/** @format */

import React, { useState, useEffect } from "react"
import Divider from "../components/Divider"
import { cartServices } from "../services/cartServices" 

export default function KeyboardDesigner() {
	const [bgColor, setBgColor] = useState("#B0C4DE")
	const [keyColors, setKeyColors] = useState(["#FF6F61", "#EAE6FF", "#D8BFD8"])
	const [selectedOption, setSelectedOption] = useState("") 
	const [notification, setNotification] = useState("") 
	const [keyboardImage, setKeyboardImage] = useState("keyboard.png")


	const handleAddToCart = async () => {
		if (!selectedOption) {
			setNotification("Please select a color option before adding to the cart.")
			return
		}
	
		const productId = 55; 
		const quantity = 1;    
	
		try {
			await cartServices.AddCartItem(productId, quantity)
			setNotification("Added Custom Keylab Keyboard To Cart!")
		} catch (error) {
			console.error("Failed to add item to cart:", error)
			setNotification("Failed to add item to cart. Please try again.")
		}
	}
	

	return (
		<div
			className="flex justify-start items-start min-h-screen pl-12 pt-10 transition-all duration-300"
			style={{ backgroundColor: bgColor }}>
			<div className="w-full max-w-5xl">
				{/* Keyboard Designer Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-16 p-6">
					{/* Keyboard Designer Container */}
					<div className="bg-white drop-shadow-cartoon rounded-lg border border-black p-6 h-[600px]">
						<div className="text-3xl font-display mb-4">
							Keyboard Designer
						</div>
						<Divider />

						{/* Color Customizer */}
						<div className="bg-white border border-black rounded-lg p-4 ">
							<h3 className="text-2x1 font-display mb-4">
								Color Customizer
							</h3>
							<hr className="my-2" />

							{/* Color Options */}
							<div className="space-y-3">
								{[
									{ name: "Avocado", bg: "#A78B71", colors: ["#B8B42D", "#697A21", "#FFFCE8"] },
									{ name: "Lavender", bg: "#8A6794", colors: ["#EAE6FF", "#D8BFD8", "#B19CD9"] },
									{ name: "Futuristic", bg: "#C0C0C0", colors: ["#000000", "#4B4B4B", "#00AEEF"] },
									{ name: "Forest", bg: "#9CAF88", colors: ["#2E8B57", "#004B23", "#000000"] },
									{ name: "Rose", bg: "#A35426", colors: ["#E5E5E0", "#7A8676", "#B15C66"] },
									{ name: "Ocean", bg: "#5069A5", colors: ["#001F3F", "#4CA6A8", "#87CEEB"] },
									{ name: "Electric", bg: "#312778", colors: ["#0D0D0D", "#8A2BE2", "#00FFFF"] },
								].map((option, index) => (
									<div
										key={option.name}
										className={`flex gap-6 hover:bg-[${option.bg}] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md`}
										onClick={() => {
											setBgColor(option.bg)
											setKeyColors(option.colors)
											setSelectedOption(option.name)
											setKeyboardImage(`keyboard${index + 1}.png`)
											setNotification("") // Reset the notification when switching keyboards
										}}>
										<span>{option.name}</span>
										<div className="flex ml-auto">
											{option.colors.map((color, index) => (
												<div key={index} className="w-10 h-8" style={{ backgroundColor: color }} />
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Keyboard Image */}
					<div className="flex-grow flex justify-end items-center pr-20">
						<img
							src={`/keyboard/${keyboardImage}`}
							alt="Keyboard Design"
							className="w-[700px] max-w-[700px] h-auto object-contain ml-auto shadow-2xl mr-[-400px]"
						/>
					</div>
				</div>

				{/* Add to Cart Button */}
				<div className="fixed bottom-6 right-6">
					<button
						onClick={handleAddToCart}
						disabled={!selectedOption}
						className={`w-full py-2 px-4 rounded-lg text-white font-bold transition duration-200 ${
							selectedOption
								? "bg-[#4CAF50] hover:bg-[#45a049]"
								: "bg-gray-400 cursor-not-allowed"
						}`}>
						Add to Cart £89.99
					</button>

					{/* Notification for added to cart*/}
					{notification && (
						<div className="mt-2 text-black-600 text-sm font-medium">
							{notification}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
