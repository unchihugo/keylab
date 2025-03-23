/** @format */

import React, { useState, useEffect } from "react"
import ErrorBox from "../../components/ErrorBox"
import { userService } from "../../services/userService"
import * as formValidation from "../../lib/formValidation"

export interface UserProfile {
	forename: string
	surname: string
	email: string
	phoneNumber: string
}

interface AccountDetailsProps {
	user: UserProfile
	userId: number | null
	setUser: React.Dispatch<React.SetStateAction<UserProfile>>
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
	user,
	userId,
	setUser,
}) => {
	const [editedUser, setEditedUser] = useState(user)
	const [errors, setErrors] = useState<string[]>([])

	useEffect(() => {
		setEditedUser(user)
	}, [user])

	const handleUpdateUser = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault()
		setErrors([])

		if (!userId) {
			setErrors(["User ID is missing cannot update the user's profile."])
			return
		}

		const validationErrors = [
			formValidation.validateForename(editedUser.forename),
			formValidation.validateSurname(editedUser.surname),
			formValidation.validatePhoneNum(editedUser.phoneNumber),
		].filter(Boolean)

		if (validationErrors.length) {
			setErrors(validationErrors)
			return
		}

		try {
			const updatedUserData = { ...editedUser }

			const response = await userService.updateUserProfile(
				userId,
				updatedUserData,
			)

			if (response?.message === "User profile updated successfully") {
				alert("Profile updated successfully!")
				setUser(updatedUserData)
				setEditedUser(updatedUserData)
				setErrors([])
			} else {
				setErrors(["Failed to update profile please try again."])
			}
		} catch (error) {
			console.error("Error updating profile:", error)
			setErrors(["An error occurred while updating the profile."])
		}
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<h2 className="text-xl font-semibold mb-10">Account Details</h2>
			{errors.length > 0 && <ErrorBox>{errors}</ErrorBox>}
			<form
				className="w-full max-w-md space-y-4"
				onSubmit={handleUpdateUser}>
				<div>
					<label className="block text-sm font-medium">
						First Name
					</label>
					<input
						type="text"
						className="w-full border p-2 rounded"
						value={editedUser.forename}
						onChange={(e) =>
							setEditedUser({
								...editedUser,
								forename: e.target.value,
							})
						}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">
						Last Name
					</label>
					<input
						type="text"
						className="w-full border p-2 rounded"
						value={editedUser.surname}
						onChange={(e) =>
							setEditedUser({
								...editedUser,
								surname: e.target.value,
							})
						}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">Email</label>
					<input
						type="email"
						className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
						value={editedUser.email}
						disabled
					/>
				</div>
				<div>
					<label className="block text-sm font-medium">
						Phone Number
					</label>
					<input
						type="text"
						className="w-full border p-2 rounded"
						value={editedUser.phoneNumber}
						onChange={(e) =>
							setEditedUser({
								...editedUser,
								phoneNumber: e.target.value,
							})
						}
					/>
				</div>
				<div className="mt-10 flex justify-center">
					<button
						type="submit"
						className="group h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200 
                        hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y
                        bg-secondary px-6 text-black font-body leading-tight tracking-tight">
						Save Changes
					</button>
				</div>
			</form>
		</div>
	)
}

export default AccountDetails
