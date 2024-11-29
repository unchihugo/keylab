package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type ProductReviews struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id" validate:"omitempty,numeric"`
	ProductID int64     `gorm:"not null" json:"product_id" validate:"omitempty,numeric"`
	UserID    int64     `gorm:"not null" json:"user_id" validate:"omitempty,numeric"`
	Rating    int16     `gorm:"not null;check:rating BETWEEN 1 AND 10" json:"rating" validate:"required,gte=1,lte=10"`
	Comment   string    `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"comment"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product" validate:"omitempty"`
	User      User      `gorm:"foreignKey:UserID" json:"user" validate:"omitempty"`
	CreatedAt time.Time `json:"created_at" validate:"omitempty"`
	UpdatedAt time.Time `json:"updated_at" validate:"omitempty"`
}

func (pr *ProductReviews) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(pr, fields...)
	}

	return validate.Struct(pr)
}
