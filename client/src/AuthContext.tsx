/** @format */

import React, { createContext, useContext, useEffect, useState } from "react"
import { authService } from "./services/authService"

interface User {
	id: number
	email: string
	role: { roleId: number; name: string }
}

interface AuthContextProps {
	isAuthenticated: boolean
	isAdmin: boolean
	isLoading: boolean
	user: User | null
	login: (email: string, password: string) => Promise<string | undefined> // async function that can return a promise
	register: (
		forename: string,
		surname: string,
		email: string,
		password: string,
	) => Promise<void>
	logout: () => void
}

// we're using React Context so we can access the auth state from any component without having to pass it down as props
const AuthContext = createContext<AuthContextProps | undefined>(undefined)

/**
 * AuthProvider component that provides the auth state and functions to all components wrapped in AuthProvider
 * @returns AuthContext.Provider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isTesting] = useState(false) // TODO: set to false when we have supporting backend
	const [user, setUser] = useState<User | null>(null)
	// login function for ../pages/sign-in.tsx that calls the authService.login function (seperation of concerns) and sets the auth state
	// Promise added so func waits for data to come back b4 carrying on
	const login = async (
		email: string,
		password: string,
	): Promise<string | undefined> => {
		try {
			if (!isTesting) {
				const data = await authService.login(email, password)
				const { token, role } = data
				console.log(data)
				// token used to check if user authenticated
				localStorage.setItem("token", token)
				//role to check if user admin or not
				localStorage.setItem("role", role)

				setIsAuthenticated(true)
				// return role so know where to redirect user/admin
				return role
			}
			setIsAuthenticated(true)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	// register function for ../pages/register.tsx that calls the authService.register function and sets the auth state
	const register = async (
		forename: string,
		surname: string,
		email: string,
		password: string,
	) => {
		try {
			if (!isTesting) {
				const data = await authService.register(
					forename,
					surname,
					email,
					password,
				)
				console.log(data.message)
			}
			setIsAuthenticated(true)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	// logout function that calls the authService.logout function and sets the auth state
	const logout = async () => {
		try {
			if (!isTesting) {
				const data = await authService.logout()
				console.log(data.message)
			}
			setIsAuthenticated(false)
		} catch (error) {
			console.error(error)
		}
	}

	// check if user is authenticated on page load using HttpOnly cookies
	useEffect(() => {
		const validateSession = async () => {
			try {
				setIsLoading(true)
				const data = await authService.validateSession()
				console.log(data)
				if (!data) {
					setIsAuthenticated(false)
					setIsLoading(false)
					return
				}
				setIsAuthenticated(true)
				setIsAdmin(data.data.role.roleId === 1)
				setUser(data.data)
			} catch {
				setIsAuthenticated(false)
				setUser(null)
			} finally {
				setIsLoading(false)
			}
		}
		validateSession()
	}, [])

	return (
		// provides the auth state and functions to all components wrapped in AuthProvider
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isAdmin,
				isLoading,
				user,
				login,
				register,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
