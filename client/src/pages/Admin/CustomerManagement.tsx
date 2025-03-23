/** @format */
import { useEffect, useState } from "react"
import { adminService } from "../../services/adminService"
import { Pencil, Trash2 } from "lucide-react"
type User = {
	id: number
	forename: string
	surname: string
	email: string
	phone_number: string
	role: string
}
const CustomerManagement = () => {
	const [users, setUsers] = useState<User[]>([])
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [showModal, setShowModal] = useState(false)
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await adminService.getAllUsers()
				console.log("Admin users fetched:", res)
				setUsers(res.data || [])
			} catch (err) {
				console.error("Error fetching users:", err)
			}
		}
		fetchUsers()
	}, [])
	const handleUpdate = async () => {
		if (!selectedUser) return
		try {
			await adminService.updateUser(selectedUser.id, selectedUser)
			setShowModal(false)
		} catch (err) {
			console.error("Update failed:", err)
		}
	}
	return (
		<div className="p-8">
			<h2 className="text-2xl font-bold mb-6">Customer Management</h2>
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
						{users.map((user) => (
							<tr key={user.id}>
								<td className="px-4 py-3">
									{user.forename} {user.surname}
								</td>
								<td className="px-4 py-3">{user.email}</td>
								<td className="px-4 py-3">
									{user.phone_number}
								</td>
								<td className="px-4 py-3 space-x-2">
									<button
										className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
										onClick={() => {
											setSelectedUser(user)
											setShowModal(true)
										}}>
										<Pencil
											size={16}
											className="inline mr-1"
										/>
										Edit
									</button>
									{/* Delete button */}
									{/* <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                        <Trash2 size={16} className="inline mr-1" />
                                        Delete
                                    </button> */}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Edit Modal */}
			{showModal && selectedUser && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
						<h3 className="text-lg font-semibold mb-4">
							Edit User
						</h3>
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
													forename: e.target.value,
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
													surname: e.target.value,
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
											? { ...prev, email: e.target.value }
											: null,
									)
								}
								className="w-full border px-3 py-2 rounded"
							/>
							<input
								type="text"
								placeholder="Phone Number"
								value={selectedUser.phone_number}
								onChange={(e) =>
									setSelectedUser((prev) =>
										prev
											? {
													...prev,
													phone_number:
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
		</div>
	)
}
export default CustomerManagement
