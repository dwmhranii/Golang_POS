package models

// import (
//     "time"
//     // "gorm.io/gorm"
// )

// // Model Purchase
// type Purchase struct {
//     PurchaseID   uint           `gorm:"primaryKey" json:"purchase_id"`
//     PurchaseCode string         `gorm:"size:10;unique;not null" json:"purchase_code"` // Kode unik pembelian
//     ProductID    uint           `json:"product_id"`
//     Quantity     int            `json:"quantity"`
//     CostPrice    float64        `gorm:"type:decimal(10,2)" json:"cost_price"`
//     TotalCost    float64        `gorm:"type:decimal(10,2)" json:"total_cost"`
//     Date         time.Time      `gorm:"autoCreateTime" json:"date"`
//     Product      Product        `gorm:"foreignKey:ProductID" json:"product"` // Relasi ke Product
// }