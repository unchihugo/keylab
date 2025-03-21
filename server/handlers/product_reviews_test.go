package handlers

import (
	"encoding/json"
	"keylab/database"
	"keylab/database/models"
	"keylab/handlers"
	"keylab/repositories"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetReviewByUser(t *testing.T) {
	e := echo.New()
	testDB := database.SetupTestDB(t)
	defer database.CleanupTestDB(t, testDB)

	h := &handlers.Handlers{
		DB: testDB.DB,
	}

	user := models.User{Email: "test@example.com", Password: "password123"}
	assert.NoError(t, testDB.DB.Create(&user).Error)

	reviews := []models.ProductReviews{
		{UserID: user.ID, ProductID: 1, Rating: 5, Comment: "Great!"},
		{UserID: user.ID, ProductID: 2, Rating: 4, Comment: "Good"},
	}
	for _, review := range reviews {
		assert.NoError(t, testDB.DB.Create(&review).Error)
	}

	t.Run("Reviews Found", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/products/product-slug/reviews/users/1/reviews", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetParamNames("user_id")
		c.SetParamValues("1")

		err := h.GetReviewByUser(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]interface{}
		assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &response))
		assert.Equal(t, "Reviews found", response["message"])
	})
}

func TestCreateReview(t *testing.T) {
	e := echo.New()
	testDB := database.SetupTestDB(t)
	defer database.CleanupTestDB(t, testDB)

	h := &handlers.Handlers{
		DB: testDB.DB,
	}

	product := models.Product{Name: "Keyboard", Slug: "keyboard", Price: 50.0}
	assert.NoError(t, testDB.DB.Create(&product).Error)

	t.Run("Valid Review", func(t *testing.T) {
		review := models.ProductReviews{
			UserID:    1,
			ProductID: product.ID,
			Rating:    5,
			Comment:   "Amazing!",
		}
		body, _ := json.Marshal(review)
		req := httptest.NewRequest(http.MethodPost, "/products/keyboard/reviews", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := h.CreateReview(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})
}
