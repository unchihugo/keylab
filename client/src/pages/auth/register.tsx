/** @format */

import React, { useEffect } from "react"
import { useAuth } from "../../AuthContext"
import { useNavigate } from "react-router-dom"
import LinkButton from "../../components/LinkButton"
import Divider from "../../components/Divider"
import { CheckCheck, ChevronRight } from "lucide-react"
import * as formValidation from "../../lib/formValidation"
import ErrorBox from "../../components/ErrorBox"

export default function Register() {
	const { register, isAuthenticated } = useAuth()
	const [firstName, setFirstName] = React.useState("")
	const [lastName, setLastName] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [passwordConfirm, setPasswordConfirm] = React.useState("")
	const [errors, setErrors] = React.useState<string[]>([])

	// handle register form submission
	const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// validate all form fields and return an array of errors
		// password will only be validated if it matches the confirm password
		// if error is empty, filter it out
		setErrors(
			[
				formValidation.validateForename(firstName),
				formValidation.validateSurname(lastName),
				formValidation.validateEmail(email),
				formValidation.validateMatch(password, passwordConfirm, "Passwords") ||
					formValidation.validatePassword(password),
			].filter(Boolean),
		)

		// if there are errors, log them and return
		if (errors.length) {
			console.error(errors)
			return
		}

		try {
			await register(firstName, lastName, email, password)
		} catch (error) {
			console.error(error)
		}
	}

	// TODO: add "Receive updates" checkbox functionality

	const navigate = useNavigate()
	useEffect(() => {
		if (isAuthenticated) {
			// redirect to home page if authenticated
			navigate('/sign-in')
		}
	}, [isAuthenticated, navigate])

	return (
		<div className="flex justify-center items-center bg-primary">
			<div className="flex h-screen max-w-screen-lg w-full">
				<div className="px-4 my-24 md:grid md:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
					<form onSubmit={handleRegister}>
						<div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black mb-4 md:mb-0 w-full">
							<div className="text-2xl font-display">
								Register
							</div>
							<Divider />
							<div className="flex flex-col space-y-3">
								<div className="flex space-x-3">
									<div className="grow">
										<label
											htmlFor="firstName"
											className="text-sm mb-2 block">
											First Name
										</label>
										<input
											type="text"
											value={firstName}
											onChange={(e) =>
												setFirstName(e.target.value)
											}
											className="border border-gray-300 p-2 rounded-lg w-full"
											placeholder="John"
											required
										/>
									</div>
									<div className="grow">
										<label
											htmlFor="lastName"
											className="text-sm mb-2 block">
											Last Name
										</label>
										<input
											type="text"
											value={lastName}
											onChange={(e) =>
												setLastName(e.target.value)
											}
											className="border border-gray-300 p-2 rounded-lg w-full"
											placeholder="Doe"
											required
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="text-sm mb-2 block">
										Email
									</label>
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
									<label
										htmlFor="password"
										className="text-sm mb-2 block">
										Password
									</label>
									<input
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className="border border-gray-300 p-2 rounded-lg w-full"
										placeholder="Enter your password"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="passwordConfirm"
										className="text-sm mb-2 block">
										Confirm Password
									</label>
									<input
										type="password"
										value={passwordConfirm}
										onChange={(e) =>
											setPasswordConfirm(e.target.value)
										}
										className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
										placeholder="Confirm your password"
										required
									/>
								</div>
								<ErrorBox>{errors}</ErrorBox>
								<Divider />
								<div>
									<label className="text-sm font-bold group">
										Receive updates
									</label>
									<div className="flex">
										<input
											type="checkbox"
											className="mr-2"
										/>
										<span className="text-sm">
											Get updated on the latest Keylab and
											stock updates
										</span>
									</div>
								</div>
								<button
									type="submit"
									className="group bg-black text-white p-2 rounded-full justify-center items-center gap-2 inline-flex">
									Continue
									<ChevronRight className="-m-2 duration-200 group-hover:translate-x-1" />
								</button>
							</div>
						</div>
					</form>
					<div>
						<div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
							<CheckCheck className="w-8 h-8 -m-1" />
							<div className="mt-4 text-2xl font-display">
								Already have an account?
							</div>
							<div className="mt-2 font-body">
								Log in instead!
							</div>
							<LinkButton
								to="/sign-in"
								text="Sign In"
								buttonClassNames="mt-3 px-6 bg-white"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
