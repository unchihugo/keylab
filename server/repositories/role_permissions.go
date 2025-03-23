package repositories

import (
	"log"

	"gorm.io/gorm"
)

func CheckRolePermissions(roleID int64, requiredPermissions []string, db *gorm.DB) (bool, error) {
	var count int64

	err := db.Table("role_permissions").
		Joins("JOIN permissions ON role_permissions.permission_id = permissions.id").
		Where("role_permissions.role_id = ?", roleID).
		Where("permissions.name IN ?", requiredPermissions).
		Count(&count).Error

	if err != nil {
		log.Printf("Error checking role permissions: %v", err)
		return false, err
	}

	if count == int64(len(requiredPermissions)) {
		return true, nil
	}

	return false, nil
}
