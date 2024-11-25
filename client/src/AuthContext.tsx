import React, { createContext, useContext, useState } from "react";

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>; // async function that can return a promise
    logout: () => void;
}

// we're using React Context so we can access the auth state from any component without having to pass it down as props
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// TODO: store the auth state in a cookie or localStorage so that the user doesn't have to login every time they refresh the page
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isTesting = useState(true); // TODO: set to false when we have supporting backend

    const login = async (email: string, password: string) => {
        // this is where we make a request to backend to authenticate the user (makes sure that the email and password are valid)
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // to allow HttpOnly and Secure cookies to be sent
        });

        if (response.ok || isTesting) {
            setIsAuthenticated(true);
        } else {
            // handle errors
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }
    }

    const logout = async () => {
        // we make a request to backend to logout the user
        await fetch("auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setIsAuthenticated(false);
    }

    return (
        // provides the auth state and functions to all components wrapped in AuthProvider
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}