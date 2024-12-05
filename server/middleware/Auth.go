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
                        if !ok {
				return c.JSON(http.StatusUnauthorized, "Invalid session data")
			}
			user, err := repositories.FindUserByID(userID)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, "User not found")
			}

			c.Set("user", user)
			return next(c)
		}
	}
}
func PermissionMiddleware(requiredPermissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			
			user, ok := c.Get("user").(*repositories.User)
			if !ok || user == nil {
				return c.JSON(http.StatusUnauthorized, "Unauthorized user")
			}

			
			hasPermission, err := repositories.CheckRolePermissions(user.RoleID, requiredPermissions)
			if err != nil || !hasPermission {
				return c.JSON(http.StatusForbidden, "You do not have access to this resource")
			}

			return next(c)
		}
	}
}
