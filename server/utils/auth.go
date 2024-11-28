package utils

import (
	"regexp"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)

	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}

func ComparePasswordHash(password string, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func ValidatePassword(password string) (bool, error) {
	passwordRegex := `^.*[a-z].*[A-Z].*\d.*$`
	matched, err := regexp.MatchString(passwordRegex, password)

	if err != nil {
		return false, err
	}

	return matched, nil
}
