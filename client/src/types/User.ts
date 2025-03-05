/** @format */

// src/types/User.ts

// Defining the possible user roles (you can adjust this based on your backend roles)
export type UserRole = "admin" | "user" | "manager" // Adjust based on backend roles

// Defining the User interface with the properties that match the backend model
export interface User {
	id: string
	name: string
	email: string
	role: UserRole // This refers to the UserRole type
}
