package handlers

import (
	"fmt"
	"keylab/config"
	"keylab/database/models"
	"keylab/repositories"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gosimple/slug"
	"github.com/labstack/echo/v4"
)

func wrapData(products []models.Product) []map[string]interface{} {
	result := make([]map[string]interface{}, len(products))
	for i, product := range products {
		result[i] = map[string]interface{}{
			"data": product,
		}
	}
	return result
}

// List Products [GET /products] or [GET /products?page=1&per_page=10]
// 1. Fetches all products from the database.
// 2. Returns status 200 with the products if successful.
// 3. Returns status 500 if an error occurs.

func (h *Handlers) ListProducts(c echo.Context) error {
	var products []models.Product

	config := config.Initialize()

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	products, err := repositories.GetProducts(order, perPage, offset, h.DB)
	if err != nil {
		log.Printf("Error fetching products: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching products")
	}

	repositories.SetProductImageURLs(products, config.SERVER_URL)

	var total int64
	if err := h.DB.Model(&models.Product{}).Count(&total).Error; err != nil {
		log.Printf("Error counting products: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error counting products")
	}

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"products": wrapData(products),
		"metadata": generatePaginationResponse(page, perPage, int(total)),
	})
}

// Get Product By Slug [GET /products/:slug]
// 1. Fetches slug from params and validates it.
// 2. Fetches product by slug from the database.
// 3. Returns status 200 with the product if successful.
// 4. Returns status 404 if the product is not found.
// 5. Returns status 500 if an error occurs.

func (h *Handlers) GetProductBySlug(c echo.Context) error {
	var product models.Product

	config := config.Initialize()

	slug := c.Param("slug")
	if err := product.Validate(slug); err != nil {
		log.Printf("Error validating product slug: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid product slug")
	}

	product, err := repositories.GetProductBySlug(slug, h.DB)
	if err != nil {
		log.Printf("Error fetching product by slug: %v", err)
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	repositories.SetProductImageURLs([]models.Product{product}, config.SERVER_URL)

	return jsonResponse(c, http.StatusOK, "Product found", product)
}

// Get Products By Category [GET /products/category/:id]
// 1. Fetches category from params and validates it.
// 2. Fetches products by category from the database.
// 3. Returns status 200 with the products if successful.
// 4. Returns status 404 if no products are found.
// 5. Returns status 500 if an error occurs.

func (h *Handlers) GetProductsByCategory(c echo.Context) error {
	var products []models.Product

	config := config.Initialize()

	category, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Error converting category ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid category ID")
	}

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	if err := h.DB.Preload("Category").Preload("Category.Parent").Preload("ProductImages").Order(order).Where("category_id = ?", category).Limit(perPage).Offset(offset).Find(&products).Error; err != nil {
		log.Printf("Error fetching products by category: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching products by category")
	}

	repositories.SetProductImageURLs(products, config.SERVER_URL)

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"products": wrapData(products),
		"metadata": generatePaginationResponse(page, perPage, len(products)),
	})
}

