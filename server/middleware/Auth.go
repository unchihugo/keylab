package middleware

import (
	"keylab/database/models"
	"keylab/handlers"
	"keylab/repositories"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func AuthMiddleware(sessionStore *sessions.CookieStore, db *gorm.DB) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			session, err := sessionStore.Get(c.Request(), handlers.SessionName)

			if err != nil || session.Values["user_id"] == nil {
				return c.JSON(http.StatusUnauthorized, "Unauthorized")
			}

			userID, ok := session.Values["user_id"].(int64)
			if !ok {
				return c.JSON(http.StatusUnauthorized, "Invalid session data")
			}

			user, err := repositories.FindUserByID(userID, db)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, "Unauthorized")
			}

			c.Set("user", user)
			return next(c)
		}
	}
}

func PermissionMiddleware(db *gorm.DB, requiredPermissions ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			user, ok := c.Get("user").(models.User)
			if !ok {
				return c.JSON(http.StatusUnauthorized, "Unauthorized user")
			}

			hasPermission, err := repositories.CheckRolePermissions(user.RoleID, requiredPermissions, db)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, "A error occured! Please contact administration")
			}

			if !hasPermission {
				return c.JSON(http.StatusForbidden, "You do not have access to this resource")
			}

			return next(c)
		}
	}
}
