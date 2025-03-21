package handlers

import (
	"keylab/database/models"

	"github.com/labstack/echo/v4"
)

func (h *Handlers) ContactUs(c echo.Context) error {
	var ContactUsRequest models.ContactUsRequest

	if err := c.Bind(&ContactUsRequest); err != nil {
		return jsonResponse(c, 400, "Invalid contact us request")
	}

	if err := ContactUsRequest.Validate(); err != nil {
		return jsonResponse(c, 400, err.Error())
	}

	if err := h.DB.Create(&ContactUsRequest).Error; err != nil {
		return jsonResponse(c, 500, "Failed to save contact us request")
	}

	return jsonResponse(c, 200, "Contact us request saved successfully", ContactUsRequest)
}
