/** @format */

import { ProductCategory } from "./ProductCategory"
import { ProductImage } from "./ProductImage"

export interface Product {
	data: {
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
	}
	message: string
}
