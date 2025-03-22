/** @format */

import { useEffect, useState } from "react"
import { Product } from "../types/Product"
import { productService } from "../services/productService"

/**
 * Hook that returns all products
 * @returns An object with the products array, loading state, and error state
 * @see ../../../../server/database/models/Product.go
 */
export const useProducts = (searchTerm: string = "") => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchProducts = async () => {
		try {
			setLoading(true)
			const response = await productService.listProducts()
			setProducts(response.data.products)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while fetching products.",
			)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const fetchTestProducts = () => {
			setProducts([
				{
					data: {
						id: 1,
						name: "Test Product Lorem Ipsum",
						slug: "test-product-slug",
						description:
							"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
						price: 10.99,
						stock: 100,
						category_id: 1,
						product_images: [
							{
								id: 1,
								product_id: 1,
								image: "Keychron V1 Custom Mechanical Keyboard frosted black knob K-Pro red",
								url: "https://www.keychron.uk/cdn/shop/products/Keychron-V1-Custom-Mechanical-Keyboard-frosted-black-knob-K-Pro-red.jpg",
								primary_image: true,
							},
						],
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
			])
		}

		// Fetch products
		if (import.meta.env.MODE == "test") {
			fetchTestProducts()
		} else {
			if (searchTerm) {
				searchProducts(searchTerm)
			} else fetchProducts()
		}
	}, [])

	const searchProducts = async (searchTerm: string) => {
		searchTerm = searchTerm.trim()
		if (searchTerm.length < 1) {
			fetchProducts()
			return
		}
		try {
			setLoading(true)
			const response = await productService.searchProducts(searchTerm)
			setProducts(response.data.products)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while searching products.",
			)
		} finally {
			setLoading(false)
		}
	}

	const getProductsByCategory = async (category: string) => {
		category = category.trim()
		try {
			setLoading(true)
			const response =
				await productService.getProductsByCategory(category)
			setProducts(response.data.products)
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while fetching products by category.",
			)
		} finally {
			setLoading(false)
		}
	}

	return { products, loading, error, searchProducts, getProductsByCategory }
}
