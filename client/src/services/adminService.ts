/** @format */

// Admin API to manage users
// @module services/adminService
// @see ../../../../server/handlers/User.go

const ADMIN_API_URL = "http://localhost:8080/admin/users"

export const adminService = {
	// Get all users
	async getAllUsers() {
		const response = await fetch(ADMIN_API_URL, {
			method: "GET",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to fetch users")
		}

		return response.json()
	},

	// Update a specific user by admin
	async updateUser(userId: number, updatedData: any) {
		const response = await fetch(`${ADMIN_API_URL}/${userId}`, {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedData),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to update user")
		}

		return response.json()
	},
}
