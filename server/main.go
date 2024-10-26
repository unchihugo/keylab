package main

import (
	db "keylab/database"
	"keylab/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	routes.RegisterRoutes(e)

	db.InitDB()

	e.Start(":8080")
}
