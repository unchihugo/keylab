/** @format */

//src/types/User.ts
import { Role } from './Role'

// Defining the possible user roles (you can adjust this based on your backend roles)
export type UserRole = 0 | 1 // Adjust based on backend roles

// Defining the User interface with the properties that match the backend model
export interface User {
  id: number
  forename: string
  surname: string
  email: string
  name?: string // Kept for backward compatibility
  phoneNumber?: string
  roleId: number | null
  created_at?: string
  updated_at?: string
  role: Role | null // Changed from UserRole to Role object
}