/** @format */

import { useEffect, useState } from "react"
import { Order } from "../types/Order"
import { adminOrdersService } from "../services/admin/adminOrdersService"

export const useAdminOrders = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	useEffect(() => {
		const fetchAllOrders = async () => {
			try {
				setLoading(true)
				const response = await adminOrdersService.getAllOrders()
				console.log(response)
				const ordersData = response.data.orders.map(
					(item: { order: Order }) => item.order,
				)
				setOrders(ordersData)
				setError("")
			} catch (error) {
				setOrders([])
				setError(
					error instanceof Error
						? error.message
						: "An error occurred",
				)
			}
			setLoading(false)
		}

		fetchAllOrders()
	}, [])

	const getUserOrders = async (userId: number) => {
		try {
			setLoading(true)
			const response = await adminOrdersService.getUserOrders(userId)
			const ordersData = response.data.orders.map(
				(item: { order: Order }) => item.order,
			)
			setOrders(ordersData)
			setError("")
		}
		catch (error) {
			setOrders([])
			setError(
				error instanceof Error
					? error.message
					: "An error occurred",
			)
		}
		setLoading(false)
	}

	return {
		orders,
		loading,
		error,
		getUserOrders,
	}
}
