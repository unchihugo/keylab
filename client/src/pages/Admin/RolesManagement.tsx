/** @format */

// src/pages/RolesManagement.tsx
import React, { useState, useEffect } from "react"
import { Role } from "../../types/Role"
import { User, UserRole } from "../../types/User"
import { roleService } from "../../services/roleService"
import { userService } from "../../services/userService"

const RolesManagement: React.FC = () => {
	const [users, setUsers] = useState<User[]>([])
	const [roles, setRoles] = useState<Role[]>([])
	const [loading, setLoading] = useState(true)
	const [newRoleName, setNewRoleName] = useState("")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersData, rolesData] = await Promise.all([
					userService.getAllUsers(),
					roleService.getAllRoles(),
				])
				setUsers(usersData)
				setRoles(rolesData)
			} catch (error) {
				console.error("Error fetching data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleRoleChange = async (userId: number, roleId: number) => {
		try {
			await roleService.updateUserRole(userId, roleId)
			setUsers(
				users.map((user) => {
					if (user.id === userId) {
						const selectedRole = roles.find((r) => r.id === roleId)

						return {
							...user,
							roleId,
							role: selectedRole
								? convertRoleToUserRole(selectedRole)
								: user.role,
						}
					}
					return user
				}),
			)

			function convertRoleToUserRole(role: Role): UserRole {
				return role.name.toLowerCase() === "admin" ? 1 : 0
			}
		} catch (error) {
			console.error("Error updating role:", error)
		}
	}

	function getRoleName(roleValue: number | null | undefined): string {
		if (roleValue === null || roleValue === undefined) return "No Role"
		return roleValue === 1 ? "Admin" : "User"
	}

	const createNewRole = async () => {
		if (!newRoleName) return

		try {
			const newRole = await roleService.createRole(newRoleName)
			setRoles([...roles, newRole])
			setNewRoleName("")
		} catch (error) {
			console.error("Error creating role:", error)
		}
	}

	if (loading) return <div>Loading...</div>

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">User Roles Management</h1>

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
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
						Create Role
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
									{user.roleId !== undefined &&
									user.roleId !== null
										? getRoleName(user.roleId)
										: typeof user.role === "object" &&
											  user.role !== null
											? (user.role as Role).name
											: "No Role"}
								</td>
								<td className="py-2 px-4 border">
									<select
										value={user.roleId || ""}
										onChange={(e) =>
											handleRoleChange(
												user.id,
												Number(e.target.value),
											)
										}
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
