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

	// admin only for creating, updating and deleting categories
	categoryGroup.POST("", handlers.CreateCategory, middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware(sessionStore, "manage_categories"))
	categoryGroup.DELETE("/:slug", handlers.DeleteCategory, middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware(sessionStore, "manage_categories"))
	categoryGroup.PUT("/:slug", handlers.UpdateCategory, middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware(sessionStore, "manage_categories"))

	// Product related routes
	productGroup := e.Group("/products")
	productGroup.GET("", handlers.ListProducts)
	productGroup.GET("/:slug", handlers.GetProductBySlug)
	productGroup.GET("/category/:category", handlers.GetProductsByCategory)
	productGroup.GET("/search/:query", handlers.SearchProducts)

	// admin only for creating, updating and deleting categories
	productGroup.POST("", handlers.CreateProduct, middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware(sessionStore, "manage_products"))
	productGroup.DELETE("/:id", handlers.DeleteProduct, middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware(sessionStore, "manage_products"))
	productGroup.PUT("/:id", handlers.UpdateProduct, middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware(sessionStore, "manage_products"))

	productReviewGroup := e.Group("/products/:product_slug/reviews")
	productReviewGroup.GET("", handlers.GetReviewsByProduct)
	productReviewGroup.GET("/user/:user_id", handlers.GetReviewByUser)
	productReviewGroup.GET("/:id", handlers.GetReview)
	productReviewGroup.GET("/statistics", handlers.GetReviewStatistics)
	e.GET("/users/:user_id/reviews", handlers.GetReviewsByUser)

	productReviewGroup.POST("", handlers.CreateReview, middleware.AuthMiddleware(sessionStore))
	productReviewGroup.PUT("/:id", handlers.UpdateReview, middleware.AuthMiddleware(sessionStore))
	productReviewGroup.DELETE("/:id", handlers.DeleteReview, middleware.AuthMiddleware(sessionStore))
}
