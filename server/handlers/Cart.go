package handlers

import (
	"errors"
	"keylab/database/models"
	"keylab/repositories"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// List Cart Items Handler [GET /cart items]
// 1. Fetches all cart items for a specific user.
// 2. Returns status 200 with the cart items if successful.
// 3. Returns status 400 if 'user_id' query parameter is missing or invalid.
// 3. Returns status 404 if no cart items are found for specified user.
// 4. Returns status 500 if an error occurs.

func (h *Handlers) ListCartItems(c echo.Context) error {
	var cartItems []models.CartItems

	user := c.Get("user").(models.User)

	cartItems, err := repositories.GetCartItemsByUserID(user.ID, h.DB)
	if err != nil {
		log.Printf("Error fetching cart items: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart items")
	}

	if len(cartItems) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No cart items found for the user")
	}

	return jsonResponse(c, http.StatusOK, "Cart items fetched successfully", cartItems)
}

// Add Item to Cart Handler [POST /cart]
// 1. Parses the cart item from the request body.
// 2. Validates the cart item.
// 3. Checks if the specified product exists and if it has the sufficient stock requested.
// 4. If the product already exists in the cart it updates the quantity- if not it adds the new cart item.
// 5. Returns status 201 if the cart item is successfully added or updated.
// 6. Returns status 400 if input is invalid or stock is insufficient.
// 7. Returns status 500 if an error occurs.

func (h *Handlers) AddCartItem(c echo.Context) error {
	var cartItem models.CartItems
	if err := c.Bind(&cartItem); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for cart item")
	}

	if err := cartItem.Validate("ProductID", "Quantity"); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	product, err := repositories.GetProductByID(cartItem.ProductID, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	if product.Stock < cartItem.Quantity {
		return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the product")
	}

	user := c.Get("user").(models.User)
	cartItem.UserID = user.ID

	var existingCartItem models.CartItems
	if err := h.DB.Where("user_id = ? AND product_id = ?", cartItem.UserID, cartItem.ProductID).First(&existingCartItem).Error; err == nil {
		existingCartItem.Quantity += cartItem.Quantity
		if existingCartItem.Quantity > product.Stock {
			return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the updated quantity")
		}

		if err := h.DB.Save(&existingCartItem).Error; err != nil {
			log.Printf("Error updating cart item: %v", err)
			return jsonResponse(c, http.StatusInternalServerError, "Error updating cart item")
		}

		existingCartItem, err = repositories.GetCartItemByID(existingCartItem.ID, h.DB)
		if err != nil {
			return jsonResponse(c, http.StatusInternalServerError, "Error fetching updated cart item")
		}

		return jsonResponse(c, http.StatusOK, "Cart item updated successfully", existingCartItem)
	}

	if err := h.DB.Preload("Product").Create(&cartItem).Error; err != nil {
		log.Printf("Error adding cart item: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error adding cart item")
	}

	cartItem, err = repositories.GetCartItemByID(cartItem.ID, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart item")
	}

	return jsonResponse(c, http.StatusCreated, "Cart item added successfully", cartItem)
}

// Delete Cart Item Handler [DELETE /cart/:id]
// 1. Retrieves the cart item by ID from the URL parameter and validates the ID.
// 2. If the cart item is not found, returns status 404.
// 3. Deletes the cart item from the database if it exists.
// 4. Returns status 200 if the cart item is successfully deleted.
// 5. Returns status 500 if an error occurs during deletion or fetching the cart item.

func (h *Handlers) DeleteCartItem(c echo.Context) error {
	var cartItem models.CartItems
	user := c.Get("user").(models.User)

	idParam, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid cart item ID")
	}

	cartItem, err = repositories.GetCartItemByID(idParam, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Cart item not found")
	}

	if cartItem.UserID != user.ID {
		return jsonResponse(c, http.StatusForbidden, "You are not authorized to delete this cart item")
	}

	if err := h.DB.Delete(&cartItem).Error; err != nil {
		log.Printf("Error deleting cart item: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting cart item")
	}

	return jsonResponse(c, http.StatusOK, "Cart item deleted successfully", cartItem)
}

// Update Cart Item Quantity Handler [PUT /cart/:id]
// 1. Retrieves the cart item by ID from the URL parameter and validates the ID.
// 2. Binds the request body to the cart item and validates the data.
// 3. Checks if the product exists and if there is sufficient stock for the updated quantity.
// 4. If the cart item is not found, returns status 404.
// 5. If input is invalid or stock is insufficient, returns status 400.
// 6. Updates the cart item in the database and returns status 200 if successful.
// 7. Returns status 500 if an error occurs during database operations.

