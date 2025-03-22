package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// Role represents the role model
type Role struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Permissions string `json:"permissions"`
}

// User represents the user model with role information
type User struct {
	ID     int64 `json:"id"`
	RoleID int64 `json:"role_id"`
	Role   *Role `json:"role,omitempty" gorm:"foreignKey:RoleID"`
}

// GetRoles returns all roles
func (h *Handlers) GetRoles(c echo.Context) error {
	var roles []Role
	if err := h.DB.Find(&roles).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching roles"})
	}
	return c.JSON(http.StatusOK, roles)
}

// GetUserRole returns a user's role
func (h *Handlers) GetUserRole(c echo.Context) error {
	userID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var user User
	if err := h.DB.Preload("Role").First(&user, userID).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"userId": user.ID,
		"roleId": user.RoleID,
		"role":   user.Role,
	})
}

// GetUsers returns all users with their roles
func (h *Handlers) GetUsers(c echo.Context) error {
	var users []User
	if err := h.DB.Preload("Role").Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching users"})
	}
	return c.JSON(http.StatusOK, users)
}

// UpdateUserRoleInput represents the input to update a user's role
type UpdateUserRoleInput struct {
	RoleID int64 `json:"roleId"`
}

// UpdateUserRole updates a user's role
func (h *Handlers) UpdateUserRole(c echo.Context) error {
	userID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	var input UpdateUserRoleInput
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	// Verify role exists if a role ID is provided
	if input.RoleID != 0 {
		var role Role
		if err := h.DB.First(&role, input.RoleID).Error; err != nil {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "Role not found"})
		}
	}

	// Update user's role
	if err := h.DB.Model(&User{}).Where("id = ?", userID).Update("role_id", input.RoleID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update user role"})
	}

	// Get updated user with role
	var user User
	h.DB.Preload("Role").First(&user, userID)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"userId": user.ID,
		"roleId": user.RoleID,
		"role":   user.Role,
	})
}

// CreateRole creates a new role
func (h *Handlers) CreateRole(c echo.Context) error {
	var role Role
	if err := c.Bind(&role); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	// Simple validation
	if role.Name == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Role name is required"})
	}

	if err := h.DB.Create(&role).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create role"})
	}

	return c.JSON(http.StatusCreated, role)
}