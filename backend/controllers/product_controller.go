package controllers

import (
    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"
    "golang_pos/models"
)

// Buat produk baru
func CreateProduct(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    product := new(models.Product)

    if err := c.BodyParser(product); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    if err := db.Create(&product).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create product"})
    }

    return c.Status(fiber.StatusCreated).JSON(product)
}

// Mendapatkan semua produk
func GetProducts(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    var products []models.Product

    if err := db.Find(&products).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve products"})
    }

    return c.JSON(products)
}

// Mendapatkan produk berdasarkan ID
func GetProduct(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    var product models.Product

    id := c.Params("id")
    if err := db.First(&product, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
    }

    return c.JSON(product)
}

// Mengupdate produk berdasarkan ID
func UpdateProduct(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    var product models.Product

    id := c.Params("id")
    if err := db.First(&product, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
    }

    if err := c.BodyParser(&product); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    if err := db.Save(&product).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update product"})
    }

    return c.JSON(product)
}

// Menghapus produk berdasarkan ID
func DeleteProduct(c *fiber.Ctx) error {
    db := c.Locals("db").(*gorm.DB)
    var product models.Product

    id := c.Params("id")
    if err := db.First(&product, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
    }

    if err := db.Delete(&product).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete product"})
    }

    return c.JSON(fiber.Map{"message": "Product deleted successfully"})
}
