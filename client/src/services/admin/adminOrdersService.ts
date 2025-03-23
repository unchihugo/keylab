const ADMIN_ORDERS_API_URL = "http://localhost:8080/admin/orders"

/**
 * Service that handles admin orders requests to the backend
 * @module services/admin/adminOrdersService
 * @see ../../../../server/handlers/Cart.go
 */
export const adminOrdersService = {
    async getAllOrders() {
        const response = await fetch(ADMIN_ORDERS_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
                errorData.message || "Failed to get orders",
            )
        }

        return response.json()
    },

    async getOrderDetails(orderId: number) {
        const response = await fetch(`${ADMIN_ORDERS_API_URL}/${orderId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
                errorData.message || "Failed to get order details",
            )
        }

        return response.json()
    },

    async getUserOrders(userId: number) {
        const response = await fetch(`${ADMIN_ORDERS_API_URL}/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
                errorData.message || "Failed to get user orders",
            )
        }

        return response.json()
    },

    async updateOrderStatus(orderId: number) {
        const response = await fetch(`${ADMIN_ORDERS_API_URL}/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ status: "updated" }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
                errorData.message || "Failed to update order status",
            )
        }

        return response.json()
    }
}
