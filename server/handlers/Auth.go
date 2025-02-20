package handlers

import (
	"fmt"
	db "keylab/database"
	"keylab/database/models"
	"keylab/repositories"
	"keylab/utils"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

const SessionName = "keylab"

// Login Handler [POST /auth/login]
// 1. Parsing user input from the request body, and validating it.
// 2. Checks if user exists, returns status 401 if not.
// 3. Compares the password hash against the user's password hash.
// 4. Creates or gets session for the user.
// 5. Initiates the session with the user's ID.
// 6. Returns status 200 if successful.

func Login(sessionStore *sessions.CookieStore) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Parsing user input from the request body, and validating it.
		var user models.User
		if err := c.Bind(&user); err != nil {
			return jsonResponse(c, http.StatusBadRequest, "Invalid input")
		}

		if err := user.Validate("Email"); err != nil {
			return jsonResponse(c, http.StatusBadRequest, err.Error())
		}

		// Checks if user exists, returns status 401 if not.
		validUser, err := repositories.FindUserByEmail(user.Email)
		if err != nil {
			log.Printf("Error in database while finding user by email: %v", err)
			return jsonResponse(c, http.StatusInternalServerError, "Error checking existing user")
		}

		// Compares the password hash against the user's password hash.
		if validUser == nil || utils.ComparePasswordHash(user.Password, validUser.Password) != nil {
			return jsonResponse(c, http.StatusUnauthorized, "Invalid email or password")
		}

		// Creates or gets session for the user.
		session, err := sessionStore.Get(c.Request(), SessionName)
		if err != nil {
			log.Printf("Error creating session: %v", err)
			return jsonResponse(c, http.StatusInternalServerError, "Error creating session")
		}

		// Initiates the session with the user's ID.
		initiateSession(session, validUser.ID)
		if err := session.Save(c.Request(), c.Response()); err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error saving session")
		}

		return jsonResponse(c, http.StatusOK, "Logged in successfully!")
	}
}

// Register Handler [POST /auth/register]
// 1. Parsing user input from the request body, and validating it.
// 2. Checks if user exists, returns status 401 if not.
// 3. Hashes the user's password.
// 4. Creates the user in the database.
// 5. Returns status 200 if successful.

func Register(c echo.Context) error {

	// Parsing user input from the request body, and validating it.
	var user models.User
	if err := c.Bind(&user); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input registration user")
	}

	if err := user.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	// Checks if user exists, returns status 401 if not.
	validUser, err := repositories.FindUserByEmail(user.Email)
	if err != nil {
		// If error occurs while checking for existing user, return 500 and output error message to terminal.
		log.Printf("Error checking existing user: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error checking existing user")
	}

	if validUser != nil {
		return jsonResponse(c, http.StatusBadRequest, "User already exists")
	}

	// Password regex validation (at least one lowercase, one uppercase, one digit)
	matched, err := utils.ValidatePassword(user.Password)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error validating password")
	}

	if !matched {
		return jsonResponse(c, http.StatusBadRequest, "Password does not meet requirements")
	}

	// Hashes user's password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error hashing password")
	}
	user.Password = hashedPassword

	// Creates the user in the database.
	if err := db.DB.Create(&user).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error creating user")
	}

	return jsonResponse(c, http.StatusOK, "User created successfully!")
}

// Logout Handler [POST /auth/logout]
// 1. Gets the session for the user.
// 2. Sets the session's MaxAge to -1.
// 3. Saves the session.
// 4. Returns status 200 if successful.

func Logout(sessionStore *sessions.CookieStore) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Gets the session for the user.
		session, err := sessionStore.Get(c.Request(), SessionName)
		if err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error retrieving session")
		}

		// Sets the session's MaxAge to -1 essentially deleting the session.
		session.Options.MaxAge = -1
		if err := session.Save(c.Request(), c.Response()); err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error saving session")
		}

		return jsonResponse(c, http.StatusOK, "Logged out successfully!")
	}
}

// ValidateSession Handler [GET /auth/validate]
// 1. Validates the session.
// 2. Returns status 200 if successful.
// 3. Returns status 401 if unsuccessful.
// 4. Returns status 500 if an error occurs.

func ValidateSession(sessionStore *sessions.CookieStore) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, ok := c.Get("user").(models.User)
		if !ok {
			return jsonResponse(c, http.StatusUnauthorized, "Invalid session")
		}

		if user.ID == 0 {
			return jsonResponse(c, http.StatusUnauthorized, "Invalid session")
		}

		return jsonResponse(c, http.StatusOK, "Valid session", user)
	}
}

// REMOVE LATER

func TestPermission() echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(models.User)

		fmt.Println(user)

		return jsonResponse(c, http.StatusOK, "Test Permission")
	}
}
