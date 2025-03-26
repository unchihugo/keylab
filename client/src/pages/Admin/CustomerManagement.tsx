/** @format */

import { useEffect, useState } from "react"
import { adminService } from "../../services/adminService"
import { Pencil, Trash2 } from "lucide-react"
import Breadcrumb from "../../components/Breadcrumb"
import LinkButton from "../../components/LinkButton"
import ErrorBox from "../../components/ErrorBox"
import * as formValidation from "../../lib/formValidation"
import { Search } from "lucide-react"
import Divider from "../../components/Divider"

interface User {
	id: number
	forename: string
	surname: string
	email: string
	phoneNumber: string
	role: string
	is_deleted: boolean
}

export default function CustomerManagement() {
	const [users, setUsers] = useState<User[]>([])
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [errors, setErrors] = useState<string[]>([])
	const [searchTerm, setSearchTerm] = useState("")

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await adminService.getAllUsers()
				setUsers(res.data.users || [])
			} catch (err) {
				console.error("Error fetching users:", err)
			}
		}
		fetchUsers()
	}, [])

	const handleUpdate = async () => {
		if (!selectedUser) return

		const validationErrors = [
			formValidation.validateForename(selectedUser.forename),
			formValidation.validateSurname(selectedUser.surname),
			formValidation.validateEmail(selectedUser.email),
			formValidation.validatePhoneNum(selectedUser.phoneNumber),
		].filter(Boolean)

		if (validationErrors.length > 0) {
			setErrors(validationErrors)
			return
		}

		try {
			await adminService.updateUser(selectedUser.id, selectedUser)
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === selectedUser.id ? selectedUser : user,
				),
			)
			setErrors([])
			setShowModal(false)
		} catch (err) {
			setErrors(["Something went wrong while saving changes."])
			console.error("Update failed:", err)
		}
	}

	const filteredUsers = users
		.filter((user) => !user.is_deleted)
		.filter((user) =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
		)
	const handleDelete = async (userId: number) => {
		if (!confirm("Are you sure you want to delete this user?")) return

		try {
			await adminService.deleteUser(userId)
			setUsers((prev) => prev.filter((u) => u.id !== userId))
		} catch (err: any) {
			setErrors([err.message || "Failed to delete user"])
		}
	}

	return (
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
							to="/admin/customers"
							text="Customer Management"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/settings"
							text="Change Password"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 bg-white rounded-2xl p-6 border border-black">
					<Breadcrumb
						breadcrumbs={["Admin Dashboard", "Customer Management"]}
					/>
					<Divider />
					<h2 className="text-2xl font-bold mb-6">
						Customer Management
					</h2>

					{/* Search bar */}
					<div className="flex items-center justify-between mb-4">
						<div className="relative w-full max-w-md">
							<form
								className="flex"
								onSubmit={(e) => {
									e.preventDefault()
								}}>
								<input
									type="text"
									name="search"
									placeholder="Search by email..."
									className="w-full px-4 py-2 border border-black rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary"
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(
											e.target.value.toLowerCase(),
										)
									}
								/>
								<button
									type="submit"
									className="px-4 py-2 bg-primary border-t border-e border-b border-black rounded-r-full hover:bg-primary-dark transition-colors">
									<Search />
								</button>
							</form>
						</div>
					</div>

					<div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
						<table className="min-w-full divide-y divide-gray-300">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-medium">
										Name
									</th>
									<th className="px-4 py-3 text-left text-sm font-medium">
										Email
									</th>
									<th className="px-4 py-3 text-left text-sm font-medium">
										Phone
									</th>
									<th className="px-4 py-3 text-left text-sm font-medium">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">
								{filteredUsers.map((user) => (
									<tr key={user.id}>
										<td className="px-4 py-3">
											{user.forename} {user.surname}
										</td>
										<td className="px-4 py-3">
											{user.email}
										</td>
										<td className="px-4 py-3">
											{user.phoneNumber}
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<button
													className="bg-secondary text-sm font-medium text-black px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
													onClick={() => {
														setSelectedUser(user)
														setShowModal(true)
													}}>
													<Pencil size={12} />
													Edit
												</button>
												<button
													className="bg-red-600 text-sm font-medium text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1"
													onClick={() =>
														handleDelete(user.id)
													}>
													<Trash2 size={12} />
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Modal */}
					{showModal && selectedUser && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
							<div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
								<h3 className="text-lg font-semibold mb-4">
									Edit User
								</h3>

								{errors.length > 0 && (
									<div className="mb-4">
										<ErrorBox>{errors}</ErrorBox>
									</div>
								)}

								<div className="space-y-4">
									<input
										type="text"
										placeholder="First Name"
										value={selectedUser.forename}
										onChange={(e) =>
											setSelectedUser((prev) =>
												prev
													? {
															...prev,
															forename:
																e.target.value,
														}
													: null,
											)
										}
										className="w-full border px-3 py-2 rounded"
									/>
									<input
										type="text"
										placeholder="Last Name"
										value={selectedUser.surname}
										onChange={(e) =>
											setSelectedUser((prev) =>
												prev
													? {
															...prev,
															surname:
																e.target.value,
														}
													: null,
											)
										}
										className="w-full border px-3 py-2 rounded"
									/>
									<input
										type="email"
										placeholder="Email"
										value={selectedUser.email}
										onChange={(e) =>
											setSelectedUser((prev) =>
												prev
													? {
															...prev,
															email: e.target
																.value,
														}
													: null,
											)
										}
										className="w-full border px-3 py-2 rounded"
									/>
									<input
										type="text"
										placeholder="Phone Number"
										value={selectedUser.phoneNumber || ""}
										onChange={(e) =>
											setSelectedUser((prev) =>
												prev
													? {
															...prev,
															phoneNumber:
																e.target.value,
														}
													: null,
											)
										}
										className="w-full border px-3 py-2 rounded"
									/>
								</div>

								<div className="flex justify-end mt-6 gap-3">
									<button
										className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
										onClick={() => setShowModal(false)}>
										Cancel
									</button>
									<button
										className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
										onClick={handleUpdate}>
										Save
									</button>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
