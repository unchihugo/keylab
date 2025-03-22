package config

import (
	"keylab/helpers"
	"log"
	"path/filepath"
	"sync"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

type Config struct {
	CLIENT_URL       string `env:"CLIENT_URL,required"`
	SERVER_URL       string `env:"SERVER_URL,required"`
	SESSIONS_KEY     string `env:"SESSIONS_KEY,required"`
	HASH_KEY         string `env:"HASH_KEY,required"`
	MARIADB_USER     string `env:"MARIADB_USER,required"`
	MARIADB_PASSWORD string `env:"MARIADB_PASSWORD,required"`
	MARIADB_HOST     string `env:"MARIADB_HOST,required"`
	MARIADB_PORT     string `env:"MARIADB_PORT,required"`
	MARIADB_DATABASE string `env:"MARIADB_DATABASE,required"`
}

var (
	cfg  *Config
	once sync.Once
)

func Initialize() *Config {
	once.Do(func() {
		envPath := filepath.Join(helpers.GetProjectRoot(), ".env")

		if err := godotenv.Load(envPath); err != nil {
			log.Fatal("No .env file found!")
		}

		cfg = &Config{}
		if err := env.Parse(cfg); err != nil {
			log.Fatalf("Failed to load configuration: %v", err)
		}
	})

	return cfg
}
