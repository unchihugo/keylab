package seeders

import (
	"keylab/database/models"
	"time"

	"gorm.io/gorm"
)

// Seeds all data into the database
func SeedAll(DB *gorm.DB) error {
	if err := cleanTables(DB); err != nil {
		return err
	}

	if err := SeedProductCategories(DB); err != nil {
		return err
	}

	if err := SeedProducts(DB); err != nil {
		return err
	}

	return nil
}

func cleanTables(DB *gorm.DB) error {
	tables := []string{"products", "product_categories"}

	for _, table := range tables {
		if err := DB.Exec("DELETE FROM " + table).Error; err != nil {
			return err
		}
		if err := DB.Exec("ALTER TABLE " + table + " AUTO_INCREMENT = 1").Error; err != nil {
			return err
		}
	}

	return nil
}

func SeedProductCategories(DB *gorm.DB) error {
	categories := []models.ProductCategory{
		{ParentID: nil, Name: "Keyboards", Slug: "keyboards", Description: "Find your next mechanical, ergonomic, or aesthetic keyboards here", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Switches", Slug: "switches", Description: "Find your next tactile, clicky, or linear switches here", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ParentID: nil, Name: "Cherry MX Switches", Slug: "cherry-mx", Description: "A collection of popular Cherry MX switches", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	// Create parent categories
	for i := 0; i < 2; i++ {
		if err := DB.Create(&categories[i]).Error; err != nil {
			return err
		}
	}

	var parentCategory models.ProductCategory
	if err := DB.Where("slug = ?", "switches").First(&parentCategory).Error; err != nil {
		return err
	}

	// Update the Cherry MX Switches category with the correct ParentID
	categories[2].ParentID = &parentCategory.ID
	if err := DB.Create(&categories[2]).Error; err != nil {
		return err
	}

	return nil
}

func SeedProducts(DB *gorm.DB) error {
	products := []models.Product{
		{Name: "Keychron K6", Slug: "keychron-k6", Description: "A compact 65% wireless mechanical keyboard, by Keychron.", Price: 69.99, Stock: 40, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Keychron K8", Slug: "keychron-k8", Description: "A compact 75% wireless mechanical keyboard, by Keychron.", Price: 79.99, Stock: 50, CategoryID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Gateron Red", Slug: "gateron-red", Description: "A linear switch with a 45g actuation force.", Price: 0.25, Stock: 1000, CategoryID: 2, CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{Name: "Cherry MX Blue", Slug: "cherry-mx-blue", Description: "A clicky switch with a 50g actuation force. A popular choice for tactile users!", Price: 0.50, Stock: 1000, CategoryID: 3, CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	if err := DB.Create(&products).Error; err != nil {
		return err
	}

	return nil
}
