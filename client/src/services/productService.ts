


/** @format */

const PRODUCTS_API_URL = "http://localhost:8080/products"; // TODO: use env variable


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
  }
}