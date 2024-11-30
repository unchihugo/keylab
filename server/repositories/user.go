package repositories

import (
	"errors"
	db "keylab/database"
	"keylab/database/models"
	"log"

	"gorm.io/gorm"
)

func FindUserByEmail(email string) (*models.User, error) {
	var user models.User

	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

func FindUserByID(id int64) (models.User, error) {
	var user models.User

	err := db.DB.Where("id = ?", id).First(&user).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching user by ID: %v", err)
	}

	return user, err
}
