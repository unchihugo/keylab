/** @format */

const PRODUCTS_API_URL = "http://localhost:8080/products"

/**
 * Service that handles product review requests to the backend
 * @module services/review
 * @see ../../../../server/handlers/Reviews.go
 */
export const reviewService = {
	async getReviewByUser(productId: number, userId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${productId}/reviews/user/${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message || "Failed to get review from user",
			)
		}

		return response.json()
	},

	async getReviewsByProduct(productId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${productId}/reviews`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message || "Failed to get reviews by product",
			)
		}
		return response.json()
	},

	// currenty getReviewsByUser and getReviewByUser are the same server-side
	async getReviewsByUser(productId: number, userId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${productId}/reviews/users/${userId}/reviews`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message || "Failed to get reviews by user",
			)
		}
		return response.json()
	},

	async getReview(productId: number, reviewId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${productId}/reviews/${reviewId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to get review")
		}
		return response.json()
	},

	// async getReviewStatistics(productId: number) {
	// 	const response = await fetch(
	// 		`${PRODUCTS_API_URL}/${productId}/reviews/statistics`,
	// 		{
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		},
	// 	)

	// 	if (!response.ok) {
	// 		const errorData = await response.json()
	// 		throw new Error(
	// 			errorData.message || "Failed to get review statistics",
	// 		)
	// 	}
	// 	return response.json()
	// },

	async createReview(
		productId: number,
		review: { rating: number; comment: string },
	) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${productId}/reviews`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(review),
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to create review")
		}
		return response.json()
	},

	async updateReview(
		reviewId: number,
		review: { rating: number; comment: string },
	) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/reviews/${reviewId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(review),
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to update review")
		}
		return response.json()
	},

	async deleteReview(reviewId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/reviews/${reviewId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to delete review")
		}
		return response.json()
	},
}
