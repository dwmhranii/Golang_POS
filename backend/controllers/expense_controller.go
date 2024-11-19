package controllers

import (
	"golang_pos/models"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

var validate = validator.New()

// Create Expense
func CreateExpense(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    expense := new(models.Expense)

    // Parse input
    if err := c.BodyParser(expense); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    // Validasi input
    if err := validate.Struct(expense); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Atur waktu secara otomatis jika tidak ada
    if expense.Date.IsZero() {
        expense.Date = time.Now()
    }

    // Simpan ke database
    if err := db.Create(&expense).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create expense"})
    }

    return c.Status(fiber.StatusCreated).JSON(expense)
}

// Update Expense by ID
func UpdateExpense(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    var expense models.Expense

    id := c.Params("id")
    if err := db.First(&expense, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Expense not found"})
    }

    // Parse input
    updateInput := new(models.Expense)
    if err := c.BodyParser(updateInput); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    // Validasi input
    if err := validate.Struct(updateInput); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Partial update hanya field yang relevan
    if updateInput.Description != "" {
        expense.Description = updateInput.Description
    }
    if updateInput.Amount > 0 {
        expense.Amount = updateInput.Amount
    }
    if !updateInput.Date.IsZero() {
        expense.Date = updateInput.Date
    }

    // Simpan ke database
    if err := db.Save(&expense).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update expense"})
    }

    return c.JSON(expense)
}

// Delete Expense by ID
func DeleteExpense(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    var expense models.Expense

    id := c.Params("id")
    if err := db.First(&expense, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Expense not found"})
    }

    // Hapus expense
    if err := db.Delete(&expense).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete expense"})
    }

    return c.JSON(fiber.Map{"message": "Expense deleted successfully"})
}
