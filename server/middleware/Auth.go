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
func PermissionMiddleware(sessionStore *sessions.CookieStore, requiredPermissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			session, _ := sessionStore.Get(c.Request(), "session-key")
			userID, ok := session.Values["user_id"].(int64)
			if !ok {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not logged in")
			}

			
			user, err := repositories.FindUserByID(userID)
			if err != nil || user == nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "User not found")
			}

			
			roleID := user.RoleID

			hasPermission, err := repositories.CheckRolePermissions(roleID, requiredPermissions)
			if err != nil || !hasPermission {
				return echo.NewHTTPError(http.StatusForbidden, "You do not have access to this resource")
			}

			return next(c)
		}
	}
}
