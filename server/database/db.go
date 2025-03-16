package db

import (
	"context"
	"errors"
	"fmt"
	"keylab/config"
	"keylab/database/seeders"
	"log"
	"os"
	"path/filepath"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	mysqlDriver "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/mariadb"
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

	fmt.Println(config)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	if err := runMigrations(db, config.MARIADB_DATABASE); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Connected to the database and migrations completed")

	if err := runSeeder(db); err != nil {
		log.Fatalf("Failed to seed database: %v", err)
	}

	return db
}

func runMigrations(db *gorm.DB, dbName string) error {
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("could not get SQL DB: %w", err)
	}

	projectRoot, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("could not get working directory: %w", err)
	}

	migrationsPath := filepath.Join(projectRoot, "database", "migrations")
	for {
		if _, err := os.Stat(migrationsPath); err == nil {
			break
		}

		parent := filepath.Dir(projectRoot)
		if parent == projectRoot {
			// We've reached the root
			return fmt.Errorf("migrations directory not found")
		}
		projectRoot = parent
		migrationsPath = filepath.Join(projectRoot, "database", "migrations")
	}

	log.Printf("Using migrations path: %s", migrationsPath)

	driver, err := mysqlDriver.WithInstance(sqlDB, &mysqlDriver.Config{})
	if err != nil {
		return fmt.Errorf("could not create MySQL driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", migrationsPath),
		dbName,
		driver,
	)
	if err != nil {
		return fmt.Errorf("could not create migrate instance: %w", err)
	}

	if err := m.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			log.Println("Migrations are up to date, no changes were made")
			return nil
		}
		return fmt.Errorf("could not run migrations: %w", err)
	}

	log.Println("Migrations completed successfully")
	return nil
}

func runSeeder(db *gorm.DB) error {
	if os.Getenv("RUN_TEST_SEEDER") == "true" {
		if err := seeders.SeedAll(db); err != nil {
			return fmt.Errorf("could not seed database: %w", err)
		}

		log.Println("Database seeded successfully")
		return nil
	} else {
		if err := seeders.CleanTables(db); err != nil {
			return fmt.Errorf("could not clean tables: %w", err)
		}

		log.Println("Database test seeding is disabled")
		return nil
	}
}

type TestDB struct {
	Container testcontainers.Container
	DB        *gorm.DB
}

func SetupTestDB(t *testing.T) *TestDB {
	ctx := context.Background()

	container, err := mariadb.Run(ctx,
		"mariadb:10.6",
		mariadb.WithDatabase("keylab_test"),
		mariadb.WithUsername("test_user"),
		mariadb.WithPassword("test_password"),
	)
	if err != nil {
		t.Fatalf("Failed to start MariaDB container: %v", err)
	}

	host, _ := container.Host(ctx)
	port, _ := container.MappedPort(ctx, "3306")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		"test_user", "test_password", host, port.Port(), "keylab_test")

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect to database: %v", err)
	}

	if err := runMigrations(db, "keylab_test"); err != nil {
		CleanupTestDB(t, &TestDB{Container: container})
		t.Fatalf("Failed to run migrations: %v", err)
	}

	if err := seeders.SeedAll(db); err != nil {
		CleanupTestDB(t, &TestDB{Container: container})
		t.Fatalf("Failed to seed test database: %v", err)
	}

	return &TestDB{
		Container: container,
		DB:        db,
	}
}

func CleanupTestDB(t *testing.T, testDB *TestDB) {
	if err := testcontainers.TerminateContainer(testDB.Container); err != nil {
		t.Logf("Failed to terminate container: %v", err)
	}
}
