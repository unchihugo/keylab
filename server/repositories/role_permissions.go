package repositories

import (
	"errors"
	db "keylab/database"
	"keylab/database/models"
	"log"

	"gorm.io/gorm"
)
func CheckRolePermissions(roleID int64, requiredPermissions []string) (bool, error) {
	
	var permissions []models.Permission
	err := database.DB.Table("role_permissions").
		Joins("JOIN permissions ON role_permissions.permission_id = permissions.id").
		Where("role_permissions.role_id = ?", roleID).
		Where("permissions.name IN ?", requiredPermissions).
		Find(&permissions).Error

	if err != nil {
		log.Printf("Error checking role permissions: %v", err)
		return false, err
	}


	if len(permissions) == len(requiredPermissions) {
		return true, nil
	}


	return false, nil
}
