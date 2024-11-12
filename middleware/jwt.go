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
		log.Println("User ID:", userID)
	}

	return c.Next()
}