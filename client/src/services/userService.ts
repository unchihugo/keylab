/** @format */

const USERS_API_URL = "http://localhost:8080/users"; 

/**
 * Service handles the user requests to the backend
 * @module services/userService
 * @see ../../../../server/handlers/User.go
 */

export const userService = {
  
 //request to backend to get the profile of logged-in user
  async getUserProfile(userId: number) {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user profile");
    }

    return response.json();
  },

 
   // request to update the profile of a specific user
  async updateUserProfile(userId: number, updatedUser: any) {
    const response = await fetch(`${USERS_API_URL}/${userId}`, {
      method: "PUT",
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user profile");
    }

    return response.json();
  },
 
  // request to backend to change users password
   async changePassword(userId: number, passwordData: { current_password: string; new_password: string }) {
    const response = await fetch(`${USERS_API_URL}/${userId}/change-password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }

    return response.json();
  },
};

