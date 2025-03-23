const PRODUCTS_API_URL = "http://localhost:8080/products";

interface Product {
    id: string;
    name: string;
    stock: number;
    price: number;
    image: string;
    description: string;
}

export const inventoryService = {
    async getProducts(): Promise<any> {
        try {
            const response = await fetch(PRODUCTS_API_URL, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch products");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    async createProduct(product: Product): Promise<any> {
        try {
            const response = await fetch(PRODUCTS_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create product");
            }
            return await response.json();
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async updateProduct(id: string, updatedProduct: Product): Promise<any> {
        try {
            const response = await fetch(`<span class="math-inline">\{PRODUCTS\_API\_URL\}/</span>{id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update product");
            }
            return await response.json();
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async deleteProduct(id: string): Promise<boolean> {
        try {
            const response = await fetch(`<span class="math-inline">\{PRODUCTS\_API\_URL\}/</span>{id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete product");
            }
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
};
