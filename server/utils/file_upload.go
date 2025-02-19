package utils

import (
	"fmt"
	"os"
	"time"
)

func GenerateUniqueFilename(ext string) string {
	timestamp := time.Now().UnixNano()
	return fmt.Sprintf("%d%s", timestamp, ext)
}

func GetBaseURL() string {
	serverURL := os.Getenv("SERVER_URL")
	serverPort := os.Getenv("SERVER_PORT")
	return fmt.Sprintf("%s:%s", serverURL, serverPort)
}
