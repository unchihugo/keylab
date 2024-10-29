package routes

import (
	"keylab/handlers"
	"keylab/middleware"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo, sessionStore *sessions.CookieStore) {
	e.POST("/auth/register", handlers.Register)

	e.POST("/auth/login", handlers.Login(sessionStore))

	e.GET("/auth/logout", handlers.Logout(sessionStore))

	e.GET("/protected", handlers.Protected, middleware.AuthMiddleware(sessionStore))
}
