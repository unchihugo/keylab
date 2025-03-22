/** @format */

// src/types/role.ts
export interface Role {
	id: number
	name: string
	created_at: string
	updated_at: string
}

export interface User {
	id: number
	forename: string
	surname: string
	email: string
	phoneNumber?: string
	roleId: number | null
	created_at: string
	updated_at: string
	role?: Role
}

// export interface UserRoleUpdate {
// 	userId: number
// 	roleId: number
// 	role: Role
// }
