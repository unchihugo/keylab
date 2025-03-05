package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type AddressType string

const (
	Billing  AddressType = "billing"
	Shipping AddressType = "shipping"
)

type Address struct {
	ID         int64       `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     int64       `gorm:"not null" json:"user_id"`
	Street     string      `gorm:"size:255;not null" json:"street"`
	City       string      `gorm:"size:100;not null" json:"city"`
	County     string      `gorm:"size:100;not null" json:"county"`
	PostalCode string      `gorm:"size:20;not null" json:"postal_code"`
	Country    string      `gorm:"size:100;not null" json:"country"`
	Type       AddressType `gorm:"type:ENUM('billing','shipping');not null" json:"type"`
	CreatedAt  time.Time   `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt  time.Time   `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime" json:"updated_at"`
	IsDeleted  bool        `gorm:"default:false" json:"is_deleted"`
}

func (a *Address) Validate() error {
	validate := validator.New()
	return validate.Struct(a)
}
