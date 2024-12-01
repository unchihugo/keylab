package handlers

import (
    db "keylab/database"
    "keylab/database/models"
    "log"
    "net/http"
    "github.com/labstack/echo/v4"
    "gorm.io/gorm"
	"errors"
)

// List Cart Items Handler [GET /cart items]
// 1. Fetches all cart items for a specific user.
// 2. Returns status 200 with the cart items if successful.
// 3. Returns status 400 if 'user_id' query parameter is missing or invalid.
// 3. Returns status 404 if no cart items are found for specified user.
// 4. Returns status 500 if an error occurs.

func ListCartItems(c echo.Context) error {
    var cartItems []models.CartItems
    userID := c.QueryParam("user_id")

    if userID == "" {
        return jsonResponse(c, http.StatusBadRequest, "User ID is required")
    }

    if err := db.DB.Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
        log.Printf("Error fetching cart items: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart items")
    }

    if len(cartItems) == 0 {
        return jsonResponse(c, http.StatusNotFound, "No cart items found for the user")
    }

    return jsonResponse(c, http.StatusOK, "Cart items fetched successfully", cartItems)
}

// Add Item to Cart Handler [POST /cart-items]
// 1. Parses the cart item from the request body.
// 2. Validates the cart item.
// 3. Checks if the specified product exists and if it has the sufficient stock requested.
// 4. If the product already exists in the cart it updates the quantity- if not it adds the new cart item.
// 5. Returns status 201 if the cart item is successfully added or updated.
// 6. Returns status 400 if input is invalid or stock is insufficient.
// 7. Returns status 500 if an error occurs.

func AddCartItem(c echo.Context) error {
    var cartItem models.CartItems

    if err := c.Bind(&cartItem); err != nil {
        log.Printf("Error binding cart item: %v", err)
        return jsonResponse(c, http.StatusBadRequest, "Invalid input for cart item")
    }

    if err := cartItem.Validate(); err != nil {
		log.Printf("Validation error: %v", err)
        return jsonResponse(c, http.StatusBadRequest, err.Error())
    }

    var product models.Product
    if err := db.DB.First(&product, cartItem.ProductID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return jsonResponse(c, http.StatusNotFound, "Product not found")
        }
        log.Printf("Error fetching product: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
    }

    if product.Stock < cartItem.Quantity {
        return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the product")
    }

    
    var existingCartItem models.CartItems
    if err := db.DB.Where("user_id = ? AND product_id = ?", cartItem.UserID, cartItem.ProductID).
        First(&existingCartItem).Error; err == nil {
        
        existingCartItem.Quantity += cartItem.Quantity
        if existingCartItem.Quantity > product.Stock {
            return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the updated quantity")
        }
        if err := db.DB.Save(&existingCartItem).Error; err != nil {
            log.Printf("Error updating cart item: %v", err)
            return jsonResponse(c, http.StatusInternalServerError, "Error updating cart item")
        }
        return jsonResponse(c, http.StatusOK, "Cart item updated successfully", existingCartItem)
    }

    if err := db.DB.Create(&cartItem).Error; err != nil {
        log.Printf("Error adding cart item: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error adding cart item")
    }

    return jsonResponse(c, http.StatusCreated, "Cart item added successfully", cartItem)
}

// Delete Cart Item Handler [DELETE /cart-items/:id]
// 1. Retrieves the cart item by ID from the URL parameter and validates the ID.
// 2. If the cart item is not found, returns status 404.
// 3. Deletes the cart item from the database if it exists.
// 4. Returns status 200 if the cart item is successfully deleted.
// 5. Returns status 500 if an error occurs during deletion or fetching the cart item.

func DeleteCartItem(c echo.Context) error {
    var cartItem models.CartItems

    idParam := c.Param("id")
    id, err := convertToInt64(idParam)
    if err != nil {
        log.Printf("Error converting cart item ID: %v", err)
        return jsonResponse(c, http.StatusBadRequest, "Invalid cart item ID")
    }

    if err := db.DB.First(&cartItem, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return jsonResponse(c, http.StatusNotFound, "Cart item not found")
        }
        log.Printf("Error fetching cart item: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart item")
    }

    if err := db.DB.Delete(&cartItem).Error; err != nil {
        log.Printf("Error deleting cart item: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error deleting cart item")
    }

    return jsonResponse(c, http.StatusOK, "Cart item deleted successfully", cartItem)
}

// Update Cart Item Quantity Handler [PUT /cart-items/:id]
// 1. Retrieves the cart item by ID from the URL parameter and validates the ID.
// 2. Binds the request body to the cart item and validates the data.
// 3. Checks if the product exists and if there is sufficient stock for the updated quantity.
// 4. If the cart item is not found, returns status 404.
// 5. If input is invalid or stock is insufficient, returns status 400.
// 6. Updates the cart item in the database and returns status 200 if successful.
// 7. Returns status 500 if an error occurs during database operations.


func UpdateCartItemQuantity(c echo.Context) error {
    var cartItem models.CartItems

    idParam := c.Param("id")
    id, err := convertToInt64(idParam)
    if err != nil {
        log.Printf("Error converting cart item ID: %v", err)
        return jsonResponse(c, http.StatusBadRequest, "Invalid cart item ID")
    }

    if err := db.DB.First(&cartItem, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return jsonResponse(c, http.StatusNotFound, "Cart item not found")
        }
        log.Printf("Error fetching cart item: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart item")
    }

    if err := c.Bind(&cartItem); err != nil {
        log.Printf("Error binding cart item data: %v",err)
        return jsonResponse(c, http.StatusBadRequest, "Invalid input for updating cart item")
    }

    var product models.Product
    if err := db.DB.First(&product, cartItem.ProductID).Error; err != nil {
        log.Printf("Error fetching product: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
    }

    if cartItem.Quantity > product.Stock {
        return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the product")
    }

    if err:= cartItem.Validate(); err !=nil {
        log.Printf("Validation error: %v", err)
        return jsonResponse(c, http.StatusBadRequest, err.Error())
    }

    if err := db.DB.Save(&cartItem).Error; err != nil {
        log.Printf("Error updating cart item: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error updating cart item")
    }

    return jsonResponse(c, http.StatusOK, "Cart item updated successfully", cartItem)
}








