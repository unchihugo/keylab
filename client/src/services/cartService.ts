/** @format */

const CART_API_URL = "http://localhost:8080/cart";

/** @module services/cart */

export const cartService = {

    async getCartByUser(user: string) {

        const response = await fetch(`${CART_API_URL} ${user}` );
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "failed to get cart")
        }

        return response.json()

    },

    async addCartItem(user: string, product: string, quantity: number) {
        const response = await fetch(`${CART_API_URL}/ ${user}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({product, quantity}),
        });
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(
                    errorData.message || "failed to add a cart item"
                )
            }

        return response.json()
    },

    async deleteCartItem(product: string, user: string) {
        const response = await fetch(`${CART_API_URL}/${product}/${user}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
            if (!response.ok) {
               const errorData = await response.json()
                throw new Error(
                    errorData.message || "failed to delete the cart item"
            )
        }

        return response.json()

    },

    async updateCartItemQuantity(product: string, quantity: number) {
        const response = await fetch(`${CART_API_URL}/${product}/${quantity}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });
            if (!response.ok) {
               const errorData = await response.json()
               throw new Error(
                   errorData.message || "failed to update the quantity of the cart item"
            )
        }

        return response.json()
    }
}