// Create Product [POST /products]
// 1. Parses product data from the request body and validates it.
// 2. Checks if the product already exists with the same slug.
// 3. Fetches the category by ID.
// 4. Creates the product in the database.
// 5. Uploads product images to the server.
// 6. Returns status 201 if successful.
// 7. Returns status 400 if the input data is invalid.
// 8. Returns status 500 if an error occurs.
func (h *Handlers) CreateProduct(c echo.Context) error {
	var product models.Product

	if err := c.Bind(&product); err != nil {
		log.Printf("Error binding product data: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for creating product")
	}

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := h.DB.First(&product.Category, "id = ?", product.CategoryID).Error; err != nil {
		log.Printf("Error fetching category: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Category not found")
	}

	formField := "product_images"
	destination := "public/images/product_images"
	allowedExtensions := []string{".jpg", ".jpeg", ".png", ".webp"}

	transaction := h.DB.Begin()
	if transaction.Error != nil {
		log.Printf("Error starting transaction: %v", transaction.Error)
		return jsonResponse(c, http.StatusInternalServerError, "Failed to initiate transaction")
	}

	defer func() {
		if r := recover(); r != nil {
			transaction.Rollback()
		}
	}()

	if err := transaction.Create(&product).Error; err != nil {
		transaction.Rollback()
		log.Printf("Error creating product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error creating product")
	}

	baseSlug := slug.Make(c.FormValue("name"))
	product.Slug = baseSlug

	var existingProduct models.Product
	if _, err := repositories.GetProductBySlug(product.Slug, h.DB); err == nil && existingProduct.ID != product.ID {
		product.Slug = fmt.Sprintf("%s-%d", baseSlug, product.ID)
	}

	if err := transaction.Model(&product).Update("slug", product.Slug).Error; err != nil {
		transaction.Rollback()
		log.Printf("Error updating product slug: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Failed to update product slug")
	}

	uploadedImages, err := uploadImages(c, formField, destination, allowedExtensions)
	if err != nil {
		transaction.Rollback()
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	for _, img := range uploadedImages {
		productImage := models.ProductImage{
			ProductID: product.ID,
			Image:     img["filename"].(string),
		}

		if err := transaction.Create(&productImage).Error; err != nil {
			transaction.Rollback()
			return jsonResponse(c, http.StatusInternalServerError, "Failed to save product images to database")
		}
	}

	if err := transaction.Commit().Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to commit transaction")
	}

	return jsonResponse(c, http.StatusCreated, "Product created successfully", map[string]interface{}{
		"product":        product,
		"product_images": uploadedImages,
	})
}

// Delete Product
// 1. Fetches the product by ID.
// 2. Fetches the product images by product ID.
// 3. Deletes the product images from the server.
// 4. Deletes the product from the database.
// 5. Returns status 200 if successful.
// 6. Returns status 404 if the product is not found.
// 7. Returns status 500 if an error occurs.

func (h *Handlers) DeleteProduct(c echo.Context) error {
	var productImages []models.ProductImage
	var productReviews []models.ProductReviews

	id, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Error converting product ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid product ID")
	}

	product, err := repositories.GetProductByID(id, h.DB)
	if err != nil {
		log.Printf("Error fetching product by ID: %v", err)
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	transaction := h.DB.Begin()

	if err := transaction.Where("product_id = ?", product.ID).Find(&productReviews).Error; err != nil {
		log.Printf("Error fetching product reviews: %v", err)
		transaction.Rollback()
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching product reviews")
	}

	// Delete each review
	for _, review := range productReviews {
		if err := transaction.Delete(&review).Error; err != nil {
			log.Printf("Error deleting product review: %v", err)
			transaction.Rollback()
			return jsonResponse(c, http.StatusInternalServerError, "Error deleting product reviews")
		}
	}

	// THEN: Continue with existing logic to delete images
	if err := transaction.Where("product_id = ?", product.ID).Find(&productImages).Error; err != nil {
		transaction.Rollback()
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching product images")
	}

	for _, productImage := range productImages {
		fmt.Println("productImage", productImage)
		if err := deleteImage("public/images/product_images/" + productImage.Image); err != nil {
			transaction.Rollback()
			return jsonResponse(c, http.StatusInternalServerError, "Error deleting product images")
		}

		transaction.Delete(&productImage)
	}

	if err := transaction.Delete(&product).Error; err != nil {
		transaction.Rollback()
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting product")
	}

	if err := transaction.Commit().Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error finalizing product deletion")
	}

	return jsonResponse(c, http.StatusOK, "Product deleted successfully", product)
}

// Update Product Handler [PUT /products/:id]
// 1. Updates a product by ID.
// 2. Returns status 200 if successful.
// 3. Returns status 400 if the input data is invalid.
// 4. Returns status 404 if the product is not found.
// 5. Returns status 500 if an error occurs.

func (h *Handlers) UpdateProduct(c echo.Context) error {
	var product models.Product

	id, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Error converting product ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid product ID")
	}

	product, err = repositories.GetProductByID(id, h.DB)
	if err != nil {
		log.Printf("Error fetching product by ID: %v", err)
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	if err := c.Bind(&product); err != nil {
		log.Printf("Error binding product data: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for updating product")
	}

	var existingProduct models.Product
	existingProduct, err = repositories.GetProductBySlug(product.Slug, h.DB)
	if err == nil && existingProduct.ID != product.ID {
		return jsonResponse(c, http.StatusBadRequest, "Product already exists with the same slug")
	}

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := h.DB.Save(&product).Error; err != nil {
		log.Printf("Error updating product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error updating product")
	}

	return jsonResponse(c, http.StatusOK, "Product updated successfully", product)
}

