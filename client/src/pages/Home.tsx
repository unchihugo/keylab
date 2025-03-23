/** @format */

import { Link } from "react-router-dom"
import LinkButton from "../components/LinkButton"
import ProductCarousel from "../components/ProductCarousel"
import { useProducts } from "../hooks/useProducts"
import Divider from "../components/Divider"

export default function Home() {
	const { products: popularKeycaps } = useProducts("keycap")
	const { products: popularKeyboards } = useProducts("keyboard")
	const { products: duckyProducts } = useProducts("ducky")

	return (
		<div className="flex justify-center items-center bg-primary/25">
			<div className="max-w-screen-2xl w-full my-28 px-6">
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
				/>

				{/* hero section */}
				<div>
					<div className="flex flex-col md:flex-row gap-3">
						{/* First main column - takes up 1/2 of the space */}
						<Link
							to={"/shop?category=keyboard"}
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
										to={"/shop?category=keycap"}
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
										to={"/shop?category=switch"}
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

				{/* Reviews Section */}
				<section className="py-16 px-8 bg-yellow-50">
					<h2 className="text-2xl font-body text-center mb-8">
						Latest Reviews
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-lg mx-auto">
						{[
							"bg-primary-dark",
							"bg-blue-100",
							"bg-purple-100",
							"bg-pink-100",
						].map((bgColor, index) => (
							<div
								key={index}
								className={`${bgColor} p-6 rounded-lg shadow-md text-center`}>
								<div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
								<h4 className="text-lg font-display">
									Review Title
								</h4>
								<p className="text-gray-600 font-body mt-2">
									Review Body
								</p>
								<p className="text-sm text-gray-500 font-body mt-4">
									Reviewer Name - Date
								</p>

								{/* Star Icons */}
								<div className="flex justify-center space-x-1 mt-4">
									<i className="fas fa-star text-yellow-400"></i>
									<i className="fas fa-star text-yellow-400"></i>
									<i className="fas fa-star text-yellow-400"></i>
									<i className="fas fa-star text-yellow-400"></i>
									<i className="fas fa-star text-gray-300"></i>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	)
}
