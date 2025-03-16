package handlers

import (
	"bytes"
	"encoding/json"
	"keylab/config"
	db "keylab/database"
	"keylab/database/models"
	"keylab/utils"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestLogin(t *testing.T) {
	e := echo.New()

	config := config.Initialize()

	sessionStore := sessions.NewCookieStore([]byte(config.SESSIONS_KEY), []byte(config.HASH_KEY))
	sessionStore.Options.HttpOnly = true
	sessionStore.Options.Secure = true

	testDB := db.SetupTestDB(t)
	defer db.CleanupTestDB(t, testDB)

	var hashed string
	var err error

	if hashed, err = utils.HashPassword("P@ssw0rd$ecure2024!"); err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	validUser := models.User{
		Forename:    "Valid",
		Surname:     "User",
		Email:       "valid@example.com",
		Password:    hashed,
		PhoneNumber: "+12345678901",
		RoleID:      1,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := testDB.DB.Create(&validUser).Error; err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}

	h := &Handlers{
		DB:           testDB.DB,
		SessionStore: sessionStore,
	}

	tests := []struct {
		name  string
		input models.User
		want  int
	}{
		{
			name: "Empty Email and Password",
			input: models.User{
				Email:    "",
				Password: "",
			},
			want: http.StatusBadRequest,
		},
		{
			name: "Invalid Email Format",
			input: models.User{
				Email:    "invalid-email",
				Password: "Password123",
			},
			want: http.StatusBadRequest,
		},
		{
			name: "Valid Email but Empty Password",
			input: models.User{
				Email:    "valid@example.com",
				Password: "",
			},
			want: http.StatusBadRequest,
		},
		{
			name: "Valid Email but Short Password",
			input: models.User{
				Email:    "valid@example.com",
				Password: "short",
			},
			want: http.StatusBadRequest,
		},
		{
			name: "Non-existent User",
			input: models.User{
				Email:    "nonexistent@example.com",
				Password: "P@ssw0rd$ecure2024!",
			},
			want: http.StatusUnauthorized,
		},
		{
			name: "Valid User but Wrong Password",
			input: models.User{
				Email:    "valid@example.com",
				Password: "WrongPassword123!",
			},
			want: http.StatusUnauthorized,
		},
		{
			name: "Successful Login",
			input: models.User{
				Email:    "valid@example.com",
				Password: "P@ssw0rd$ecure2024!",
			},
			want: http.StatusOK,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payloadBytes, err := json.Marshal(test.input)
			if err != nil {
				t.Fatalf("Failed to marshal payload: %v", err)
			}

			req := httptest.NewRequest(http.MethodPost, "/auth/login", bytes.NewReader(payloadBytes))
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)

			err = h.Login(c)

			if err != nil {
				t.Errorf("Handler returned an error: %v", err)
			}

			if rec.Code != test.want {
				t.Logf("Response body: %s", rec.Body.String())
				t.Logf("Expected status: %d, Got status: %d", test.want, rec.Code)

				if rec.Code == http.StatusInternalServerError {
					var resp map[string]interface{}
					if json.Unmarshal(rec.Body.Bytes(), &resp) == nil {
						t.Logf("Error details: %v", resp)
					}
				}
			}

			assert.Equal(t, test.want, rec.Code, "Expected status code %d, got %d", test.want, rec.Code)
		})
	}
}
