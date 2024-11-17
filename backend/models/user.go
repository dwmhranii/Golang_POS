package models

import "time"

type User struct {
	UserID    uint      `gorm:"primaryKey"`
	Name      string    `gorm:"size:100;not null"`
	Email     string    `gorm:"size:100;not null;unique"`
	Password  string    `gorm:"size:255;not null"`
	Role      string    `gorm:"size:20;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}