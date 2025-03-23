package handlers

import (
	"keylab/database/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// GetAllRoles Handler [GET /admin/roles]
// 1. Fetches all roles from the database.
// 2. Checks if permissions should be included in the response.
// 3. If requested, fetches associated permissions for each role.
// 4. Returns status 200 with roles data if successful.
// 5. Returns status 500 if database error occurs.

func (h *Handlers) GetAllRoles(c echo.Context) error {
	var roles []models.Role

	includePermissions := c.QueryParam("include_permissions") == "true"

	if err := h.DB.Find(&roles).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching roles")
	}

	if includePermissions {
		type RoleWithPermissions struct {
			models.Role
			Permissions []models.Permission `json:"permissions"`
		}

		var result []RoleWithPermissions

		for _, role := range roles {
			var permissions []models.Permission

			if err := h.DB.Model(&models.Permission{}).
				Joins("JOIN role_permissions ON role_permissions.permission_id = permissions.id").
				Where("role_permissions.role_id = ?", role.ID).
				Find(&permissions).Error; err != nil {
				return jsonResponse(c, http.StatusInternalServerError, "Error fetching permissions")
			}

			result = append(result, RoleWithPermissions{
				Role:        role,
				Permissions: permissions,
			})
		}

		return jsonResponse(c, http.StatusOK, "Roles retrieved successfully", result)
	}

	return jsonResponse(c, http.StatusOK, "Roles retrieved successfully", roles)
}

// GetRoleById Handler [GET /admin/roles/:id]
// 1. Parses and validates the role ID parameter.
// 2. Fetches the role from the database.
// 3. Retrieves all permissions associated with the role.
// 4. Returns status 200 with role and permissions data if successful.
// 5. Returns status 400 if ID parameter is invalid.
// 6. Returns status 404 if role not found.
// 7. Returns status 500 if database error occurs.

func (h *Handlers) GetRoleById(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := h.DB.First(&role, id).Error; err != nil {
		return jsonResponse(c, http.StatusNotFound, "Role not found")
	}

	var permissions []models.Permission
	if err := h.DB.Model(&models.Permission{}).
		Joins("JOIN role_permissions ON role_permissions.permission_id = permissions.id").
		Where("role_permissions.role_id = ?", id).
		Find(&permissions).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching permissions")
	}

	return jsonResponse(c, http.StatusOK, "Role retrieved successfully", map[string]interface{}{
		"role":        role,
		"permissions": permissions,
	})
}

// CreateRole Handler [POST /admin/roles]
// 1. Parses and validates the role data from request body.
// 2. Checks if a role with the same name already exists.
// 3. Creates the new role in the database.
// 4. Returns status 201 with the created role data if successful.
// 5. Returns status 400 if input validation fails.
// 6. Returns status 400 if role with same name exists.
// 7. Returns status 500 if database error occurs.

func (h *Handlers) CreateRole(c echo.Context) error {
	var role models.Role
	if err := c.Bind(&role); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input")
	}

	if err := role.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	var existingRole models.Role
	if err := h.DB.Where("name = ?", role.Name).First(&existingRole).Error; err == nil {
		return jsonResponse(c, http.StatusBadRequest, "Role with this name already exists")
	}

	if err := h.DB.Create(&role).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error creating role")
	}

	return jsonResponse(c, http.StatusCreated, "Role created successfully", role)
}

// UpdateRole Handler [PUT /admin/roles/:id]
// 1. Parses and validates the role ID parameter.
// 2. Fetches the existing role from the database.
// 3. Parses the updated role data from request body.
// 4. Validates that the new name doesn't conflict with other roles.
// 5. Updates the role in the database.
// 6. Returns status 200 with updated role data if successful.
// 7. Returns status 400 if ID parameter or input is invalid.
// 8. Returns status 404 if role not found.
// 9. Returns status 500 if database error occurs.

func (h *Handlers) UpdateRole(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := h.DB.First(&role, id).Error; err != nil {
		return jsonResponse(c, http.StatusNotFound, "Role not found")
	}

	var updatedRole struct {
		Name string `json:"name"`
	}

	if err := c.Bind(&updatedRole); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input")
	}

	if updatedRole.Name != role.Name {
		var existingRole models.Role
		if err := h.DB.Where("name = ? AND id != ?", updatedRole.Name, id).First(&existingRole).Error; err == nil {
			return jsonResponse(c, http.StatusBadRequest, "Role with this name already exists")
		}
	}

	role.Name = updatedRole.Name

	if err := role.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := h.DB.Save(&role).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error updating role")
	}

	return jsonResponse(c, http.StatusOK, "Role updated successfully", role)
}

