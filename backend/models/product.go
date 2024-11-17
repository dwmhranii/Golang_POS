package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ProductID    uint      `gorm:"primaryKey" json:"product_id"`
	ProductCode  string    `gorm:"size:10;unique;not null" json:"product_code"`
	Name         string    `gorm:"size:100;not null" json:"name"`
	SKU          string    `gorm:"size:100;unique;not null" json:"sku"`
	CostPrice    float64   `gorm:"type:decimal(10,2);not null" json:"cost_price"`
	SellingPrice float64   `gorm:"type:decimal(10,2);not null" json:"selling_price"`
	PromoPrice   *float64  `gorm:"type:decimal(10,2)" json:"promo_price"`
	Stock        int       `gorm:"default:0;check:stock >= 0" json:"stock"`
	CategoryID   uint      `gorm:"not null" json:"category_id"`        // Foreign key ke Category
	Category     Category  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"category"` // Relasi ke Category
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

// GORM Hook untuk validasi logika bisnis
func (p *Product) BeforeSave(tx *gorm.DB) (err error) {
	if p.SellingPrice < p.CostPrice {
		return errors.New("selling_price must be greater than or equal to cost_price")
	}
	if p.PromoPrice != nil && *p.PromoPrice < 0 {
		return errors.New("promo_price must be non-negative")
	}
	return nil
}
