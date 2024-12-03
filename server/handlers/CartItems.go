package handlers

import (
    db "keylab/database"
    "keylab/database/models"
    "keylab/repositories"
    "log"
    "net/http"
    "github.com/labstack/echo/v4"
    
)

// List Cart Items Handler [GET /cart items]
// 1. Fetches all cart items for a specific user.
// 2. Returns status 200 with the cart items if successful.
// 3. Returns status 400 if 'user_id' query parameter is missing or invalid.
// 3. Returns status 404 if no cart items are found for specified user.
// 4. Returns status 500 if an error occurs.

func ListCartItems(c echo.Context) error {
    var cartItems []models.CartItems

    user:= c.Get("user").(models.User)
    
    cartItems, err := repositories.GetCartItemsByUserID(user.ID)
    if err != nil {
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
        return jsonResponse(c, http.StatusBadRequest, "Invalid input for cart item")
    }

    if err := cartItem.Validate(); err != nil {
        return jsonResponse(c, http.StatusBadRequest, err.Error())
    }

    product, err := repositories.GetProductByID(cartItem.ProductID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

    if product.Stock < cartItem.Quantity {
        return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the product")
    }

    user := c.Get("user").(models.User)
    cartItem.UserID = user.ID

    var existingCartItem models.CartItems
    if err := db.DB.Where("user_id = ? AND product_id = ?", cartItem.UserID, cartItem.ProductID).First(&existingCartItem).Error; err == nil {

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
    user := c.Get("user").(models.User)

    idParam, err := convertToInt64(c.Param("id"))
    if err != nil {
        return jsonResponse(c, http.StatusBadRequest, "Invalid cart item ID")
    }
    
    cartItem, err := repositories.GetCartItemByID(idParam)
    if err != nil {
        return jsonResponse(c, http.StatusNotFound, "Cart item not found")
    }

    if cartItem.UserID != user.ID {
		return jsonResponse(c, http.StatusForbidden, "You are not authorized to delete this cart item")
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
    user := c.Get("user").(models.User)

    idParam, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid cart item ID")
	}

    cartItem, err := repositories.GetCartItemByID(idParam)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Cart item not found")
	}

    if cartItem.UserID != user.ID {
		return jsonResponse(c, http.StatusForbidden, "You are not authorized to update this cart item")
	}

    if err := c.Bind(&cartItem); err != nil {
        return jsonResponse(c, http.StatusBadRequest, "Invalid input for updating cart item")
    }

    product, err := repositories.GetProductByID(cartItem.ProductID)
    if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

    if cartItem.Quantity > product.Stock {
		return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the product")
	}

    if err:= cartItem.Validate(); err !=nil {
        return jsonResponse(c, http.StatusBadRequest, err.Error())
    }

    if err := db.DB.Save(&cartItem).Error; err != nil {
        log.Printf("Error updating cart item: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error updating cart item")
    }

    return jsonResponse(c, http.StatusOK, "Cart item updated successfully", cartItem)
}








