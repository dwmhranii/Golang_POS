package controllers

import (
	"github.com/gofiber/fiber/v2"
	"golang_pos/config"
	"golang_pos/models"
	"golang.org/x/crypto/bcrypt"
	"log"
)

// Fungsi untuk membuat pengguna baru (hanya admin)
func CreateUser(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied, admin only"})
	}

	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		log.Println("Error hashing password:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	user.Password = string(hashedPassword)

	// Simpan user ke database
	if err := config.DB.Create(&user).Error; err != nil {
		log.Println("Error saving user:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Hapus password dari response
	user.Password = ""
	return c.Status(fiber.StatusCreated).JSON(user)
}

// Fungsi untuk mengambil semua pengguna
func GetAllUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := config.DB.Find(&users).Error; err != nil {
		log.Println("Error retrieving users:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve users"})
	}

	// Hapus password dari setiap pengguna
	for i := range users {
		users[i].Password = ""
	}

	return c.JSON(users)
}

// Fungsi untuk mengambil satu pengguna berdasarkan ID
func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Hapus password dari response
	user.Password = ""
	return c.JSON(user)
}

// Fungsi untuk memperbarui data pengguna
func UpdateUser(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied, admin only"})
	}

	id := c.Params("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Update fields
	user.Name = input.Name
	user.Email = input.Email
	if input.Role != "" {
		user.Role = input.Role
	}

	if input.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
		if err != nil {
			log.Println("Error hashing password:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
		}
		user.Password = string(hashedPassword)
	}

	if err := config.DB.Save(&user).Error; err != nil {
		log.Println("Error updating user:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	// Hapus password dari response
	user.Password = ""
	return c.JSON(user)
}

// Fungsi untuk menghapus pengguna berdasarkan ID
func DeleteUser(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied, admin only"})
	}

	id := c.Params("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if err := config.DB.Delete(&user).Error; err != nil {
		log.Println("Error deleting user:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	return c.JSON(fiber.Map{"message": "User deleted successfully"})
}
