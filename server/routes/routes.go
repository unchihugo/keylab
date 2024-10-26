package routes

import (
	"keylab/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.GET("/", handlers.ExampleHandler)
}
