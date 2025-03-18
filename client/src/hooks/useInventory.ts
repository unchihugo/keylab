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
      const data = await inventoryService.getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: any) => {
    setLoading(true);
    try {
      const newProduct = await inventoryService.createProduct(product);
      if (newProduct) setProducts((prev) => [...prev, newProduct]);
    } catch (err) {
      setError("Failed to add product");
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
          prev.map((prod) => (prod.id === id ? updated : prod))
        );
      }
    } catch (err) {
      setError("Failed to update product");
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
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
}

