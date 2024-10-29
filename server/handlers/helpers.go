package handlers

import (
	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func jsonResponse(c echo.Context, httpCode int, message string) error {
	return c.JSON(httpCode, echo.Map{"message": message})
}

func initiateSession(session *sessions.Session, userID int64) {
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
		Secure:   true,
	}

	session.Values["user_id"] = userID
}
