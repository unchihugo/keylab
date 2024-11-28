package db

import (
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	migrateDriver "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

/*

	Loads values from the .env filE
	Initializes a GORM connection to the MariaDB database and runs migrations

*/

func InitDB() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("MARIADB_USER"),
		os.Getenv("MARIADB_PASSWORD"),
		os.Getenv("MARIADB_HOST"),
		os.Getenv("MARIADB_PORT"),
		os.Getenv("MARIADB_DATABASE"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	DB = db

	if err := runMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Connected to the database and migrations completed")
}

/*

	Creates a new driver instance and migrator instance
	Runs the migrations and logs the result

*/

func runMigrations() error {
	db, _ := DB.DB()

	// Creates a new MySQL driver instance with GORM connection and empty config
	driver, err := migrateDriver.WithInstance(db, &migrateDriver.Config{})
	if err != nil {
		return fmt.Errorf("Could not create driver: %w", err)
	}

	// Reads the migration files and creates a new migrator instance
	m, err := migrate.NewWithDatabaseInstance(
		"file://database/migrations",
		os.Getenv("MARIADB_DATABASE"),
		driver,
	)
	if err != nil {
		return fmt.Errorf("Could not create migrate instance: %w", err)
	}

	// Runs all the migrations
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
