package repositories

import (
	"errors"
	db "keylab/database"
	"keylab/database/models"
	"log"

	"gorm.io/gorm"
)

// GetCartItemsByUserID fetches all cart items for a specific user
func GetCartItemsByUserID(userID int64) ([]models.CartItems, error) {
	var cartItems []models.CartItems
	err := database.DB.Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Find(&cartItems).Error
	
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching cart items for user ID %d: %v", userID, err)
	}
	
	return cartItems, err
}

// GetCartItemByID fetches a cart item by ID
func GetCartItemByID(cartItemID int64) (models.CartItems, error) {
	var cartItem models.CartItems
	err := db.DB.Preload("Product").Preload("Product.Category").First(&cartItem, cartItemID).Error
	
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching cart item by ID %d: %v", cartItemID, err)
	}
	
	return cartItem, err
}

// GetProductByID fetches a product by ID
func GetProductByID(productID int64) (models.Product, error) {
	var product models.Product
	err := database.DB.First(&product, productID).Error
	
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching product by ID %d: %v", productID, err)
	}
	
	return product, err
}



































func listcartitems--
GetCartItemsByUserID
if err := db.DB.Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
	log.Printf("Error fetching cart items: %v", err)
	return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart items")
}

--
func add cartItem 
GetProductByID
var product models.Product
    if err := db.DB.First(&product, cartItem.ProductID).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return jsonResponse(c, http.StatusNotFound, "Product not found")
        }
        log.Printf("Error fetching product: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
    }

	AddOrUpdateCartItem
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

	func Delete
	
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

func update

GetCartItemByID
if err := db.DB.First(&cartItem, id).Error; err != nil {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return jsonResponse(c, http.StatusNotFound, "Cart item not found")
	}
	log.Printf("Error fetching cart item: %v", err)
	return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart item")
}
GetProductByID

var product models.Product
    if err := db.DB.First(&product, cartItem.ProductID).Error; err != nil {
        log.Printf("Error fetching product: %v", err)
        return jsonResponse(c, http.StatusInternalServerError, "Error fetching product")
    }

