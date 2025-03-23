/** @format */

import { Link } from "react-router-dom"
import LinkButton from "../components/LinkButton"
import ProductCarousel from "../components/ProductCarousel"
import { useProducts } from "../hooks/useProducts"
import Divider from "../components/Divider"
import { ProductReview } from "../types/ProductReview"
import { useEffect, useState } from "react"
import { reviewService } from "../services/reviewService"
import { Star } from "lucide-react"
import ZoomImage from "../components/ZoomImage"

export default function Home() {
	const { products: popularKeycaps } = useProducts("keycap")
	const { products: popularKeyboards } = useProducts("keyboard")
	const { products: duckyProducts } = useProducts("ducky")
	const [recentReviews, setRecentReviews] = useState<ProductReview[]>([])

	useEffect(() => {
		// fetch recent reviews
		const fetchRecentReviews = async () => {
			const reviews = await reviewService.fetchRecentReviews(4)
			setRecentReviews(reviews.data)
		}
		fetchRecentReviews()
	}, [])

	return (
		<div className="flex justify-center items-center bg-primary/25">
			<div className="max-w-screen-2xl w-full my-28 px-6">
				{/* hero section */}
				<div>
					<div className="flex flex-col md:flex-row gap-3">
						{/* First main column - takes up 1/2 of the space */}
						<Link
							to={"/shop?category=1"}
							className="md:w-1/2 bg-white rounded-lg p-6 h-56 md:h-96 flex flex-col justify-between bg-right bg-no-repeat bg-[length:85%] transition-all duration-300 hover:bg-[length:90%]"
							style={{
								backgroundImage:
									"url('./home/keyboards-lined-up.png')",
							}}>
							<h3 className="text-2xl font-display mb-4">
								Prebuilt Keyboards
							</h3>
							<p className="text-sm font-medium">
								Discover our premium selection.
							</p>
						</Link>

						{/* Second main column - takes up 1/2 of the space */}
						<div className="md:w-1/2">
							<div className="flex flex-col md:flex-row gap-3 h-full">
								{/* First sub-column of second main column */}
								<Link
									to={"/shop"}
									className="md:w-1/2 bg-[#DDDCED] rounded-lg p-6 h-full flex flex-col justify-between bg-center bg-no-repeat bg-[length:90%] transition-all duration-300 hover:bg-[length:95%]"
									style={{
										backgroundImage:
											"url('./home/CreatorboardXL.webp')",
									}}>
									<h3 className="text-xl font-display mb-4">
										Keyboard Designer
									</h3>
									<p className="text-sm font-medium">
										Build your dream keyboard with ease.
									</p>
								</Link>

								{/* Second sub-column of second main column - divided into two rows */}
								<div className="md:w-1/2 flex flex-col gap-3">
									{/* First row of second sub-column */}
									<Link
										to={"/shop?category=7"}
										className="h-1/2 bg-[#E0E1CE] rounded-lg p-6 flex flex-col justify-between bg-center bg-no-repeat bg-[length:55%] transition-all duration-300 hover:bg-[length:60%]"
										style={{
											backgroundImage:
												"url('./home/keycap-pile.png')",
										}}>
										<h3 className="text-xl font-display mb-2">
											Keycaps
										</h3>
										<p className="text-sm font-medium">
											Explore vibrant keycap sets.
										</p>
									</Link>

									{/* Second row of second sub-column */}
									<Link
										to={"/shop?category=8"}
										className="h-1/2 bg-[#E5CCD0] rounded-lg p-6 flex flex-col justify-between bg-center bg-no-repeat bg-[length:80%] transition-all duration-300 hover:bg-[length:85%]"
										style={{
											backgroundImage:
												"url('./home/kailh-switches.webp')",
										}}>
										<h3 className="text-xl font-display mb-2">
											Switches
										</h3>
										<p className="text-sm font-medium">
											Customise your typing experience.
										</p>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* product carousel section */}
				<div>
					<div className="mt-8">
						<div className="text-xl font-display my-4">
							Popular Keycaps
						</div>
						<ProductCarousel
							products={popularKeycaps}
							hideOverflow={true}
						/>
					</div>

					<div className="mb-8">
						<div className="text-xl font-display mb-4">
							Popular Keyboards
						</div>
						<ProductCarousel
							products={popularKeyboards}
							hideOverflow={true}
						/>
					</div>
				</div>

				{/* banner section */}
				<div
					className="bg-cover bg-center bg-no-repeat py-28 text-left rounded-lg"
					style={{
						backgroundImage:
							"url('./public/home/Keychron-K6-Pro-Promo-image.png')",
					}}>
					<div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center">
						{/* Left Text Section */}
						<div className="flex flex-col w-full md:w-1/2">
							<h2 className="text-xl sm:text-4xl font-display text-primary drop-shadow-cartoon tracking-tight [-webkit-text-stroke:_1px_black]">
								Your one-stop shop for
							</h2>
							<h2 className="text-2xl sm:text-5xl md:text-6xl font-display text-white drop-shadow-cartoon tracking-tight [-webkit-text-stroke:_1px_black]">
								KEYCAPS, SWITCHES & KEYBOARDS
							</h2>

							<div className="flex justify-start space-x-4 mt-6">
								<LinkButton
									text="Shop now"
									buttonClassNames=" bg-primary"
									textClassNames="px-6 py-2"
									to="/shop"
								/>

								<LinkButton
									text="Try our Keyboard Designer"
									buttonClassNames="bg-primary-dark"
									textClassNames="px-6 py-2"
									to="/keyboard-designer"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="my-12">
					<div className="text-xl font-display my-4">
						Ducky Products
					</div>
					<ProductCarousel products={duckyProducts} />
				</div>

				{/* quotes section */}
				<div className="mt-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
						<div className="flex flex-col">
							<div className="mb-6">
								<div className="flex mb-1">
									<p className="font-display text-xl">
										The Ultimate Keyboard Catalog
									</p>
								</div>
								<p className="">
									Find your perfect mechanical keyboard from
									our curated collection of premium products.
								</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="mb-6">
								<div className="flex mb-1">
									<p className="font-display text-xl">
										Customization Heaven
									</p>
								</div>
								<p className="">
									Mix and match switches, keycaps, and cases
									to create your dream setup.
								</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="mb-6">
								<div className="flex mb-1">
									<p className="font-display text-xl">
										Top Quality Products
									</p>
								</div>
								<p className="">
									We carefully select products from trusted
									brands offering a premium experience.
								</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="mb-6">
								<div className="flex mb-1">
									<p className="font-display text-xl">
										Expert Advice
									</p>
								</div>
								<p className="">
									Our team of experts is here to help you
									along the way to find the perfect keyboard
									for your needs.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* i havent touched the page beyond this line */}
				<Divider />

				{/* reviews */}
				<div className="mt-16">
					<div className="text-xl font-display my-4">
						Most Recent Reviews
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
						{recentReviews.map((review, index) => (
							<Link
								to={`/products/${review.product.slug}`}
								key={review.id || index}
								className="group flex flex-col bg-white rounded-lg p-6 border border-black hover:drop-shadow-cartoon-y hover:-translate-y-1 duration-200 active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y">
								<div className="">
									{review.product.product_images &&
										review.product.product_images.length >
											0 && (
											<ZoomImage
												src={
													review.product
														.product_images[0].url
												}
												alt={
													review.product
														.product_images[0].image
												}
											/>
										)}

									<div className="group-active:translate-y-0.5 flex mb-1">
										<p className="font-bold">
											{`Review for ${review.product.name}`}
										</p>
									</div>
									<div className="group-active:translate-y-0.5 flex items-center mb-2">
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
										<span className="ml-2 text-sm">
											{review.user.forename}{" "}
											{review.user.surname}
										</span>
									</div>
									<p className="group-active:translate-y-0.5 line-clamp-3">
										{review.comment}
									</p>
								</div>
							</Link>
						))}
						{recentReviews.length === 0 && (
							<div className="col-span-full text-center py-8">
								<p>No reviews available yet.</p>
							</div>
						)}
					</div>
				</div>

				<section className="py-16 px-8">
					<div className="flex gap-4">
						{/* First Product Image Box */}
						<div className="h-64 w-full bg-gray-200 rounded-md border-4 border-pink-100 flex items-center justify-center">
							<img
								src="https://via.placeholder.com/600x400?text=Product+Image" /* replace placeholder with actual product images */
								alt="Keycaps"
								className="w-full h-full object-cover rounded-md"
							/>
						</div>

						{/* Second Product Image Box */}
						<div className="h-64 w-full bg-gray-200 rounded-md border-4 border-purple-100 flex items-center justify-center">
							<img
								src="https://via.placeholder.com/600x400?text=Product+Image" /* replace placeholder with actual product images */
								alt="Switches"
								className="w-full h-full object-cover rounded-md"
							/>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
