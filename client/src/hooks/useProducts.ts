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
          data: {
            id: 1,
            name: "Test Product 1",
            slug: "test-product-1",
            description: "Test Product 1 description: .",
            price: 19.99,
            stock: 50,
            category_id: 2,
          },
          message: "Product found",
        },
        {
          data: {
            id: 2,
            name: "Test Product 2",
            slug: "test-product-2",
            description: "Test Product 2 description: ",
            price: 29.99,
            stock: 30,
            category_id: 3,
          },
          message: "Product found",
        },
        {
          data: {
          id: 3,
          name: "Test Product 3",
          slug: "test-product-3",
          description: "Test Product 3 description: ",
          price: 15.99,
          stock: 20,
          category_id: 4,
        },
        message: "Product found",
      },
      {
        data: {
        id: 4,
        name: "Test Product 4",
        slug: "test-product-4",
        description: "Test Product 4 description: ",
        price: 20.99,
        stock: 60,
        category_id: 5,
      },
      message: "Product found",
    },
    { 
      data: {
      id: 5,
      name: "Test Product 5",
      slug: "test-product-5",
      description: "Test Product 5 description: ",
      price: 49.99,
      stock: 10,
      category_id: 6,
    },
    message: "Product found",
  },
      ]);
    };

    // Fetch products 
    if (import.meta.env.MODE === "test") {
      fetchTestProducts();
    } else {
      fetchProducts();
    }
  }, []);

  return { products, loading, error };
};