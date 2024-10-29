package handlers

import (
	db "keylab/database"
	"keylab/database/models"
	"keylab/repositories"
	"keylab/utils"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

// SessionName for all session cookies
const SessionName = "keylab"

/*

   TODO: Comment the Login function

*/

func Login(sessionStore *sessions.CookieStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		var user models.User
		if err := c.Bind(&user); err != nil {
			return jsonResponse(c, http.StatusBadRequest, "Invalid input")
		}

		validUser, err := repositories.FindUserByEmail(user.Email)
		if err != nil || utils.ComparePasswordHash(user.Password, validUser.Password) != nil {
			return jsonResponse(c, http.StatusUnauthorized, "Invalid email or password")
		}

		session, err := sessionStore.Get(c.Request(), SessionName)
		if err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error creating session")
		}

		initiateSession(session, validUser.ID)
		if err := session.Save(c.Request(), c.Response()); err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error saving session")
		}

		return jsonResponse(c, http.StatusOK, "Logged in successfully!")
	}
}

/*

   TODO: Comment the Register function

*/

func Register(c echo.Context) error {
	var user models.User

	if err := c.Bind(&user); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input registration user")
	}

	if err := user.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	exists, err := repositories.FindUserByEmail(user.Email)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error checking existing user")
	}
	if exists != nil {
		return jsonResponse(c, http.StatusBadRequest, "Email already exists")
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error hashing password")
	}
	user.Password = hashedPassword

	if err := db.DB.Create(&user).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error creating user")
	}

	return jsonResponse(c, http.StatusOK, "User created successfully!")
}

/*

   TODO: Comment the Logout function

*/

func Logout(sessionStore *sessions.CookieStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		session, err := sessionStore.Get(c.Request(), SessionName)
		if err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error retrieving session")
		}

		session.Options.MaxAge = -1
		if err := session.Save(c.Request(), c.Response()); err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error saving session")
		}

		return jsonResponse(c, http.StatusOK, "Logged out successfully!")
	}
}

/*

   TODO: Comment the Protected route handler

*/

func Protected(c echo.Context) error {
	user := c.Get("user").(*models.User)

	return c.JSON(http.StatusOK, user)
}
