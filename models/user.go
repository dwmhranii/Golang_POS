package models

import "time"

type User struct {
    UserID    uint      `gorm:"primaryKey"`
    Name      string    `gorm:"size:100;not null"`
    Email     string    `gorm:"size:100;unique;not null"`
    Password  string    `gorm:"size:255;not null"`
    Role      string    `gorm:"size:20;check:role IN ('admin', 'cashier', 'reseller')"`
    CreatedAt time.Time `gorm:"default:current_timestamp"`
}
