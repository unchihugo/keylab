package middleware

import (
	"keylab/handlers"
	"keylab/repositories"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func AuthMiddleware(sessionStore *sessions.CookieStore) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			session, err := sessionStore.Get(c.Request(), handlers.SessionName)

			if err != nil || session.Values["user_id"] == nil {
				return c.JSON(http.StatusUnauthorized, "Unauthorized")
			}

			userID := session.Values["user_id"].(int64)
			user, err := repositories.FindUserByID(userID)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, "User not found")
			}

			c.Set("user", user)
			return next(c)
		}
	}
}
