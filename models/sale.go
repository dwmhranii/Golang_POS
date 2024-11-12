package models

import (
    "time"
    // "gorm.io/gorm"
)

// Model Sale
type Sale struct {
    SaleID      uint           `gorm:"primaryKey" json:"sale_id"`
    SaleCode    string         `gorm:"size:10;unique;not null" json:"sale_code"`
    Date        time.Time      `gorm:"autoCreateTime" json:"date"`
    ResellerID  uint           `json:"reseller_id"`
    TotalAmount float64        `gorm:"type:decimal(10,2)" json:"total_amount"`
    Profit      float64        `gorm:"type:decimal(10,2)" json:"profit"`
    SalesItems  []SalesItem    `gorm:"foreignKey:SaleID" json:"sales_items"` // Relasi ke SalesItem
}

// Model SalesItem
type SalesItem struct {
    SalesItemID uint           `gorm:"primaryKey" json:"sales_item_id"`
    SaleID      uint           `json:"sale_id"`
    ProductID   uint           `json:"product_id"`
    Quantity    int            `json:"quantity"`
    UnitPrice   float64        `gorm:"type:decimal(10,2)" json:"unit_price"`
    TotalPrice  float64        `gorm:"type:decimal(10,2)" json:"total_price"`
}