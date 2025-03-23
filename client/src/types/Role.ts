/** @format */

// src/types/Role.ts
export interface Role {
	id: number
	name: string
	created_at?: string
	updated_at?: string
	description?: string
	permissions?: string
}

// Export interface for role update response
export interface UserRoleUpdate {
	userId: number
	roleId: number
	role: Role | null
}