func (h *Handlers) UpdateCartItemQuantity(c echo.Context) error {
	var cartItem models.CartItems
	user := c.Get("user").(models.User)

	idParam, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid cart item ID")
	}

	cartItem, err = repositories.GetCartItemByID(idParam, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Cart item not found")
	}

	if cartItem.UserID != user.ID {
		return jsonResponse(c, http.StatusForbidden, "You are not authorized to update this cart item")
	}

	if err := c.Bind(&cartItem); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input for updating cart item")
	}

	product, err := repositories.GetProductByID(cartItem.ProductID, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	if cartItem.Quantity > product.Stock {
		return jsonResponse(c, http.StatusBadRequest, "Insufficient stock for the product")
	}

	if err := cartItem.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := h.DB.Save(&cartItem).Error; err != nil {
		log.Printf("Error updating cart item: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error updating cart item")
	}

	return jsonResponse(c, http.StatusOK, "Cart item updated successfully", cartItem)
}

type CheckoutRequest struct {
	BillingAddressID   int64           `json:"billing_address_id"`
	ShippingAddressID  int64           `json:"shipping_address_id"`
	NewBillingAddress  *models.Address `json:"new_billing_address"`
	NewShippingAddress *models.Address `json:"new_shipping_address"`
}

// Checkout [POST /cart/checkout]
// 1. Retrieves the addresses from the request and handles it as expected.
// 2. Fetches Cart Items by the User and Calculates Total
// 3. Creates a DB Transaction and handles creating order
// 4. Returns order

func (h *Handlers) CheckoutCart(c echo.Context) error {
	user := c.Get("user").(models.User)

	var req CheckoutRequest
	if err := c.Bind(&req); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid request data")
	}

	billingAddress, err := repositories.HandleAddress(user.ID, req.BillingAddressID, req.NewBillingAddress, models.Billing, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to handle billing address")
	}

	shippingAddress, err := repositories.HandleAddress(user.ID, req.ShippingAddressID, req.NewShippingAddress, models.Shipping, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to handle shipping address")
	}

	cartItems, err := repositories.GetCartItemsByUserID(user.ID, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching cart items")
	}
	if len(cartItems) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No cart items found for the user")
	}

	total := repositories.CalculateTotal(cartItems, h.DB)
	transaction := h.DB.Begin()
	if transaction.Error != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to initiate transaction")
	}

	defer func() {
		if r := recover(); r != nil {
			transaction.Rollback()
		}
	}()

	order := models.Order{
		UserID:            user.ID,
		Status:            models.Pending,
		Total:             total,
		ShippingAddressID: shippingAddress.ID,
		BillingAddressID:  billingAddress.ID,
		OrderDate:         time.Now(),
	}

	if err := transaction.Create(&order).Error; err != nil {
		transaction.Rollback()
		return jsonResponse(c, http.StatusInternalServerError, "Error creating order")
	}

	for _, item := range cartItems {
		if err := transaction.Model(&models.Product{}).Where("id = ?", item.ProductID).UpdateColumn("stock", gorm.Expr("stock - ?", item.Quantity)).Error; err != nil {
			transaction.Rollback()
			return jsonResponse(c, http.StatusInternalServerError, "Error updating product stock")
		}

		orderItem := models.OrderedItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Product.Price,
		}
		if err := transaction.Create(&orderItem).Error; err != nil {
			transaction.Rollback()
			return jsonResponse(c, http.StatusInternalServerError, "Error adding item to order")
		}
	}

	if err := transaction.Where("user_id = ?", user.ID).Delete(&models.CartItems{}).Error; err != nil {
		transaction.Rollback()
		return jsonResponse(c, http.StatusInternalServerError, "Error clearing cart")
	}

	if err := transaction.Commit().Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error processing checkout")
	}

	return jsonResponse(c, http.StatusOK, "Order confirmed")
}

// Checkout [GET /users/order/:id]
func (h *Handlers) GetUserOrderDetails(c echo.Context) error {
	user := c.Get("user").(models.User)
	orderID := c.Param("id")

	var order models.Order
	if err := h.DB.Preload("ShippingAddress").Preload("BillingAddress").Where("id = ? AND user_id = ?", orderID, user.ID).First(&order).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c, http.StatusNotFound, "Order not found!")
		}
		return jsonResponse(c, http.StatusInternalServerError, "Internal server error")
	}

	var orderedItems []models.OrderedItem
	if err := h.DB.Where("order_id = ?", orderID).Find(&orderedItems).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Failed to fetch ordered items")
	}

	response := map[string]interface{}{
		"order":         order,
		"ordered_items": orderedItems,
	}

	return jsonResponse(c, http.StatusOK, "Order found", response)
}

// Checkout [PUT /orders/:id/status]
func (h *Handlers) UpdateOrderStatus(c echo.Context) error {
	orderID := c.Param("id")

	var requestBody struct {
		Status string `json:"status"`
	}
	if err := c.Bind(&requestBody); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid request body")
	}

	validStatuses := map[string]bool{
		"pending":   true,
		"shipped":   true,
		"delivered": true,
		"cancelled": true,
		"returned":  true,
	}

	status := strings.ToLower(requestBody.Status)
	if !validStatuses[status] {
		return jsonResponse(c, http.StatusBadRequest, "Invalid status value")
	}

	var order models.Order
	if err := h.DB.Preload("ShippingAddress").Preload("BillingAddress").Where("id = ?", orderID).First(&order).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c, http.StatusNotFound, "Order not found")
		}
		return jsonResponse(c, http.StatusInternalServerError, "Internal server error")
	}

	order.Status = models.OrderStatus(status)

	if err := h.DB.Save(&order).Error; err != nil {
		return jsonResponse(c, http.StatusInternalServerError, "Error updating order status")
	}

	return jsonResponse(c, http.StatusOK, "Order status updated successfully", order)
}

