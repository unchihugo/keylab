package models

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Permission struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(100);not null;unique" validate:"required,min=2,max=100" json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type RolePermission struct {
	RoleID       int64      `gorm:"primaryKey;not null" json:"roleId"`
	PermissionID int64      `gorm:"primaryKey;not null" json:"permissionId"`
	Role         Role       `gorm:"foreignKey:RoleID;constraint:OnDelete:CASCADE;"`
	Permission   Permission `gorm:"foreignKey:PermissionID;constraint:OnDelete:CASCADE;"`
}

func (p *Permission) Validate(fields ...string) error {
	validate := validator.New()

	if len(fields) > 0 {
		return validate.StructPartial(p, fields...)
	}

	return validate.Struct(p)
}
