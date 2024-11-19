package models

import (
    "time"
    // "gorm.io/gorm"
)

type Expense struct {
    ExpenseID   uint      `gorm:"primaryKey" json:"expense_id"`
    Description string    `gorm:"type:varchar(255);not null" json:"description" validate:"required"`
    Amount      float64   `gorm:"type:decimal(10,2);not null" json:"amount" validate:"required,gt=0"`
    Date        time.Time `json:"date"`
}
