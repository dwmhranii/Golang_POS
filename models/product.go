package models

import (
    "time"
    // "gorm.io/gorm"
)

type Product struct {
    ProductID    uint           `gorm:"primaryKey" json:"product_id"`
    ProductCode  string         `gorm:"size:10;unique;not null" json:"product_code"`
    Name         string         `gorm:"size:100;not null" json:"name"`
    SKU          string         `gorm:"size:100;unique;not null" json:"sku"`
    CostPrice    float64        `gorm:"type:decimal(10,2);not null" json:"cost_price"`
    SellingPrice float64        `gorm:"type:decimal(10,2);not null" json:"selling_price"`
    Stock        int            `gorm:"default:0" json:"stock"`
    CreatedAt    time.Time      `gorm:"autoCreateTime" json:"created_at"`
}
