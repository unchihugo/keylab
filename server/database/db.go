package db

import (
	"fmt"
	"keylab/config"
	"keylab/database/seeders"
	"log"
	"os"
	"path/filepath"
	"runtime"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	migrateDriver "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	config := config.Initialize()

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.MARIADB_USER,
		config.MARIADB_PASSWORD,
		config.MARIADB_HOST,
		config.MARIADB_PORT,
		config.MARIADB_DATABASE,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	if err := runMigrations(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Connected to the database and migrations completed")

	if err := runSeeder(db); err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}

	return db
}

func runMigrations(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("Could not get SQL DB: %w", err)
	}

	driver, err := migrateDriver.WithInstance(sqlDB, &migrateDriver.Config{})
	if err != nil {
		return fmt.Errorf("Could not create driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://database/migrations",
		os.Getenv("MARIADB_DATABASE"),
		driver,
	)
	if err != nil {
		return fmt.Errorf("Could not create migrate instance: %w", err)
	}

	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			log.Println("Migrations are up to date, no changes were made")
			return nil
		}

		return fmt.Errorf("Could not run migrations: %w", err)
	}

	log.Println("Migrations completed successfully")
	return nil
}

func runSeeder(db *gorm.DB) error {
	if os.Getenv("RUN_TEST_SEEDER") == "true" {
		if err := seeders.SeedAll(db); err != nil {
			return fmt.Errorf("Could not seed database: %w", err)
		}

		log.Println("Database seeded successfully")
		return nil
	} else {
		if err := seeders.CleanTables(db); err != nil {
			return fmt.Errorf("Could not clean tables: %w", err)
		}

		log.Println("Database test seeding is disabled")
		return nil
	}
}

func GetProjectRoot() string {
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatal("Unable to get the current file path")
	}

	projectRoot := filepath.Dir(filepath.Dir(filename))

	return projectRoot
}
