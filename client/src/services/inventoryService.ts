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
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(PRODUCTS_API_URL, {
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

  async createProduct(product: Product): Promise<Product | null> {
    try {
      const response = await fetch(PRODUCTS_API_URL, {
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

  async updateProduct(id: string, updatedProduct: Product): Promise<Product | null> {
    try {
      const response = await fetch(`${PRODUCTS_API_URL}/${id}`, {
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

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${PRODUCTS_API_URL}/${id}`, {
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
