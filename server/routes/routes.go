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
	productGroup.GET("/category/:id", handlers.GetProductsByCategory)
	productGroup.GET("/search/:query", handlers.SearchProducts)
	productGroup.GET("/image/:path", handlers.GetProductImage)

	// TODO: Add admin middleware to the following routes
	productGroup.POST("", handlers.CreateProduct)
	productGroup.DELETE("/:id", handlers.DeleteProduct)
	productGroup.PUT("/:id", handlers.UpdateProduct)
	productGroup.POST("/:slug/image", handlers.UploadProductImages)
	productGroup.DELETE("/:slug/image/:id", handlers.DeleteProductImage)

	productReviewGroup := e.Group("/products/:product_slug/reviews")
	productReviewGroup.GET("", handlers.GetReviewsByProduct)
	productReviewGroup.GET("/user/:user_id", handlers.GetReviewByUser)
	productReviewGroup.GET("/:id", handlers.GetReview)
	productReviewGroup.GET("/statistics", handlers.GetReviewStatistics)
	e.GET("/users/:user_id/reviews", handlers.GetReviewsByUser)

	productReviewGroup.POST("", handlers.CreateReview, middleware.AuthMiddleware(sessionStore))
	productReviewGroup.PUT("/:id", handlers.UpdateReview, middleware.AuthMiddleware(sessionStore))
	productReviewGroup.DELETE("/:id", handlers.DeleteReview, middleware.AuthMiddleware(sessionStore))

	// Cart related routes
	cartGroup := e.Group("/cart", middleware.AuthMiddleware(sessionStore))
	cartGroup.GET("", handlers.ListCartItems)
	cartGroup.POST("", handlers.AddCartItem)
	cartGroup.PUT("/:id", handlers.UpdateCartItemQuantity)
	cartGroup.DELETE("/:id", handlers.DeleteCartItem)

	e.POST("/contact", handlers.ContactUs)
}
