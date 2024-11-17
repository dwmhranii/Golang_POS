package models

import "time"

// Sale - Model untuk tabel sales
type Sale struct {
	SaleID      uint        `gorm:"primaryKey;autoIncrement" json:"sale_id"`
	SaleCode    string      `gorm:"size:10;unique;not null" json:"sale_code"`
	Date        time.Time   `gorm:"type:timestamp;default:CURRENT_TIMESTAMP" json:"date"`
	TotalAmount float64     `gorm:"type:decimal(10,2);default:0;not null" json:"total_amount"`
	Profit      float64     `gorm:"type:decimal(10,2);default:0" json:"profit"`
	CreatedAt   time.Time   `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time   `gorm:"autoUpdateTime" json:"updated_at"`
	Items       []SalesItem `gorm:"foreignKey:SaleID;constraint:OnDelete:CASCADE;" json:"items"`
}

// SalesItem - Model untuk tabel sales_items
type SalesItem struct {
	SalesItemID uint    `gorm:"primaryKey;autoIncrement" json:"sales_item_id"`
	SaleID      uint    `gorm:"not null;index" json:"sale_id"`
	ProductID   uint    `gorm:"not null;index" json:"product_id"`
	Quantity    int     `gorm:"not null" json:"quantity"`
	UnitPrice   float64 `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	TotalPrice  float64 `gorm:"type:decimal(10,2);not null" json:"total_price"` // Hitung manual di controller
	Profit      float64 `gorm:"type:decimal(10,2);default:0" json:"profit"`     // Hitung manual di controller
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}