package models

import "time"

type Product struct {
	ProductID    uint       `gorm:"primaryKey" json:"product_id"`
	ProductCode  string     `gorm:"size:10;unique;not null" json:"product_code"`
	Name         string     `gorm:"size:100;not null" json:"name"`
	CostPrice    float64    `gorm:"type:decimal(10,2);not null" json:"cost_price"`
	SellingPrice float64    `gorm:"type:decimal(10,2);not null" json:"selling_price"`
	Stock        int        `gorm:"default:0;check:stock >= 0" json:"stock"`
	CategoryID   uint       `gorm:"not null" json:"category_id"`
	Category     *Category  `gorm:"foreignKey:CategoryID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"category,omitempty"`
	Purchase     []Purchase `gorm:"foreignKey:PurchaseID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"purchase,omitempty"`
	CreatedAt    time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}
