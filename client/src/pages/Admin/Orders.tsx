/** @format */

import Breadcrumb from "../../components/Breadcrumb"
import Divider from "../../components/Divider"
import LinkButton from "../../components/LinkButton"
import OrderCard from "../../components/OrderCard"
import { useAdminOrders } from "../../hooks/useAdminOrders"
import NotFound from "../NotFound"

export default function AdminOrders() {
	const { orders, loading, error } = useAdminOrders()

	if (loading) return <div>Loading...</div>

	if (error)
		return <NotFound errorMessage="400 - Bad Request" bodyMessage={error} />
	if (!orders) return <NotFound bodyMessage="No orders found" />

	return (
		// <div className="flex flex-col items-center justify-center">
		//     <Breadcrumb breadcrumbs={["Admin Dashboard", "Orders"]} />
		//     <h1 className="text-3xl font-semibold text-center">All Orders</h1>
		//     <div className="flex flex-col items-center justify-center">
		//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		//             {orders.map((order) => (
		//                 <OrderCard key={order.id} order={order} />
		//             ))}
		//         </div>
		//     </div>
		// </div>

		<div className="min-h-screen bg-primary/25 py-6">
			<div className="container mx-auto px-6 flex flex-col md:flex-row gap-6">
				{/* Sidebar Navigation */}
				<aside className="w-full lg:w-1/5 bg-primary-dark/25 p-4 rounded-2xl space-y-4 mb-6 lg:mb-0 h-fit border border-gray-700 mr-4">
					<h2 className="text-xl font-bold mb-4">Admin Panel</h2>
					<div className="flex flex-col space-y-2">
						<LinkButton
							to="/admin/dashboard"
							text="Dashboard"
							buttonClassNames=" border-black bg-primary text-black transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/orders"
							text="Orders"
							buttonClassNames=" border-black bg-primary text-black transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/inventory"
							text="Inventory"
							buttonClassNames=" border-black bg-primary text-black transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/reports"
							text="Reports"
							buttonClassNames=" border-black bg-primary text-black transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/settings"
							text="Settings"
							buttonClassNames=" border-black bg-primary text-black transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
					</div>
				</aside>

				<main className="flex-1 bg-white rounded-2xl p-6 border border-black">
					<Breadcrumb breadcrumbs={["Admin Dashboard", "Orders"]} />
					<Divider />
					<h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
						{orders.map((order) => (
							<OrderCard key={order.id} order={order} isAdmin={true} />
						))}
					</div>
				</main>
			</div>
		</div>
	)
}
