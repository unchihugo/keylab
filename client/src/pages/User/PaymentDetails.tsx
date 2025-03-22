/** @format */
import { useState } from "react"

const dummyCards = [
	{
		id: 1,
		cardNumber: "****2215",
		expiry: "12/25",
		isPrimary: true,
		type: "Visa",
		logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
	},
	{
		id: 2,
		cardNumber: "****3175",
		expiry: "05/26",
		isPrimary: false,
		type: "Mastercard",
		logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
	},
	{
		id: 3,
		cardNumber: "****5366",
		expiry: "11/27",
		isPrimary: false,
		type: "Visa",
		logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
	},
]
const PaymentDetails = () => {
	const [cards, setCards] = useState(dummyCards)
	// function to set a card as default & move it to the top
	const handleSetPrimary = (id: number) => {
		setCards((prevCards) => {
			return prevCards
				.map((card) => ({
					...card,
					isPrimary: card.id === id,
				}))
				.sort((a, b) =>
					a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1,
				)
		})
	}
	// function to delete a card
	const handleDeleteCard = (id: number) => {
		setCards(cards.filter((card) => card.id !== id))
	}
	return (
		<div className="max-w-lg mx-auto">
			<h2 className="text-2xl font-semibold mb-4">
				Manage your payment details
			</h2>
			<p className="text-gray-600 mb-6">
				Select your default payment card.
			</p>

			{/*cards list */}
			<div className="space-y-4">
				{cards.map((card) => (
					<div
						key={card.id}
						className={`p-4 border rounded-lg shadow-md flex items-center gap-4 relative cursor-pointer transition duration-200 ${
							card.isPrimary
								? "border-green-500 bg-white ring-2 ring-green-500"
								: "border-gray-300 hover:bg-gray-100"
						}`}
						onClick={() => handleSetPrimary(card.id)}>
						<img
							src={card.logo}
							alt={card.type}
							className="w-12 h-auto"
						/>
						<div className="flex-1">
							<p className="font-semibold flex items-center gap-2">
								{card.type}{" "}
								<span className="text-gray-600">
									{card.cardNumber}
								</span>
								{card.isPrimary && (
									<span className="text-blue-600 text-sm font-bold">
										Default
									</span>
								)}
							</p>
							<p className="text-sm text-gray-500">
								Expires {card.expiry}
							</p>
						</div>

						{/* remove button */}
						<button
							className="text-red-500 text-sm ml-auto"
							onClick={(e) => {
								e.stopPropagation()
								handleDeleteCard(card.id)
							}}>
							Remove
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
export default PaymentDetails
