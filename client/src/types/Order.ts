/** @format */

import { Address } from "./Address"
import { User } from "./User"

export interface Order {
	id: number
	userId: number
	orderDate: string | null
	status: "pending" | "shipped" | "delivered" | "cancelled" | "returned"
	total: number
	shippingAddressId: number
	billingAddressId: number
	shippingAddress: Address | null
	billingAddress: Address | null
	createdAt: string
	updatedAt: string
	user: User
}
