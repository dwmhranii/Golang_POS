package routes

import (
    "github.com/gofiber/fiber/v2"
    "golang_pos/controllers"
    "golang_pos/middleware"
)

func Setup(app *fiber.App) {
    // Rute untuk registrasi dan login
    app.Post("/register", controllers.RegisterUser)
    app.Post("/login", controllers.LoginUser)

    // Group rute dengan autentikasi JWT
    api := app.Group("/api", middleware.JWTMiddleware)

    // CRUD operasi pada user
    api.Post("/users", controllers.CreateUser)       // Create
    api.Get("/users", controllers.GetAllUsers)       // Read All
    api.Get("/users/:id", controllers.GetUser)       // Read One
    api.Put("/users/:id", controllers.UpdateUser)    // Update
    api.Delete("/users/:id", controllers.DeleteUser) // Delete

    // CRUD operasi pada product
    product := api.Group("/products")
    product.Post("/", controllers.CreateProduct)         // Create product
    product.Get("/", controllers.GetProducts)            // Read All products
    product.Get("/:id", controllers.GetProduct)          // Read One product
    product.Put("/:id", controllers.UpdateProduct)       // Update product
    product.Delete("/:id", controllers.DeleteProduct)    // Delete product


    // CRUD operasi pada sales
    sale := api.Group("/sales")
    sale.Post("/", controllers.CreateSale)         // Create sale
    sale.Get("/", controllers.GetSales)            // Read All sales
    sale.Get("/:id", controllers.GetSale)          // Read One sale
    sale.Put("/:id", controllers.UpdateSale)       // Update sale
    sale.Delete("/:id", controllers.DeleteSale)    // Delete sale


    // CRUD operasi pada purchases
    purchase := api.Group("/purchases")
    purchase.Post("/", controllers.CreatePurchase)         // Create purchase
    purchase.Get("/", controllers.GetPurchases)            // Read All purchases
    purchase.Get("/:id", controllers.GetPurchase)          // Read One purchase
    purchase.Put("/:id", controllers.UpdatePurchase)       // Update purchase
    purchase.Delete("/:id", controllers.DeletePurchase)    // Delete purchase


    // CRUD operasi pada expenses
    expense := api.Group("/expenses")
    expense.Post("/", controllers.CreateExpense)
    expense.Get("/", controllers.GetExpenses)
    expense.Get("/:id", controllers.GetExpense)
    expense.Put("/:id", controllers.UpdateExpense)
    expense.Delete("/:id", controllers.DeleteExpense)
}
