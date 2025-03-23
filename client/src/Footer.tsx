/** @format */

import keylabicon from "./assets/keylab-icon.svg"

export default function Footer() {
	return (
		<footer className="bg-white py-12 px-8 border-t text-sm">
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
			/>
			<div className="max-w-screen-lg mx-auto flex flex-col items-center space-y-6">
				{/* Logo Section */}
				<div className="flex flex-col items-center">
					<img src={keylabicon} alt="Logo" className="h-10 mb-2" />
					<p>© Copyright</p>
					<p>Keylab, 2024</p>
				</div>

				{/* Navigation Links Section with Dividers */}
				<div className="grid grid-cols-3 gap-8 w-full max-w-2xl relative">
					{/* First Column */}
					<div className="flex flex-col space-y-3 items-end">
						<a href="/shop" className="hover:text-gray-900 font-medium">
							Shop
						</a>
						<a href="/keyboard-designer" className="hover:text-gray-900 font-medium">
							Keyboard Designer
						</a>
					</div>
					
					{/* Vertical Divider */}
					<div className="absolute h-full w-px bg-gray-200 left-1/3"></div>
					
					{/* Second Column */}
					<div className="flex flex-col space-y-3 items-center">
						<a href="/about" className="hover:text-gray-900 font-medium">
							About
						</a>
						<a href="/about" className="hover:text-gray-900 font-medium">
							Contact Us
						</a>
					</div>
					
					{/* Vertical Divider */}
					<div className="absolute h-full w-px bg-gray-200 left-2/3"></div>
					
					{/* Third Column */}
					<div className="flex flex-col space-y-3">
						<a href="/admin/login" className="hover:text-gray-900 font-medium">
							Admin Portal
						</a>
					</div>
				</div>

				{/* Social Media Icons */}
				<div className="flex justify-center space-x-6">
					<a href="#" className="text-black/50 hover:text-black">
						<i className="fab fa-facebook-f text-xl"></i>
					</a>
					<a href="#" className="text-black/50 hover:text-black">
						<i className="fab fa-twitter text-xl"></i>
					</a>
					<a href="#" className="text-black/50 hover:text-black">
						<i className="fab fa-instagram text-xl"></i>
					</a>
					<a href="#" className="text-black/50 hover:text-black">
						<i className="fab fa-linkedin-in text-xl"></i>
					</a>
				</div>
			</div>
		</footer>
	)
}
