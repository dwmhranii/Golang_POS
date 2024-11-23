package controllers

import (
	"fmt"
	"golang_pos/config"
	"golang_pos/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jung-kurt/gofpdf"
	"github.com/xuri/excelize/v2"
	"gorm.io/gorm"
)

// CreateSale - Tambah data penjualan
func CreateSale(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)

	// Struct untuk menerima request
	type SaleRequest struct {
		SaleCode string `json:"sale_code"`
		Items    []struct {
			ProductID uint `json:"product_id"`
			Quantity  int  `json:"quantity"`
		} `json:"items"`
	}

	var saleRequest SaleRequest
	if err := c.BodyParser(&saleRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validasi jika tidak ada item
	if len(saleRequest.Items) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No sales items provided"})
	}

	// Membuat objek Sale
	sale := models.Sale{
		SaleCode: saleRequest.SaleCode,
		Date:     time.Now(),
	}

	var totalAmount float64
	var totalProfit float64

	// Iterasi melalui item penjualan
	for _, item := range saleRequest.Items {
		var product models.Product

		// Validasi produk berdasarkan ProductID
		if err := db.First(&product, item.ProductID).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Product ID %d not found", item.ProductID)})
		}

		// Validasi stok produk
		if product.Stock < item.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": fmt.Sprintf("Insufficient stock for Product ID %d", item.ProductID)})
		}

		// Hitung total harga dan profit
		totalPrice := float64(item.Quantity) * product.SellingPrice // Ambil UnitPrice dari produk
		profit := float64(item.Quantity) * (product.SellingPrice - product.CostPrice)

		// Kurangi stok produk
		product.Stock -= item.Quantity
		if err := db.Save(&product).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update product stock"})
		}

		// Tambahkan item ke dalam sale.Items
		sale.Items = append(sale.Items, models.SalesItem{
			ProductID:  item.ProductID,
			Quantity:   item.Quantity,
			UnitPrice:  product.SellingPrice, // Ambil UnitPrice dari produk
			TotalPrice: totalPrice,           // Hitung manual
			Profit:     profit,               // Hitung manual
		})

		// Update totalAmount dan totalProfit
		totalAmount += totalPrice
		totalProfit += profit
	}

	// Set totalAmount dan totalProfit pada Sale
	sale.TotalAmount = totalAmount
	sale.Profit = totalProfit

	// Simpan ke database
	if err := db.Create(&sale).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to create sale",
			"details": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Sale created successfully",
		"data":    sale,
	})
}

// GetSales - Ambil semua data penjualan dengan pagination
func GetSales(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)

	// Pagination
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	offset := (page - 1) * limit

	var sales []models.Sale
	var total int64

	db.Model(&models.Sale{}).Count(&total)
	if err := db.Preload("Items").Limit(limit).Offset(offset).Find(&sales).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch sales"})
	}

	return c.JSON(fiber.Map{
		"page":  page,
		"limit": limit,
		"total": total,
		"data":  sales,
	})
}

// UpdateSale - Perbarui data penjualan
func UpdateSale(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)

	saleID := c.Params("id")
	var sale models.Sale
	if err := db.First(&sale, saleID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sale not found"})
	}

	if err := c.BodyParser(&sale); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if err := db.Save(&sale).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update sale"})
	}

	return c.JSON(sale)
}

// DeleteSale - Hapus data penjualan
func DeleteSale(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)

	saleID := c.Params("id")
	if err := db.Delete(&models.Sale{}, saleID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete sale"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// ExportSalesToExcel - Ekspor data penjualan ke Excel
func ExportSalesToExcel(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)

	var sales []models.Sale
	if err := db.Preload("Items").Find(&sales).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch sales"})
	}

	file := excelize.NewFile()
	sheet := "Sales"
	file.NewSheet(sheet)

	// Header
	headers := []string{"Sale ID", "Sale Code", "Date", "Total Amount", "Profit"}
	for i, h := range headers {
		cell := fmt.Sprintf("%s1", string('A'+i))
		file.SetCellValue(sheet, cell, h)
	}

	// Data
	for i, sale := range sales {
		row := i + 2
		file.SetCellValue(sheet, fmt.Sprintf("A%d", row), sale.SaleID)
		file.SetCellValue(sheet, fmt.Sprintf("B%d", row), sale.SaleCode)
		file.SetCellValue(sheet, fmt.Sprintf("C%d", row), sale.Date)
		file.SetCellValue(sheet, fmt.Sprintf("D%d", row), sale.TotalAmount)
		file.SetCellValue(sheet, fmt.Sprintf("E%d", row), sale.Profit)
	}

	// Simpan dan kirim file
	filename := "sales.xlsx"
	if err := file.SaveAs(filename); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate Excel"})
	}

	return c.Download(filename)
}

// ExportSalesToPDF - Ekspor data penjualan ke PDF
func ExportSalesToPDF(c *fiber.Ctx) error {
	db := c.Locals("db").(*gorm.DB)

	var sales []models.Sale
	if err := db.Preload("Items").Find(&sales).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch sales"})
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 12)

	// Header
	pdf.Cell(40, 10, "Sale ID")
	pdf.Cell(40, 10, "Sale Code")
	pdf.Cell(40, 10, "Date")
	pdf.Cell(40, 10, "Total Amount")
	pdf.Cell(40, 10, "Profit")
	pdf.Ln(10)

	// Data
	for _, sale := range sales {
		pdf.Cell(40, 10, fmt.Sprintf("%d", sale.SaleID))
		pdf.Cell(40, 10, sale.SaleCode)
		pdf.Cell(40, 10, sale.Date.Format("2006-01-02"))
		pdf.Cell(40, 10, fmt.Sprintf("%.2f", sale.TotalAmount))
		pdf.Cell(40, 10, fmt.Sprintf("%.2f", sale.Profit))
		pdf.Ln(10)
	}

	filename := "sales.pdf"
	if err := pdf.OutputFileAndClose(filename); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate PDF"})
	}

	return c.Download(filename)
}

func GetSaleByID(c *fiber.Ctx) error {
	// Ambil ID dari parameter route
	id := c.Params("id")
	saleID, err := strconv.Atoi(id)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid sale ID",
		})
	}

	// Cari sale berdasarkan ID
	var sale models.Sale
	if err := config.DB.Preload("Items").First(&sale, saleID).Error; err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Sale not found",
		})
	}

	// Kembalikan data sale
	return c.JSON(sale)
}
