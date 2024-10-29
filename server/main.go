package main

import (
	db "keylab/database"
	"keylab/routes"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type app struct {
	e       *echo.Echo
	session *sessions.CookieStore
}

func main() {
	e := echo.New()

	if err := godotenv.Load(); err != nil {
		e.Logger.Warn("Error loading .env file")
	}

	sessionKey := []byte(os.Getenv("SESSIONS_KEY"))
	hashKey := []byte(os.Getenv("HASH_KEY"))

	if len(sessionKey) < 32 || len(hashKey) < 32 {
		e.Logger.Fatal("SESSIONS_SECRET and HASH_KEY are empty or need to be at least 32 characters.")
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{os.Getenv("CLIENT_URL")},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowCredentials: true,
	}))

	session := sessions.NewCookieStore(sessionKey, hashKey)
	session.Options.HttpOnly = true
	session.Options.Secure = true

	app := &app{
		e:       e,
		session: session,
	}

	routes.RegisterRoutes(app.e, app.session)

	db.InitDB()

	app.e.Start(":8080")
}
