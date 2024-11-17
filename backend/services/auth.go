package services

// import (
//     "os"
//     "time"

//     "github.com/golang-jwt/jwt/v4"
//     "golang_pos/models" // Sesuaikan dengan path model Anda
// )

// var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

// type JWTClaim struct {
//     UserID uint `json:"user_id"`
//     Role  string `json:"role"`
//     jwt.RegisteredClaims
// }

// func GenerateJWT(user models.User) (tokenString string, err error) {
//     expirationTime := time.Now().Add(8 * time.Hour) // 8 jam shift kerja
//     claims := &JWTClaim{
//         UserID: user.UserID,
//         Role:  user.Role,
//         RegisteredClaims: jwt.RegisteredClaims{
//             ExpiresAt: jwt.NewNumericDate(expirationTime),
//         },
//     }
//     token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
//     tokenString, err = token.SignedString(jwtKey)
//     return
// }

// func ValidateToken(signedToken string) (*jwt.Token, error) {
//     return jwt.ParseWithClaims(
//         signedToken,
//         &JWTClaim{},
//         func(token *jwt.Token) (interface{}, error) {
//             return []byte(jwtKey), nil
//         },
//     )
// }