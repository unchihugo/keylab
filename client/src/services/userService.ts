import { User, UserRole } from "../types/User";
const USERS_API_URL = "http://localhost:8080/users"; // Adjust based on your backend URL
/**
 * Get the role of a user by their ID
 * @param {string} userId The user's ID
 * @returns {Promise<User>} A promise that resolves with the user's data (including role)
 * @throws {Error} An error from the API request
 */
async function getUserRole(userId: string): Promise<User> {
  const response = await fetch(`${USERS_API_URL}/${userId}/role`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get user role");
  }

  return response.json(); // Returns the User object with role
}

/**
 * Set the role of a user by their ID
 * @param {string} userId The user's ID
 * @param {UserRole} role The new role to set (e.g., "admin", "user", "manager")
 * @returns {Promise<User>} A promise that resolves with the updated user data
 * @throws {Error} An error from the API request
 */
async function setUserRole(userId: string, role: UserRole): Promise<User> {
  const response = await fetch(`${USERS_API_URL}/${userId}/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }), // Sending the role as JSON
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to set user role");
  }

  return response.json(); // Returns the updated User object
}


// Export the functions for user role management
export const userService = {
  getUserRole,
  setUserRole,
};


