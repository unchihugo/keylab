package handlers

import (
	db "keylab/database"
	"keylab/database/models"
	"keylab/repositories"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Reviews By User [GET /products/:product_slug/reviews/users/:user_id/reviews]
// 1. Fetches user id from params and converts it to int64.
// 2. Checks if user exists in the database.
// 3. Fetches reviews by user from the database.
// 4. Returns status 200 with the reviews if successful.
// 5. Returns status 404 if no reviews are found.
// 6. Returns status 500 if an error occurs.

func GetReviewByUser(c echo.Context) error {
	var reviews []models.ProductReviews
	var user models.User

	userID, err := convertToInt64(c.Param("user_id"))
	if err != nil {
		log.Printf("Error converting user ID to int64: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	user, err = repositories.FindUserByID(userID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Cannot find user with that ID")
	}

	reviews, err = repositories.GetReviewByUserID(user.ID)
	if err != nil || len(reviews) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No reviews found for this user")
	}

	return jsonResponse(c, http.StatusOK, "Reviews found", reviews)
}

// Get Reviews For Product [GET /products/:product_slug/reviews]
// 1. Gets product slug from params and validates it
// 2. Fetches product by slug from the database
// 3. Fetches reviews by product from the database
// 4. Returns status 200 with the reviews if successful
// 5. Returns status 404 if no reviews are found
// 6. Returns status 500 if an error occurs

func GetReviewsByProduct(c echo.Context) error {
	var reviews []models.ProductReviews
	var product models.Product

	productSlug := c.Param("product_slug")
	product, err := repositories.GetProductBySlug(productSlug)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Cannot find product with that slug")
	}

	reviews, err = repositories.GetReviewsByProductID(product.ID)
	if err != nil || len(reviews) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No reviews found for this product")
	}

	return jsonResponse(c, http.StatusOK, "Reviews found", reviews)
}

// Get Reviews By User [GET /products/:product_slug/reviews/users/:user_id/reviews]
// 1. Fetches user id from params and converts it to int64.
// 2. Checks if user exists in the database.
// 3. Fetches reviews by user from the database.
// 4. Returns status 200 with the reviews if successful.
// 5. Returns status 404 if no reviews are found.
// 6. Returns status 500 if an error occurs.

func GetReviewsByUser(c echo.Context) error {
	var reviews []models.ProductReviews
	var user models.User

	userID, err := convertToInt64(c.Param("user_id"))
	if err != nil {
		log.Printf("Error converting user ID to int64: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid user ID")
	}

	user, err = repositories.FindUserByID(userID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Cannot find user with that ID")
	}

	reviews, err = repositories.GetReviewByUserID(user.ID)
	if err != nil || len(reviews) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No reviews found for this user")
	}

	return jsonResponse(c, http.StatusOK, "Reviews found", reviews)
}

// Get Review [GET /products/:product_slug/reviews/:id]
// 1. Fetches review by ID and validates it.
// 2. Fetches reviews by ID from the database.
// 3. Returns status 200 with the review if successful.
// 4. Returns status 404 if the review is not found.

func GetReview(c echo.Context) error {
	var review models.ProductReviews

	productSlug := c.Param("product_slug")
	reviewID, err := convertToInt64(c.Param("id"))
	if err != nil {
		log.Printf("Error converting review ID to int64: %v", err)
		return jsonResponse(c, http.StatusBadRequest, "Invalid review ID")
	}

	product, err := repositories.GetProductBySlug(productSlug)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	if product.ID == 0 {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	review, err = repositories.GetReviewByID(reviewID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Review not found")
	}

	return jsonResponse(c, http.StatusOK, "Review found", review)
}

// Get Review Statistics [GET /products/:product_slug/reviews/statistics]
// 1. Fetches product by slug and validates it.
// 2. Fetches reviews by product from the database.
// 3. Calculates the total number of reviews and average rating.
// 4. Returns status 200 with the review statistics if successful.
// 5. Returns status 404 if no reviews are found.
// 6. Returns status 500 if an error occurs.

func GetReviewStatistics(c echo.Context) error {
	var reviews []models.ProductReviews
	var product models.Product

	slug := c.Param("product_slug")
	if err := product.Validate(slug); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid product slug")
	}

	product, err := repositories.GetProductBySlug(slug)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	reviews, err = repositories.GetReviewsByProductID(product.ID)
	if err != nil || len(reviews) == 0 {
		return jsonResponse(c, http.StatusNotFound, "No reviews found for this product")
	}

	var (
		totalReviews = len(reviews)
		averageRating float64
	)

	for _, review := range reviews {
		averageRating += float64(review.Rating)
	}
	averageRating = averageRating / float64(totalReviews)

	reviewStatistics := map[string]interface{}{
		"total_reviews":  totalReviews,
		"average_rating": averageRating,
	}

	return jsonResponse(c, http.StatusOK, "Review statistics", reviewStatistics)
}

