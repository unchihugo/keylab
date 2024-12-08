/** @format */

import { ProductCategory } from "./ProductCategory"

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
		created_at?: string | null
		updated_at?: string | null
		rating?: number
		imageUrl?: string;
	}
	message: string
}

