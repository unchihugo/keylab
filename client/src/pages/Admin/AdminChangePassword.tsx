/** @format */
import React, { useState } from "react"
import { userService } from "../../services/userService"
import * as formValidation from "../../lib/formValidation"
import ErrorBox from "../../components/ErrorBox"
import { useAuth } from "../../AuthContext"
import Breadcrumb from "../../components/Breadcrumb"
import LinkButton from "../../components/LinkButton"

const AdminChangePassword: React.FC = () => {
	const { user } = useAuth()
	const userId = user?.id
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [errors, setErrors] = useState<string[]>([])
	const [successMessage, setSuccessMessage] = useState("")
	const handlePasswordChange = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault()
		setErrors([])
		setSuccessMessage("")

		if (!userId) {
			setErrors(["User ID is missing. Cannot update password."])
			return
		}

		const validationErrors = [
			formValidation.validatePassword(newPassword),
			formValidation.validateMatch(
				newPassword,
				confirmPassword,
				"Passwords",
			),
		].filter(Boolean)
		if (validationErrors.length) {
			setErrors(validationErrors)
			return
		}

		try {
			const response = await userService.changePassword(userId, {
				current_password: currentPassword,
				new_password: newPassword,
				password_confirmation: confirmPassword,
			})

			if (response?.message === "Password changed successfully") {
				setSuccessMessage(
					"Your password has been updated successfully!",
				)
				setCurrentPassword("")
				setNewPassword("")
				setConfirmPassword("")
				setErrors([])
			} else {
				setErrors(["Failed to update password. Please try again."])
			}
		} catch (error) {
			console.error("Error updating password:", error)
			setErrors(["An error occurred while updating your password."])
		}
	}

	return (
		<div className="min-h-screen bg-primary/25 py-6">
			<div className="container mx-auto px-6 flex flex-col md:flex-row gap-6">
				{/* Sidebar Navigation */}
				<aside className="w-full lg:w-1/5 bg-primary-dark/25 p-4 rounded-2xl space-y-4 mb-6 lg:mb-0 h-fit border border-gray-700 mr-4">
					<h2 className="text-xl font-bold mb-4">Admin Panel</h2>
					<div className="flex flex-col space-y-2">
						<LinkButton
							to="/admin/dashboard"
							text="Dashboard"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/orders"
							text="Orders"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/inventory"
							text="Inventory"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/CustomerManagement"
							text="Customer Management"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/settings"
							text="Change Password"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
					</div>
				</aside>
				{/* Main Content */}
				<main className="flex-1 bg-white rounded-2xl p-6 border border-black">
					<Breadcrumb
						breadcrumbs={["Admin Dashboard", "Change Password"]}
					/>
					<h2 className="text-2xl font-bold mb-6">Change Password</h2>
					{successMessage && (
						<p className="text-green-600 mb-4">{successMessage}</p>
					)}
					{errors.length > 0 && <ErrorBox>{errors}</ErrorBox>}
					<form
						className="w-full max-w-md space-y-4 mt-4"
						onSubmit={handlePasswordChange}>
						<div>
							<label className="block text-sm font-medium">
								Current Password
							</label>
							<input
								type="password"
								className="w-full border p-2 rounded"
								value={currentPassword}
								onChange={(e) =>
									setCurrentPassword(e.target.value)
								}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium">
								New Password
							</label>
							<input
								type="password"
								className="w-full border p-2 rounded"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium">
								Confirm New Password
							</label>
							<input
								type="password"
								className="w-full border p-2 rounded"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
								required
							/>
						</div>
						<div className="mt-6">
							<button
								type="submit"
								className="group h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200 
                                hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y
                                bg-secondary px-6 text-black font-body leading-tight tracking-tight">
								Save Changes
							</button>
						</div>
					</form>
				</main>
			</div>
		</div>
	)
}
export default AdminChangePassword
