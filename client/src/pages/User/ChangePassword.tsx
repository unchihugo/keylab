/** @format */

import React, { useState } from "react"
import { userService } from "../../services/userService"
import * as formValidation from "../../lib/formValidation"
import ErrorBox from "../../components/ErrorBox"

const ChangePassword: React.FC<{ userId: number }> = ({ userId }) => {
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
			setErrors(["User ID is missing cannot update password."])
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
			})

			if (response?.message === "Password updated successfully") {
				setSuccessMessage(
					"Your password has been updated successfully!",
				)
				setCurrentPassword("")
				setNewPassword("")
				setConfirmPassword("")
				setErrors([])
			} else {
				setErrors(["Failed to update password please try again."])
			}
		} catch (error) {
			console.error("Error updating password:", error)
			setErrors(["An error occurred while updating your password."])
		}
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold mb-10">Change Password</h2>
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
						onChange={(e) => setCurrentPassword(e.target.value)}
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
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<button
					type="submit"
					className="mt-5 group h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200 
                        hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y
                        bg-secondary px-6 text-black font-body leading-tight tracking-tight">
					Save Changes
				</button>
			</form>
		</div>
	)
}

export default ChangePassword
