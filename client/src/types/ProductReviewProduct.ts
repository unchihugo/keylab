/** @format */

// workaround because Product has a data property

import { ProductCategory } from "./ProductCategory"
import { ProductImage } from "./ProductImage"

export interface ProductReviewProduct {
	id: number
	name: string
	slug: string
	description: string
	price: number
	stock: number
	category_id: number
	category?: ProductCategory | null
	product_images?: ProductImage[]
	created_at?: string | null
	updated_at?: string | null
	rating?: number
	imageUrl?: string
	color?: string
	size?: string
	brand?: string
}
