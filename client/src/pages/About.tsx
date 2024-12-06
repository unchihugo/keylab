/** @format */

import Divider from "../components/Divider"

export default function About() {
	return (
		<div className="flex justify-center items-center bg-secondary min-h-screen">
			<div className="flex flex-col w-full max-w-3xl px-4 space-y-6 my-24">
				{/* About Us */}
				<div className="px-6 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
					<div className="text-2xl font-display text-black mb-4">
						About Us
					</div>
					<Divider />
					<div className="flex flex-col space-y-6 font-body text-gray-600">
						{/* Vision */}
						<section>
							<h2 className="text-xl font-semibold text-gray-800 mb-4">
								Our Vision
							</h2>
							<p>
								At Keylab, we specialise in creating a unique
								experience for our customers by offering a range
								of high-quality products designed to enhance
								both function and aesthetics. Whether it's
								smooth switches, keycaps or the chance to
								completely personalise your own keyboard, we
								have it all!
							</p>
							<p className="mt-4">
								Our vision is to empower creators,
								professionals, and gamers with tools that
								enhance performance, comfort and creativity,
								allowing people to express themselves. Our
								commitment to innovation drives us to give
								everyone the chance to elevate their experince.
							</p>
						</section>
					</div>
				</div>

				{/* Slogan */}
				<div className="px-6 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
					<div className="text-lg font-body italic text-gray-700 text-center">
						"Build your perfect board!"
					</div>
				</div>
			</div>
		</div>
	)
}
