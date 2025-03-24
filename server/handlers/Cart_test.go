package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	db "keylab/database"
	"keylab/database/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func setupCartTest(t *testing.T) (*Handlers, *db.TestDB, models.User, models.Product) {
	testDB := db.SetupTestDB(t)

	user := models.User{
		Forename:    "Alice",
		Surname:     "Doe",
		Email:       "alice@example.com",
		Password:    "pass123",
		PhoneNumber: "1234567890",
	}
	assert.NoError(t, testDB.DB.Create(&user).Error)

	category := models.ProductCategory{Name: "Accessories"}
	assert.NoError(t, testDB.DB.Create(&category).Error)

	product := models.Product{
		Name:        "Mousepad",
		Slug:        "mousepad",
		Description: "Gaming mousepad",
		Price:       25.0,
		Stock:       10,
		CategoryID:  category.ID,
	}
	assert.NoError(t, testDB.DB.Create(&product).Error)

	h := &Handlers{DB: testDB.DB}
	return h, testDB, user, product
}

func TestAddCartItem(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	t.Run("Valid", func(t *testing.T) {
		e := echo.New()
		cartItem := models.CartItems{ProductID: product.ID, Quantity: 2}
		body, _ := json.Marshal(cartItem)
		req := httptest.NewRequest(http.MethodPost, "/cart", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)

		err := h.AddCartItem(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, rec.Code)
	})

	t.Run("Invalid Input", func(t *testing.T) {
		e := echo.New()
		req := httptest.NewRequest(http.MethodPost, "/cart", bytes.NewReader([]byte("invalid")))
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)

		err := h.AddCartItem(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})

	t.Run("Product Not Found", func(t *testing.T) {
		e := echo.New()
		cartItem := models.CartItems{ProductID: 99999, Quantity: 1}
		body, _ := json.Marshal(cartItem)
		req := httptest.NewRequest(http.MethodPost, "/cart", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)

		err := h.AddCartItem(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)
	})
}

func TestListCartItems(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	t.Run("Empty Cart", func(t *testing.T) {
		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/cart", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)

		err := h.ListCartItems(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)
	})

	t.Run("With Items", func(t *testing.T) {
		item := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
		assert.NoError(t, testDB.DB.Create(&item).Error)

		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/cart", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)

		err := h.ListCartItems(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})
}

func TestDeleteCartItem(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	item := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
	assert.NoError(t, testDB.DB.Create(&item).Error)

	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/cart/%d", item.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(item.ID))
	c.Set("user", user)

	err := h.DeleteCartItem(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestUpdateCartItemQuantity(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	item := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
	assert.NoError(t, testDB.DB.Create(&item).Error)

	item.Quantity = 3
	body, _ := json.Marshal(item)
	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/cart/%d", item.ID), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(item.ID))
	c.Set("user", user)

	err := h.UpdateCartItemQuantity(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestCheckoutCart(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	billing := models.Address{UserID: user.ID, Street: "1 Main", City: "City", County: "County", PostalCode: "12345", Country: "X", Type: models.Billing}
	shipping := models.Address{UserID: user.ID, Street: "1 Main", City: "City", County: "County", PostalCode: "12345", Country: "X", Type: models.Shipping}
	assert.NoError(t, testDB.DB.Create(&billing).Error)
	assert.NoError(t, testDB.DB.Create(&shipping).Error)

	cartItem := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 2}
	assert.NoError(t, testDB.DB.Create(&cartItem).Error)

	reqBody := map[string]interface{}{
		"billing_address_id":  billing.ID,
		"shipping_address_id": shipping.ID,
	}
	body, _ := json.Marshal(reqBody)
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/cart/checkout", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.Set("user", user)

	err := h.CheckoutCart(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestUpdateOrderStatus(t *testing.T) {
	h, testDB, user, _ := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	// Create valid addresses
	shipping := models.Address{UserID: user.ID, Street: "123 A", City: "TestCity", County: "TC", PostalCode: "11111", Country: "X", Type: models.Shipping}
	billing := models.Address{UserID: user.ID, Street: "456 B", City: "TestCity", County: "TC", PostalCode: "22222", Country: "X", Type: models.Billing}
	assert.NoError(t, testDB.DB.Create(&shipping).Error)
	assert.NoError(t, testDB.DB.Create(&billing).Error)

	order := models.Order{
		UserID:            user.ID,
		Status:            models.Pending,
		Total:             50,
		ShippingAddressID: shipping.ID,
		BillingAddressID:  billing.ID,
	}
	assert.NoError(t, testDB.DB.Create(&order).Error)

	body, _ := json.Marshal(map[string]string{"status": "shipped"})
	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/orders/%d/status", order.ID), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(order.ID))

	err := h.UpdateOrderStatus(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestGetUserOrderDetails(t *testing.T) {
	h, testDB, user, _ := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	shipping := models.Address{UserID: user.ID, Street: "1", City: "C", County: "Co", PostalCode: "123", Country: "X", Type: models.Shipping}
	billing := models.Address{UserID: user.ID, Street: "2", City: "C", County: "Co", PostalCode: "456", Country: "X", Type: models.Billing}
	assert.NoError(t, testDB.DB.Create(&shipping).Error)
	assert.NoError(t, testDB.DB.Create(&billing).Error)

	order := models.Order{UserID: user.ID, ShippingAddressID: shipping.ID, BillingAddressID: billing.ID, Status: models.Pending, Total: 100.0}
	assert.NoError(t, testDB.DB.Create(&order).Error)

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/users/order/1", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(order.ID))
	c.Set("user", user)

	err := h.GetUserOrderDetails(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}