// GetAllOrders Handler [GET /admin/orders]
// 1. Fetches all orders with pagination
// 2. Returns status 200 with orders data and pagination metadata if successful
// 3. Returns status 500 if an error occurs

func (h *Handlers) GetAllOrders(c echo.Context) error {
	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	status := c.QueryParam("status")

	var orders []models.Order
	query := h.DB.Preload("User").Preload("ShippingAddress").Preload("BillingAddress").Order(order)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Limit(perPage).Offset(offset).Find(&orders).Error; err != nil {
		log.Printf("Error fetching orders: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching orders")
	}

	var total int64
	countQuery := h.DB.Model(&models.Order{})
	if status != "" {
		countQuery = countQuery.Where("status = ?", status)
	}

	if err := countQuery.Count(&total).Error; err != nil {
		log.Printf("Error counting orders: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error counting orders")
	}

	var processedOrders []map[string]interface{}
	for _, order := range orders {
		var orderedItems []models.OrderedItem
		if err := h.DB.Preload("Product").Where("order_id = ?", order.ID).Find(&orderedItems).Error; err != nil {
			log.Printf("Error fetching ordered items for order %d: %v", order.ID, err)
			continue
		}

		processedOrders = append(processedOrders, map[string]interface{}{
			"order":         order,
			"ordered_items": orderedItems,
		})
	}

	return jsonResponse(c, http.StatusOK, "Orders fetched successfully", map[string]interface{}{
		"orders":   processedOrders,
		"metadata": generatePaginationResponse(page, perPage, int(total)),
	})
}

// GetOrderDetails Handler [GET /admin/orders/:id]
// 1. Fetches a specific order by ID with all related data
// 2. Returns status 200 with order data if successful
// 3. Returns status 404 if order not found
// 4. Returns status 500 if an error occurs

func (h *Handlers) GetOrderDetails(c echo.Context) error {
	orderID, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid order ID")
	}

	var order models.Order
	if err := h.DB.Preload("User").Preload("ShippingAddress").Preload("BillingAddress").Where("id = ?", orderID).First(&order).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c, http.StatusNotFound, "Order not found")
		}
		log.Printf("Error fetching order details: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching order details")
	}

	var orderedItems []models.OrderedItem
	if err := h.DB.Preload("Product").Where("order_id = ?", orderID).Find(&orderedItems).Error; err != nil {
		log.Printf("Error fetching ordered items: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Failed to fetch ordered items")
	}

	response := map[string]interface{}{
		"order":         order,
		"ordered_items": orderedItems,
	}

	return jsonResponse(c, http.StatusOK, "Order found", response)
}

// GetUserOrders Handler [GET /admin/users/:id/orders]
// 1. Fetches all orders for a specific user with pagination
// 2. Returns status 200 with orders data and pagination metadata if successful
// 3. Returns status 404 if user not found
// 4. Returns status 500 if an error occurs

func (h *Handlers) GetUserOrders(c echo.Context) error {
	userID, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	user, err := repositories.FindUserByID(userID, h.DB)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "User not found")
	}

	page, perPage, offset := getPaginationParams(c)
	order := getSortOrder(c)

	status := c.QueryParam("status")

	var orders []models.Order
	query := h.DB.Preload("User").Preload("ShippingAddress").Preload("BillingAddress").Where("user_id = ?", user.ID).Order(order)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Limit(perPage).Offset(offset).Find(&orders).Error; err != nil {
		log.Printf("Error fetching user orders: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching user orders")
	}

	var total int64
	countQuery := h.DB.Model(&models.Order{}).Where("user_id = ?", user.ID)
	if status != "" {
		countQuery = countQuery.Where("status = ?", status)
	}

	if err := countQuery.Count(&total).Error; err != nil {
		log.Printf("Error counting user orders: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error counting user orders")
	}

	var processedOrders []map[string]interface{}
	for _, order := range orders {
		var orderedItems []models.OrderedItem
		if err := h.DB.Preload("Product").Where("order_id = ?", order.ID).Find(&orderedItems).Error; err != nil {
			log.Printf("Error fetching ordered items for order %d: %v", order.ID, err)
			continue
		}

		processedOrders = append(processedOrders, map[string]interface{}{
			"order":         order,
			"ordered_items": orderedItems,
		})
	}

	return jsonResponse(c, http.StatusOK, "User orders fetched successfully", map[string]interface{}{
		"user":     user,
		"orders":   processedOrders,
		"metadata": generatePaginationResponse(page, perPage, int(total)),
	})
}
