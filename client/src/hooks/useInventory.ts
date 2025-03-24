import { useState, useEffect } from "react";
import { inventoryService } from "../services/inventoryService";
import { Product } from "../types/Product";

export function useInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await inventoryService.getProducts();
            if (response && response.data && response.data.products) {
                setProducts(response.data.products);
            } else {
                setError("Failed to load products: Invalid API response.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to load products. Please check your network or try again.");
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (product: Product) => {
        setLoading(true);
        try {
            const newProduct = await inventoryService.createProduct(product);
            if (newProduct && newProduct.data) {
                setProducts((prev) => [...prev, newProduct.data]);
            } else {
                setError("Failed to add product: Invalid API response.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to add product. Please check your network or try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: string, updatedProduct: Product) => {
        setLoading(true);
        try {
            const updated = await inventoryService.updateProduct(id, updatedProduct);
            if (updated && updated.data) {
                setProducts((prev) =>
                    prev.map((prod) => (prod.id === id ? updated.data : prod))
                );
            } else {
                setError("Failed to update product: Invalid API response.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to update product. Please check your network or try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        setLoading(true);
        try {
            const success = await inventoryService.deleteProduct(id);
            if (!success) {
                setError("Failed to delete product.");
            } else {
                setProducts((prev) => prev.filter((prod) => prod.id !== id));
            }

        } catch (err: any) {
            setError(err.message || "Failed to delete product. Please check your network or try again.");
        } finally {
            setLoading(false);
        }
    };

    return { products, loading, error, addProduct, updateProduct, deleteProduct };
}
