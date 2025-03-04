// @ts-ignore
import { User, UserRole } from "../types/User";


/** @format */

const PRODUCTS_API_URL = "http://localhost:8080/products"; // TODO: use env variable
const USERS_API_URL = "http://localhost:8080/users"; // Adjust based on your backend URL

/**
 * Service that handles product and user requests to the backend
 * @module services/product
 * @see ../../../../server/handlers/Products.go
 */

export const productService = {
  /**
   * Get a list of all products
   * @returns {Promise} A promise that resolves with the list of products
   * @throws {Error} An error from the API request
   */
  async listProducts() {
    const response = await fetch(`${PRODUCTS_API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to list products");
    }

    return response.json();
  },

  /**
   * Get a product by its slug
   * @param {string} slug The product's slug
   * @returns {Promise} A promise that resolves when the product is retrieved
   * @throws {Error} An error from the API request
   */
  async getProductBySlug(slug: string) {
    const response = await fetch(`${PRODUCTS_API_URL}/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get product by slug");
    }

    return response.json();
  },

  /**
   * Get a list of products by category
   * @param {string} category The category to filter by
   * @returns {Promise} A promise that resolves with the list of products
   * @throws {Error} An error from the API request
   */
  async getProductsByCategory(category: string) {
    const response = await fetch(`${PRODUCTS_API_URL}/category/${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get products by category");
    }

    return response.json();
  },

  /**
   * Get a list of products by search query
   * @param {string} query The search query
   * @returns {Promise} A promise that resolves with the list of products
   * @throws {Error} An error from the API request
   */
  async searchProducts(query: string) {
    const response = await fetch(`${PRODUCTS_API_URL}/search/${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search products");
    }

    return response.json();
  },


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

};

// Export the functions for user role management
export const userService = {
  getUserRole,
  setUserRole,
};

function getUserRole(_userId: any, _string: any) {
	throw new Error("Function not implemented.");
}

function setUserRole(_userId: any, _string: any, _role: any, _UserRole: any) {
	throw new Error("Function not implemented.");
}

