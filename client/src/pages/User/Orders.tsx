/** @format */
interface OrdersProps {
	userId: number
}

import { useEffect, useState } from "react"
import { userService } from "../../services/userService"
import { Order } from "../../types/Order"
import ErrorBox from "../../components/ErrorBox"

export default function Orders({ userId }: OrdersProps) {
	const [errors, setErrors] = useState<string[]>([])
	const [orders, setOrders] = useState<Order[]>([])

	useEffect(() => {
		// fetch orders
		const fetchOrders = async () => {
			try {
				// const response = await userService.getUserOrders(userId)
				// setOrders(response.data.orders)
			} catch (error) {
				console.error("Error fetching orders:", error)
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
					<div
						key={order.id}
						className="p-4 border rounded-lg shadow-md flex items-center gap-4 relative cursor-pointer transition duration-200"></div>
				))}
			</div>
		</div>
	)
}
