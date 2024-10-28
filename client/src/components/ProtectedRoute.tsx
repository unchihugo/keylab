import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

// use this component to disallow access to the specified route if the user is not authenticated
// this is frontend protection only, the backend should also have protection in place (in other words: do not send sensitive data after just this)
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" />;
    }

    return children;
}

export default ProtectedRoute;