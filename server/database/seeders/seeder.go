package seeders

import (
	"keylab/database/models"

	"gorm.io/gorm"
)

// Seeds all data into the database
func SeedAll(DB *gorm.DB) error {
	if err := SeedProductCategories(DB); err != nil {
		return err
	}

	if err := SeedProducts(DB); err != nil {
		return err
	}

	return nil
}

func SeedProductCategories(DB *gorm.DB) error {
	categories := []models.ProductCategory{
		{Name: "Keyboards", Slug: "keyboards", Description: "Find your next mechanical, ergonomic, or aesthetic keyboards here"},
		{Name: "Switches", Slug: "switches", Description: "Find your next tactile, clicky, or linear switches here"},
		{Name: "Cherry MX Switches", Slug: "cherry-mx", Description: "A collection of popular Cherry MX switches"},
	}

	if err := DB.Create(&categories).Error; err != nil {
		return err
	}

	return nil
}

func SeedProducts(DB *gorm.DB) error {
	products := []models.Product{
		{Name: "Keychron K6", Slug: "keychron-k6", Description: "A compact 65% wireless mechanical keyboard, by Keychron.", Price: 69.99, Stock: 40, CategoryID: 1},
		{Name: "Keychron K8", Slug: "keychron-k8", Description: "A compact 75% wireless mechanical keyboard, by Keychron.", Price: 79.99, Stock: 50, CategoryID: 1},
		{Name: "Gateron Red", Slug: "gateron-red", Description: "A linear switch with a 45g actuation force.", Price: 0.25, Stock: 1000, CategoryID: 2},
		{Name: "Cherry MX Blue", Slug: "cherry-mx-blue", Description: "A clicky switch with a 50g actuation force. A popular choice for tactile users!", Price: 0.50, Stock: 1000, CategoryID: 3},
	}

	if err := DB.Create(&products).Error; err != nil {
		return err
	}

	return nil
}
