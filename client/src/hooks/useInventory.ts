import { useState, useEffect } from "react";
import { inventoryService } from "../services/inventoryService";

export function useInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryService.getProducts(); // Get the entire response
      setProducts(response.data.products); // Access response.data.products
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: any) => {
    setLoading(true);
    try {
      const newProduct = await inventoryService.createProduct(product);
      if (newProduct) setProducts((prev) => [...prev, newProduct.data]);
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updatedProduct: any) => {
    setLoading(true);
    try {
      const updated = await inventoryService.updateProduct(id, updatedProduct);
      if (updated) {
        setProducts((prev) =>
          prev.map((prod) => (prod.id === id ? updated.data : prod))
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const success = await inventoryService.deleteProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((prod) => prod.id !== id));
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
}