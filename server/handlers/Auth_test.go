package handlers

import (
	"bytes"
	"encoding/json"
	db "keylab/database"
	"keylab/database/models"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func TestLogin(t *testing.T) {
	e := echo.New()
	sessionStore := sessions.NewCookieStore([]byte("test-secret"))
	db.InitDB()

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
				Email:    "mikey.d.tilley@gmail.com",
				Password: "willfailfornow",
			},
			want: http.StatusUnauthorized,
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

			handler := Login(sessionStore)
			err = handler(c)

			if err != nil {
				t.Errorf("Handler returned an error: %v", err)
			}

			if rec.Code != test.want {
				t.Errorf("Expected status code %d, got %d", test.want, rec.Code)
			}

			var response map[string]interface{}
			if err := json.Unmarshal(rec.Body.Bytes(), &response); err == nil {
				t.Logf("Response: %v", response)
			}
		})
	}
}
