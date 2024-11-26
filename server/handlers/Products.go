package handlers

import (

    "github.com/labstack/echo/v4"
    "gorm.io/gorm"
    "keylab/database/models"
    db "keylab/database"
    "net/http"
    "regexp"
	"errors"
)

// List Products Handler [GET /products]
// 1. Fetches all products from the database.
// 2. Returns status 200 with the products if successful.
// 3. Returns status 404 if no products are found.
// 4. Returns status 500 if an error occurs.

func ListProducts(c echo.Context) error {
    var products []models.Product

    if err := db.DB.Find(&products).Error; err != nil {
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching products")
    }

    if len(products) == 0 {
        return jsonResponse(c, http.StatusNotFound, "No products found")
		}
		
		return jsonResponse(c, http.StatusOK, "Products fetched successfully", products)
    }

// Get Product By Slug Handler [GET /products/:slug]
// 1. Fetches a product by slug from the database.
// 2. Validates the slug parameter.
// 3. Returns status 200 if successful.
// 4. Returns status 404 if the product is not found.
// 5. Returns status 500 if an error occurs.

func GetProductBySlug(c echo.Context) error {
	var product models.Product

    slug := c.Param("slug")
    if err := product.Validate(slug); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid product slug")
	}

    if err := db.DB.Where("slug = ?", slug).First(&product).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, http.StatusNotFound, "Product not found")
        }
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
    }

	return jsonResponse(c, http.StatusOK, "Product found", product)
}

// Get Products By Category Handler [GET /products/category/:categoryID]
// 1. Fetches products by category ID.
// 2. Returns status 200 if successful.
// 3. Returns status 404 if no products are found.
// 4. Returns status 500 if an error occurs.

func GetProductsByCategory(c echo.Context) error {
    categoryID := c.Param("categoryID")
    var products []models.Product
    
    if err := db.DB.Where("category_id = ?", categoryID).Find(&products).Error; err != nil {
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching products from database")
    }

	if len(products) == 0 {
		return jsonResponse(c, http.StatusOK, "No products found in this category")
	}

    return jsonResponse(c, http.StatusOK, "Products fetched successfully", products)

}

// Create Product Handler [POST /products]
// 1. Parses the product data from the request body.
// 2. Checks for validation errors.
// 3. Creates the product data in the database.
// 4. Returns status 201 if successful.
// 5. Returns status 400 for invalid input.
// 6. Returns status 500 if an error occurs.

func CreateProduct(c echo.Context) error {
	var product models.Product

	if err := c.Bind(&product); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input creating product")
	}

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := db.DB.Create(&product).Error; err != nil {
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
	id := c.Param("id")
	var product models.Product

	if err := db.DB.First(&product, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return jsonResponse(c, http.StatusNotFound, "Product not found")
		}
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
	}

	if err := db.DB.Delete(&product).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting product")
	}

	return jsonResponse(c, http.StatusOK, "Product deleted successfully")
}

// Update Product Handler [PUT /products/:id]
// 1. Updates a product by ID.
// 2. Validates the input data.
// 3. Returns status 200 if successful.
// 4. Returns status 404 if the product is not found.
// 5. Returns status 500 if an error occurs.

func UpdateProduct(c echo.Context) error {
    id := c.Param("id")
    var product models.Product

	if err := db.DB.First(&product, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c, http.StatusNotFound, "Product not found")
		}
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
	}

    if err := c.Bind(&product); err != nil {
        return c.JSON(http.StatusBadRequest, "Invalid input updating product")
    }

	if err := product.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

    if err := db.DB.Save(&product).Error; err != nil {
        return c.JSON(http.StatusInternalServerError, "Error updating product")
    }

    return jsonResponse(c, http.StatusOK, "Product updated successfully", product)
}

// Search Products Handler [GET /products/search]
// 1. Searches for products by name or description.
// 2. Returns status 200 if successful.
// 3. Returns status 500 if an error occurs.

func SearchProducts(c echo.Context) error {
    query := c.QueryParam("query") 
    var products []models.Product

    if err := db.DB.Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Find(&products).Error; err != nil {
        return jsonResponse(c, http.StatusInternalServerError, "Error searching for products")
	}
    
    if len(products) == 0 {
        return jsonResponse(c, http.StatusOK, "No products found matching the query")
    }

    return jsonResponse(c, http.StatusOK, "Product found", products)
}


