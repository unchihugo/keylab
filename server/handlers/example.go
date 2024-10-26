package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func ExampleHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, "Hello, World!")
}
