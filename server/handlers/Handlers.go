package handlers

import (
	"github.com/gorilla/sessions"
	"gorm.io/gorm"
)

type Handlers struct {
	DB           *gorm.DB
	SessionStore *sessions.CookieStore
}
