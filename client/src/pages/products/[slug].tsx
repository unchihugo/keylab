/** @format */

import { useParams } from "react-router-dom"
import { useProduct } from "../../hooks/useProduct"
import { useProductReviews } from "../../hooks/useProductReviews"
import NotFound from "../NotFound"
import { Minus, Plus, Star } from "lucide-react"
import LinkButton from "../../components/LinkButton"
import ZoomImage from "../../components/ZoomImage"
import Breadcrumb from "../../components/Breadcrumb"
import ProductCarousel from "../../components/ProductCarousel"
import { useState } from "react"
import { useAuth } from "../../AuthContext"
import Divider from "../../components/Divider"
import UserReviewForm from "../../components/UserReviewForm"

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
		addToCart,
	} = useProduct(slug as string)
	const {
		reviews,
		statistics,
		userReview,
		submitReview,
		deleteReview,
		updateReview,
	} = useProductReviews(slug as string)
	const [isEditingReview, setIsEditingReview] = useState(false)
	const { isAuthenticated } = useAuth()

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
							{/* <div className="text-black/50">
								Tag1 | Tag2 | Tag3
							</div> */}
							{statistics ? (
								<div className="flex">
									{Array.from(
										{ length: statistics.average_rating },
										(_, i) => (
											<Star
												key={i}
												fill="#ffd063"
												strokeWidth={0}
												className="inline-block"
											/>
										),
									)}
									<span className="font-bold me-1">
										{statistics.average_rating}{" "}
									</span>
									({statistics.total_reviews} reviews)
								</div>
							) : (
								<div>No reviews yet</div>
							)}
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
									{addToCart ? "Added!" : "Add to cart"}
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

				{/* product carousels section */}
				<div className="my-12">
					<div className="text-2xl font-display mt-4">
						Related products
					</div>
					<ProductCarousel products={relatedProducts} />
				</div>

				{/* <div className="my-12">
					<div className="text-2xl font-display my-4">
						Black Friday deals
					</div>
					<div className="flex h-40 bg-black/10" />
				</div> */}

				{/* user reviews section */}
				<div className="my-24">
					<div className="text-2xl font-display w-full mt-4 text-center">
						User reviews
					</div>
					<div className="w-full">
						{statistics ? (
							<div className="flex justify-center items-center gap-4">
								<div className="flex justify-center items-center">
									{Array.from(
										{ length: statistics.average_rating },
										(_, i) => (
											<Star
												key={i}
												fill="#ffd063"
												strokeWidth={0}
												className="inline-block"
											/>
										),
									)}
									<span className="font-bold">
										{statistics.average_rating} average
									</span>
								</div>
								<div className="text-black/50">
									{statistics.total_reviews} reviews total
								</div>
							</div>
						) : (
							<div className="flex justify-center items-center gap-4">
								<div>No reviews yet</div>
								<div className="text-black/50">
									Be the first to review this product
								</div>
							</div>
						)}

						{/* user's review */}
						{userReview ? (
							<div className="mt-4 border border-black w-full bg-white rounded-lg px-6 py-3">
								{isEditingReview ? (
									<>
										<div className="font-medium text-2xl mb-2">
											Edit your review
										</div>
										<UserReviewForm
											initialRating={userReview.rating}
											initialComment={userReview.comment}
											onSubmit={(data) => {
												updateReview(
													userReview.id,
													data,
												)
												setIsEditingReview(false)
											}}
											buttonText="Update Review"
										/>
									</>
								) : (
									<>
										<div className="font-medium text-2xl">
											Your review
										</div>
										<div className="text-lg">
											{Array.from(
												{ length: userReview.rating },
												(_, i) => (
													<Star
														key={i}
														fill="#ffd063"
														strokeWidth={0}
														className="inline-block"
													/>
												),
											)}
										</div>
										<div className="flex items-center gap-4">
											<div className="font-bold">
												{userReview.user_id}
											</div>
											<div className="text-black/50 text-sm">
												{userReview.updated_at
													? new Date(
															userReview.updated_at,
														).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															},
														)
													: "No date available"}
											</div>
										</div>
										<Divider />
										<div className="text-pretty">
											{userReview.comment}
										</div>
										<div className="flex gap-2 justify-end">
											<button
												className="bg-white text-black p-2 px-4 rounded-full border
												h-11 border-black justify-center items-center"
												onClick={() => {
													deleteReview(userReview.id)
												}}>
												Delete review
											</button>
											<button
												className="bg-primary text-black p-2 px-4 rounded-full border
												h-11 border-black justify-center items-center"
												onClick={() =>
													setIsEditingReview(true)
												}>
												Edit review
											</button>
										</div>
									</>
								)}
							</div>
						) : isAuthenticated ? (
							<div className="mt-4 border border-black w-full bg-white rounded-lg px-6 py-3">
								<div className="font-medium text-2xl mb-2">
									Write a review
								</div>
								<UserReviewForm
									onSubmit={(data) => {
										submitReview(data)
									}}
								/>
							</div>
						) : (
							<div className="mt-4 border border-black w-full bg-white rounded-lg px-6 py-3">
								<div className="text-lg font-medium">
									Sign in to leave a review
								</div>
								<div className="flex justify-end">
									<LinkButton
										to="/sign-in"
										text="Sign in"
										buttonClassNames="bg-primary text-white"
										textClassNames="p-2"
									/>
								</div>
							</div>
						)}

						{/* other user reviews */}

						{reviews.length > 0 &&
							reviews.map((review) => (
								<div
									key={review.id}
									className="mt-4 border border-black w-full bg-white rounded-lg px-6 py-3">
									<div className="text-lg">
										{Array.from(
											{ length: review.rating },
											(_, i) => (
												<Star
													key={i}
													fill="#ffd063"
													strokeWidth={0}
													className="inline-block"
												/>
											),
										)}
									</div>
									<div className="flex items-center gap-4">
										<div className="font-bold">
											{review.user.forename}{" "}{review.user.surname}
										</div>
										<div className="text-black/50 text-sm">
											{review.updated_at
												? new Date(
														review.updated_at,
													).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														},
													)
												: "No date available"}
										</div>
									</div>
									<Divider />
									<div className="text-pretty">
										{review.comment}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}
