package handlers

import (
	"bytes"
	"encoding/json"
	db "keylab/database"
	"keylab/database/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func setupContactHandler(t *testing.T) (*Handlers, *db.TestDB) {
	testDB := db.SetupTestDB(t)
	h := &Handlers{DB: testDB.DB}
	return h, testDB
}

func TestContactUs(t *testing.T) {
	h, testDB := setupContactHandler(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()

	t.Run("Valid Contact Request", func(t *testing.T) {
		contact := models.ContactUsRequest{
			Forename:    "John",
			Surname:     "Doe",
			Email:       "john@example.com",
			PhoneNumber: "+1234567890",
			Message:     "Hello, this is a test message",
		}
		body, _ := json.Marshal(contact)

		req := httptest.NewRequest(http.MethodPost, "/contact", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := h.ContactUs(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
	})

	t.Run("Invalid JSON Body", func(t *testing.T) {
		invalidBody := []byte(`{"invalid":}`)
		req := httptest.NewRequest(http.MethodPost, "/contact", bytes.NewReader(invalidBody))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := h.ContactUs(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})

	t.Run("Validation Error - Missing Fields", func(t *testing.T) {
		contact := models.ContactUsRequest{
			Forename:    "",
			Surname:     "",
			Email:       "not-an-email",
			PhoneNumber: "",
			Message:     "",
		}
		body, _ := json.Marshal(contact)

		req := httptest.NewRequest(http.MethodPost, "/contact", bytes.NewReader(body))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := h.ContactUs(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})
}
