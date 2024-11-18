package controllers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"golang_pos/models"
)

// Create Purchase
func CreatePurchase(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	purchase := new(models.Purchase)

	// Parsing body JSON
	if err := c.BodyParser(purchase); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validasi input
	if purchase.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Quantity must be greater than 0"})
	}

	if purchase.CostPrice < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cost Price cannot be negative"})
	}

	// Hitung TotalCost
	purchase.TotalCost = float64(purchase.Quantity) * purchase.CostPrice

	// Insert ke database
	if err := db.Create(&purchase).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(purchase)
}

// Get All Purchases
func GetPurchases(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var purchases []models.Purchase

	// Query dengan preload product
	if err := db.Preload("Product").Find(&purchases).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(purchases)
}

// Get Purchase by ID
func GetPurchase(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var purchase models.Purchase

	id := c.Params("id")
	if err := db.Preload("Product").First(&purchase, "purchase_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Purchase not found"})
	}

	return c.JSON(purchase)
}

// Update Purchase by ID
func UpdatePurchase(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var purchase models.Purchase

	id := c.Params("id")
	if err := db.First(&purchase, "purchase_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Purchase not found"})
	}

	// Parsing body JSON
	if err := c.BodyParser(&purchase); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validasi input
	if purchase.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Quantity must be greater than 0"})
	}

	if purchase.CostPrice < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cost Price cannot be negative"})
	}

	// Hitung TotalCost
	purchase.TotalCost = float64(purchase.Quantity) * purchase.CostPrice

	// Simpan perubahan
	if err := db.Save(&purchase).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(purchase)
}

// Delete Purchase by ID
func DeletePurchase(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var purchase models.Purchase

	id := c.Params("id")
	if err := db.First(&purchase, "purchase_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Purchase not found"})
	}

	// Hapus data
	if err := db.Delete(&purchase).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Purchase deleted successfully"})
}
