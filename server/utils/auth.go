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
	lowerCase := regexp.MustCompile("[a-z]")
	upperCase := regexp.MustCompile("[A-Z]")
	digit := regexp.MustCompile("[0-9]")

	return lowerCase.MatchString(password) && upperCase.MatchString(password) && digit.MatchString(password), nil
}
