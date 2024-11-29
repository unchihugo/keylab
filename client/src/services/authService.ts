/** @format */

const AUTH_API_URL = "http://localhost:8080/auth"

/**
 * Service that handles authentication requests to the backend
 * @module services/auth
 * @see ../../../../server/handlers/Auth.go
 */
export const authService = {
	// where we make a request to backend to authenticate the user (makes sure that the email and password are valid)
	async login(email: string, password: string) {
		const response = await fetch(`${AUTH_API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
			credentials: "include", // to allow HttpOnly and Secure cookies to be sent
		})

		if (!response.ok) {
			// handle errors
			const errorData = await response.json()
			throw new Error(errorData.message || "Login failed")
		}

		return response.json()
	},

	// request to backend to create a new user
	async register(
		forename: string,
		surname: string,
		email: string,
		password: string,
	) {
		const response = await fetch(`${AUTH_API_URL}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ forename, surname, email, password }),
			credentials: "include",
		})

		if (!response.ok) {
			// handle errors
			const errorData = await response.json()
			throw new Error(errorData.message || "Registration failed")
		}

		return response.json()
	},

	// this is where we make a request to backend to logout the user
	async logout() {
		const response = await fetch(`${AUTH_API_URL}/logout`, {
			method: "POST",
			credentials: "include",
		})

		if (!response.ok) {
			// handle errors
			const errorData = await response.json()
			throw new Error(errorData.message || "Logout failed")
		}

		return response.json()
	},
}
