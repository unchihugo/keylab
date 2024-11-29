package handlers

import(
	db "keylab/database"
	"keylab/database/models"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)
//status 200 = http.StatusOK, status 201 = http.StatusCreated, status 404 = http.StatusNotFound, status 500 = http.StatusInternalServerError

//1. Fetching a specific review GET
// fetch specific review by id, 
//returns status 200 if success, returns status 404 if no revs found, returns status 500 if error

func GetSpecificReview(c echo.Context) error {
	var reviews models.ProductReviews
	id := c.Param("id")

	if err := db.DB.First(&review, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c, http.StatusNotFound, "Review not found")
		}
		log.Printf("Error fetching a review by ID: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching review")
		}

		return jsonResponse(c, http.StatusOK, "Review fetched successfully", review)
	}

//2. Fetching reviews by user GET
// will fetch all reviews written by specific user
// returns status 200 if succ, returns status404 if no revs found, returns status 500 if error

func GetReviewByUser(c echo.Context) error {
	var reviews []models.ProductReviews
	userID := c.Param("user_id")

	if err := db.DB.Where("user_id = ?", userID).Find(&reviews).Error; err != nil {
		log.Printf("Error fetching reviews by user: %v", err)
		return jsonResponse(c,http.StatusInternalServerError, "Error fetching reviews by user")
	}
	if len(reviews) == 0 {
		return jsonResponse(c,http.StatusNotFound, "No reviews can be found for this user")

	}
	return jsonResponse(c, http.StatusOK, "Rewviews found", reviews)
}
//3. Fetching reviews by product GET
// will fetch all reviews for specific products
// returns status 200 if succ, returns status404 if no revs found, returns status 500 if error

func GetReviewsByProduct(c echo.Context) error {
	var reviews []models.ProductReviews
	productID := c.Param("product_id")

	if err := db.DB.Where("product_id = ?", productID).Find(&reviews).Error; err != nil {
		log.Printf("Error fetching reviews by product: %v", err)
		return jsonResponse(c,http.StatusInternalServerError, "Error fetching reviews by product")
	}
	if len(reviews) == 0 {
		return jsonResponse(c,http.StatusNotFound,"No reviews found for this product")

	}
	return jsonResponse(c,http.StatusOK, "Reviews found", reviews)
}
//4. Fetching all reviews (optional parameter for amount?) GET

func GetAllReviews (c echo.Context) error {
	var reviews []models.ProductReviews
	limit := c.QueryParam("limit")

}
//5. Create reviews POST
// will create new review in db, validates data inputed
// returns status 201 if succ, returns status404 if no revs found, returns status 500 if error

func CreateReview(c echo.Context) error {
	var review models.ProductReviews 

	if err := c.Bind(&review); err != nil {
		return jsonResponse(c,http.StatusBadRequest, "Invalid input for creating a review")
	}

	if err := db.DB.Create(&review).Error; err != nil {
		log.Printf("Error creating review: %v", err)
		return jsonResponse(c,http.StatusInternalServerError, "Error creating a review")
	}
	return jsonResponse(c,http.StatusCreated,"Review created", review)
}
//6. Delete reviews DELETE
// will delete review by id 
//returns status 200 if succ, returns status404 if no revs found, returns status 500 if error

func DeleteReview(c echo.Context) error {
	var review models.ProductReviews

	if err := db.DB.First(&review, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c,http.StatusNotFound, "Review not found")
		}
		log.Printf("Error fetching review to delete: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching review")
	}

	if err := db.DB.Delete(&review).Error; err != nil {
		log.Printf("Error deleting review: %v", err)
		return jsonResponse(c,http.StatusInternalServerError, "Error deleting review")
	}
	return jsonResponse(c,http.StatusOK,"review deleted", review)

}
//7. Update reviews PUT
// will update review that already exists, validates data inputed,
// returns status 200 if succ, returns status404 if no revs found, returns status 500 if error

func UpdateReview(c echo.Context) error {
	var review models.ProductReviews
	id := c.Param("id")

	if err := db.DB.First(&review, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return jsonResponse(c,http.StatusNotFound, "Review not found")
		}
		log.Printf("Error fetching review for update: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error fetching review")
	}
	if err := c.Bind(&review); err != nil {
		return jsonResponse(c,http.StatusBadRequest, "Invalid input updating review")
	}
	if err := db.DB.Save(&review).Error; err != nil {
		log.Printf("Error updating review: %v", err)
		return jsonResponse(c, http.StatusInternalServerError, "Error updating review")
	}

	return jsonResponse (c,http.StatusOK, "Review updated", review)
}

