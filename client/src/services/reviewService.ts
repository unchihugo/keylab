/** @format */

const PRODUCTS_API_URL = "http://localhost:8080/products"

/**
 * Service that handles product review requests to the backend
 * @module services/review
 * @see ../../../../server/handlers/Reviews.go
 */
export const reviewService = {
	// gets user's review for a product
	async getReviewByUser(slug: string) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${slug}/reviews/user`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
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

	async getReviewsByProduct(slug: string) {
		const response = await fetch(`${PRODUCTS_API_URL}/${slug}/reviews`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.message || "Failed to get reviews by product",
			)
		}
		return response.json()
	},

	// currenty getReviewsByUser and getReviewByUser are the same server-side
	async getReviewsByUser(slug: string, userId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${slug}/reviews/users/${userId}/reviews`,
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

	async getReview(slug: string, reviewId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${slug}/reviews/${reviewId}`,
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

	async getReviewStatistics(slug: string) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${slug}/reviews/statistics`,
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
				errorData.message || "Failed to get review statistics",
			)
		}
		return response.json()
	},

	async createReview(
		slug: string,
		review: { rating: number; comment: string },
	) {
		const response = await fetch(`${PRODUCTS_API_URL}/${slug}/reviews`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(review),
			credentials: "include",
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to create review")
		}
		return response.json()
	},

	async updateReview(
		slug: string,
		reviewId: number,
		review: { rating: number; comment: string },
	) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${slug}/reviews/${reviewId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(review),
				credentials: "include",
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to update review")
		}
		return response.json()
	},

	async deleteReview(slug: string, reviewId: number) {
		const response = await fetch(
			`${PRODUCTS_API_URL}/${slug}/reviews/${reviewId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to delete review")
		}
		return response.json()
	},
}
