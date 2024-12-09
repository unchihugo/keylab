/** @format */

import React from "react"
import { Link } from "react-router-dom"
import { Product } from "../types/Product"
import ZoomImage from "./ZoomImage"

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
	const linkTo = `/products/${product.data.slug}`

	return (
		<Link
			to={linkTo}
			className="block border border-black w-full h-80 bg-white rounded-lg hover:drop-shadow-cartoon-y hover:-translate-y-1 duration-200 overflow-hidden">
			<div className="w-full aspect-square rounded-md object-fill -z-10 flex items-center justify-center">
				{product.data.product_images &&
					product.data.product_images.length > 0 && (
						<ZoomImage
							src={product.data.product_images[0].url}
							alt={product.data.product_images[0].image}
						/>
					)}
			</div>
			<div className="p-4">
				<h3 className="font-medium leading-tight text-gray-800 relative select-none pointer-events-none">
					{product.data.name}
				</h3>
				<p className="text-gray-500 relative select-none pointer-events-none">
					${product.data.price}
				</p>
			</div>
		</Link>
	)
}

export default ProductCard
