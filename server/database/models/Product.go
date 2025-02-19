package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Product struct {
	ID            int64            `gorm:"primaryKey;autoIncrement" json:"id" form:"id" validate:"omitempty,numeric"`
	Name          string           `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"name" form:"name"`
	Slug          string           `gorm:"type:varchar(255);not null;unique" validate:"-" json:"slug" form:"slug"`
	Description   string           `gorm:"type:text;not null" validate:"required" json:"description" form:"description"`
	Price         float64          `gorm:"type:decimal(10,2);not null" validate:"required,gte=0" json:"price" form:"price"`
	Stock         int              `gorm:"type:int;not null" validate:"required,min=0" json:"stock" form:"stock"`
	CategoryID    int64            `gorm:"not null" json:"category_id" validate:"required,numeric" form:"category_id"`
	Category      *ProductCategory `gorm:"foreignKey:CategoryID" json:"category"`
	ProductImages []ProductImage   `json:"product_images" gorm:"foreignKey:ProductID"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
}

func (p *Product) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(p, fields...)
	}

	return validate.Struct(p)
}
