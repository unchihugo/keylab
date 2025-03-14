package repositories

import (
	"errors"
	db "keylab/database"
	"keylab/database/models"
	"log"

	"gorm.io/gorm"
)

// Get review by ID
func GetReviewByID(id int64) (models.ProductReviews, error) {
	var review models.ProductReviews

	err := db.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "forename", "surname")
	}).Preload("Product").Preload("Product.Category").Where("id = ?", id).First(&review).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching review by ID: %v", err)
	}

	return review, err
}

// Retrieve all reviews by a user
func GetReviewByUserID(userID int64) ([]models.ProductReviews, error) {
	var reviews []models.ProductReviews

	err := db.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "forename", "surname")
	}).Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Find(&reviews).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching reviews by user ID: %v", err)
	}

	return reviews, err
}

// Retrieve all reviews for a product by product ID
func GetReviewsByProductID(productID int64) ([]models.ProductReviews, error) {
	var reviews []models.ProductReviews

	err := db.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "forename", "surname")
	}).Preload("Product").Preload("Product.Category").Where("product_id = ?", productID).Find(&reviews).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching reviews by product ID: %v", err)
	}

	return reviews, err
}
