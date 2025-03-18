const API_URL = "https://your-api-url.com/products";

export const inventoryService = {
  async getProducts() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async createProduct(product: any) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return await response.json();
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  },

  async updateProduct(id: string, updatedProduct: any) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return await response.json();
    } catch (error) {
      console.error("Error updating product:", error);
      return null;
    }
  },


  async deleteProduct(id: string) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },
};
