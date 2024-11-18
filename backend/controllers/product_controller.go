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

	// Validate CategoryID
	if product.CategoryID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "CategoryID is required"})
	}

	// Fetch category by CategoryID
	var category models.Category
	if err := db.First(&category, product.CategoryID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Category does not exist"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to validate category"})
	}

	// Generate product code based on category code
	var lastProduct models.Product
	if err := db.Where("category_id = ?", product.CategoryID).Order("product_id desc").First(&lastProduct).Error; err != nil && err != gorm.ErrRecordNotFound {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate product code"})
	}

	// Generate next number (increment last product code or start at 001)
	nextNumber := 1
	if lastProduct.ProductCode != "" {
		fmt.Sscanf(lastProduct.ProductCode, category.CategoryCode+"-%03d", &nextNumber)
		nextNumber++
	}

	// Assign generated product code
	product.ProductCode = fmt.Sprintf("%s-%03d", category.CategoryCode, nextNumber)

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

	// Validate category if CategoryID is updated
	if updateData.CategoryID != 0 && updateData.CategoryID != product.CategoryID {
		var category models.Category
		if err := db.First(&category, updateData.CategoryID).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid category ID"})
		}
	}

	// Validate prices
	if updateData.CostPrice == 0 {
		updateData.CostPrice = product.CostPrice
	}
	if updateData.SellingPrice == 0 {
		updateData.SellingPrice = product.SellingPrice
	}
	if updateData.SellingPrice < updateData.CostPrice {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Selling price cannot be less than cost price"})
	}

	// Update product
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

	// Check if product is associated with any purchases
	var relatedPurchase models.Purchase
	err := db.Where("product_id = ?", product.ProductID).First(&relatedPurchase).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		// Handle any other errors, such as database errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Failed to check product associations: %v", err)})
	}

	if err == nil {
		// If a related purchase is found
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Product is associated with existing purchases"})
	}

	// Delete product
	if err := db.Delete(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete product"})
	}

	return c.JSON(fiber.Map{"message": "Product deleted successfully"})
}
