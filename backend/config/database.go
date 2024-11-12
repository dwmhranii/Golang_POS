// config/database.go
package config

import (
	"golang_pos/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() (*gorm.DB, error) {
    // Ambil DSN dari environment
    dsn := os.Getenv("DB_DSN")
    if dsn == "" {
        dsn = "host=localhost user=postgres password=admin dbname=pos_project port=5432 sslmode=disable"
    }

    database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
        return nil, err
    }

    // Jalankan migrasi pada model-model
    err = database.AutoMigrate(
        &models.User{},
        &models.Product{},
        // &models.Reseller{},
        &models.Sale{},
        &models.SalesItem{},
        &models.Purchase{},
        &models.Expense{},
        // &models.ProfitLoss{},
        // &models.Session{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
        return nil, err
    }

    DB = database
    return DB, nil
}
