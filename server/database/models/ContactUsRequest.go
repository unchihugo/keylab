package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type ContactUsRequest struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id" validate:"omitempty,numeric"`
	Forename    string    `gorm:"not null" json:"forename" validate:"required,min=1,max=100"`
	Surname     string    `gorm:"not null" json:"surname" validate:"required,min=1,max=100"`
	Email       string    `gorm:"not null" json:"email" validate:"required,email,max=320"`
	PhoneNumber string    `gorm:"null" json:"phone_number" validate:"omitempty,min=1,max=15"`
	Message     string    `gorm:"not null" json:"message" validate:"required,min=1"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (c *ContactUsRequest) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(c, fields...)
	}

	return validate.Struct(c)
}
