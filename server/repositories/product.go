package repositories

import (
	"errors"
	db "keylab/database"
	"keylab/database/models"
	"log"

	"gorm.io/gorm"
)

func GetProductBySlug(slug string) (models.Product, error) {
	var product models.Product
	err := db.DB.Preload("Category").Where("slug = ?", slug).First(&product).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching product by slug: %v", err)
	}

	return product, err
}
