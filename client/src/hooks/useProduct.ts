/** @format */

import { useEffect, useState } from "react"
import { Product } from "../types/Product"
import { productService } from "../services/productService"
import { useNavigate } from "react-router-dom"
import { cartServices } from "../services/cartServices"

/**
 * Hook that returns a product by its slug
 * @param slug The product's slug
 * @returns An object with the product, loading state, and error state
 * @see ../../../../server/database/models/Product.go
 */
export const useProduct = (slug: string) => {
	const [product, setProduct] = useState<Product | null>(null)
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [quantity, setQuantity] = useState(1)
	const navigate = useNavigate()
	const [addToCart, setAddToCart] = useState(false)

	// Fetch the product by its slug when the component mounts
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
					product_images: [
						{
							id: 1,
							product_id: 1,
							image: "Keychron V1 Custom Mechanical Keyboard frosted black knob K-Pro red",
							url: "http://localhost:8080/products/image/public/seed/ducky-one-2-mini.jpg",
							primary_image: true,
						},
					],
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

	// Fetch related products when the product changes
	useEffect(() => {
		const fetchRelatedProducts = async () => {
			if (!product?.data.name) return
			try {
				// cut the product name and get the first word for query
				const query = String(product.data.name).split(" ")[0]
				const response = await productService.searchProducts(query)
				// remove the current product from the related products
				setRelatedProducts(response.data.products)
				console.log(response.data.products)
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "An error occurred",
				)
			}
		}

		fetchRelatedProducts()
	}, [product?.data.name])

	/**
	 * Add the current product to user's cart, taking into account the quantity
	 */
	const addProductToCart = async () => {
		if (!product) return
		if (quantity < 1) return
		if (quantity > product.data.stock) return

		try {
			// Add product to cart
			setAddToCart(true)
			await cartServices.AddCartItem(product.data.id, quantity)
			navigate("/cart")
		} catch (error) {
			console.error(error)
		} finally {
			setAddToCart(false)
		}
	}

	/**
	 * Increase the quantity of the product to be added to the cart by 1
	 */
	const incrementQuantity = () => {
		setQuantity((prev) => prev + 1)
	}

	/**
	 * Descrease the quantity of the product to be added to the cart by 1 if it's not already 1
	 */
	const decrementQuantity = () => {
		setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
	}

	return {
		product,
		relatedProducts,
		loading,
		error,
		quantity,
		addToCart,
		incrementQuantity,
		decrementQuantity,
		addProductToCart,
	}
}
