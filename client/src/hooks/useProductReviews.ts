/** @format */

import { useState, useEffect } from "react"
import { ProductReview, ReviewStatistics } from "../types/ProductReview"
import { reviewService } from "../services/reviewService"
import { validateReview } from "../lib/formValidation"

export const useProductReviews = (productId: number) => {
	const [reviews, setReviews] = useState<ProductReview[]>([])
	const [statistics, setStatistics] = useState<ReviewStatistics | null>(null)
	const [userReview, setUserReview] = useState<ProductReview | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formErrors, setFormErrors] = useState<string[]>([])
	
	// get all reviews for a product
	const fetchReviews = async () => {
		if (!productId) return
		
		try {
			setLoading(true)
			const reviewsData = await reviewService.getReviewsByProduct(productId)
			setReviews(reviewsData)
			
			// calculate review statistics manually (discussed, should be changed later)
			if (reviewsData && reviewsData.length > 0) {
				const totalReviews = reviewsData.length
				let sum = 0
				const distribution: { [key: number]: number } = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
				
				reviewsData.forEach((review: ProductReview) => {
					sum += review.rating;
					distribution[review.rating] = (distribution[review.rating] || 0) + 1;
				});
				
				const avgRating = sum / totalReviews
				
				setStatistics({
					average_rating: avgRating,
					total_reviews: totalReviews,
					rating_distribution: distribution
				})
			}
			
		} catch (error) {
			setError(error instanceof Error ? error.message : "Failed to fetch reviews")
		} finally {
			setLoading(false)
		}
	}
	
	// submit a new review
	const submitReview = async (review: { rating: number; comment: string }) => {
		try {
			setLoading(true)
			setFormErrors([])
			
			// validate review
			const errors = validateReview(review)
			if (errors.length > 0) {
				setFormErrors(errors)
				return null
			}
			
			const newReview = await reviewService.createReview(productId, review)
			setUserReview(newReview)
			
			// refresh reviews after submitting
			await fetchReviews()
			return newReview
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : "Failed to submit review"
			setError(errorMsg)
			setFormErrors([errorMsg])
			return null
		} finally {
			setLoading(false)
		}
	}
	
	// delete a review
	const deleteReview = async (reviewId: number) => {
		try {
			setLoading(true)
			await reviewService.deleteReview(reviewId)
			
			// remove locally
			setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId))
			if (userReview?.id === reviewId) {
				setUserReview(null)
			}
			
			await fetchReviews()
			return true
		} catch (error) {
			setError(error instanceof Error ? error.message : "Failed to delete review")
			return false
		} finally {
			setLoading(false)
		}
	}
		
	// fetch reviews on mount or when productId changes
	useEffect(() => {
		if (productId) {
			fetchReviews()
		}
	}, [productId])

	return { 
		reviews, 
		statistics, 
		userReview,
		loading, 
		error, 
		formErrors,
		fetchReviews,
		submitReview,
		deleteReview
	}
}
