package handlers

// func ContactUs(c echo.Context) error {
// 	var ContactUsRequest models.ContactUsRequest

// 	if err := c.Bind(&ContactUsRequest); err != nil {
// 		return jsonResponse(c, 400, "Invalid contact us request")
// 	}

// 	if err := ContactUsRequest.Validate(); err != nil {
// 		return jsonResponse(c, 400, err.Error())
// 	}

// 	if err := db.DB.Create(&ContactUsRequest).Error; err != nil {
// 		return jsonResponse(c, 500, "Failed to save contact us request")
// 	}

// 	return jsonResponse(c, 200, "Contact us request saved successfully", ContactUsRequest)
// }
