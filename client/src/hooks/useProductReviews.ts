/** @format */

import { useState, useEffect, useCallback } from "react"
import { ProductReview, ReviewStatistics } from "../types/ProductReview"
import { reviewService } from "../services/reviewService"
import { validateReview } from "../lib/formValidation"

export const useProductReviews = (slug: string) => {
	const [reviews, setReviews] = useState<ProductReview[]>([])
	const [statistics, setStatistics] = useState<ReviewStatistics | null>(null)
	const [userReview, setUserReview] = useState<ProductReview | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formErrors, setFormErrors] = useState<string[]>([])

	// get all reviews for a product
	const fetchReviews = useCallback(async () => {
		if (!slug) return

		try {
			setLoading(true)
			const reviewsData = await reviewService.getReviewsByProduct(slug)
			setReviews(reviewsData.data)
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to fetch reviews",
			)
			setReviews([])
		} finally {
			setLoading(false)
		}
	}, [slug])

	const fetchStatistics = useCallback(async () => {
		if (!slug) return

		try {
			setLoading(true)
			const statsData = await reviewService.getReviewStatistics(slug)
			console.log(statsData)
			setStatistics(statsData.data)
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to fetch review statistics",
			)
			setStatistics(null)
		} finally {
			setLoading(false)
		}
	}, [slug])

	const fetchUserReview = useCallback(async () => {
		if (!slug) return

		try {
			setLoading(true)
			const userReviewData = await reviewService.getReviewByUser(slug)
			setUserReview(userReviewData.data[0])
			console.log(userReviewData)
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to fetch user review",
			)
			setUserReview(null)
		} finally {
			setLoading(false)
		}
	}, [slug])

	// submit a new review
	const submitReview = async (review: {
		rating: number
		comment: string
	}) => {
		try {
			setLoading(true)
			setFormErrors([])

			// validate review
			const errors = validateReview(review)
			if (errors.length > 0) {
				setFormErrors(errors)
				return null
			}

			const newReview = await reviewService.createReview(slug, review)
			setUserReview(newReview.data)

			// refresh reviews after submitting
			await fetchReviews()
			return newReview.data
		} catch (error) {
			const errorMsg =
				error instanceof Error
					? error.message
					: "Failed to submit review"
			setError(errorMsg)
			setFormErrors([errorMsg])
			console.warn(errorMsg)
			return null
		} finally {
			setLoading(false)
		}
	}

	// delete a review
	const deleteReview = async (reviewId: number) => {
		try {
			setLoading(true)
			await reviewService.deleteReview(slug, reviewId)

			// remove locally
			setReviews((prevReviews) =>
				prevReviews.filter((review) => review.id !== reviewId),
			)
			if (userReview?.id === reviewId) {
				setUserReview(null)
			}

			await fetchReviews()
			return true
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to delete review",
			)
			console.warn(error)
			return false
		} finally {
			setLoading(false)
		}
	}

	// update a review
	const updateReview = async (
		reviewId: number,
		review: { rating: number; comment: string },
	) => {
		try {
			setLoading(true)
			setFormErrors([])

			// validate review
			const errors = validateReview(review)
			if (errors.length > 0) {
				setFormErrors(errors)
				return null
			}

			const updatedReview = await reviewService.updateReview(
				slug,
				reviewId,
				review,
			)
			setUserReview(updatedReview.data)

			// refresh reviews after updating
			await fetchReviews()
			return updatedReview.data
		} catch (error) {
			const errorMsg =
				error instanceof Error
					? error.message
					: "Failed to update review"
			setError(errorMsg)
			setFormErrors([errorMsg])
			console.warn(errorMsg)
			return null
		} finally {
			setLoading(false)
		}
	}

	// fetch reviews on mount or when productId changes
	useEffect(() => {
		fetchReviews()
		fetchStatistics()
		fetchUserReview()
	}, [slug, fetchReviews, fetchStatistics, fetchUserReview])

	return {
		reviews,
		statistics,
		userReview,
		loading,
		error,
		formErrors,
		submitReview,
		deleteReview,
		updateReview,
	}
}
