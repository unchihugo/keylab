package routes

import (
	"keylab/handlers"
	"keylab/middleware"

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
	e.GET("/test/permission", h.TestPermission, middleware.AuthMiddleware(sessionStore, db), middleware.PermissionMiddleware(db, "admin:dashboard"))

	// Category related routes
	categoryGroup := e.Group("/categories")
	categoryGroup.GET("", h.GetCategories)
	categoryGroup.GET("/:slug", h.GetCategoryBySlug)

	// TODO: Add admin middleware to the following routes
	categoryGroup.POST("", h.CreateCategory)
	categoryGroup.DELETE("/:slug", h.DeleteCategory)
	categoryGroup.PUT("/:slug", h.UpdateCategory)

	// Product related routes
	productGroup := e.Group("/products")
	productGroup.GET("", h.ListProducts)
	productGroup.GET("/:slug", h.GetProductBySlug)
	productGroup.GET("/category/:id", h.GetProductsByCategory)
	productGroup.GET("/search/:query", h.SearchProducts)
	productGroup.GET("/image/:path", h.GetProductImage)

	// TODO: Add admin middleware to the following routes
	productGroup.POST("", h.CreateProduct)
	productGroup.DELETE("/:id", h.DeleteProduct)
	productGroup.PUT("/:id", h.UpdateProduct)
	productGroup.POST("/:slug/image", h.UploadProductImages)
	productGroup.DELETE("/:slug/image/:id", h.DeleteProductImage)

	productReviewGroup := e.Group("/products/:product_slug/reviews")
	productReviewGroup.GET("", h.GetReviewsByProduct)
	productReviewGroup.GET("/user/:user_id", h.GetReviewByUser)
	productReviewGroup.GET("/:id", h.GetReview)
	productReviewGroup.GET("/statistics", h.GetReviewStatistics)
	e.GET("/users/:user_id/reviews", h.GetReviewsByUser)

	productReviewGroup.POST("", h.CreateReview, middleware.AuthMiddleware(sessionStore, db))
	productReviewGroup.PUT("/:id", h.UpdateReview, middleware.AuthMiddleware(sessionStore, db))
	productReviewGroup.DELETE("/:id", h.DeleteReview, middleware.AuthMiddleware(sessionStore, db))
	productReviewGroup.GET("/user", h.GetUserReview, middleware.AuthMiddleware(sessionStore, db))
	e.GET("/reviews/recent", h.FetchRecentViews)

	// Cart related routes
	cartGroup := e.Group("/cart", middleware.AuthMiddleware(sessionStore, db))
	cartGroup.GET("", h.ListCartItems)
	cartGroup.POST("", h.AddCartItem)
	cartGroup.PUT("/:id", h.UpdateCartItemQuantity)
	cartGroup.DELETE("/:id", h.DeleteCartItem)
	cartGroup.POST("/checkout", h.CheckoutCart)

	// Orders related routes
	e.GET("/user/orders/:id", h.GetUserOrderDetails, middleware.AuthMiddleware(sessionStore, db))
	// NEEDS ADMIN MIDDLEWARE
	e.PUT("/orders/:id/status", h.UpdateOrderStatus)

	e.POST("/contact", h.ContactUs)

	// Role Management Routes - using proper handler methods
	e.GET("/api/roles", h.GetRoles)
	e.GET("/api/users/:id/role", h.GetUserRole)
	e.GET("/users", h.GetUsers)
	e.PUT("/api/users/:id/role", h.UpdateUserRole)
	e.POST("/api/roles", h.CreateRole)
}
