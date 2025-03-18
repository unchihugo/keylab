/** @format */

import React, { useEffect } from "react"
import { useAuth } from "../../AuthContext"
import Divider from "../../components/Divider"
import LinkButton from "../../components/LinkButton"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import * as formValidation from "../../lib/formValidation"
import ErrorBox from "../../components/ErrorBox"

export default function SignIn() {
	const { login, isAuthenticated } = useAuth()
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [errors, setErrors] = React.useState<string[]>([])

	// handle login form submission
	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// validate email and password
		// if error is empty, filter it out
		setErrors(
			[
				formValidation.validateEmail(email),
				formValidation.validatePassword(password),
			].filter(Boolean),
		)

		// if there are errors, log them and return
		if (errors.length) {
			console.error(errors)
			return
		}

		try {
			const role = await login(email, password)
			if (!role) {
				setErrors(['Login failed, please try again'])
				return
			}
			if (role !== 'admin') {
				navigate('/')
			} else {
				setErrors(['Admins must log in using the admin page'])
			}
		} catch (error) {
			console.error(error)
		}
	}

	const navigate = useNavigate()
	useEffect(() => {
		if (isAuthenticated) {
			// redirect to home page if authenticated
			navigate('/')
		}
	}, [isAuthenticated, navigate])

	return (
		<div className="flex justify-center items-center bg-secondary">
			<div className="flex h-screen max-w-screen-lg w-full">
				<div className="px-4 my-24 md:grid md:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
					<form onSubmit={handleLogin}>
						<div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black mb-4 md:mb-0">
							<div className="text-2xl font-display">Sign in</div>
							<Divider />
							<div className="flex flex-col space-y-6">
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
								<ErrorBox>{errors}</ErrorBox>
								<button
									type="submit"
									className="group bg-black text-white p-2 rounded-full justify-center items-center gap-2 inline-flex">
									Sign In
									<ChevronRight className="-m-2 duration-200 group-hover:translate-x-1" />
								</button>
								{/* TODO: add forgot password */}
							</div>
						</div>
					</form>
					<div>
						<div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
							<ArrowUpRight className="w-8 h-8 -m-1" />
							<div className="mt-4 text-2xl font-display">
								New here?
							</div>
							<div className="mt-2 font-body">
								Create an account to get started.
							</div>
							<LinkButton
								to="/register"
								text="Register"
								buttonClassNames="mt-3 px-6 bg-white"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
