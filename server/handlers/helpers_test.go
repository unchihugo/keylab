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
		result, err := convertToInt64(test.input)
		if test.isError {
			assert.Error(t, err)
		} else {
			assert.NoError(t, err)
			assert.Equal(t, test.expected, result)
		}
	}
}

func TestGeneratePaginationResponse(t *testing.T) {
	result := generatePaginationResponse(2, 10, 50)
	assert.Equal(t, 2, result["page"])
	assert.Equal(t, 10, result["per_page"])
	assert.Equal(t, 50, result["total"])
}

func TestGetSortOrder(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/?sort=name&direction=asc", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	order := getSortOrder(c)
	assert.Equal(t, "name asc", order)

	req = httptest.NewRequest(http.MethodGet, "/", nil)
	rec = httptest.NewRecorder()
	c = e.NewContext(req, rec)

	order = getSortOrder(c)
	assert.Equal(t, "created_at desc", order)
}
