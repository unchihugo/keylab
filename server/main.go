package main

import (
	"fmt"
	"keylab/config"
	db "keylab/database"
	"keylab/routes"
	"log"
	"net/url"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	config := config.Initialize()
	fmt.Println("Starting KeyLab server...")

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{config.CLIENT_URL},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))

	if len(config.SESSIONS_KEY) < 32 || len(config.HASH_KEY) < 32 {
		e.Logger.Fatal("SESSIONS_KEY and HASH_KEY are empty or need to be at least 32 characters.")
	}

	session := sessions.NewCookieStore([]byte(config.SESSIONS_KEY), []byte(config.HASH_KEY))
	session.Options.HttpOnly = true
	session.Options.Secure = true

	db := db.InitDB()
	routes.RegisterRoutes(e, session, db)

	parsedURL, err := url.Parse(config.SERVER_URL)
	if err != nil {
		log.Fatalf("Error parsing backend URL: %v", err)
	}

	fmt.Println("Server started at", config.SERVER_URL)
	e.Logger.Fatal(e.Start(parsedURL.Host))
}
