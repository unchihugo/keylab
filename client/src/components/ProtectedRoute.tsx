/** @format */

import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../AuthContext"

// use this component to disallow access to the specified route if the user is not authenticated
// this is frontend protection only, the backend should also have protection in place (in other words: do not send sensitive data after just this)
interface ProtectedRouteProps {
	children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth()
	
	// If still loading authentication state, show a loading indicator or null
	if (isLoading) {
		return <div>Loading...</div>
	}
	if (!isAuthenticated) {
		return <Navigate to="/sign-in" />
	}

	return children
}

export default ProtectedRoute
