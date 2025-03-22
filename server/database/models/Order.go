package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type OrderStatus string

const (
	Pending   OrderStatus = "pending"
	Shipped   OrderStatus = "shipped"
	Delivered OrderStatus = "delivered"
	Cancelled OrderStatus = "cancelled"
	Returned  OrderStatus = "returned"
)

type Order struct {
	ID                int64       `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID            int64       `gorm:"not null" json:"user_id"`
	User              User        `gorm:"foreignKey:UserID" json:"user"`
	OrderDate         time.Time   `gorm:"default:CURRENT_TIMESTAMP" json:"order_date"`
	Status            OrderStatus `gorm:"type:ENUM('pending','shipped','delivered','cancelled', 'returned');not null" json:"status"`
	Total             float64     `gorm:"type:DECIMAL(10,2);not null" json:"total"`
	ShippingAddressID int64       `gorm:"column:shipping_address;not null" json:"shipping_address_id"`
	BillingAddressID  int64       `gorm:"column:billing_address;not null" json:"billing_address_id"`
	ShippingAddress   *Address    `gorm:"foreignKey:ShippingAddressID" json:"shipping_address"`
	BillingAddress    *Address    `gorm:"foreignKey:BillingAddressID" json:"billing_address"`
	CreatedAt         time.Time   `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt         time.Time   `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime" json:"updated_at"`
}

func (o *Order) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(o, fields...)
	}

	return validate.Struct(o)
}
