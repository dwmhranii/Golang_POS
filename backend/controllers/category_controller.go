package controllers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"golang_pos/models"
)

// Create Category (Membuat kategori baru)
func CreateCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	category := new(models.Category)

	// Parsing input JSON
	if err := c.BodyParser(category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Simpan kategori ke database
	if err := db.Create(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create category"})
	}

	return c.Status(fiber.StatusCreated).JSON(category)
}

// Get Categories (Mendapatkan semua kategori)
func GetCategories(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var categories []models.Category

	if err := db.Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve categories"})
	}

	return c.JSON(categories)
}

// Get Category by ID (Mendapatkan kategori berdasarkan ID)
func GetCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var category models.Category

	id := c.Params("id")
	if err := db.First(&category, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	return c.JSON(category)
}

// Update Category (Mengupdate kategori)
func UpdateCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var category models.Category

	// Ambil ID kategori dari parameter URL
	id := c.Params("id")

	// Cari kategori berdasarkan ID
	if err := db.First(&category, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	// Parsing data JSON untuk update
	if err := c.BodyParser(&category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Update data kategori
	if err := db.Save(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update category"})
	}

	return c.JSON(category)
}

// Delete Category (Menghapus kategori)
func DeleteCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var category models.Category

	id := c.Params("id")
	if err := db.First(&category, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	// Hapus kategori
	if err := db.Delete(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete category"})
	}

	return c.JSON(fiber.Map{"message": "Category deleted successfully"})
}
