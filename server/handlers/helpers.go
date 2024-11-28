package handlers

import (
	"strconv"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func jsonResponse(c echo.Context, httpCode int, message string, data ...interface{}) error {
	response := echo.Map{
		"message": message,
	}

	if len(data) > 0 && data[0] != nil {
		response["data"] = data[0]
	} else {
		response["data"] = []string{}
	}

	return c.JSON(httpCode, response)
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

func convertToInt64(value string) (int64, error) {
	intValue, err := strconv.ParseInt(value, 10, 64)

	if err != nil {
		return 0, err
	}

	return intValue, nil
}
