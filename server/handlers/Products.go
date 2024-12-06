package handlers

import (
	"errors"
	"fmt"
	db "keylab/database"
	"keylab/database/models"
	"keylab/repositories"
	"keylab/utils"
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// List Products [GET /products] or [GET /products?page=1&per_page=10]
// 1. Fetches all products from the database.
// 2. Returns status 200 with the products if successful.
// 3. Returns status 500 if an error occurs.

func ListProducts(c echo.Context) error {
	var products []models.Product

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	products, err := repositories.GetProducts(order, perPage, offset)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching products")
	}

	repositories.SetProductImageURLs(products, utils.GetBaseURL())

	var total int64
	if err := db.DB.Model(&models.Product{}).Count(&total).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error counting products")
	}

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"products": products,
		"metadata": generatePaginationResponse(page, perPage, int(total)),
	})
}

// Get Product By Slug [GET /products/:slug]
// 1. Fetches slug from params and validates it.
// 2. Fetches product by slug from the database.
// 3. Returns status 200 with the product if successful.
// 4. Returns status 404 if the product is not found.
// 5. Returns status 500 if an error occurs.

func GetProductBySlug(c echo.Context) error {
	var product models.Product

	slug := c.Param("slug")
	if err := product.Validate(slug); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid product slug")
	}

	product, err := repositories.GetProductBySlug(slug)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	repositories.SetProductImageURLs([]models.Product{product}, utils.GetBaseURL())

	return jsonResponse(c, http.StatusOK, "Product found", product)
}

// Get Products By Category [GET /products/category/:id]
// 1. Fetches category from params and validates it.
// 2. Fetches products by category from the database.
// 3. Returns status 200 with the products if successful.
// 4. Returns status 404 if no products are found.
// 5. Returns status 500 if an error occurs.

func GetProductsByCategory(c echo.Context) error {
	var products []models.Product

	category, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Error converting category ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid category ID")
	}

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	if err := db.DB.Preload("Category").Preload("ProductImages").Order(order).Where("category_id = ?", category).Limit(perPage).Offset(offset).Find(&products).Error; err != nil {
		log.Printf("Error fetching products by category: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching products by category")
	}

	repositories.SetProductImageURLs(products, utils.GetBaseURL())

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"products": products,
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

func CreateProduct(c echo.Context) error {
	var product models.Product

	if err := c.Bind(&product); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for creating product")
	}

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if _, err := repositories.GetProductBySlug(product.Slug); err == nil {
		return jsonResponse(c, http.StatusBadRequest, "Product already exists with the same slug")
	}

	if err := db.DB.First(&product.Category, "id = ?", product.CategoryID).Error; err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Category not found")
	}

	formField := "product_images"
	destination := "public/images/product_images"
	allowedExtensions := []string{".jpg", ".jpeg", ".png", ".webp"}

	transaction := db.DB.Begin()
	if transaction.Error != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to initiate transaction")
	}

	defer func() {
		if r := recover(); r != nil {
			transaction.Rollback()
		}
	}()

	uploadedImages, err := uploadImages(c, formField, destination, allowedExtensions)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := transaction.Create(&product).Error; err != nil {
		transaction.Rollback()
		return jsonResponse(c, http.StatusInternalServerError, "Error creating product")
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

func DeleteProduct(c echo.Context) error {
	var productImages []models.ProductImage

	id, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid product ID")
	}

	product, err := repositories.GetProductByID(id)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	transaction := db.DB.Begin()
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

func UpdateProduct(c echo.Context) error {
	var product models.Product

	id, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid product ID")
	}

	product, err = repositories.GetProductByID(id)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	if err := c.Bind(&product); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for updating product")
	}

	var existingProduct models.Product
	existingProduct, err = repositories.GetProductBySlug(product.Slug)
	if err == nil && existingProduct.ID != product.ID {
		return jsonResponse(c, http.StatusBadRequest, "Product already exists with the same slug")
	}

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := db.DB.Save(&product).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error updating product")
	}

	return jsonResponse(c, http.StatusOK, "Product updated successfully", product)
}

// Search Products Handler [GET /products/search]
// 1. Searches for products by name or description.
// 2. Returns status 200 if successful.
// 3. Returns status 500 if an error occurs.

func SearchProducts(c echo.Context) error {
	query := c.QueryParam("query")

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	var products []models.Product
	if err := db.DB.Preload("Category").Preload("ProductImages").Order(order).Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Limit(perPage).Offset(offset).Find(&products).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error searching for products")
	}

	var total int64
	if err := db.DB.Model(&models.Product{}).Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Count(&total).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error counting products")
	}

	repositories.SetProductImageURLs(products, utils.GetBaseURL())

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", map[string]interface{}{
		"products": products,
		"metadata": generatePaginationResponse(page, perPage, int(total)),
	})
}

// Get Product Image Handler [GET /products/image/:path]
// 1. Fetches the product image by filename.
// 2. Returns file response if successful.
// 3. Returns status 404 if the image is not found.

func GetProductImage(c echo.Context) error {
	imagePath := "public/images/product_images/" + c.Param("path")

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

func UploadProductImages(c echo.Context) error {
	slug := c.Param("slug")
	product, err := repositories.GetProductBySlug(slug)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c, http.StatusNotFound, "Product not found")
		}
		return jsonResponse(c, http.StatusInternalServerError, "Failed to retrieve product")
	}

	formField := "product_images"
	destination := "public/images/product_images"
	allowedExtensions := []string{".jpg", ".jpeg", ".png", ".webp"}

	uploadedImages, err := uploadImages(c, formField, destination, allowedExtensions)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	for _, img := range uploadedImages {
		productImage := models.ProductImage{
			ProductID: product.ID,
			Image:     img["filename"].(string),
		}

		if err := db.DB.Create(&productImage).Error; err != nil {
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
func DeleteProductImage(c echo.Context) error {
	product, err := repositories.GetProductBySlug(c.Param("slug"))
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	var productImage models.ProductImage
	if err := db.DB.Where("product_id = ? AND id = ?", product.ID, c.Param("id")).First(&productImage).Error; err != nil {
		return jsonResponse(c, http.StatusNotFound, "Image not found for the product")
	}

	if err := deleteImage("public/images/product_images/" + productImage.Image); err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting image")
	}

	return jsonResponse(c, http.StatusOK, "Image deleted successfully")
}
