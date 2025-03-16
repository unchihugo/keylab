package routes

import (
	"keylab/handlers"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func RegisterRoutes(e *echo.Echo, sessionStore *sessions.CookieStore, db *gorm.DB) {
	h := &handlers.Handlers{
		DB:           db,
		SessionStore: sessionStore,
	}

	// Auth related routes
	authGroup := e.Group("/auth")
	authGroup.POST("/register", h.Register)
	authGroup.POST("/login", h.Login)
	authGroup.POST("/logout", h.Logout)
	authGroup.GET("/validate", h.ValidateSession)

	// TEMP TEST ROUTE - use as an example
	// e.GET("/test/permission", h.TestPermission(), middleware.AuthMiddleware(sessionStore), middleware.PermissionMiddleware("admin:dashboard"))

	// // Category related routes
	// categoryGroup := e.Group("/categories")
	// categoryGroup.GET("", handlers.GetCategories)
	// categoryGroup.GET("/:slug", handlers.GetCategoryBySlug)

	// // TODO: Add admin middleware to the following routes
	// categoryGroup.POST("", handlers.CreateCategory)
	// categoryGroup.DELETE("/:slug", handlers.DeleteCategory)
	// categoryGroup.PUT("/:slug", handlers.UpdateCategory)

	// // Product related routes
	// productGroup := e.Group("/products")
	// productGroup.GET("", handlers.ListProducts)
	// productGroup.GET("/:slug", handlers.GetProductBySlug)
	// productGroup.GET("/category/:id", handlers.GetProductsByCategory)
	// productGroup.GET("/search/:query", handlers.SearchProducts)
	// productGroup.GET("/image/:path", handlers.GetProductImage)

	// // TODO: Add admin middleware to the following routes
	// productGroup.POST("", handlers.CreateProduct)
	// productGroup.DELETE("/:id", handlers.DeleteProduct)
	// productGroup.PUT("/:id", handlers.UpdateProduct)
	// productGroup.POST("/:slug/image", handlers.UploadProductImages)
	// productGroup.DELETE("/:slug/image/:id", handlers.DeleteProductImage)

	// productReviewGroup := e.Group("/products/:product_slug/reviews")
	// productReviewGroup.GET("", handlers.GetReviewsByProduct)
	// productReviewGroup.GET("/user/:user_id", handlers.GetReviewByUser)
	// productReviewGroup.GET("/:id", handlers.GetReview)
	// productReviewGroup.GET("/statistics", handlers.GetReviewStatistics)
	// e.GET("/users/:user_id/reviews", handlers.GetReviewsByUser)

	// productReviewGroup.POST("", handlers.CreateReview, middleware.AuthMiddleware(sessionStore))
	// productReviewGroup.PUT("/:id", handlers.UpdateReview, middleware.AuthMiddleware(sessionStore))
	// productReviewGroup.DELETE("/:id", handlers.DeleteReview, middleware.AuthMiddleware(sessionStore))

	// // Cart related routes
	// cartGroup := e.Group("/cart", middleware.AuthMiddleware(sessionStore))
	// cartGroup.GET("", handlers.ListCartItems)
	// cartGroup.POST("", handlers.AddCartItem)
	// cartGroup.PUT("/:id", handlers.UpdateCartItemQuantity)
	// cartGroup.DELETE("/:id", handlers.DeleteCartItem)
	// cartGroup.POST("/checkout", handlers.CheckoutCart)

	// // Orders related routes
	// e.GET("/user/orders/:id", handlers.GetUserOrderDetails, middleware.AuthMiddleware(sessionStore))
	// // NEEDS ADMIN MIDDLEWARE
	// e.PUT("/orders/:id/status", handlers.UpdateOrderStatus)

	// e.POST("/contact", handlers.ContactUs)
}
