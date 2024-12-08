/** @format */

import React, { createContext, useContext, useEffect, useState } from "react"
import { authService } from "./services/authService"

interface AuthContextProps {
	isAuthenticated: boolean
	login: (email: string, password: string) => Promise<void> // async function that can return a promise
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
	const [isTesting] = useState(false) // TODO: set to false when we have supporting backend

	// login function for ../pages/sign-in.tsx that calls the authService.login function (seperation of concerns) and sets the auth state
	const login = async (email: string, password: string) => {
		try {
			if (!isTesting) {
				const data = await authService.login(email, password)
				console.log(data.message)
			}
			setIsAuthenticated(true)
		} catch (error) {
			console.error(error)
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
				const data = await authService.validateSession()
				console.log(data.message)
				setIsAuthenticated(true)
			} catch {
				// invalid session
			}
		}
		validateSession()
	}, [])

	return (
		// provides the auth state and functions to all components wrapped in AuthProvider
		<AuthContext.Provider
			value={{ isAuthenticated, login, register, logout }}>
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
