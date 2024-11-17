package controllers

// import (
//     "github.com/gofiber/fiber/v2"
//     "gorm.io/gorm"
//     "golang_pos/models"
// )

// // Create Sale
// func CreateSale(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     sale := new(models.Sale)

//     if err := c.BodyParser(sale); err != nil {
//         return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
//     }

//     // Calculate total amount and profit
//     totalAmount := 0.0
//     profit := 0.0

//     for i := range sale.SalesItems {
//         sale.SalesItems[i].TotalPrice = float64(sale.SalesItems[i].Quantity) * sale.SalesItems[i].UnitPrice
//         totalAmount += sale.SalesItems[i].TotalPrice
//         profit += sale.SalesItems[i].TotalPrice - (float64(sale.SalesItems[i].Quantity) * sale.SalesItems[i].UnitPrice)
//     }

//     sale.TotalAmount = totalAmount
//     sale.Profit = profit

//     if err := db.Create(&sale).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not create sale"})
//     }

//     return c.Status(fiber.StatusCreated).JSON(sale)
// }

// // Get All Sales
// func GetSales(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var sales []models.Sale

//     if err := db.Preload("SalesItems").Find(&sales).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve sales"})
//     }

//     return c.JSON(sales)
// }

// // Get Sale by ID
// func GetSale(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var sale models.Sale

//     id := c.Params("id")
//     if err := db.Preload("SalesItems").First(&sale, id).Error; err != nil {
//         return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sale not found"})
//     }

//     return c.JSON(sale)
// }

// // Update Sale by ID
// func UpdateSale(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var sale models.Sale

//     id := c.Params("id")
//     if err := db.Preload("SalesItems").First(&sale, id).Error; err != nil {
//         return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sale not found"})
//     }

//     if err := c.BodyParser(&sale); err != nil {
//         return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
//     }

//     // Calculate total amount and profit
//     totalAmount := 0.0
//     profit := 0.0
//     for i := range sale.SalesItems {
//         sale.SalesItems[i].TotalPrice = float64(sale.SalesItems[i].Quantity) * sale.SalesItems[i].UnitPrice
//         totalAmount += sale.SalesItems[i].TotalPrice
//         profit += sale.SalesItems[i].TotalPrice - (float64(sale.SalesItems[i].Quantity) * sale.SalesItems[i].UnitPrice)
//     }

//     sale.TotalAmount = totalAmount
//     sale.Profit = profit

//     if err := db.Save(&sale).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not update sale"})
//     }

//     return c.JSON(sale)
// }

// // Delete Sale by ID
// func DeleteSale(c *fiber.Ctx) error {
//     db := c.Locals("db").(*gorm.DB)
//     var sale models.Sale

//     id := c.Params("id")
//     if err := db.First(&sale, id).Error; err != nil {
//         return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sale not found"})
//     }

//     if err := db.Delete(&sale).Error; err != nil {
//         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete sale"})
//     }

//     return c.JSON(fiber.Map{"message": "Sale deleted successfully"})
// }
