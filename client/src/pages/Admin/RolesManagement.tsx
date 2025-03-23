/** @format */

// src/pages/RolesManagement.tsx
import React, { useState, useEffect } from "react"
import { Role, UserRoleUpdate } from "../../types/Role"
import { User } from "../../types/User"
import { roleService } from "../../services/roleService"
import { userService } from "../../services/userService"

const RolesManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>([])
	const [roles, setRoles] = useState<Role[]>([])
	const [loading, setLoading] = useState(true)
	const [newRoleName, setNewRoleName] = useState("")
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersData, rolesData] = await Promise.all([
					userService.getAllUsers(),
					roleService.getAllRoles(),
				])
				setUsers(usersData)
				setRoles(rolesData)
				setError(null)
			} catch (error) {
				console.error("Error fetching data:", error)
				setError("Failed to load data. Please try again.")
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleRoleChange = async (
		userId: number,
		roleId: number | string,
	) => {
		const numericRoleId = roleId === "" ? 0 : Number(roleId)

		try {
			setLoading(true)
			const updatedUserRole: UserRoleUpdate =
				await roleService.updateUserRole(userId, numericRoleId)

			setUsers((prevUsers) =>
				prevUsers.map((user) => {
					if (user.id === userId) {
						return {
							...user,
							roleId: updatedUserRole.roleId,
							role: updatedUserRole.role,
						}
					}
					return user
				}),
			)
			setError(null)
		} catch (error) {
			console.error("Error updating role:", error)
			setError("Failed to update user role. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	const getRoleName = (user: User): string => {
		if (!user.roleId || user.roleId === 0) return "No Role"

		if (user.role && typeof user.role === "object") {
			return user.role.name || "Unknown Role"
		}

		const role = roles.find((r) => r.id === user.roleId)
		return role ? role.name : "Unknown Role"
	}

	const createNewRole = async () => {
		if (!newRoleName) return

		try {
			setLoading(true)
			const newRole = await roleService.createRole(newRoleName)
			setRoles((prevRoles) => [...prevRoles, newRole])
			setNewRoleName("")
			setError(null)
		} catch (error) {
			console.error("Error creating role:", error)
			setError("Failed to create new role. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	if (loading && users.length === 0 && roles.length === 0) {
		return <div className="container mx-auto p-4">Loading...</div>
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">User Roles Management</h1>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded">
					{error}
				</div>
			)}

			<div className="mb-8 p-4 border rounded">
				<h2 className="text-xl font-semibold mb-4">Create New Role</h2>
				<div className="flex items-center">
					<input
						type="text"
						value={newRoleName}
						onChange={(e) => setNewRoleName(e.target.value)}
						placeholder="Role name"
						className="border rounded px-3 py-2 mr-2"
					/>
					<button
						onClick={createNewRole}
						disabled={loading || !newRoleName}
						className={`px-4 py-2 rounded text-white ${
							loading || !newRoleName
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-500 hover:bg-blue-600"
						}`}>
						{loading ? "Creating..." : "Create Role"}
					</button>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border">
					<thead className="bg-gray-100">
						<tr>
							<th className="py-2 px-4 border">ID</th>
							<th className="py-2 px-4 border">Name</th>
							<th className="py-2 px-4 border">Email</th>
							<th className="py-2 px-4 border">Current Role</th>
							<th className="py-2 px-4 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td className="py-2 px-4 border">{user.id}</td>
								<td className="py-2 px-4 border">
									{user.forename} {user.surname}
								</td>
								<td className="py-2 px-4 border">
									{user.email}
								</td>
								<td className="py-2 px-4 border">
									{getRoleName(user)}
								</td>
								<td className="py-2 px-4 border">
									<select
										value={user.roleId || ""}
										onChange={(e) =>
											handleRoleChange(
												user.id,
												e.target.value,
											)
										}
										disabled={loading}
										className="border rounded px-2 py-1">
										<option value="">No Role</option>
										{roles.map((role) => (
											<option
												key={role.id}
												value={role.id}>
												{role.name}
											</option>
										))}
									</select>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default RolesManagement
