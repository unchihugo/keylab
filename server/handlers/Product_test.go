package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"

	"testing"

	db "keylab/database"
	"keylab/database/models"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func setupProductTest(t *testing.T) (*Handlers, *db.TestDB, models.Product) {
	testDB := db.SetupTestDB(t)

	category := models.ProductCategory{
		Name: "Electronics",
	}
	assert.NoError(t, testDB.DB.Create(&category).Error)

	product := models.Product{
		Name:        "Sample Product",
		Slug:        "sample-product",
		Description: "This is a sample product",
		Price:       49.99,
		CategoryID:  category.ID,
		Stock:       10,
	}
	assert.NoError(t, testDB.DB.Create(&product).Error)

	h := &Handlers{DB: testDB.DB}
	return h, testDB, product
}

func TestListProducts(t *testing.T) {
	h, testDB, _ := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/products", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := h.ListProducts(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestGetProductBySlug(t *testing.T) {
	h, testDB, product := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/products/sample-product", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("slug")
	c.SetParamValues(product.Slug)

	err := h.GetProductBySlug(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestCreateProduct(t *testing.T) {
	h, testDB, _ := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	_ = writer.WriteField("name", "New Product")
	_ = writer.WriteField("slug", "new-product")
	_ = writer.WriteField("description", "New Product Description")
	_ = writer.WriteField("price", "99.99")
	_ = writer.WriteField("category_id", "1")
	_ = writer.WriteField("stock", "10")

	imagePart, _ := writer.CreateFormFile("product_images", "test.png")
	_, _ = imagePart.Write([]byte("fake image content"))
	writer.Close()

	req := httptest.NewRequest(http.MethodPost, "/products", body)
	req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := h.CreateProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)
}

func TestUpdateProduct(t *testing.T) {
	h, testDB, product := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	product.Name = "Updated Product"
	updated := models.Product{
		ID:          product.ID,
		Name:        "Updated Product",
		Slug:        product.Slug,
		Description: product.Description,
		Price:       product.Price,
		Stock:       product.Stock,
		CategoryID:  product.CategoryID,
	}
	body, _ := json.Marshal(updated)

	req := httptest.NewRequest(http.MethodPut, fmt.Sprintf("/products/%d", product.ID), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(product.ID))

	err := h.UpdateProduct(c)
	if rec.Code != http.StatusOK {
		t.Log("Response Body:", rec.Body.String())
	}
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestDeleteProduct(t *testing.T) {
	h, testDB, product := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/products/%d", product.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues(fmt.Sprint(product.ID))

	err := h.DeleteProduct(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestSearchProducts(t *testing.T) {
	h, testDB, _ := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/products/search/sample", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("query")
	c.SetParamValues("sample")

	err := h.SearchProducts(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestGetProductImage(t *testing.T) {
	h := &Handlers{}
	e := echo.New()

	dir := "public/images"
	filePath := filepath.Join(dir, "test-image.jpg")
	_ = os.MkdirAll(dir, os.ModePerm)
	_ = os.WriteFile(filePath, []byte("fake image content"), 0644)
	defer os.Remove(filePath)

	req := httptest.NewRequest(http.MethodGet, "/products/image/test-image.jpg", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("path")
	c.SetParamValues("test-image.jpg")

	err := h.GetProductImage(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestUploadProductImages(t *testing.T) {
	h, testDB, product := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	e := echo.New()
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	fileWriter, _ := writer.CreateFormFile("product_images", "test.png")
	_, _ = fileWriter.Write([]byte("fake image content"))
	writer.Close()

	req := httptest.NewRequest(http.MethodPost, fmt.Sprintf("/products/%s/image", product.Slug), body)
	req.Header.Set(echo.HeaderContentType, writer.FormDataContentType())
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("slug")
	c.SetParamValues(product.Slug)

	err := h.UploadProductImages(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestDeleteProductImage(t *testing.T) {
	h, testDB, product := setupProductTest(t)
	defer db.CleanupTestDB(t, testDB)

	image := models.ProductImage{
		ProductID: product.ID,
		Image:     "test-delete.png",
	}
	assert.NoError(t, testDB.DB.Create(&image).Error)

	dir := "public/images/product_images"
	_ = os.MkdirAll(dir, os.ModePerm)
	_ = os.WriteFile(filepath.Join(dir, image.Image), []byte("fake"), 0644)

	e := echo.New()
	req := httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/products/%s/image/%d", product.Slug, image.ID), nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("slug", "id")
	c.SetParamValues(product.Slug, fmt.Sprint(image.ID))

	err := h.DeleteProductImage(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}
