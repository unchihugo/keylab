package handlers

import "github.com/labstack/echo/v4"

/*

	TODO: Comment the GetProductCategories function - Fetch all product categories from the database

*/

func GetCategories(c echo.Context) error {
	// TODO: Fetch all product categories from the database
	// TODO: Return the product categories as JSON

	return c.JSON(200, "GetProductCategories")
}

/*

	TODO: Comment the GetProductCategoryBySlug function - Fetch a product category by slug from the database

*/

func GetCategoryBySlug(c echo.Context) error {
	// TODO: Parse category slug from URL
	// TODO: Fetch the product category by slug from the database
	// TODO: Return the product category as JSON

	return c.JSON(200, "GetProductCategoryBySlug")
}

/*

	TODO: Comment the CreateProductCategory function - Create a new product category

*/

func CreateCategory(c echo.Context) error {
	// TODO: Parse product category from request body
	// TOOD: Create a new product category model and save it to the database
	// TODO: Return the created product category as JSON

	return c.JSON(200, "CreateProductCategory")
}

/*

	TODO: Comment the DeleteProductCategory function - Delete a product category

*/

func DeleteCategory(c echo.Context) error {
	// TODO: Parse category slug from URL
	// TODO: Delete the product category by slug from the database
	// TODO: Return a success message

	return c.JSON(200, "DeleteProductCategory")
}

/*

	TODO: Comment the UpdateProductCategory function - Update a product category

*/

func UpdateCategory(c echo.Context) error {
	// TODO: Parse category slug from URL
	// TODO: Parse updated product category from request body
	// TODO: Update the product category by slug in the database
	// TODO: Return the updated product category as JSON

	return c.JSON(200, "UpdateProductCategory")
}
