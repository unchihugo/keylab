package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)


func TestConvertToInt64(t *testing.T) {
	tests := []struct {
		input    string
		expected int64
		isError  bool
	}{
		{"123", 123, false},
		{"-456", -456, false},
		{"abc", 0, true},
		{"", 0, true},
	}

	for _, test := range tests {
		result, err := convertToInt64(test.input) // ✅ Call function directly (since it's in the same package)
		if test.isError {
			assert.Error(t, err, "Expected an error but got none")
		} else {
			assert.NoError(t, err, "Expected no error but got one")
			assert.Equal(t, test.expected, result, "Mismatch in expected and actual values")
		}
	}
}


func TestGeneratePaginationResponse(t *testing.T) {
	result := generatePaginationResponse(2, 10, 50) 

	assert.Equal(t, 2, result["page"], "Page number mismatch")
	assert.Equal(t, 10, result["per_page"], "Per page value mismatch")
	assert.Equal(t, 50, result["total"], "Total value mismatch")
}


func TestGetSortOrder(t *testing.T) {
	e := echo.New()


	req := httptest.NewRequest(http.MethodGet, "/?sort=name&direction=asc", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	order := getSortOrder(c)
	assert.Equal(t, "name asc", order, "Sort order mismatch")

	req = httptest.NewRequest(http.MethodGet, "/", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	order = getSortOrder(c) 
	assert.Equal(t, "created_at desc", order, "Default sort order mismatch")
}
