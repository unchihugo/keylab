/** @format */

import { ProductReviewProduct } from "./ProductReviewProduct"
import { User } from "./User"

export interface ProductReview {
	id: number
	product_id: number
	user_id: number
	rating: number
	comment: string
	created_at?: string | null
	updated_at?: string | null
	product: ProductReviewProduct
	user: User
}

export interface ReviewStatistics {
	average_rating: number
	total_reviews: number
}