// DeleteRole Handler [DELETE /admin/roles/:id]
// 1. Parses and validates the role ID parameter.
// 2. Checks if the role exists.
// 3. Deletes all role-permission associations for the role.
// 4. Deletes the role from the database.
// 5. Returns status 200 if deletion is successful.
// 6. Returns status 400 if ID parameter is invalid.
// 7. Returns status 404 if role not found.
// 8. Returns status 500 if database error occurs.

func (h *Handlers) DeleteRole(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := h.DB.First(&role, id).Error; err != nil {
		return jsonResponse(c, http.StatusNotFound, "Role not found")
	}

	if err := h.DB.Model(&models.User{}).Where("role_id = ?", id).Update("role_id", nil).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error updating user roles")
	}

	if err := h.DB.Where("role_id = ?", id).Delete(&models.RolePermission{}).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error removing role permissions")
	}

	if err := h.DB.Delete(&role).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting role")
	}

	return jsonResponse(c, http.StatusOK, "Role deleted successfully")
}

// AddPermissionToRole Handler [POST /admin/roles/:id/permissions]
// 1. Parses and validates the role ID parameter.
// 2. Checks if the role exists.
// 3. Parses permission IDs from request body.
// 4. Validates each permission exists.
// 5. Adds new role-permission associations for each permission.
// 6. Skips permissions already assigned to the role.
// 7. Returns status 200 if permissions added successfully.
// 8. Returns status 400 if ID parameter or permission IDs are invalid.
// 9. Returns status 404 if role not found.
// 10. Returns status 500 if database error occurs.

func (h *Handlers) AddPermissionToRole(c echo.Context) error {
	roleId, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid role ID")
	}

	var role models.Role
	if err := h.DB.First(&role, roleId).Error; err != nil {
		return jsonResponse(c, http.StatusNotFound, "Role not found")
	}

	var request struct {
		PermissionIDs []int64 `json:"permission_ids"`
	}

	if err := c.Bind(&request); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input")
	}

	for _, permID := range request.PermissionIDs {
		var perm models.Permission
		if err := h.DB.First(&perm, permID).Error; err != nil {
			return jsonResponse(c, http.StatusBadRequest, "Permission ID "+strconv.FormatInt(permID, 10)+" not found")
		}

		var existingRP models.RolePermission
		if err := h.DB.Where("role_id = ? AND permission_id = ?", roleId, permID).First(&existingRP).Error; err == nil {
			continue
		}

		rolePermission := models.RolePermission{
			RoleID:       roleId,
			PermissionID: permID,
		}

		if err := h.DB.Create(&rolePermission).Error; err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error adding permission to role")
		}
	}

	return jsonResponse(c, http.StatusOK, "Permissions added successfully")
}

// RemovePermissionFromRole Handler [DELETE /admin/roles/:roleId/permissions/:permissionId]
// 1. Parses and validates the role ID and permission ID parameters.
// 2. Deletes the role-permission association from the database.
// 3. Returns status 200 if removal is successful.
// 4. Returns status 400 if any ID parameter is invalid.
// 5. Returns status 404 if the association is not found.
// 6. Returns status 500 if database error occurs.

func (h *Handlers) RemovePermissionFromRole(c echo.Context) error {
	roleId, err := strconv.ParseInt(c.Param("roleId"), 10, 64)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid role ID")
	}

	permId, err := strconv.ParseInt(c.Param("permissionId"), 10, 64)
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid permission ID")
	}

	result := h.DB.Where("role_id = ? AND permission_id = ?", roleId, permId).Delete(&models.RolePermission{})

	if result.Error != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error removing permission from role")
	}

	if result.RowsAffected == 0 {
		return jsonResponse(c, http.StatusNotFound, "Role-permission association not found")
	}

	return jsonResponse(c, http.StatusOK, "Permission removed from role")
}

// GetAllPermissions Handler [GET /admin/permissions]
// 1. Fetches all permissions from the database.
// 2. Returns status 200 with permissions data if successful.
// 3. Returns status 500 if database error occurs.

func (h *Handlers) GetAllPermissions(c echo.Context) error {
	var permissions []models.Permission

	if err := h.DB.Find(&permissions).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching permissions")
	}

	return jsonResponse(c, http.StatusOK, "Permissions retrieved successfully", permissions)
}
