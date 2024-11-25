package handlers

import (
	"github.com/labstack/echo/v4"
	"keylab/database"
	"keylab/database/models"
	"net/http"

)

/*
  TODO: Comment the GetProducts function - Fetch all products from the database
*/

func ListProducts(c echo.Context) error {
	var products[] models.Product

	if err:= database.DB.Find(&products).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, "Error fetching products")
	}

	if len(products) == 0 {
        return c.JSON(http.StatusOK, echo.Map{
            "message": "No products are available",
            "products": []models.Product{},
        })
    }
	return c.JSON(http.StatusOK, products)
	// Thoughts: Might want to add pagination to this endpoint
}


/*
	TODO: Comment the GetProductBySlug function - Fetch a product by slug from the database
*/

func GetProductBySlug(c echo.Context) error {
	slug := c.Param("slug")
	if slug == "" {
		return c.JSON(http.StatusBadRequest, "Slug parameter is required")
	}
	var product models.Product

	if err := database.DB.Where("slug = ?", slug).First(&product).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, echo.Map{
				"message":"Product not found",
				"slug": slug,
			})
		}
		return c.JSON(http.StatusInternalServerError, "Error fetching product")
	}
	return c.JSON(http.StatusOK, product)
}

/*
  TODO: Comment the GetProductsByCategory function - Fetch all products from a category from the database
*/

func GetProductsByCategory(c echo.Context) error {
	categoryID := c.Param("categoryID")
	var products []models.Product
	
	if err := database.DB.Where("category_id = ?", categoryID).Find(&products).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, "Error fetching products from database")
	}

	if len(products) == 0 {
		return c.JSON(http.StatusOK, echo.Map{
			"message": "No products found in this category",
			"categoryID": categoryID,
			"products": []models.Product{},
		})
	}
	return c.JSON(http.StatusOK, products)
}

/*
  TODO: Comment the CreateProduct function - Create a new product
*/

func CreateProduct(c echo.Context) error {
	var product models.Product

	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid input data")
	}

	if err := database.DB.Create(&product).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, "Error creating product")
	}

	return c.JSON(http.StatusCreated, product)
}

/*
  TODO: Comment the DeleteProduct function - Delete a product
*/

func DeleteProduct(c echo.Context) error {
	id := c.Param("id")
	var product models.Product

	if err := database.DB.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Product not found")
	}

	if err := database.DB.Delete(&product).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, "Error deleting product")
	}

	return c.JSON(http.StatusOK, "Product deleted successfully")
}

/*
  TODO: Comment the UpdateProduct function - Update a product
*/

func UpdateProduct(c echo.Context) error {
	id := c.Param("id")
	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Product not found")
	}

	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid input data")
	}

	if err := database.DB.Save(&product).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, "Error updating product")
	}

	return c.JSON(http.StatusOK, product)
}

/*
	TODO: Comment the SearchProducts function - Search for products by name or description in the database
*/

func SearchProducts(c echo.Context) error {
	query := c.QueryParam("query") 
	var products []models.Product

	if err := database.DB.Where("name LIKE ? OR description LIKE ?", "%"+query+"%", "%"+query+"%").Find(&products).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, "Error searching for products")
	}

	if len(products) == 0 {
		return c.JSON(http.StatusOK, echo.Map{
			"message": "No products found matching the query",
			"products": []models.Product{}, 
		})
	}

	return c.JSON(http.StatusOK, products)
}
