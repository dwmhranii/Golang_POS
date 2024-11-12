package controllers

import (
    "github.com/gofiber/fiber/v2"
    "golang.org/x/crypto/bcrypt"
    "golang_pos/config"
    "golang_pos/models"
    "time"
    "github.com/golang-jwt/jwt/v4"

)

// Fungsi untuk registrasi pengguna baru
func RegisterUser(c *fiber.Ctx) error {
    var user models.User

    if err := c.BodyParser(&user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    // Hash password menggunakan bcrypt
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
    }
    user.Password = string(hashedPassword)

    // Simpan user ke database
    if err := config.DB.Create(&user).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
    }

    return c.Status(fiber.StatusCreated).JSON(user)
}

// Fungsi untuk login pengguna
func LoginUser(c *fiber.Ctx) error {
    var input struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    if err := c.BodyParser(&input); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
    }

    // Cari user berdasarkan email
    var user models.User
    if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
    }

    // Verifikasi password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
    }

    // Buat JWT token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.UserID,
        "email":   user.Email,
        "role":    user.Role,
        "exp":     time.Now().Add(time.Hour * 8).Unix(), 
    })

    tokenString, err := token.SignedString([]byte(config.GetJWTSecret()))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not login"})
    }

    return c.JSON(fiber.Map{"message": "Login successful", "token": tokenString})
}