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
    dsn := os.Getenv("DB_DSN")
    if dsn == "" {
        dsn = "host=localhost user=postgres password=admin dbname=pos2 port=5432 sslmode=disable"
    }

    database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
        return nil, err
    }

    err = database.AutoMigrate(
        &models.User{},
        &models.Product{},
        &models.Category{},
        &models.Sale{},
        &models.SalesItem{},
        // // &models.Purchase{},
        // // &models.Session{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
        return nil, err
    }

    DB = database
    return DB, nil
}
