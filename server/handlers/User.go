package handlers

import (
	db "keylab/database"
	"keylab/database/models"
	"keylab/repositories"
	"keylab/utils"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetUserProfile [GET /users/:id]
// 1. Ensures the user is authenticated
// 2. Ensures a user can only access their own profile
// 3. Fetches user ID from the request and validates it
// 4. Fetches user from the database by ID
// 5. Returns status 200 with user details if successful
// 6. Returns status 400 if user ID is invalid
// 7. Returns status 401 if the user is not authenticated
// 8. Returns status 403 if a user tries to access another user's profile
// 9. Returns status 404 if user is not found
func GetUserProfile(c echo.Context) error {

	authenticatedUser, ok := c.Get("user").(models.User)
	if !ok {
		log.Println("Unauthorized access attempt")
		return jsonResponse(c, http.StatusUnauthorized, "Unauthorized")
	}

	userID, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Invalid user ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	if authenticatedUser.ID != userID {
		log.Printf("Unauthorized access attempt by user %d to access user %d", authenticatedUser.ID, userID)
		return jsonResponse(c, http.StatusForbidden, "Access denied")
	}

	user, err := repositories.FindUserByID(userID)
	if err != nil {
		log.Printf("User not found: %v", err)
		return jsonResponse(c, http.StatusNotFound, "User not found")
	}

	return jsonResponse(c, http.StatusOK, "User profile retrieved successfully", user)
}

// UpdateUserProfile [PUT /users/:id]
// 1. Fetches the user ID from the request and validates it
// 2. Ensures the user is authenticated
// 3. Fetches the existing user from the database
// 4. Parses user input from the request body and validates it
// 5. Prevents modification of sensitive fields (password & email)
// 6. Updates the user in the database
// 7. Returns status 200 if successful
// 8. Returns status 400 if the input data is invalid
// 9. Returns status 404 if the user is not found
func UpdateUserProfile(c echo.Context) error {

	userID, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	authenticatedUser, ok := c.Get("user").(models.User)
	if !ok || authenticatedUser.ID != userID {
		return jsonResponse(c, http.StatusUnauthorized, "Unauthorized to update this profile")
	}

	existingUser, err := repositories.FindUserByID(userID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "User not found")
	}

	var updatedUser models.User
	if err := c.Bind(&updatedUser); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid request body")
	}

	updatedUser.Email = existingUser.Email

	if err := db.DB.Model(&existingUser).Omit("password").Updates(updatedUser).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Could not update user")
	}

	fullUser, err := repositories.FindUserByID(userID)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to retrieve updated user")
	}

	return jsonResponse(c, http.StatusOK, "User profile updated successfully", fullUser)
}

// ChangeUserPassword [POST /users/:id/change-password]
// 1. Fetches user ID from request parameters and validates it.
// 2. Ensures the logged-in user can only update their own password.
// 3. Parses password change request from the request body.
// 4. Validates the old password before updating.
// 5. Returns status 200 if successful.
// 6. Returns status 400 if input is invalid.
// 7. Returns status 401 if old password is incorrect.
// 8. Returns status 500 if an error occurs.
func ChangeUserPassword(c echo.Context) error {
	userID, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Invalid user ID: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	authenticatedUser, ok := c.Get("user").(models.User)
	if !ok || authenticatedUser.ID != userID {
		return jsonResponse(c, http.StatusUnauthorized, "Unauthorized to change this password")
	}

	var body struct {
		CurrentPassword      string `json:"current_password"`
		NewPassword          string `json:"new_password"`
		PasswordConfirmation string `json:"password_confirmation"`
	}

	if err := c.Bind(&body); err != nil {
		log.Printf("Error binding password data: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid request body")
	}

	if body.NewPassword != body.PasswordConfirmation {
		return jsonResponse(c, http.StatusBadRequest, "New password and confirmation do not match")
	}

	user, err := repositories.FindUserByID(userID)
	if err != nil {
		log.Printf("User not found: %v", err)
		return jsonResponse(c, http.StatusNotFound, "User not found")
	}
	// Compare hashed passwords
	if utils.ComparePasswordHash(body.CurrentPassword, user.Password) != nil {
		log.Printf("Incorrect password for user ID: %d", userID)
		return jsonResponse(c, http.StatusUnauthorized, "Incorrect password")
	}
	// Hash new password before saving
	hashedPassword, err := utils.HashPassword(body.NewPassword)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Could not update password")
	}

	user.Password = hashedPassword
	if err := db.DB.Save(&user).Error; err != nil {
		log.Printf("Error updating password: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Could not update password")
	}

	return jsonResponse(c, http.StatusOK, "Password changed successfully")
}

// GetUserOrders [GET /users/:id/orders]
// 1. Ensures the user is authenticated
// 2. Fetches user ID from the request and validates it
// 3. Checks if the authenticated user matches the requested user ID
// 4. Retrieves orders from the database associated with the user
// 5. Returns status 200 with the orders if successful
// 6. Returns status 400 if user ID is invalid
// 7. Returns status 401 if the user is not authenticated
// 8. Returns status 404 if user has no orders
func GetUserOrders(c echo.Context) error {

	userID, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	authenticatedUser, ok := c.Get("user").(models.User)
	if !ok || authenticatedUser.ID != userID {
		return jsonResponse(c, http.StatusUnauthorized, "Unauthorized to view orders")
	}

	var orders []models.Order
	if err := db.DB.Where("user_id = ?", userID).Preload("OrderItems").Find(&orders).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching orders")
	}

	if len(orders) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No orders found for this user")
	}

	return jsonResponse(c, http.StatusOK, "User orders retrieved successfully", orders)
}
