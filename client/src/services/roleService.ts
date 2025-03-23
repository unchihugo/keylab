/** @format */

// src/services/roleService.ts
import { Role, UserRoleUpdate } from "../types/Role"

const API_URL = "/api"

export const roleService = {
	getAllRoles: async (): Promise<Role[]> => {
		const response = await fetch(`${API_URL}/roles`)
		if (!response.ok) {
			throw new Error("Failed to fetch roles")
		}
		return response.json()
	},

	getUserRole: async (userId: number): Promise<UserRoleUpdate> => {
		const response = await fetch(`${API_URL}/users/${userId}/role`)
		if (!response.ok) {
			throw new Error("Failed to fetch user role")
		}
		return response.json()
	},

	updateUserRole: async (
		userId: number,
		roleId: number,
	): Promise<UserRoleUpdate> => {
		const response = await fetch(`${API_URL}/users/${userId}/role`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ roleId }),
		})
		if (!response.ok) {
			throw new Error("Failed to update user role")
		}
		return response.json()
	},

	createRole: async (name: string): Promise<Role> => {
		const response = await fetch(`${API_URL}/roles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		})
		if (!response.ok) {
			throw new Error("Failed to create role")
		}
		return response.json()
	},
}