// Search Products Handler [GET /products/search]
// 1. Searches for products by name or description.
// 2. Returns status 200 if successful.
// 3. Returns status 500 if an error occurs.

func (h *Handlers) SearchProducts(c echo.Context) error {
	query := c.Param("query")

	config := config.Initialize()

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	var products []models.Product
	if err := h.DB.Preload("Category").Preload("Category.Parent").Preload("ProductImages").Order(order).Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Limit(perPage).Offset(offset).Find(&products).Error; err != nil {
		log.Printf("Error searching for products: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error searching for products")
	}

	var total int64
	if err := h.DB.Model(&models.Product{}).Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Count(&total).Error; err != nil {
		log.Printf("Error counting products: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error counting products")
	}

	repositories.SetProductImageURLs(products, config.SERVER_URL)

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"products": wrapData(products),
		"metadata": generatePaginationResponse(page, perPage, int(total)),
	})
}

// Get Product Image Handler [GET /products/image/:path]
// 1. Fetches the product image by filename.
// 2. Returns file response if successful.
// 3. Returns status 404 if the image is not found.

func (h *Handlers) GetProductImage(c echo.Context) error {
	imagePath := c.Param("path")

	// MICHAEL TODO - DELETE AND FIX THIS AFTER PRESENTATION
	if !strings.HasPrefix(imagePath, "public/seed/") {
		imagePath = "public/images/" + imagePath
	}

	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		return jsonResponse(c, http.StatusNotFound, "Image not found")
	}

	return c.File(imagePath)
}

// Upload Product Image Handler [POST /products/:slug/image]
// 1. Validates the product exists.
// 2. Validates the uploaded file.
// 3. Saves the uploaded file to the server with a unique filename.
// 4. Saves the image record to the database.
// 5. Returns status 200 if successful.
// 6. Returns status 400 if the file type is invalid.s
// 7. Returns status 500 if an error occurs.

func (h *Handlers) UploadProductImages(c echo.Context) error {
	slug := c.Param("slug")
	product, err := repositories.GetProductBySlug(slug, h.DB)
	if err != nil {
		log.Printf("Error fetching product by slug: %v", err)
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	formField := "product_images"
	destination := "public/images/product_images"
	allowedExtensions := []string{".jpg", ".jpeg", ".png", ".webp"}

	uploadedImages, err := uploadImages(c, formField, destination, allowedExtensions)
	if err != nil {
		log.Printf("Error uploading images: %v", err)
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	for _, img := range uploadedImages {
		productImage := models.ProductImage{
			ProductID: product.ID,
			Image:     img["filename"].(string),
		}

		if err := h.DB.Create(&productImage).Error; err != nil {
			log.Printf("Error saving image to database: %v", err)
			return jsonResponse(c, http.StatusInternalServerError, "Failed to save image to database")
		}
	}

	return jsonResponse(c, http.StatusOK, "Images uploaded successfully", map[string]interface{}{
		"product": product,
		"images":  uploadedImages,
	})
}

// Delete Product Image Handler [DELETE /products/:slug/image/:filename]
// 1. Deletes a product image by filename.
// 2. Returns status 200 if successful.
// 3. Returns status 404 if the image is not found.
// 4. Returns status 500 if an error occurs.
func (h *Handlers) DeleteProductImage(c echo.Context) error {
	product, err := repositories.GetProductBySlug(c.Param("slug"), h.DB)
	if err != nil {
		log.Printf("Error fetching product by slug: %v", err)
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	var productImage models.ProductImage
	if err := h.DB.Where("product_id = ? AND id = ?", product.ID, c.Param("id")).First(&productImage).Error; err != nil {
		log.Printf("Error fetching product image: %v", err)
		return jsonResponse(c, http.StatusNotFound, "Image not found for the product")
	}

	if err := deleteImage("public/images/product_images/" + productImage.Image); err != nil {
		log.Printf("Error deleting image: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting image")
	}

	return jsonResponse(c, http.StatusOK, "Image deleted successfully")
}
