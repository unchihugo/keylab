package repositories

import (
	"errors"
	"fmt"
	"keylab/database/models"
	"log"

	"gorm.io/gorm"
)

func GetProducts(order string, limit int, offset int, db *gorm.DB) ([]models.Product, error) {
	var products []models.Product
	err := db.Preload("Category").Preload("Category.Parent").Preload("ProductImages").Order(order).Limit(limit).Offset(offset).Find(&products).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching products: %v", err)
	}

	return products, err
}

func GetProductBySlug(slug string, db *gorm.DB) (models.Product, error) {
	var product models.Product
	err := db.Preload("Category").Preload("Category.Parent").Preload("ProductImages").Where("slug = ?", slug).First(&product).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching product by slug: %v", err)
	}

	return product, err
}

func SetProductImageURLs(products []models.Product, baseURL string) {
	for i := range products {
		for j := range products[i].ProductImages {
			products[i].ProductImages[j].URL = fmt.Sprintf("%s/products/image/%s", baseURL, products[i].ProductImages[j].Image)
		}
	}
}
