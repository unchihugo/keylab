/** @format */

import React from "react"
import { Link } from "react-router-dom"
import { Product } from "../types/Product"
import ZoomImage from "./ZoomImage"

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
	return (
		<Link
			to={`/products/${product.data.slug}`}
			className="block border border-black w-full bg-white rounded-lg hover:drop-shadow-cartoon-y hover:-translate-y-1 duration-200 overflow-hidden">
			<div className="w-full h-fit bg-gray-200 rounded-md object-fill -z-10 flex items-center justify-center">
				{product.data.product_images &&
					product.data.product_images.length > 0 && (
						<ZoomImage
							src={product.data.product_images[0].data.url}
							alt={product.data.product_images[0].data.image}
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