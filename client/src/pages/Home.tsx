/** @format */

import LinkButton from "../components/LinkButton"
import { ChevronRight } from "lucide-react"

export default function Home() {
	return (
		<div className="bg-yellow-50 min-h-screen font-sans">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
			/>

			{/* Section */}
			<section className="bg-primary py-28 px-8 text-left mt-20">
				<div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center">
					{/* Left Text Section */}
					<div className="flex flex-col space-y-4 w-full md:w-1/2">
						<h2 className="text-3xl font-display text-primary-darker drop-shadow-cartoon">
							Your one-stop shop for
						</h2>
						<h2 className="text-5xl font-display text-primary-dark drop-shadow-cartoon">
							KEYCAPS, SWITCHES & KEYBOARDS
						</h2>

						<div className="flex justify-start space-x-4 mt-6">
							<LinkButton
								text="Shop now"
								buttonClassNames=" bg-white "
								textClassNames="px-6 py-2"
								to="/shop"
							/>

							<LinkButton
								text="Try our Keyboard Designer"
								buttonClassNames="bg-primary-darker"
								textClassNames="px-6 py-2"
								to="/keyboard-designer"
							/>
						</div>
					</div>

					{/* Right Image Section with Border */}
					<div className="w-full md:w-1/2 mt-8 md:mt-0">
						<img
							src="https://via.placeholder.com/600x400?text=Product+Image" /* TODO: replace placeholder with actual product images*/
							alt="Keyboard or Keycaps"
							className="w-full h-auto rounded-lg"
						/>
					</div>
				</div>
			</section>

			{/*product section */}
			<section className="py-16 px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto">
					{[
						{
							name: "Keycaps",
							img: "https://via.placeholder.com/600x400?text=Product+Image",
							category: "keycaps",
						} /* TODO: replace placeholder with actual product images */,
						{
							name: "Switches",
							img: "https://via.placeholder.com/600x400?text=Product+Image",
							category: "switches",
						} /* TODO: replace placeholder with actual product images */,
						{
							name: "Keyboard Bases",
							img: "https://via.placeholder.com/600x400?text=Product+Image",
							category: "keyboards",
						} /* TODO: replace placeholder with actual product images */,
					].map(({ name, img, category }, index) => (
						<div
							key={index}
							className="bg-secondary rounded-lg p-3 flex flex-col items-center border border-black">
							{/* Product Image */}
							<div className="w-full h-72 overflow-hidden mb-6">
								<img
									src={img}
									alt={name}
									className="w-full h-full object-cover"
								/>
							</div>

							<h3 className="text-xl font-body text-black mb-5">
								{name}
							</h3>
							<div className="w-full">
								<LinkButton
									text="Shop"
									buttonClassNames="bg-secondary-darker w-full"
									to={`/shop?category=${category}`}
									Icon={ChevronRight}
									iconRight={true}
								/>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="py-16 px-8">
				<div className="flex gap-6">
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
	)
}
