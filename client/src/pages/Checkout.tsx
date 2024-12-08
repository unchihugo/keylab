/** @format */

import React, { useState } from "react"
import Divider from "../components/Divider"
import LinkButton from "../components/LinkButton"

export default function Checkout() {
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [address1, setAddress1] = useState("")
	const [address2, setAddress2] = useState("")
	const [country, setCountry] = useState("")
	const [city, setCity] = useState("")
	const [postcode, setPostcode] = useState("")
	const [nameoncard, setNameOnCard] = useState("")
	const [cardnumber, setCardNumber] = useState("")
	const [expirydate, setExpiryDate] = useState("")
	const [cvv, setCvv] = useState("")

	return (
		<div className="flex justify-center items-center bg-primary">
			<div className="w-full max-w-screen-lg">
				{/* Checkout container */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-24 p-6">
					{/* Shipping Information Section */}
					<div className="bg-white drop-shadow-cartoon rounded-lg border border-black p-6">
						<h2 className="text-3xl font-display mb-4">
							Shipping Information
						</h2>
						<Divider />
						<form className="space-y-4 font-body">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										className="text-sm font-medium block mb-1"
										htmlFor="firstName">
										First Name
									</label>
									<input
										type="text"
										id="firstName"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="First name"
										value={firstName}
										onChange={(e) =>
											setFirstName(e.target.value)
										}
									/>
								</div>
								<div>
									<label
										className="text-sm font-medium block mb-1"
										htmlFor="lastName">
										Last Name
									</label>
									<input
										type="text"
										id="lastName"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="Last name"
										value={lastName}
										onChange={(e) =>
											setLastName(e.target.value)
										}
									/>
								</div>
							</div>
							<div>
								<label
									className="text-sm font-medium block mb-1"
									htmlFor="address1">
									Address Line 1
								</label>
								<input
									type="text"
									id="address1"
									className="border border-gray-300 p-3 rounded-lg w-full"
									placeholder="Enter shipping address"
									value={address1}
									onChange={(e) =>
										setAddress1(e.target.value)
									}
								/>
							</div>
							<div>
								<label
									className="text-sm font-medium block mb-1"
									htmlFor="address2">
									Address Line 2
								</label>
								<input
									type="text"
									id="address2"
									className="border border-gray-300 p-3 rounded-lg w-full"
									placeholder="Apartment, suite, etc. (optional)"
									value={address2}
									onChange={(e) =>
										setAddress2(e.target.value)
									}
								/>
							</div>
							<div className="grid grid-cols-2 gap-6">
								<div>
									<label
										className="text-sm font-medium block mb-1"
										htmlFor="country">
										Country
									</label>
									<input
										type="text"
										id="country"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="Enter country"
										value={country}
										onChange={(e) =>
											setCountry(e.target.value)
										}
									/>
								</div>
								<div>
									<label
										className="text-sm font-medium block mb-1"
										htmlFor="city">
										City
									</label>
									<input
										type="text"
										id="city"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="Enter city"
										value={city}
										onChange={(e) =>
											setCity(e.target.value)
										}
									/>
								</div>
							</div>
							<div>
								<label
									className="text-sm font-medium block mb-1"
									htmlFor="postcode">
									Postcode
								</label>
								<input
									type="text"
									id="postcode"
									className="border border-gray-300 p-3 rounded-lg w-full"
									placeholder="Enter postcode"
									value={postcode}
									onChange={(e) =>
										setPostcode(e.target.value)
									}
								/>
							</div>
						</form>
					</div>
					{/* Order summary + payment container */}
					<div className="bg-white drop-shadow-cartoon rounded-lg border border-black p-6 space-y-6">
						{/* Order summary */}
						<div>
							<h2 className="text-3xl font-display mb-4">
								Order Summary
							</h2>
							<Divider />
							<div className="flex justify-between font-body text-lg mt-4">
								<span>Subtotal:</span>
								<span>£150</span>
							</div>
							<div className="flex justify-between font-body text-lg mt-2">
								<span>Shipping:</span>
								<span>£3.99</span>
							</div>
							<div className="flex justify-between font-body text-xl font-semibold mt-4 border-t border-gray-300 pt-2">
								<span>Total:</span>
								<span>£153.99</span>
							</div>
						</div>
						{/* Payment */}
						<div>
							<h2 className="text-3xl font-display mb-4">
								Payment
							</h2>
							<Divider />
							<form className="space-y-4 font-body">
								<div>
									<label
										className="text-sm font-medium block mb-1"
										htmlFor="nameOnCard">
										Name on Card
									</label>
									<input
										type="text"
										id="nameOnCard"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="Name on Card"
										value={nameoncard}
										onChange={(e) =>
											setNameOnCard(e.target.value)
										}
									/>
								</div>
								<div>
									<label
										className="text-sm font-medium block mb-1"
										htmlFor="cardNumber">
										Card Number
									</label>
									<input
										type="text"
										id="cardNumber"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="Card Number"
										value={cardnumber}
										onChange={(e) =>
											setCardNumber(e.target.value)
										}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label
											className="text-sm font-medium block mb-1"
											htmlFor="expiryDate">
											MM/YY
										</label>
										<input
											type="text"
											id="expiryDate"
											className="border border-gray-300 p-3 rounded-lg w-full"
											placeholder="MM/YY"
											value={expirydate}
											onChange={(e) =>
												setExpiryDate(e.target.value)
											}
										/>
									</div>
									<div>
										<label
											className="text-sm font-medium block mb-1"
											htmlFor="cvv">
											CVV
										</label>
										<input
											type="text"
											id="cvv"
											className="border border-gray-300 p-3 rounded-lg w-full"
											placeholder="CVV"
											value={cvv}
											onChange={(e) =>
												setCvv(e.target.value)
											}
										/>
									</div>
								</div>
							</form>
							{/* Pay Now Button */}
							<div className="mt-6">
								<LinkButton
									to="/payment"
									text="Pay Now"
									buttonClassNames="mt-3 px-6 bg-secondary-dark"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
