//same as sign in just slight changes for admin login
/** @format */

import React, { useEffect } from "react"
import { useAuth } from "../../AuthContext"
import Divider from "../../components/Divider"
import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import * as formValidation from "../../lib/formValidation"
import ErrorBox from "../../components/ErrorBox"

export default function AdminLogin() {
	const { login, isAuthenticated, isAdmin } = useAuth()
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
			if (isAdmin) {
				navigate('/admin/dashboard');
			} else {
				console.error('Access denied, not an admin')
			}
		} catch (error) {
			console.error(error)
		}
	}

	const navigate = useNavigate()
	useEffect(() => {
		if (isAuthenticated) {
			// redirect to admin dashboard if authenticated
			navigate('/admin/dashboard')
		}
	}, [isAuthenticated, navigate])

	return (
		<div className="flex justify-center items-center h-screen bg-primary">	
					<form onSubmit={handleLogin} className="flex flex col space-y-4">
						<div className="px-20 py-20 bg-white drop-shadow-cartoon rounded-lg border border-black mb-4 md:mb-0">
							<div className="text-2xl font-display">Admin Sign in</div>
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


					</div>
				</div>
		
	)
}
