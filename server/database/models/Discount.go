package models

import (
	"time"
	"github.com/go-playground/validator/v10"
)

type Discount struct {
	ID             int64     `gorm:"primaryKey;autoIncrement" json:"id" form:"id" validate:"omitempty,numeric"`
	Code           string    `gorm:"type:varchar(50);not null;unique" json:"code" form:"code" validate:"required,max=50"`
	DiscountType   string    `gorm:"type:enum('percentage','fixed');not null" json:"discount_type" form:"discount_type" validate:"required,oneof=percentage fixed"`
	Value          float64   `gorm:"type:decimal(10,2);not null" json:"value" form:"value" validate:"required,gte=0"`
	StartDate      time.Time `gorm:"not null" json:"start_date" form:"start_date" validate:"required"`
	EndDate        time.Time `gorm:"not null" json:"end_date" form:"end_date" validate:"required,gtfield=StartDate"`
	ApplicableItems string   `gorm:"type:text" json:"applicable_items" form:"applicable_items" validate:"omitempty,json"` 
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}


func (d *Discount) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(d, fields...)
	}

	return validate.Struct(d)
}