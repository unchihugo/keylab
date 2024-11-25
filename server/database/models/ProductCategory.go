package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type ProductCategory struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string    `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"name"`
	Slug        string    `gorm:"type:varchar(255);not null;unique" validate:"required,max=255" json:"slug"`
	Description string    `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"description"`
	Products    []Product `gorm:"foreignKey:CategoryID" json:"products"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (pc *ProductCategory) Validate() error {
	validate := validator.New()
	return validate.Struct(pc)
}
