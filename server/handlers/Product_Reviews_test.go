package handlers

import (
	"bytes"
	"encoding/json"
	db "keylab/database"
	"keylab/database/models"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func setupReviewHandler(t *testing.T) (*Handlers, *db.TestDB, models.User, models.Product) {
	testDB := db.SetupTestDB(t)

	category := models.ProductCategory{
		Name:      "Test Category",
		Slug:      "test-category",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	assert.NoError(t, testDB.DB.Create(&category).Error)

	user := models.User{
		Forename:    "John",
		Surname:     "Doe",
		Email:       "john.doe@example.com",
		Password:    "hashedpassword",
		PhoneNumber: "+1234567890",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	assert.NoError(t, testDB.DB.Create(&user).Error)

	product := models.Product{
		Name:        "Test Product",
		Slug:        "test-product",
		Description: "Test Description",
		Price:       10.0,
		Stock:       0,
		CategoryID:  category.ID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	assert.NoError(t, testDB.DB.Create(&product).Error)

	h := &Handlers{DB: testDB.DB}
	return h, testDB, user, product
}

func TestCreateReview(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)
	e := echo.New()

	t.Run("Valid Review", func(t *testing.T) {
		review := models.ProductReviews{Rating: 5, Comment: "Amazing!"}
		body, _ := json.Marshal(review)
		req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)
		c.SetParamNames("product_slug")
		c.SetParamValues(product.Slug)

		err := h.CreateReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})

	t.Run("Duplicate Review", func(t *testing.T) {
		existingReview := models.ProductReviews{
			Rating:    5,
			Comment:   "Already reviewed",
			ProductID: product.ID,
			UserID:    user.ID,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		assert.NoError(t, testDB.DB.Create(&existingReview).Error)

		newReview := models.ProductReviews{Rating: 4, Comment: "Trying again"}
		body, _ := json.Marshal(newReview)
		req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)
		c.SetParamNames("product_slug")
		c.SetParamValues(product.Slug)

		err := h.CreateReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})

	t.Run("Invalid JSON", func(t *testing.T) {
		invalidBody := []byte(`{"invalid":}`)
		req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(invalidBody))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)
		c.SetParamNames("product_slug")
		c.SetParamValues(product.Slug)

		err := h.CreateReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})
}

func TestGetReviewByUser(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)
	e := echo.New()

	review := models.ProductReviews{
		ProductID: product.ID,
		UserID:    user.ID,
		Rating:    4,
		Comment:   "Sweet!",
	}
	assert.NoError(t, testDB.DB.Create(&review).Error)

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("user_id")
	c.SetParamValues(strconv.FormatInt(user.ID, 10))

	err := h.GetReviewByUser(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestGetReviewsByUser(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)

	review := models.ProductReviews{Rating: 4, Comment: "Nice product", ProductID: product.ID, UserID: user.ID}
	assert.NoError(t, testDB.DB.Create(&review).Error)
	e := echo.New()

	t.Run("Valid User", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetParamNames("user_id")
		c.SetParamValues(strconv.FormatInt(user.ID, 10))

		err := h.GetReviewsByUser(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})

	t.Run("Invalid User", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetParamNames("user_id")
		c.SetParamValues("abc")

		err := h.GetReviewsByUser(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})
}

func TestGetReviewsByProduct(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)

	review := models.ProductReviews{Rating: 4, Comment: "Good product", ProductID: product.ID, UserID: user.ID}
	assert.NoError(t, testDB.DB.Create(&review).Error)
	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("product_slug")
	c.SetParamValues(product.Slug)

	err := h.GetReviewsByProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestGetReview(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)

	review := models.ProductReviews{Rating: 5, Comment: "Perfect!", ProductID: product.ID, UserID: user.ID}
	assert.NoError(t, testDB.DB.Create(&review).Error)
	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id", "product_slug")
	c.SetParamValues(strconv.FormatInt(review.ID, 10), product.Slug)

	err := h.GetReview(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestGetReviewStatistics(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)

	reviews := []models.ProductReviews{
		{Rating: 5, Comment: "Great!", ProductID: product.ID, UserID: user.ID},
		{Rating: 3, Comment: "Okay", ProductID: product.ID, UserID: user.ID},
	}
	assert.NoError(t, testDB.DB.Create(&reviews).Error)
	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("product_slug")
	c.SetParamValues(product.Slug)

	err := h.GetReviewStatistics(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestUpdateReview(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)

	review := models.ProductReviews{Rating: 2, Comment: "Not great", ProductID: product.ID, UserID: user.ID}
	assert.NoError(t, testDB.DB.Create(&review).Error)
	updated := models.ProductReviews{
		ProductID: product.ID,
		UserID:    user.ID,
		Rating:    4,
		Comment:   "Actually better now",
	}

	body, _ := json.Marshal(updated)
	e := echo.New()

	t.Run("Valid Update", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPut, "/", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)
		c.SetParamNames("id")
		c.SetParamValues(strconv.FormatInt(review.ID, 10))

		err := h.UpdateReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})

	t.Run("Unauthorized Update", func(t *testing.T) {
		otherUser := models.User{Forename: "Jane", Surname: "Doe", Email: "jane@example.com", Password: "pass"}
		assert.NoError(t, testDB.DB.Create(&otherUser).Error)

		req := httptest.NewRequest(http.MethodPut, "/", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", otherUser)
		c.SetParamNames("id")
		c.SetParamValues(strconv.FormatInt(review.ID, 10))

		err := h.UpdateReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusForbidden, rec.Code)
	})
}

func TestDeleteReview(t *testing.T) {
	h, testDB, user, product := setupReviewHandler(t)
	defer db.CleanupTestDB(t, testDB)

	review := models.ProductReviews{Rating: 3, Comment: "Meh", ProductID: product.ID, UserID: user.ID}
	assert.NoError(t, testDB.DB.Create(&review).Error)
	e := echo.New()

	t.Run("Valid Delete", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)
		c.SetParamNames("id")
		c.SetParamValues(strconv.FormatInt(review.ID, 10))

		err := h.DeleteReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})

	t.Run("Invalid ID", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.Set("user", user)
		c.SetParamNames("id")
		c.SetParamValues("abc")

		err := h.DeleteReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})
}
