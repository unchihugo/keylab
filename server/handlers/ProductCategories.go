package handlers

// import (
// 	"errors"
// 	db "keylab/database"
// 	"keylab/database/models"
// 	"log"
// 	"net/http"

// 	"github.com/labstack/echo/v4"
// 	"gorm.io/gorm"
// )

// // Get Categories Handler [GET /categories]
// // 1. Fetches all product categories from the database.
// // 2. Returns status 200 if successful.
// // 3. Returns status 404 if no categories are found.
// // 4. Returns status 500 if an error occurs.
// // 5. Returns the product categories as JSON.

// func GetCategories(c echo.Context) error {
// 	var categories []models.ProductCategory

// 	if err := db.DB.Preload("Parent").Find(&categories).Error; err != nil {
// 		log.Printf("Error fetching categories: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error fetching categories")
// 	}

// 	if len(categories) == 0 {
// 		return jsonResponse(c, http.StatusNotFound, "No categories found", categories)
// 	}

// 	return jsonResponse(c, http.StatusOK, "Categories found", categories)
// }

// // Get Category By Slug Handler [GET /categories/:slug]
// // 1. Fetches a product category by slug from the database.
// // 2. Returns status 200 if successful.
// // 3. Returns status 404 if no category is found.
// // 4. Returns status 500 if an error occurs.
// // 5. Returns the product category as JSON.

// func GetCategoryBySlug(c echo.Context) error {
// 	var category models.ProductCategory

// 	slug := c.Param("slug")
// 	if err := category.Validate(slug); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, "Invalid category slug")
// 	}

// 	if err := db.DB.Where("slug = ?", slug).Preload("Parent").First(&category).Error; err != nil {
// 		if errors.Is(err, gorm.ErrRecordNotFound) {
// 			return jsonResponse(c, http.StatusNotFound, "Category not found")
// 		}

// 		log.Printf("Error fetching category by slug: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error fetching category by slug")
// 	}

// 	return jsonResponse(c, http.StatusOK, "Category found", category)
// }

// // Create Category Handler [POST /categories]
// // 1. Parses the product category from the request body.
// // 2. Validates the product category.
// // 3. Checks if a category with the same slug exists.
// // 4. Creates the product category in the database.
// // 5. Returns status 201 if successful.
// // 6. Returns status 400 if invalid input.
// // 7. Returns status 500 if an error occurs.

// func CreateCategory(c echo.Context) error {
// 	var category models.ProductCategory

// 	if err := c.Bind(&category); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, "Invalid input creating product category")
// 	}

// 	if err := category.Validate(); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, err.Error())
// 	}

// 	if err := db.DB.Where("slug = ?", category.Slug).First(&category).Error; err == nil {
// 		return jsonResponse(c, http.StatusBadRequest, "Category already exists with the same slug")
// 	}

// 	if err := db.DB.Create(&category).Error; err != nil {
// 		log.Printf("Error creating product category: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error creating product category")
// 	}

// 	return jsonResponse(c, http.StatusCreated, "Product category created", category)
// }

// // Delete Category Handler [DELETE /categories/:slug]
// // 1. Fetches a product category by slug from the database.
// // 2. Deletes the product category from the database.
// // 3. Returns status 200 if successful.
// // 4. Returns status 404 if no category is found.
// // 5. Returns status 500 if an error occurs.

// func DeleteCategory(c echo.Context) error {
// 	var category models.ProductCategory

// 	slug := c.Param("slug")
// 	if err := category.Validate(slug); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, "Invalid category slug")
// 	}

// 	if err := db.DB.Where("slug = ?", slug).Preload("Parent").First(&category).Error; err != nil {
// 		if errors.Is(err, gorm.ErrRecordNotFound) {
// 			return jsonResponse(c, http.StatusNotFound, "Category not found")
// 		}

// 		log.Printf("Error fetching category by slug: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error fetching category by slug")
// 	}

// 	if err := db.DB.Delete(&category).Error; err != nil {
// 		log.Printf("Error deleting product category: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error deleting product category")
// 	}

// 	return jsonResponse(c, http.StatusOK, "Product category deleted", category)
// }

// // Update Category Handler [PUT /categories/:slug]
// // 1. Fetches a product category by slug from the database.
// // 2. Parses the product category from the request body.
// // 3. Validates the product category.
// // 4. Updates the product category in the database.
// // 5. Returns status 200 if successful.
// // 6. Returns status 400 if invalid input.
// // 7. Returns status 404 if no category is found.
// // 8. Returns status 500 if an error occurs.

// func UpdateCategory(c echo.Context) error {
// 	var category models.ProductCategory

// 	slug := c.Param("slug")
// 	if err := category.Validate(slug); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, "Invalid category slug")
// 	}

// 	if err := db.DB.Where("slug = ?", slug).First(&category).Error; err != nil {
// 		if errors.Is(err, gorm.ErrRecordNotFound) {
// 			return jsonResponse(c, http.StatusNotFound, "Category not found")
// 		}

// 		log.Printf("Error fetching category by slug: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error fetching category by slug")
// 	}

// 	if err := c.Bind(&category); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, "Invalid input updating product category")
// 	}

// 	if err := category.Validate(); err != nil {
// 		return jsonResponse(c, http.StatusBadRequest, err.Error())
// 	}

// 	if err := db.DB.Save(&category).Error; err != nil {
// 		log.Printf("Error updating product category: %v", err)
// 		return jsonResponse(c, http.StatusInternalServerError, "Error updating product category")
// 	}

// 	return jsonResponse(c, http.StatusOK, "Product category updated", category)
// }
