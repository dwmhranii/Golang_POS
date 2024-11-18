package models

import "time"

type Category struct {
	CategoryID   uint       `gorm:"primaryKey" json:"category_id"`
	Name         string     `gorm:"size:100;unique;not null" json:"name"`
	Description  string     `gorm:"type:text" json:"description,omitempty"`
	CategoryCode string     `gorm:"size:3;unique;not null" json:"category_code"`
	Products     []Product  `gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"products,omitempty"`
	CreatedAt    time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}
