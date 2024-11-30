/** @format */

import { useEffect, useState } from "react"
import { Product } from "../types/Product"
import { productService } from "../services/productService"

/**
 * Hook that returns a product by its slug
 * @param slug The product's slug
 * @returns An object with the product, loading state, and error state
 * @see ../../../../server/database/models/Product.go
 */
export const useProduct = (slug: string) => {
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true)
				const response = await productService.getProductBySlug(slug)
				setProduct(response)
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "An error occurred",
				)
			} finally {
				setLoading(false)
			}
		}

		const fetchTestProduct = () => {
			setProduct({
				data: {
					id: 1,
					name: "Test Product Lorem Ipsum",
					slug: "test-product-slug",
					description:
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
					price: 10.99,
					stock: 100,
					category_id: 1,
				},
				message: "Product found",
			})
		}

		if (slug) {
			if (slug === "test-product-slug") {
				fetchTestProduct()
			} else {
				fetchProduct()
			}
		}
	}, [slug])

	return { product, loading, error }
}
