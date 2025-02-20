package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Role struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(100);not null;unique" validate:"required,min=2,max=100" json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (r *Role) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(r, fields...)
	}

	return validate.Struct(r)
}
