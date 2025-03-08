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
	err := db.DB.Preload("Product").Preload("Product.Category").Where("user_id = ?", userID).Find(&cartItems).Error

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
	err := db.DB.First(&product, productID).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("Error fetching product by ID %d: %v", productID, err)
	}

	return product, err
}

// Calculate Card Total

func CalculateTotal(cartItems []models.CartItems) float64 {
	var total float64
	for _, item := range cartItems {
		total += item.Product.Price * float64(item.Quantity)
	}
	return total
}

// Fetch or Store Address

func HandleAddress(userID int64, addressID int64, newAddress *models.Address, addressType models.AddressType) (*models.Address, error) {
	if addressID != 0 {
		var address models.Address
		if err := db.DB.First(&address, addressID).Error; err != nil {
			return nil, err
		}
		return &address, nil
	}

	if newAddress != nil {
		newAddress.UserID = userID
		newAddress.Type = addressType
		if err := db.DB.Create(newAddress).Error; err != nil {
			return nil, err
		}
		return newAddress, nil
	}

	return nil, errors.New("no address provided")
}
