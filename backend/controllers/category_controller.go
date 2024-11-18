package controllers

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"golang_pos/models"
	"gorm.io/gorm"
)

// CreateCategory (Membuat kategori baru)
// CreateCategory (Membuat kategori baru)
func CreateCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	category := new(models.Category)

	// Parsing input JSON
	if err := c.BodyParser(category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Pastikan input memiliki nama kategori
	if category.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Category name is required"})
	}

	// Ambil kode kategori terakhir
	var lastCategory models.Category
	err := db.Order("category_code desc").First(&lastCategory).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch last category"})
	}

	// Generate kode kategori baru
	var nextCode int
	if lastCategory.CategoryCode != "" {
		_, err := fmt.Sscanf(lastCategory.CategoryCode, "%03d", &nextCode)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse last category code"})
		}
		nextCode++
	} else {
		nextCode = 1
	}

	category.CategoryCode = fmt.Sprintf("%03d", nextCode)

	// Validasi kode kategori unik
	var existingCategory models.Category
	if err := db.Where("category_code = ?", category.CategoryCode).First(&existingCategory).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Category code already exists"})
	}

	// Simpan kategori ke database
	if err := db.Create(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create category"})
	}

	return c.Status(fiber.StatusCreated).JSON(category)
}

// GetCategories (Mendapatkan semua kategori)
func GetCategories(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var categories []models.Category

	if err := db.Order("created_at desc").Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve categories"})
	}

	return c.JSON(categories)
}

// GetCategory (Mendapatkan kategori berdasarkan ID)
func GetCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var category models.Category

	id := c.Params("id")
	if err := db.First(&category, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	return c.JSON(category)
}

// UpdateCategory (Mengupdate kategori)
func UpdateCategory(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var existingCategory models.Category

	id := c.Params("id")

	// Cari kategori berdasarkan ID
	if err := db.First(&existingCategory, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}

	// Parsing data JSON untuk update
	var updateInput models.Category
	if err := c.BodyParser(&updateInput); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Update hanya field tertentu
	existingCategory.Name = updateInput.Name
	existingCategory.Description = updateInput.Description

	if err := db.Save(&existingCategory).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update category"})
	}

	return c.JSON(existingCategory)
}

// DeleteCategory (Menghapus kategori)
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
