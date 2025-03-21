/** @format */

export interface Carts {
	id: number
	product_id: number
	user_id: number
	product: {
		id: number
		name: string
		price: number
	}
	quantity: number
}
