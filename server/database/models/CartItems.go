package models

import (

    "github.com/go-playground/validator/v10"
    "time"
)

type CartItems struct {
    ID          int64     `gorm:"primaryKey;autoIncrement" json:"id" validate:"omitempty,numeric"`
    ProductID   int64     `gorm:"not null" json:"product_id" validate:"required,numeric"`
    UserID      int64     `gorm:"not null" json:"user_id" validate:"required,numeric"`
    User        *User     `gorm:"foreignKey:UserID" json:"user" validate:"omitempty"`
    Product     *Product  `gorm:"foreignKey:ProductID" json:"product" validate:"omitempty"`
    Quantity    int       `gorm:"not null" json:"quantity" validate:"required,min=1"`
    CreatedAt   time.Time `json:"created_at" validate:"omitempty"`
    UpdatedAt   time.Time `json:"updated_at" validate:"omitempty"`
}

func (c *CartItems) Validate(fields ...string) error {
    validate := validator.New()

    if len(fields) > 0 {
        return validate.StructPartial(c, fields...)
    }

    return validate.Struct(c)
}
