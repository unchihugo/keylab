/** @format */

<<<<<<< HEAD
//src/types/User.ts

// Defining the possible user roles (you can adjust this based on your backend roles)
export type UserRole = 0 | 1 // Adjust based on backend roles

// Defining the User interface with the properties that match the backend model
export interface User {
	forename: string
	id: number
	name: string
	email: string
	role: UserRole // This refers to the UserRole type
	roleId: number
	surname: string
=======
export interface User {
	id: number
	forename: string
	surname: string
	email: string
	phoneNumber?: string
	createdAt?: string | null
	updatedAt?: string | null
>>>>>>> b57fd013870c2653f04db3547d655480bbe25c43
}
