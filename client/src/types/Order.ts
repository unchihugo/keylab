/** @format */

import { Address } from "./Address"
import { User } from "./User"

export interface Order {
	created_at: string | number | Date
	updated_at: string | number | Date
	id: number
	userId: number
	orderDate: string | null
	status: "pending" | "shipped" | "delivered" | "cancelled" | "returned"
	total: number
	shippingAddressId: number
	billingAddressId: number
	shippingAddress: Address | null
	billingAddress: Address | null
	user: User
}
