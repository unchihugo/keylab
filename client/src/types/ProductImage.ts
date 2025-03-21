/** @format */

export interface ProductImage {
	id: number
	product_id: number
	image: string
	url?: string
	primary_image: boolean
	created_at?: string | null
	updated_at?: string | null
}
