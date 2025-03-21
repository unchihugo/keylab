package models

import (
	"github.com/go-playground/validator/v10"
)

type DiscountItems struct { 
	ID         int64    `gorm:"primaryKey;autoIncrement" json:"id" validate:"omitempty,numeric"`
	DiscountID int64    `gorm:"not null;constraint:OnDelete:CASCADE" json:"discount_id" validate:"required,numeric"`
	ProductID  int64    `gorm:"not null;constraint:OnDelete:CASCADE" json:"product_id" validate:"required,numeric"`
	Discount   Discount `gorm:"foreignKey:DiscountID" json:"discount" validate:"omitempty"`
	Product    Product  `gorm:"foreignKey:ProductID" json:"product" validate:"omitempty"`
}

func (di *DiscountItems) Validate(fields ...string) error { 
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(di, fields...)
	}

	return validate.Struct(di)
}