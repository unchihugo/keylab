package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type User struct {
	ID          int64     `gorm:"primaryKey;autoIncrement"`
	Forename    string    `gorm:"type:varchar(100);not null" validate:"required,min=3,max=100" json:"forename"`
	Surname     string    `gorm:"type:varchar(100);not null" validate:"required,min=3,max=100" json:"surname"`
	Email       string    `gorm:"type:varchar(320);not null;unique" validate:"required,email,max=320" json:"email"`
	Password    string    `gorm:"type:varchar(100);not null" validate:"required,min=8,max=100" json:"password"`
	PhoneNumber string    `gorm:"type:varchar(15)" validate:"omitempty,e164" json:"phoneNumber"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (u *User) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(u, fields...)
	}

	return validate.Struct(u)
}
