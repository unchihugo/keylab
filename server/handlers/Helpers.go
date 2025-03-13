package handlers

import (
	"fmt"
	"io"
	"keylab/utils"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func jsonResponse(c echo.Context, httpCode int, message string, data ...interface{}) error {
	response := echo.Map{
		"message": message,
	}

	if len(data) > 0 && data[0] != nil {
		response["data"] = data[0]
	} else {
		response["data"] = []string{}
	}

	return c.JSON(httpCode, response)
}

func initiateSession(session *sessions.Session, userID int64) {
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
		Secure:   true,
	}

	session.Values["user_id"] = userID
}

func convertToInt64(value string) (int64, error) {
	intValue, err := strconv.ParseInt(value, 10, 64)

	if err != nil {
		return 0, err
	}

	return intValue, nil
}

func getPaginationParams(c echo.Context) (int, int, int) {
	page, err := strconv.Atoi(c.QueryParam("page"))
	if err != nil || page < 1 {
		page = 1
	}

	perPage, err := strconv.Atoi(c.QueryParam("per_page"))
	if err != nil || perPage < 1 {
		perPage = 50
	}

	return page, perPage, (page - 1) * perPage
}

func generatePaginationResponse(page, perPage, total int) map[string]interface{} {
	return map[string]interface{}{
		"page":     page,
		"per_page": perPage,
		"total":    total,
	}
}

func getSortOrder(c echo.Context) string {
	sortField := c.QueryParam("sort")
	sortDirection := c.QueryParam("direction")

	if sortField == "" {
		sortField = "created_at"
	}

	if sortDirection == "" {
		sortDirection = "desc"
	}

	return fmt.Sprintf("%s %s", sortField, sortDirection)
}

func uploadImages(c echo.Context, formField string, destination string, allowedExtensions []string) ([]map[string]interface{}, error) {
	var uploadedFiles []map[string]interface{}

	files, err := c.MultipartForm()
	if err != nil {
		return nil, fmt.Errorf("Failed to parse multipart form: %v", err)
	}

	fileHeaders := files.File[formField]
	if len(fileHeaders) == 0 {
		return nil, fmt.Errorf("No files uploaded")
	}

	if err := os.MkdirAll(destination, os.ModePerm); err != nil {
		return nil, fmt.Errorf("Failed to create destination directory: %v", err)
	}

	allowedExtensionsMap := make(map[string]bool)
	for _, ext := range allowedExtensions {
		allowedExtensionsMap[strings.ToLower(ext)] = true
	}

	for _, fileHeader := range fileHeaders {
		extension := strings.ToLower(filepath.Ext(fileHeader.Filename))
		if !allowedExtensionsMap[extension] {
			return nil, fmt.Errorf("File type not allowed: %s", extension)
		}

		filename := utils.GenerateUniqueFilename(extension)
		destinationPath := filepath.Join(destination, filename)

		src, err := fileHeader.Open()
		if err != nil {
			return nil, fmt.Errorf("Failed to open source file: %v", err)
		}
		defer src.Close()

		dst, err := os.Create(destinationPath)
		if err != nil {
			return nil, fmt.Errorf("Failed to create destination file: %v", err)
		}
		defer dst.Close()

		if _, err := io.Copy(dst, src); err != nil {
			return nil, fmt.Errorf("Failed to copy content to destination: %v", err)
		}

		baseURL := utils.GetBaseURL()
		fileURL := fmt.Sprintf("%s/uploads/%s", baseURL, filename)

		uploadedFiles = append(uploadedFiles, map[string]interface{}{
			"filename": filename,
			"url":      fileURL,
		})
	}

	return uploadedFiles, nil
}

func deleteImage(imagePath string) error {
	fmt.Println("imagePath", imagePath)
	if err := os.Remove(imagePath); err != nil && !os.IsNotExist(err) {
		log.Printf("Failed to delete image file: %s, error: %v", imagePath, err)
	}

	return nil
}
