package controllers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"golang_pos/models"
)

// Create Expense
func CreateExpense(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	expense := new(models.Expense)

	// Parsing request body
	if err := c.BodyParser(expense); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Simpan expense ke database
	if err := db.Create(&expense).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create expense"})
	}

	return c.Status(fiber.StatusCreated).JSON(expense)
}

// Get All Expenses
func GetExpenses(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var expenses []models.Expense

	// Ambil semua expense dari database
	if err := db.Find(&expenses).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve expenses"})
	}

	return c.JSON(expenses)
}

// Get Expense by ID
func GetExpense(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var expense models.Expense

	// Ambil ID dari parameter
	id := c.Params("id")

	// Cari expense berdasarkan ID
	if err := db.First(&expense, "expense_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Expense not found"})
	}

	return c.JSON(expense)
}

// Update Expense by ID
func UpdateExpense(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var expense models.Expense

	// Ambil ID dari parameter
	id := c.Params("id")

	// Cari expense berdasarkan ID
	if err := db.First(&expense, "expense_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Expense not found"})
	}

	// Parsing data baru dari body request
	if err := c.BodyParser(&expense); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Update data di database
	if err := db.Save(&expense).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update expense"})
	}

	return c.JSON(expense)
}

// Delete Expense by ID
func DeleteExpense(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var expense models.Expense

	// Ambil ID dari parameter
	id := c.Params("id")

	// Cari expense berdasarkan ID
	if err := db.First(&expense, "expense_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Expense not found"})
	}

	// Hapus data dari database
	if err := db.Delete(&expense).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete expense"})
	}

	return c.JSON(fiber.Map{"message": "Expense deleted successfully"})
}
