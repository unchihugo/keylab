package routes

import (
	"keylab/handlers"
	"keylab/middleware"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo, sessionStore *sessions.CookieStore) {
	// Auth related routes
	authGroup := e.Group("/auth")
	authGroup.POST("/register", handlers.Register)
	authGroup.POST("/login", handlers.Login(sessionStore))
	authGroup.POST("/logout", handlers.Logout(sessionStore))

	// Protected related routes (example only but following the same pattern)
	protectedRoutes := e.Group("/protected", middleware.AuthMiddleware(sessionStore))
	protectedRoutes.GET("/", handlers.Protected)

	// Category related routes
	categoryGroup := e.Group("/categories")
	categoryGroup.GET("", handlers.GetCategories)
	categoryGroup.GET("/:slug", handlers.GetCategoryBySlug)

	// TODO: Add admin middleware to the following routes
	categoryGroup.POST("", handlers.CreateCategory)
	categoryGroup.DELETE("/:slug", handlers.DeleteCategory)
	categoryGroup.PUT("/:slug", handlers.UpdateCategory)

	// Product related routes
	productGroup := e.Group("/products")
	productGroup.GET("", handlers.ListProducts)
	productGroup.GET("/:slug", handlers.GetProductBySlug)
	productGroup.GET("/category/:category", handlers.GetProductsByCategory)
	productGroup.GET("/search/:query", handlers.SearchProducts)

	// TODO: Add admin middleware to the following routes
	productGroup.POST("", handlers.CreateProduct)
	productGroup.DELETE("/:slug", handlers.DeleteProduct)
	productGroup.PUT("/:slug", handlers.UpdateProduct)

}
