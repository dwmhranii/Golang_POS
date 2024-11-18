package models

import "time"

// Purchase represents the purchase record in the database
type Purchase struct {
	PurchaseID   uint      `json:"purchase_id" gorm:"primaryKey"`
	PurchaseCode string    `json:"purchase_code" gorm:"unique;not null"`
	ProductID    uint      `json:"product_id"` // Foreign key ke products.product_id
	Product      Product   `json:"product" gorm:"foreignKey:ProductID;constraint:OnDelete:CASCADE"`
	Quantity     int       `json:"quantity" gorm:"check:quantity > 0;not null"`
	CostPrice    float64   `json:"cost_price" gorm:"check:cost_price >= 0;not null"`
	TotalCost    float64   `json:"total_cost" gorm:"type:decimal(10,2);->;not null"`
	Date         time.Time `json:"date" gorm:"default:CURRENT_TIMESTAMP"`
}
