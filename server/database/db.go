package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var dsn string

func InitDB() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("MARIADB_USER"),
		os.Getenv("MARIADB_PASSWORD"),
		os.Getenv("MARIADB_HOST"),
		os.Getenv("MARIADB_PORT"),
		os.Getenv("MARIADB_DATABASE"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	DB = db

	log.Println("Connected to the database")
}
