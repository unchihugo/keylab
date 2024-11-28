package handlers

import (
	db "keylab/database"
	"keylab/database/models"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// List Products Handler [GET /products]
// 1. Fetches all products from the database.
// 2. Returns status 200 with the products if successful.
// 3. Returns status 404 if no products are found.
// 4. Returns status 500 if an error occurs.

func ListProducts(c echo.Context) error {
	var products []models.Product

	if err := db.DB.Preload("Category").Find(&products).Error; err != nil {
		log.Fatalf("Error fetching products: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching products")
	}

	if len(products) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No products found")
	}

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", products)
}

// Get Product By Slug Handler [GET /products/:slug]
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

	if err := db.DB.Preload("Category").Where("slug = ?", slug).First(&product).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, http.StatusNotFound, "Product not found")
		}

		log.Printf("Error fetching product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
	}

	return jsonResponse(c, http.StatusOK, "Product found", product)
}

// Get Products By Category Handler [GET /products/category/:category]
// 1. Fetches category from params and validates it.
// 2. Fetches products by category from the database.
// 3. Returns status 200 with the products if successful.
// 4. Returns status 404 if no products are found.
// 5. Returns status 500 if an error occurs.

func GetProductsByCategory(c echo.Context) error {
	var products []models.Product

	category := c.Param("category")
	if err := db.DB.Preload("Category").Where("category_id = ?", category).Find(&products).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching products from database")
	}

	if len(products) == 0 {
		return jsonResponse(c, http.StatusOK, "No products found in this category")
	}

	return jsonResponse(c, http.StatusOK, "Products fetched successfully", products)

}

// Create Product Handler [POST /products]
// 1. Creates a product.
// 2. Validates the input data.
// 3. Checks if a product with the same slug already exists.
// 4. Returns status 201 if successful.
// 5. Returns status 400 if the input data is invalid.
// 6. Returns status 500 if an error occurs.

func CreateProduct(c echo.Context) error {
	var product models.Product

	if err := c.Bind(&product); err != nil {
		log.Printf("Error binding product: %v", err)
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := db.DB.Where("slug = ?", product.Slug).First(&product).Error; err == nil {
		return jsonResponse(c, http.StatusBadRequest, "Product already exists with the same slug")
	}

	if err := db.DB.Where("id = ?", product.CategoryID).First(&product.Category).Error; err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Category not found")
	}

	if err := db.DB.Create(&product).Error; err != nil {
		log.Printf("Error creating product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error creating product")
	}

	return jsonResponse(c, http.StatusCreated, "Product created successfully", product)
}

// Delete Product Handler [DELETE /products/:id]
// 1. Deletes a product by ID.
// 2. Returns status 200 if successful.
// 3. Returns status 404 if the product is not found.
// 4. Returns status 500 if an error occurs.

func DeleteProduct(c echo.Context) error {
	var product models.Product

	idParam := c.Param("id")

	id, err := convertToInt64(idParam)
	if err != nil {
		log.Printf("Error converting product ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid product ID")
	}
	product.ID = id

	if err := db.DB.Preload("Category").First(&product, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, http.StatusNotFound, "Product not found")
		}

		log.Printf("Error fetching product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching producta")
	}

	if err := db.DB.Delete(&product).Error; err != nil {
		log.Printf("Error deleting product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting productb")
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

	idParam := c.Param("id")
	id, err := convertToInt64(idParam)
	if err != nil {
		log.Printf("Error converting product ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid product ID")
	}

	if err := db.DB.First(&product, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("Product not found: %v", err)
			return jsonResponse(c, http.StatusNotFound, "Product not found")
		}

		log.Printf("Error fetching product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
	}

	if err := c.Bind(&product); err != nil {
		log.Printf("Error binding product data: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for updating product")
	}

	var existingProduct models.Product
	if err := db.DB.Where("slug = ? AND id != ?", product.Slug, id).First(&existingProduct).Error; err == nil {
		return jsonResponse(c, http.StatusBadRequest, "Product already exists with the same slug")
	}

	if err := product.Validate(); err != nil {
		log.Printf("Validation error: %v", err)
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := db.DB.Save(&product).Error; err != nil {
		log.Printf("Error updating product: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error updating product")
	}

	return jsonResponse(c, http.StatusOK, "Product updated successfully", product)
}

// Search Products Handler [GET /products/search]
// 1. Searches for products by name or description.
// 2. Returns status 200 if successful.
// 3. Returns status 500 if an error occurs.

func SearchProducts(c echo.Context) error {
	var products []models.Product

	query := c.QueryParam("query")
	if err := db.DB.Preload("Category").Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Find(&products).Error; err != nil {
		log.Printf("Error searching for products: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error searching for products")
	}

	if len(products) == 0 {
		return jsonResponse(c, http.StatusOK, "No products found matching the query")
	}

	return jsonResponse(c, http.StatusOK, "Product found", products)
}
