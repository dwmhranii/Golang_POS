// main.go
package main

import (
    "golang_pos/config"
    "golang_pos/routes"
    "log"
    "github.com/gofiber/fiber/v2"
    "github.com/joho/godotenv"
)

func main() {
    // Load .env file
    if err := godotenv.Load(".env"); err != nil {
        log.Fatal("Error loading .env file")
    }

    // Connect to Database
    db, err := config.ConnectDatabase()
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    // defer db.Close()

    // Initialize Fiber app
    app := fiber.New()

    // Middleware to set DB context
    app.Use(func(c *fiber.Ctx) error {
        c.Locals("db", db)
        return c.Next()
    })

    // Set up routes
    routes.Setup(app)
    
    // Start the server
    log.Fatal(app.Listen(":3010"))
}
