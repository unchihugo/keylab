package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"keylab/database"
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
		Forename: "John",
		Surname:  "Doe",
		Email:    "john@example.com",
		Password: "password",
	}
	assert.NoError(t, testDB.DB.Create(&user).Error)

	category := models.ProductCategory{
		Name: "Electronics",
	}
	assert.NoError(t, testDB.DB.Create(&category).Error)

	product := models.Product{
		Name:       "Sample Product",
		Slug:       "sample-product",
		Price:      100,
		Stock:      10,
		CategoryID: category.ID,
	}
	assert.NoError(t, testDB.DB.Create(&product).Error)

	h := &Handlers{DB: testDB.DB}
	return h, testDB, user, product
}

func TestListCartItems(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	cartItem := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
	testDB.DB.Create(&cartItem)

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/cart", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.Set("user", user)

	err := h.ListCartItems(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestAddCartItem(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	item := models.CartItems{ProductID: product.ID, Quantity: 1}
	body, _ := json.Marshal(item)

	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/cart", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.Set("user", user)

	err := h.AddCartItem(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)
}

func TestUpdateCartItemQuantity(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	cartItem := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
	assert.NoError(t, testDB.DB.Create(&cartItem).Error)

	cartItem.Quantity = 2
	body, _ := json.Marshal(cartItem)

	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/cart/%d", cartItem.ID), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(cartItem.ID))
	c.Set("user", user)

	err := h.UpdateCartItemQuantity(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestDeleteCartItem(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	cartItem := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
	assert.NoError(t, testDB.DB.Create(&cartItem).Error)

	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/cart/%d", cartItem.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(cartItem.ID))
	c.Set("user", user)

	err := h.DeleteCartItem(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestCheckoutCart(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	
	address := models.Address{UserID: user.ID, Street: "123 St", City: "City", Country: "Country", PostalCode: "0000"}
	assert.NoError(t, testDB.DB.Create(&address).Error)

	
	cartItem := models.CartItems{UserID: user.ID, ProductID: product.ID, Quantity: 1}
	assert.NoError(t, testDB.DB.Create(&cartItem).Error)

	reqBody := map[string]interface{}{
		"billing_address_id":  address.ID,
		"shipping_address_id": address.ID,
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

func TestGetUserOrderDetails(t *testing.T) {
	h, testDB, user, product := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	order := models.Order{
		UserID: user.ID,
		Status: "pending",
		Total:  100,
	}
	assert.NoError(t, testDB.DB.Create(&order).Error)

	orderedItem := models.OrderedItem{
		OrderID:   order.ID,
		ProductID: product.ID,
		Quantity:  1,
		Price:     product.Price,
	}
	assert.NoError(t, testDB.DB.Create(&orderedItem).Error)

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, fmt.Sprintf("/users/order/%d", order.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(order.ID))
	c.Set("user", user)

	err := h.GetUserOrderDetails(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestUpdateOrderStatus(t *testing.T) {
	h, testDB, user, _ := setupCartTest(t)
	defer db.CleanupTestDB(t, testDB)

	order := models.Order{
		UserID: user.ID,
		Status: "pending",
		Total:  100,
	}
	assert.NoError(t, testDB.DB.Create(&order).Error)

	body := map[string]interface{}{
		"status": "shipped",
	}
	jsonBody, _ := json.Marshal(body)

	e := echo.New()
	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/orders/%d/status", order.ID), bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(order.ID))

	err := h.UpdateOrderStatus(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}
