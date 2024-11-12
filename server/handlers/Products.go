package handlers

import "github.com/labstack/echo/v4"

/*

  TODO: Comment the GetProducts function - Fetch all products from the database

*/

func ListProducts(c echo.Context) error {
	// TODO: Fetch all products from the database
	// TODO: Return the products as JSON

	// Thoughts: Might want to add pagination to this endpoint

	return c.JSON(200, "GetProducts")
}

/*
	TODO: Comment the GetProductBySlug function - Fetch a product by slug from the database

*/

func GetProductBySlug(c echo.Context) error {
	// TODO: Parse product slug from URL
	// TODO: Fetch the product by slug from the database
	// TODO: Return the product as JSON

	return c.JSON(200, "GetProductBySlug")
}

/*

  TODO: Comment the GetProductsByCategory function - Fetch all products from a category from the database

*/

func GetProductsByCategory(c echo.Context) error {
	// TODO: Parse category from URL
	// TODO: Fetch all products from that category from the database
	// TODO: Return the products as JSON

	return c.JSON(200, "GetProductsByCategory")
}

/*

  TODO: Comment the CreateProduct function - Create a new product

*/

func CreateProduct(c echo.Context) error {
	// TODO: Parse product from request body
	// TOOD: Create a new product model and save it to the database
	// TODO: Return the created product as JSON

	return c.JSON(200, "CreateProduct")
}

/*

  TODO: Comment the DeleteProduct function - Delete a product

*/

func DeleteProduct(c echo.Context) error {
	// TODO: Parse product ID from URL
	// TODO: Delete the product from the database
	// TODO: Return a success message

	return c.JSON(200, "DeleteProduct")
}

/*

  TODO: Comment the UpdateProduct function - Update a product

*/

func UpdateProduct(c echo.Context) error {
	// TODO: Parse product ID from URL
	// TODO: Parse product from request body
	// TODO: Update the product in the database
	// TODO: Return the updated product as JSON
	// TODO: Return an error if the product is not update

	return c.JSON(200, "UpdateProduct")
}

/*

	TODO: Comment the SearchProducts function - Search for products by name or description in the database

*/

func SearchProducts(c echo.Context) error {
	// TODO: Parse search query from URL
	// TODO: Search for products by name or description in the database
	// TODO: Return the products as JSON

	return c.JSON(200, "SearchProducts")
}
