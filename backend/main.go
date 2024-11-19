package main

import (
	"golang_pos/config"
	"golang_pos/routes"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Share DB instance via Locals
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("db", db)
		return c.Next()
	})

	// Set up routes
	routes.Setup(app)

	// Start the server
	log.Fatal(app.Listen(":3010"))
}