package handlers

import (
	"bytes"
	"encoding/json"
	"keylab/config"
	db "keylab/database"
	"keylab/database/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestGetCategories(t *testing.T) {
	e := echo.New()

	config := config.Initialize()

	sessionStore := sessions.NewCookieStore([]byte(config.SESSIONS_KEY), []byte(config.HASH_KEY))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.Secure = true

	testDB := db.SetupTestDB(t)
	defer db.CleanupTestDB(t, testDB)

	h := &Handlers{
		DB:           testDB.DB,
		SessionStore: sessionStore,
	}

	t.Run("No Categories Found", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/categories", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := h.GetCategories(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)

		var response map[string]interface{}
		assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &response))
		assert.Equal(t, "No categories found", response["message"])
	})

	var parentID int64 = 1
	categories := []models.ProductCategory{
		{
			Name:        "Mechanical Keyboards",
			Slug:        "mechanical-keyboards",
			Description: "Mechanical keyboard devices",
		},
		{
			Name:        "Keycaps",
			Slug:        "keycaps",
			Description: "Keycap sets and singles",
		},
		{
			Name:        "Switch Accessories",
			Slug:        "switch-accessories",
			Description: "Accessories for keyboard switches",
		},
	}

	for _, category := range categories {
		assert.NoError(t, testDB.DB.Create(&category).Error)
	}

	subCategory := models.ProductCategory{
		Name:        "75% Keyboards",
		Slug:        "75-percent-keyboards",
		Description: "Compact 75% layout keyboards",
		ParentID:    &parentID,
	}
	assert.NoError(t, testDB.DB.Create(&subCategory).Error)

	t.Run("Categories Found", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/categories", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := h.GetCategories(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]interface{}
		assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &response))
		assert.Equal(t, "Categories found", response["message"])

		data, ok := response["data"].([]interface{})
		assert.True(t, ok)
		assert.Len(t, data, 4)
	})

}

func TestGetCategoryBySlug(t *testing.T) {
	e := echo.New()

	config := config.Initialize()

	sessionStore := sessions.NewCookieStore([]byte(config.SESSIONS_KEY), []byte(config.HASH_KEY))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.Secure = true

	testDB := db.SetupTestDB(t)
	defer db.CleanupTestDB(t, testDB)

	h := &Handlers{
		DB:           testDB.DB,
		SessionStore: sessionStore,
	}

	var parentID int64 = 1
	category := models.ProductCategory{
		Name:        "Mechanical Keyboards",
		Slug:        "mechanical-keyboards",
		Description: "Mechanical keyboard devices",
	}
	assert.NoError(t, testDB.DB.Create(&category).Error)

	subCategory := models.ProductCategory{
		Name:        "75% Keyboards",
		Slug:        "75-percent-keyboards",
		Description: "Compact 75% layout keyboards",
		ParentID:    &parentID,
	}
	assert.NoError(t, testDB.DB.Create(&subCategory).Error)

	tests := []struct {
		name     string
		slug     string
		wantCode int
	}{
		{
			name:     "Invalid Slug",
			slug:     "",
			wantCode: http.StatusBadRequest,
		},
		{
			name:     "Category Not Found",
			slug:     "nonexistent",
			wantCode: http.StatusNotFound,
		},
		{
			name:     "Category Found",
			slug:     "mechanical-keyboards",
			wantCode: http.StatusOK,
		},
		{
			name:     "Subcategory Found",
			slug:     "75-percent-keyboards",
			wantCode: http.StatusOK,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/categories/"+test.slug, nil)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			c.SetParamNames("slug")
			c.SetParamValues(test.slug)

			err := h.GetCategoryBySlug(c)
			assert.NoError(t, err)
			assert.Equal(t, test.wantCode, rec.Code)

			var response map[string]interface{}
			assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &response))

			if test.wantCode == http.StatusOK {
				data, ok := response["data"].(map[string]interface{})
				assert.True(t, ok)
				assert.Equal(t, test.slug, data["slug"])

				if test.slug == "75-percent-keyboards" {
					parent, ok := data["parent"].(map[string]interface{})
					assert.True(t, ok)
					assert.Equal(t, "mechanical-keyboards", parent["slug"])
				}
			}
		})
	}

}

