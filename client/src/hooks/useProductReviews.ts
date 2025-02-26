/** @format */

import { useState, useEffect } from "react"
import { ProductReview } from "../types/ProductReview"
import { reviewService } from "../services/reviewService"

export const useProductReviews = (productId: number) => {
	const [reviews, setReviews] = useState<ProductReview[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setLoading(true)
				const reviewsData =
					await reviewService.getReviewsByProduct(productId)
				setReviews(reviewsData)
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "Failed to fetch reviews",
				)
			} finally {
				setLoading(false)
			}
		}

		if (productId) {
			fetchReviews()
		}
	}, [productId])

	return { reviews, loading, error }
}
