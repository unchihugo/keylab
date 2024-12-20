/** @format */

import { useParams } from "react-router-dom"
import { useProduct } from "../../hooks/useProduct"
import NotFound from "../NotFound"
import { Minus, Plus } from "lucide-react"
import LinkButton from "../../components/LinkButton"
import ZoomImage from "../../components/ZoomImage"
import Breadcrumb from "../../components/Breadcrumb"
import ProductCarousel from "../../components/ProductCarousel"

export default function Product() {
	const { slug } = useParams()
	const {
		product,
		relatedProducts,
		loading,
		error,
		quantity,
		addProductToCart,
		incrementQuantity,
		decrementQuantity,
	} = useProduct(slug as string)

	if (loading) return <div>Loading...</div>
	if (error)
		return <NotFound errorMessage="400 - Bad Request" bodyMessage={error} />
	if (!product)
		return (
			<NotFound bodyMessage="The product you are looking for does not exist, or it may have been removed." />
		)

	console.log(product)
	let breadcrumbs
	if (!product.data.category) breadcrumbs = ["Shop", product.data.name]
	else
		breadcrumbs = [
			"Shop",
			// String(product.data.category.name) || "",
			"Keyboard",
			product.data.name,
		]

	return (
		<div className="flex justify-center items-center bg-primary/25">
			<div className="max-w-screen-lg w-full my-32 mx-6">
				{/* TODO: add breadcrumbs component */}
				<div className="w-full text-black/50">
					<Breadcrumb breadcrumbs={breadcrumbs} />
				</div>
				<div className="my-4 md:grid md:grid-cols-2 lg:grid-cols-5 gap-10 items-center w-full">
					<div className="w-full aspect-square rounded-lg bg-white lg:col-span-3 flex items-center">
						{product.data.product_images &&
							product.data.product_images.length > 0 && (
								<ZoomImage
									src={product.data.product_images[0].url}
									alt={product.data.product_images[0].image}
								/>
							)}
					</div>
					<div className="lg:col-span-2 flex-col gap-5 inline-flex">
						<div>
							<div className="text-black/50">
								Tag1 | Tag2 | Tag3
							</div>
							<div className="text-black">
								⭐⭐⭐⭐⭐{" "}
								<span className="font-bold">4.8</span> (10
								reviews)
							</div>
						</div>
						<div className="text-4xl font-display">
							{product.data.name}
						</div>
						<div>
							<div className="text-2xl font-medium">
								£{product.data.price}
							</div>
							<div className="text-xs text-black/50">
								Tax included.
							</div>
						</div>
						<div className="w-full space-y-3">
							<label htmlFor="quantity" className="text-sm block">
								Quantity
							</label>
							<div className="justify-start items-start gap-3 inline-flex w-full">
								<div className="h-11 bg-white rounded-full border border-black justify-center items-center gap-4 flex">
									<button
										className="p-3"
										onClick={decrementQuantity}>
										<Minus className="w-4 h-4 relative" />
									</button>
									<div className="tracking-tight leading-tight w-2 text-center -mx-3">
										{quantity}
									</div>
									<button
										className="p-3"
										onClick={incrementQuantity}>
										<Plus className="w-4 h-4 relative" />
									</button>
								</div>
								<button
									className="grow shrink basis-0 h-11 bg-white rounded-full border border-black justify-center items-center gap-2 flex"
									onClick={addProductToCart}>
									Add to cart
								</button>
							</div>
							<div>
								<LinkButton
									text="Buy now"
									to="/cart"
									buttonClassNames="bg-secondary-dark h-11 w-full"
									textClassNames="p-3"
								/>
							</div>
						</div>
						<div className="text-lg">
							<div className="text-lg font-medium">
								Description
							</div>
							<div className="leading-tight">
								{product.data.description}
							</div>
						</div>
					</div>
				</div>

				<div className="my-12">
					<div className="text-2xl font-display mt-4">
						Related products
					</div>
					<ProductCarousel products={relatedProducts} />
				</div>

				<div className="my-12">
					<div className="text-2xl font-display my-4">
						Black Friday deals
					</div>
					<div className="flex h-40 bg-black/10" />
				</div>

				<div className="my-24">
					<div className="text-2xl font-display w-full my-4 text-center">
						User reviews
					</div>
					<div className="flex h-screen bg-black/10" />
				</div>
			</div>
		</div>
	)
}
