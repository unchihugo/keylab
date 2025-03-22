/** @format */
interface OrdersProps {
	userId: number
}

import { useEffect, useState } from "react"
import { userService } from "../../services/userService"
import { Order } from "../../types/Order"
import ErrorBox from "../../components/ErrorBox"
import OrderCard from "../../components/OrderCard"

export default function Orders({ userId }: OrdersProps) {
	const [errors, setErrors] = useState<string[]>([])
	const [orders, setOrders] = useState<Order[]>([])

	useEffect(() => {
		// fetch orders
		const fetchOrders = async () => {
			try {
				const response = await userService.getUserOrders(userId)
				setOrders(response.data.orders)
				// test data
				// setOrders([
				// 	{
				// 		id: 1,
				// 		userId: 1,
				// 		orderDate: "2025-01-01",
				// 		status: "pending",
				// 		total: 100,
				// 		shippingAddressId: 1,
				// 		billingAddressId: 1,
				// 		shippingAddress: null,
				// 		billingAddress: null,
				// 		createdAt: "2025-01-01",
				// 		updatedAt: "2025-01-01",
				// 	},
				// 	{
				// 		id: 2,
				// 		userId: 1,
				// 		orderDate: "2025-02-20",
				// 		status: "shipped",
				// 		total: 200,
				// 		shippingAddressId: 1,
				// 		billingAddressId: 1,
				// 		shippingAddress: null,
				// 		billingAddress: null,
				// 		createdAt: "2025-02-20",
				// 		updatedAt: "2025-02-25",
				// 	},
				// ])
			} catch (error) {
				console.error("Error fetching orders:", error)
				setOrders([])
				if (error instanceof Error) {
					setErrors([error.message])
				} else {
					setErrors(["Error fetching orders."])
				}
			}
		}
		fetchOrders()
	}, [userId])

	return (
		<div className="max-w-lg mx-auto">
			<h2 className="text-2xl font-semibold mb-4">View your orders</h2>
			<p className="text-gray-600 mb-6">
				Manage and track your orders here.
			</p>

			<ErrorBox>{errors}</ErrorBox>

			{/*cards list */}
			<div className="space-y-4">
				{orders.map((order) => (
					<OrderCard order={order} />
				))}
			</div>
		</div>
	)
}