func TestCreateCategory(t *testing.T) {
	e := echo.New()

	config := config.Initialize()

	sessionStore := sessions.NewCookieStore([]byte(config.SESSIONS_KEY), []byte(config.HASH_KEY))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.Secure = true

	testDB := db.SetupTestDB(t)
	defer db.CleanupTestDB(t, testDB)

	h := &Handlers{
		DB:           testDB.DB,
		SessionStore: sessionStore,
	}

	existingCategory := models.ProductCategory{
		Name:        "Special Keyboards",
		Slug:        "special-keyboards",
		Description: "Special Keyboards",
	}

	assert.NoError(t, testDB.DB.Create(&existingCategory).Error)

	var parentID int64 = 1

	tests := []struct {
		name     string
		input    models.ProductCategory
		wantCode int
	}{
		{
			name: "Invalid Input - Missing Name",
			input: models.ProductCategory{
				Slug:        "invalid",
				Description: "Invalid category",
			},
			wantCode: http.StatusBadRequest,
		},
		{
			name: "Invalid Input - Missing Slug",
			input: models.ProductCategory{
				Name:        "Invalid",
				Description: "Invalid category",
			},
			wantCode: http.StatusBadRequest,
		},
		{
			name: "Invalid Input - Missing Description",
			input: models.ProductCategory{
				Name: "Invalid",
				Slug: "invalid",
			},
			wantCode: http.StatusBadRequest,
		},
		{
			name: "Duplicate Slug",
			input: models.ProductCategory{
				Name:        "Special Keyboards",
				Slug:        "special-keyboards",
				Description: "Special Keyboards duplicate",
			},
			wantCode: http.StatusBadRequest,
		},
		{
			name: "Valid Category",
			input: models.ProductCategory{
				Name:        "Small Keyboards",
				Slug:        "small-keyboards",
				Description: "Small Keyboards",
			},
			wantCode: http.StatusCreated,
		},
		{
			name: "Valid Subcategory",
			input: models.ProductCategory{
				Name:        "Cool Switches",
				Slug:        "cool-switches",
				Description: "Cool Switches Subcategory",
				ParentID:    &parentID,
			},
			wantCode: http.StatusCreated,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payloadBytes, err := json.Marshal(test.input)
			assert.NoError(t, err)

			req := httptest.NewRequest(http.MethodPost, "/categories", bytes.NewReader(payloadBytes))
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)

			err = h.CreateCategory(c)
			assert.NoError(t, err)
			assert.Equal(t, test.wantCode, rec.Code)

			var response map[string]interface{}
			assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &response))

			if test.wantCode == http.StatusCreated {
				data, ok := response["data"].(map[string]interface{})
				assert.True(t, ok)
				assert.Equal(t, test.input.Slug, data["slug"])
				assert.Equal(t, test.input.Name, data["name"])
				assert.Equal(t, test.input.Description, data["description"])

				var savedCategory models.ProductCategory
				result := testDB.DB.Where("slug = ?", test.input.Slug).First(&savedCategory)
				assert.NoError(t, result.Error)
				assert.Equal(t, test.input.Name, savedCategory.Name)

				if test.input.ParentID != nil {
					assert.Equal(t, *test.input.ParentID, *savedCategory.ParentID)
				}
			}
		})
	}

}

func TestUpdateCategory(t *testing.T) {
	e := echo.New()

	config := config.Initialize()

	sessionStore := sessions.NewCookieStore([]byte(config.SESSIONS_KEY), []byte(config.HASH_KEY))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.Secure = true

	testDB := db.SetupTestDB(t)
	defer db.CleanupTestDB(t, testDB)

	h := &Handlers{
		DB:           testDB.DB,
		SessionStore: sessionStore,
	}

	// Create initial categories
	categories := []models.ProductCategory{
		{
			Name:        "Special Keyboards",
			Slug:        "special-keyboards",
			Description: "Special Keyboards",
		},
		{
			Name:        "Switches",
			Slug:        "switches",
			Description: "Switches",
		},
	}

	for _, category := range categories {
		assert.NoError(t, testDB.DB.Create(&category).Error)
	}

	var parentID int64 = 1

	tests := []struct {
		name     string
		slug     string
		input    models.ProductCategory
		wantCode int
	}{
		{
			name: "Invalid Slug Parameter",
			slug: "",
			input: models.ProductCategory{
				Name:        "Updated Mechanical Keyboards",
				Slug:        "mechanical-keyboards-updated",
				Description: "Updated description",
			},
			wantCode: http.StatusBadRequest,
		},
		{
			name: "Category Not Found",
			slug: "nonexistent",
			input: models.ProductCategory{
				Name:        "Nonexistent",
				Slug:        "nonexistent-updated",
				Description: "This doesn't exist",
			},
			wantCode: http.StatusNotFound,
		},
		{
			name: "Invalid Input - Missing Required Field",
			slug: "special-keyboards",
			input: models.ProductCategory{
				Slug:        "mechanical-keyboards-updated",
				Description: "Updated description",
			},
			wantCode: http.StatusBadRequest,
		},
		{
			name: "Valid Update",
			slug: "special-keyboards",
			input: models.ProductCategory{
				Name:        "Updated Special Keyboards",
				Slug:        "special-keyboards-updated",
				Description: "Updated special keyboard devices",
			},
			wantCode: http.StatusOK,
		},
		{
			name: "Add Parent Relationship",
			slug: "switches",
			input: models.ProductCategory{
				Name:        "Custom Switches",
				Slug:        "custom-switches",
				Description: "Custom switch items",
				ParentID:    &parentID,
			},
			wantCode: http.StatusOK,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payloadBytes, err := json.Marshal(test.input)
			assert.NoError(t, err)

			req := httptest.NewRequest(http.MethodPut, "/categories/"+test.slug, bytes.NewReader(payloadBytes))
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			c.SetParamNames("slug")
			c.SetParamValues(test.slug)

			err = h.UpdateCategory(c)
			assert.NoError(t, err)
			assert.Equal(t, test.wantCode, rec.Code)

			var response map[string]interface{}
			assert.NoError(t, json.Unmarshal(rec.Body.Bytes(), &response))

			if test.wantCode == http.StatusOK {
				data, ok := response["data"].(map[string]interface{})
				assert.True(t, ok)
				assert.Equal(t, test.input.Slug, data["slug"])
				assert.Equal(t, test.input.Name, data["name"])
				assert.Equal(t, test.input.Description, data["description"])

				var updatedCategory models.ProductCategory
				result := testDB.DB.Where("slug = ?", test.input.Slug).First(&updatedCategory)
				assert.NoError(t, result.Error)
				assert.Equal(t, test.input.Name, updatedCategory.Name)

				if test.input.ParentID != nil {
					assert.Equal(t, *test.input.ParentID, *updatedCategory.ParentID)
				}
			}
		})
	}

}
