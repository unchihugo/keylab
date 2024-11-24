package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Product struct {
	ID          int64           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string          `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"name"`
	Slug        string          `gorm:"type:varchar(255);not null;unique" validate:"required,max=255" json:"slug"`
	Description string          `gorm:"type:text;not null" validate:"required" json:"description"`
	Price       float64         `gorm:"type:decimal(10,2);not null" validate:"required,gt=0" json:"price"`
	Stock       int             `gorm:"type:int;not null" validate:"required,gte=0" json:"stock"`
	CategoryID  int64           `gorm:"not null" json:"category_id"`
	Category    ProductCategory `gorm:"foreignKey:CategoryID" json:"category"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}

func (p *Product) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}
