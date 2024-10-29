package repositories

import (
	db "keylab/database"
	"keylab/database/models"
)

func FindUserByEmail(email string) (*models.User, error) {
	var user models.User

	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return &user, err
	}

	return &user, nil
}

func FindUserByID(id int64) (*models.User, error) {
	var user models.User

	if err := db.DB.Where("id = ?", id).First(&user).Error; err != nil {
		return &user, err
	}

	return &user, nil
}
