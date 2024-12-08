/** @format */

import React, { useEffect } from "react"
//import { useAuth } from "../AuthContext"
import * as formValidation from "../lib/formValidation.ts"
import Divider from "../components/Divider"
import ErrorBox from "../components/ErrorBox"
import { ChevronRight } from "lucide-react"

export default function About() {
	const [firstName, setFirstName] = React.useState("")
	const [lastName, setLastName] = React.useState("")
	const [phoneNum, setPhoneNum] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [message, setMessage] = React.useState("")
	const [errors, setErrors] = React.useState<string[]>([])

	// Handle contact form submission
	const handleContactForm = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault()

		setErrors(
			[
				formValidation.validateFirstName(firstName),
				formValidation.validateLastName(lastName),
				formValidation.validatePhoneNum(phoneNum),
				formValidation.validateEmail(email),
				formValidation.validateMessage(message),
			].filter(Boolean),
		)
		// if there are errors, log them and return
		if (errors.length) {
			console.error(errors)
			return
		}
		// matched how the register one was but i dont have anything in the auth files
		//so leaving this as a comment for now

		// try {
		// 	await contactForm(firstName, lastName, phoneNum, email, message)
		// } catch (error) {
		// 	console.error(error)
		// }
	}

	return (
		<div className="flex justify-center items-center bg-secondary min-h-screen">
			<div className="flex flex-col w-full max-w-5xl px-4 space-y-6 my-24">
				{/* About Us Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* About Us Box */}
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
									At Keylab, we specialise in creating a
									unique experience for our customers by
									offering a range of high-quality products
									designed to enhance both function and
									aesthetics. Whether it's smooth switches,
									keycaps, or the chance to completely
									personalise your own keyboard, we have it
									all!
								</p>
								<p className="mt-4">
									Our vision is to empower creators,
									professionals, and gamers with tools that
									enhance performance, comfort, and
									creativity, allowing people to express
									themselves. Our commitment to innovation
									drives us to give everyone the chance to
									elevate their experience.
								</p>
							</section>
						</div>
					</div>

					{/* Contact Us Container */}
					<div className="px-6 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
						<div className="text-2xl font-display text-black mb-4">
							Contact Us
						</div>
						<Divider />
						<div className="font-body text-gray-600">
							<p className="text-lg font-semibold text-gray-800 mb-2">
								Need to get in touch with us?
							</p>
							<p className="mb-4">
								Fill out the form with your inquiry and we'll
								get back to you as soon as possible.
							</p>
							{/* Contact Form */}
							<form
								onSubmit={handleContactForm}
								className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<input
											type="text"
											value={firstName}
											onChange={(e) =>
												setFirstName(e.target.value)
											}
											className="border border-gray-300 p-2 rounded-lg w-full"
											placeholder="First name"
											required
										/>
									</div>
									<div>
										<input
											type="text"
											value={lastName}
											onChange={(e) =>
												setLastName(e.target.value)
											}
											className="border border-gray-300 p-2 rounded-lg w-full"
											placeholder="Last name"
											required
										/>
									</div>
								</div>
								<div>
									<input
										type="tel"
										value={phoneNum}
										onChange={(e) =>
											setPhoneNum(e.target.value)
										}
										className="border border-gray-300 p-2 rounded-lg w-full"
										placeholder="Enter your phone number"
										required
									/>
								</div>
								<div>
									<input
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className="border border-gray-300 p-2 rounded-lg w-full"
										placeholder="Enter your email"
										required
									/>
								</div>
								<div>
									<textarea
										id="message"
										className="border border-gray-300 p-3 rounded-lg w-full"
										placeholder="What can we help you with?"
										rows={4}
										value={message}
										onChange={(e) =>
											setMessage(e.target.value)
										}
									/>
									<ErrorBox>{errors}</ErrorBox>
								</div>
								<button
									type="submit"
									className="group bg-secondary-dark text-black p-2 rounded-full justify-center items-center gap-2 inline-flex w-48 border-2 border-black">
									Submit
									<ChevronRight className="-m-2 duration-200 group-hover:translate-x-1" />
								</button>
							</form>
						</div>
					</div>
				</div>

				{/* Slogan Section */}
				<div className="px-6 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
					<div className="text-lg font-body italic text-gray-700 text-center">
						"Build your perfect board!"
					</div>
				</div>
			</div>
		</div>
	)
}
