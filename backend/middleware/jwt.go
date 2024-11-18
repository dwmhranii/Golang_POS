package middleware

import (
	"fmt"
	"log"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang_pos/config"
)

func JWTMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid authorization header"})
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetJWTSecret()), nil
	})

	if err != nil || !token.Valid {
		log.Println("Error validating JWT:", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid JWT"})
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"]
		role := claims["role"]

		// Simpan ke dalam `c.Locals` untuk digunakan di handler berikutnya
		c.Locals("user_id", userID)
		c.Locals("role", role)

		log.Println("User ID:", userID, "Role:", role)
	}

	return c.Next()
}

// Middleware untuk memastikan hanya admin yang dapat mengakses
func RequireAdmin(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied, admin only"})
	}
	return c.Next()
}

// Middleware untuk memastikan hanya role yang diperbolehkan (admin/cashier/reseller) yang bisa membaca
func AllowReadOnly(c *fiber.Ctx) error {
	role := c.Locals("role")
	if role == nil || !(role == "admin" || role == "cashier" || role == "reseller") {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied, read-only access allowed"})
	}
	return c.Next()
}