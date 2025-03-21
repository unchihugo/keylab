/** @format */

import { Product } from "../types/Product"
import ProductCard from "./ProductCard"

interface ProductCarouselProps {
	products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
	if (products.length === 0) return <p>No products found</p>

	return (
		<div className="flex py-2 overflow-x-auto overflow-y-hidden snap-x snap-mandatory gap-4 pb-4">
			{products.map((product) => (
				<div className="flex-none h-full w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-16px)] lg:w-[calc(20%-16px)] snap-start">
					<ProductCard key={product.data.id} product={product} />
				</div>
			))}
		</div>
	)
}
