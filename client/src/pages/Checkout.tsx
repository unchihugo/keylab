/** @format */

import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import Divider from "../components/Divider"
import { validateForename, validateMessage } from "../lib/formValidation";

interface FormErrors {
	firstName?: string;
	lastName?: string;
	address1?: string;
	address2?: string;
	cardnumber?: string;
	expirydate?: string;
	cvv?: string;
}
export default function Checkout() {
	const navigate = useNavigate();
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
	const [isProcessing, setIsProcessing] = useState(false);

	const [errors, setErrors] = useState<FormErrors>({});
    const validateForm = () => {
		const newErrors: FormErrors = {};
		newErrors.firstName = validateForename(firstName) || "";
		newErrors.lastName = validateForename(lastName) || "";
        newErrors.address1 = validateMessage(address1) || "";
		newErrors.address2 = validateMessage(address2) || "";
        newErrors.cardnumber = cardnumber.match(/^\d{13,19}$/) ? "" : "Invalid card number";
        newErrors.expirydate = expirydate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/) ? "" : "Invalid expiry date";
        newErrors.cvv = cvv.match(/^\d{3,4}$/) ? "" : "Invalid CVV";

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);

    setTimeout(() => {
        navigate("../components/Thankyou.tsx");
    }, 2000);
};

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
										onBlur={validateForm}
									/>
									{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
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
										onBlur={validateForm}
									/>
									{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
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
									onBlur={validateForm}
								/>
								 {errors.address1 && <p className="text-red-500 text-sm">{errors.address1}</p>}
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
									onBlur={validateForm}
								/>
								{errors.address2 && <p className="text-red-500 text-sm">{errors.address2} </p>}
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
										onBlur={validateForm}
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
										onBlur={validateForm}
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
									onBlur={validateForm}
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
							<form className="space-y-4 font-body"onSubmit={handlePayment}>
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
										onBlur={validateForm}
									/>
									{errors.cardnumber && <p className="text-red-500 text-sm">{errors.cardnumber}</p>}
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
											onBlur={validateForm}
										/>
										{errors.expirydate && <p className="text-red-500 text-sm">{errors.expirydate}</p>}
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
											onBlur={validateForm}
										/>
										{errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
									</div>
								</div>
							</form>
							{/* Pay Now Button */}
							<div className="mt-6">
								<button 
									type="submit" 
									disabled={isProcessing}
									className="mt-3 px-6 bg-secondary-dark text-white p-3 rounded-lg w-full">
									${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
									{isProcessing ? "Processing Payment..." : "Pay Now"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
