package config

import (
    "os"
    "github.com/joho/godotenv"
)

func LoadEnv() {
    godotenv.Load()
}

func GetJWTSecret() string {
    return os.Getenv("JWT_SECRET")
}
