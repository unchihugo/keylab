/** @format */

import React, { useState, useEffect } from "react"
import Divider from "../components/Divider"
import { cartServices } from "../services/cartServices"
import { useAuth } from "../AuthContext"

export default function KeyboardDesigner() {
	const { isAuthenticated } = useAuth()
	const [bgColor, setBgColor] = useState("#B0C4DE")
	const [keyColors, setKeyColors] = useState([
		"#FF6F61",
		"#EAE6FF",
		"#D8BFD8",
	])
	const [selectedOption, setSelectedOption] = useState("")
	const [keyboardSize, setKeyboardSize] = useState<"60%" | "75%" | "100%">(
		"60%",
	)
	const [notification, setNotification] = useState("")
	const [keyboardImage, setKeyboardImage] = useState("keyboard.png")

	// Pricing and product ID mapping
	const sizeOptions: Record<
		"60%" | "75%" | "100%",
		{ productId: number; price: number }
	> = {
		"60%": { productId: 55, price: 89.99 },
		"75%": { productId: 56, price: 99.99 },
		"100%": { productId: 57, price: 109.99 },
	}

	// Color options list for indexing
	const colorOptions = [
		"Avocado",
		"Lavender",
		"Futuristic",
		"Forest",
		"Rose",
		"Ocean",
		"Electric",
	]

	// Handle size change
	const handleSizeChange = (size: "60%" | "75%" | "100%") => {
		setKeyboardSize(size)

		// Determine color index
		const colorIndex = colorOptions.indexOf(selectedOption) + 1

		// Image logic
		if (!selectedOption) {
			setKeyboardImage(
				`keyboard${size === "60%" ? "" : size === "75%" ? "75" : "100"}.png`,
			)
		} else {
			const sizePrefix =
				size === "60%" ? "" : size === "75%" ? "75" : "100"
			setKeyboardImage(`keyboard${sizePrefix}${colorIndex}.png`)
		}

		setNotification("")
	}

	// Handle color change
	const handleColorChange = (
		optionName: string,
		bg: string,
		colors: string[],
		index: number,
	) => {
		setBgColor(bg)
		setKeyColors(colors)
		setSelectedOption(optionName)

		// Image logic when color is selected
		const sizePrefix =
			keyboardSize === "60%" ? "" : keyboardSize === "75%" ? "75" : "100"
		setKeyboardImage(`keyboard${sizePrefix}${index + 1}.png`)

		setNotification("")
	}

	const handleAddToCart = async () => {
		if (!selectedOption) {
			setNotification(
				"Please select a color option before adding to the cart.",
			)
			return
		}

		const productId = sizeOptions[keyboardSize].productId
		const quantity = 1

		try {
			await cartServices.AddCartItem(productId, quantity)
			setNotification(
				`Added Custom Keylab ${keyboardSize} Keyboard To Cart!`,
			)
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
					<div className="bg-white drop-shadow-cartoon rounded-lg border border-black p-6 h-[650px]">
						<div className="text-3xl font-display mb-4">
							Keyboard Designer
						</div>
						<Divider />

						{/* Size Selector */}
						<div className="flex gap-4 mb-4">
							{(["60%", "75%", "100%"] as const).map((size) => (
								<button
									key={size}
									className={`py-2 px-4 rounded-lg border ${keyboardSize === size ? "bg-blue-500 text-white" : "bg-gray-200"}`}
									onClick={() => handleSizeChange(size)}>
									{size}
								</button>
							))}
						</div>

						{/* Color Customizer */}
						<div className="bg-white border border-black rounded-lg p-4 ">
							<h3 className="text-2x1 font-display mb-4">
								Color Customizer
							</h3>
							<hr className="my-2" />

							<div className="space-y-3">
								{[
									{
										name: "Avocado",
										bg: "#A78B71",
										colors: [
											"#B8B42D",
											"#697A21",
											"#FFFCE8",
										],
									},
									{
										name: "Lavender",
										bg: "#8A6794",
										colors: [
											"#EAE6FF",
											"#D8BFD8",
											"#B19CD9",
										],
									},
									{
										name: "Futuristic",
										bg: "#C0C0C0",
										colors: [
											"#000000",
											"#4B4B4B",
											"#00AEEF",
										],
									},
									{
										name: "Forest",
										bg: "#9CAF88",
										colors: [
											"#2E8B57",
											"#004B23",
											"#000000",
										],
									},
									{
										name: "Rose",
										bg: "#A35426",
										colors: [
											"#E5E5E0",
											"#7A8676",
											"#B15C66",
										],
									},
									{
										name: "Ocean",
										bg: "#5069A5",
										colors: [
											"#001F3F",
											"#4CA6A8",
											"#87CEEB",
										],
									},
									{
										name: "Electric",
										bg: "#312778",
										colors: [
											"#0D0D0D",
											"#8A2BE2",
											"#00FFFF",
										],
									},
								].map((option, index) => (
									<div
										key={option.name}
										className={`flex gap-6 hover:bg-[${option.bg}] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md`}
										onClick={() =>
											handleColorChange(
												option.name,
												option.bg,
												option.colors,
												index,
											)
										}>
										<span>{option.name}</span>
										<div className="flex ml-auto">
											{option.colors.map(
												(color, index) => (
													<div
														key={index}
														className="w-10 h-8"
														style={{
															backgroundColor:
																color,
														}}
													/>
												),
											)}
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
				{/*Add to cart/ Login to buy */}
				<div className="fixed bottom-6 right-6 z-50">
					{selectedOption &&
						(isAuthenticated ? (
							<button
								onClick={handleAddToCart}
								className={`w-full py-2 px-4 rounded-lg text-white font-bold transition duration-200 ${
									selectedOption
										? "bg-[#4CAF50] hover:bg-[#45a049]"
										: "bg-gray-400 cursor-not-allowed"
								}`}>
								Add to Cart £
								{sizeOptions[keyboardSize].price.toFixed(2)}
							</button>
						) : (
							<button
								onClick={() =>
									(window.location.href = "/sign-in")
								}
								className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white font-bold transition duration-200 hover:bg-blue-600">
								Log in to Buy £
								{sizeOptions[keyboardSize].price.toFixed(2)}
							</button>
						))}

					{/* Notification for added to cart */}
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
