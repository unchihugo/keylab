package repositories

import (
	db "keylab/database"
	"log"
)

func CheckRolePermissions(roleID int64, requiredPermissions []string) (bool, error) {
	var count int64

	err := db.DB.Table("role_permissions").
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
