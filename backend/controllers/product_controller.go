package controllers

import (
	"fmt"
	"golang_pos/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Create Product (Membuat produk baru)
func CreateProduct(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	product := new(models.Product)

	// Parse input
	if err := c.BodyParser(product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Fetch category by CategoryID
	var category models.Category
	if err := db.First(&category, product.CategoryID).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid category"})
	}

	// Generate product code
	newProductCode := fmt.Sprintf("%s-%03d", category.CategoryCode, product.ProductID+1)
	product.ProductCode = newProductCode

	// Save the product
	if err := db.Create(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create product"})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

// Get Products (Mendapatkan semua produk)
func GetProducts(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var products []models.Product

	// Preload Category saat mengambil data produk
	if err := db.Preload("Category").Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Could not retrieve products: %v", err),
		})
	}

	if len(products) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No products found",
		})
	}

	return c.JSON(products)
}


// Get Product by ID (Mendapatkan produk berdasarkan ID)
func GetProduct(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var product models.Product

	id := c.Params("id")
	if err := db.Preload("Category").First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	return c.JSON(product)
}

// Update Product (Mengupdate produk)
func UpdateProduct(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var product models.Product

	id := c.Params("id")
	if err := db.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Parsing input JSON
	updateData := new(models.Product)
	if err := c.BodyParser(updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validasi kategori jika ada CategoryID
	if updateData.CategoryID != 0 { // Ensure it's not the zero value (0)
		var category models.Category
		if err := db.First(&category, updateData.CategoryID).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid category ID"})
		}
	}

	// Validasi harga
	if updateData.SellingPrice < updateData.CostPrice {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Selling price cannot be less than cost price"})
	}

	// Perbarui produk
	if err := db.Model(&product).Updates(updateData).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update product"})
	}

	return c.JSON(product)
}

// Delete Product (Menghapus produk)
func DeleteProduct(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)
	var product models.Product

	id := c.Params("id")
	if err := db.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Hapus produk
	if err := db.Delete(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete product"})
	}

	return c.JSON(fiber.Map{"message": "Product deleted successfully"})
}
