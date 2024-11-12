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
	authGroup.GET("/logout", handlers.Logout(sessionStore))

	// Protected related routes (example only but following the same pattern)
	productedRoutes := e.Group("/protected", middleware.AuthMiddleware(sessionStore))
	productedRoutes.GET("/", handlers.Protected)

	// Category related routes
	categoryGroup := e.Group("/categories")
	categoryGroup.GET("", handlers.GetCategories)
	categoryGroup.GET("/:slug", handlers.GetCategoryBySlug)

	// Protected category routes - To be moved under Admin middleware in the future
	categoryGroup.POST("", handlers.CreateCategory)
	categoryGroup.DELETE("/:slug", handlers.DeleteCategory)
	categoryGroup.PUT("/:slug", handlers.UpdateCategory)

	// Product related routes
	productGroup := e.Group("/products")
	productGroup.GET("", handlers.ListProducts)
	productGroup.GET("/:slug", handlers.GetProductBySlug)
	productGroup.GET("/category/:category", handlers.GetProductsByCategory)
	productGroup.GET("/search/:query", handlers.SearchProducts)

	// Protected product routes - To be moved under Admin middleware in the future
	productGroup.POST("", handlers.CreateProduct)
	productGroup.DELETE("/:slug", handlers.DeleteProduct)
	productGroup.PUT("/:slug", handlers.UpdateProduct)

}
