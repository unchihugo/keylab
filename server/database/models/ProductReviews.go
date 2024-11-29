package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

// id , product_id, user_ id = int64
// rating = int16 -- checking between 1 & 10
// comment = string
//created_at, updated_at = time.Time

type ProductReviews struct {
	ID           int64   `gorm:"primaryKey;autoIncrement" json:"id"`
	ProductID    int64   `gorm:"not null" json:"product_id"`
	UserID       int64   `gorm:"not null" json:"user_id"`
	Rating       int16   `gorm:"not null;check:rating BETWEEN 1 AND 10" json:"rating"`
	Comment      string  `gorm:"type:varchar(255);not null" validate:"required,max=255" json:"comment"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (pr *ProductReviews) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(pr, fields...)
	}
	
	return validate.Struct(pr)
}