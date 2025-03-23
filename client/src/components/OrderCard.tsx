/** @format */

import { Order } from "../types/Order"
import {
	CircleDashed,
	Truck,
	PackageCheck,
	CircleOff,
	CornerDownLeft,
} from "lucide-react"
import { adminOrdersService } from "../services/admin/adminOrdersService"

interface OrderCardProps {
	order: Order
	isAdmin?: boolean
}

export default function OrderCard({ order, isAdmin = false }: OrderCardProps) {
	return (
		<div
			key={order.id}
			className="p-4 border rounded-lg shadow-md items-center gap-4 relative border-black bg-white">
			<div className="mb-2">
				{order.status === "pending" && <CircleDashed size={24} />}
				{order.status === "shipped" && <Truck size={24} />}
				{order.status === "delivered" && <PackageCheck size={24} />}
				{order.status === "cancelled" && <CircleOff size={24} />}
				{order.status === "returned" && <CornerDownLeft size={24} />}
				{isAdmin && (
					<span className="text-xs text-black/50">
						User {order.userId}
					</span>
				)}
			</div>
			<div className="grid grid-cols-4 w-full gap-4">
				<div className="flex flex-col">
					<span className="font-semibold">Status</span>
					<div className="flex flex-col">
						<span className="text-black/75">{order.status}</span>
						<span className="text-xs text-black/50">
							{new Date(order.updatedAt).toLocaleDateString()}
						</span>
					</div>
				</div>
				<div className="flex flex-col">
					<span className="font-semibold">Order Date</span>
					<span className="text-black/75">
						{new Date(order.createdAt).toLocaleDateString()}
					</span>
				</div>
				<div className="flex flex-col">
					<span className="font-semibold">Total</span>
					<span className="text-black/75">
						£{order.total.toFixed(2)}
					</span>
				</div>
				<div className="flex flex-col">
					<span className="font-semibold">Order ID</span>
					<span className="text-black/75">{order.id}</span>
				</div>
			</div>
			{isAdmin && (
				<div className="flex justify-end mt-2">
					<button
						className="h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200 
				hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y"
						onClick={() =>
							adminOrdersService.updateOrderStatus(order.id)
						}>
						<PackageCheck />
						Update Status
					</button>
				</div>
			)}
		</div>
	)
}