// Create Review [POST /products/:product_slug/reviews]
// 1. Binds the request body to the review struct.
// 2. Validates the review input.
// 3. Validates the product slug.
// 4. Validates that the user has not already reviewed the product.
// 5. Creates the review in the database.
// 6. Returns status 200 if the review is created successfully.
// 7. Returns status 404 if the product is not found.
// 8. Returns status 400 if invalid input is provided.
// 9. Returns status 500 if an error occurs.

func CreateReview(c echo.Context) error {
	var review models.ProductReviews
	var product models.Product

	if err := c.Bind(&review); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input creating review", err.Error())
	}

	if err := review.Validate(); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	productSlug := c.Param("product_slug")
	if err := product.Validate(productSlug); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid product slug")
	}

	product, err := repositories.GetProductBySlug(productSlug)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Product not found")
	}

	review.ProductID = product.ID

	user := c.Get("user").(models.User)
	review.UserID = user.ID

	var existingReview models.ProductReviews
	if err := db.DB.Where("product_id = ? AND user_id = ?", review.ProductID, review.UserID).First(&existingReview).Error; err == nil {
		return jsonResponse(c, http.StatusBadRequest, "User has already reviewed this product")
	}

	if err := db.DB.Create(&review).Error; err != nil {
		log.Printf("Error creating review: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error creating review")
	}

	if err := db.DB.Preload("Product").Preload("Product.Category").First(&review, review.ID).Error; err != nil {
		log.Printf("Error fetching created review with related data: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching related data for created review")
	}

	return jsonResponse(c, http.StatusOK, "Review created successfully!", review)
}

// Update Review Handler [PUT /reviews/:id]
// 1. Fetches review by ID and validates it.
// 2. Validates that the logged-in user is the one who created the review.
// 3. Updates review fields based on input.
// 4. Returns status 200 if the update is successful.
// 5. Returns status 404 if the review is not found.
// 6. Returns status 400 if invalid input is provided.
// 7. Returns status 500 if an error occurs.

func UpdateReview(c echo.Context) error {
	var review models.ProductReviews

	reviewID, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid review ID")
	}

	review, err = repositories.GetReviewByID(reviewID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Review not found")
	}

	user := c.Get("user").(models.User)
	if review.UserID != user.ID {
		return jsonResponse(c, http.StatusForbidden, "You are not authorized to update this review")
	}

	if err := c.Bind(&review); err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid input updating review", err.Error())
	}

	if err := review.Validate("Rating", "Comment"); err != nil {
		return jsonResponse(c, http.StatusBadRequest, err.Error())
	}

	if err := db.DB.Save(&review).Error; err != nil {
		log.Printf("Error updating review: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error updating review")
	}

	return jsonResponse(c, http.StatusOK, "Review updated successfully", review)
}

// Delete Review Handler [DELETE /reviews/:id]
// 1. Fetches review by ID and validates it.
// 2. Validates that the logged-in user is the one who created the review.
// 3. Deletes the review from the database.
// 4. Returns status 200 if the deletion is successful.
// 5. Returns status 404 if the review is not found.
// 6. Returns status 500 if an error occurs.

func DeleteReview(c echo.Context) error {
	var review models.ProductReviews

	reviewID, err := convertToInt64(c.Param("id"))
	if err != nil {
		return jsonResponse(c, http.StatusBadRequest, "Invalid review ID")
	}

	review, err = repositories.GetReviewByID(reviewID)
	if err != nil {
		return jsonResponse(c, http.StatusNotFound, "Review not found")
	}

	user := c.Get("user").(models.User)
	if review.UserID != user.ID {
		return jsonResponse(c, http.StatusForbidden, "You are not authorized to delete this review")
	}

	if err := db.DB.Delete(&review).Error; err != nil {
		log.Printf("Error deleting review: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error deleting review")
	}

	return jsonResponse(c, http.StatusOK, "Review deleted successfully", review)
}
