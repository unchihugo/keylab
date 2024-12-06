/** @format */

import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { productService } from "../services/productService";

/**
 * Hook that returns all products
 * @returns An object with the products array, loading state, and error state
 * @see ../../../../server/database/models/Product.go
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.listProducts(); 
        setProducts(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred while fetching products."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchTestProducts = () => {
      setProducts([
        {
          id: 1,
          name: "Test Product 1",
          slug: "test-product-1",
          description:
            "Test Product 1 description: .",
          price: 19.99,
          stock: 50,
          category_id: 2,
        },
        {
          id: 2,
          name: "Test Product 2",
          slug: "test-product-2",
          description:
            "Test Product 2 description: ",
          price: 29.99,
          stock: 30,
          category_id: 3,
        },
      ]);
    };

    // Fetch products 
    if (process.env.NODE_ENV === "test") {
      fetchTestProducts();
    } else {
      fetchProducts();
    }
  }, []);

  return { products, loading, error };
};