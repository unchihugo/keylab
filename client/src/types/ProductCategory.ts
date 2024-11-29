/** @format */

import { Product } from "./Product"

export interface ProductCategory {
	id: number
	name: string
	slug: string
	description: string
	products?: Product[] | null
	created_at?: string | null
	updated_at?: string | null
}
