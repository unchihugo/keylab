/** @format */

import React from "react"
import { Link } from "react-router-dom"
import { Product } from "../types/Product"
import ZoomImage from "./ZoomImage"

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
	return (
		<Link
			to={`/products/${product.data.slug}`}
			className="block w-full p-4 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
			<div className="w-full h-48 bg-gray-200 rounded-md object-fill mb-4 -z-10">
				{product.data.product_images &&
					product.data.product_images.length > 0 && (
						<ZoomImage
							src={product.data.product_images[0].data.url}
							alt={product.data.product_images[0].data.image}
						/>
					)}
			</div>
      <h3 className="text-lg font-medium text-gray-800 relative select-none pointer-events-none">
        {product.data.name}
      </h3>
			<p className="text-gray-600 mt-2 relative select-none pointer-events-none">${product.data.price}</p>
		</Link>
	)
}

export default ProductCard
