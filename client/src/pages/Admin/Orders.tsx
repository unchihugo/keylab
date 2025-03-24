/** @format */

import { Search } from "lucide-react"
import Breadcrumb from "../../components/Breadcrumb"
import Divider from "../../components/Divider"
import LinkButton from "../../components/LinkButton"
import OrderCard from "../../components/OrderCard"
import { useAdminOrders } from "../../hooks/useAdminOrders"

export default function AdminOrders() {
	const { orders, loading, error, getUserOrders } = useAdminOrders()

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
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/orders"
							text="Orders"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/inventory"
							text="Inventory"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
							to="/admin/customers"
							text="Customer Management"
						/>
						<LinkButton
							to="/admin/settings"
							text="Change Password"
							buttonClassNames=" border-black bg-primary text-black transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
					</div>
				</aside>

				<main className="flex-1 bg-white rounded-2xl p-6 border border-black">
					<Breadcrumb breadcrumbs={["Admin Dashboard", "Orders"]} />
					<Divider />
					<h2 className="text-2xl font-bold mb-4">Sales Overview</h2>

					{/* search */}
					<div className="flex items-center justify-between mb-4">
						<div className="relative w-full max-w-md">
							<form
								className="flex"
								onSubmit={(e) => {
									e.preventDefault()
									getUserOrders(e.currentTarget.search.value)
								}}>
								<input
									type="number"
									name="search"
									placeholder="Search by UserID..."
									className="w-full px-4 py-2 border border-black rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault()
											getUserOrders(
												Number(e.currentTarget.value),
											)
										}
									}}
								/>
								<button
									type="submit"
									className="px-4 py-2 bg-primary border-t border-e border-b border-black rounded-r-full hover:bg-primary-dark transition-colors">
									<Search />
								</button>
							</form>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
						{loading && <div>Loading...</div>}
						{error && <div>Error: {error}</div>}
						{orders.map((order) => (
							<OrderCard
								key={order.id}
								order={order}
								isAdmin={true}
							/>
						))}
					</div>
				</main>
			</div>
		</div>
	)
}
