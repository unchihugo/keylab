package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type OrderedItem struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	OrderID   int64     `gorm:"not null" json:"order_id"`
	Order     Order     `gorm:"foreignKey:OrderID" json:"order"`
	ProductID int64     `gorm:"not null" json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product"`
	Quantity  int       `gorm:"not null" json:"quantity"`
	Price     float64   `gorm:"type:DECIMAL(10,2);not null" json:"price"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime" json:"updated_at"`
}

func (oi *OrderedItem) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(oi, fields...)
	}

	return validate.Struct(oi)
}
