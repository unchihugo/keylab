/** @format */

const CART_API_URL = "http://localhost:8080/cart";

/** @module services/cart */

export const cartService = {

    async getCartByUser(user: string) {

        const response = await fetch(`${CART_API_URL}` );
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to gather data")
        }

        return response.json()

    },

    
}