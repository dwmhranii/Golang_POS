package controllers

// import (
//     "github.com/gofiber/fiber/v2"
//     "gorm.io/gorm"
//     "golang_pos/models"
// )

// // Create Purchase
// func CreatePurchase(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     purchase := new(models.Purchase)

//     if err := c.BodyParser(purchase); err != nil {
//         return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
//     }

//     // Hitung TotalCost dari Quantity * CostPrice
//     purchase.TotalCost = float64(purchase.Quantity) * purchase.CostPrice

//     if err := db.Create(&purchase).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create purchase"})
//     }

//     return c.Status(fiber.StatusCreated).JSON(purchase)
// }

// // Get All Purchases
// func GetPurchases(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var purchases []models.Purchase

//     if err := db.Preload("Product").Find(&purchases).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve purchases"})
//     }

//     return c.JSON(purchases)
// }

// // Get Purchase by ID
// func GetPurchase(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var purchase models.Purchase

//     id := c.Params("id")
//     if err := db.Preload("Product").First(&purchase, id).Error; err != nil {
//         return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Purchase not found"})
//     }

//     return c.JSON(purchase)
// }

// // Update Purchase by ID
// func UpdatePurchase(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var purchase models.Purchase

//     id := c.Params("id")
//     if err := db.First(&purchase, id).Error; err != nil {
//         return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Purchase not found"})
//     }

//     if err := c.BodyParser(&purchase); err != nil {
//         return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
//     }

//     // Hitung ulang TotalCost dari Quantity * CostPrice
//     purchase.TotalCost = float64(purchase.Quantity) * purchase.CostPrice

//     if err := db.Save(&purchase).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update purchase"})
//     }

//     return c.JSON(purchase)
// }

// // Delete Purchase by ID
// func DeletePurchase(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var purchase models.Purchase

//     id := c.Params("id")
//     if err := db.First(&purchase, id).Error; err != nil {
//         return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Purchase not found"})
//     }

//     if err := db.Delete(&purchase).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete purchase"})
//     }

//     return c.JSON(fiber.Map{"message": "Purchase deleted successfully"})
// }
