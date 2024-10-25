package main

import (
	"keylab/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	routes.RegisterRoutes(e)

	e.Start(":8080")
}
