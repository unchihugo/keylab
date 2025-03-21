package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type ProductImage struct {
	ID           int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	ProductID    int64     `gorm:"not null" json:"product_id"`
	Image        string    `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"filename"`
	URL          string    `gorm:"-" json:"url"`
	PrimaryImage bool      `gorm:"not null;default:false" json:"primary_image"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (pi *ProductImage) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(pi, fields...)
	}

	return validate.Struct(pi)
}
