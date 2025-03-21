package utils

import (
	"fmt"
	"time"
)

func GenerateUniqueFilename(ext string) string {
	timestamp := time.Now().UnixNano()
	return fmt.Sprintf("%d%s", timestamp, ext)
}
