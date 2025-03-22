/** @format */
import { useState, useEffect } from "react"
import { Mail, MessageCircle } from "lucide-react"

const Preferences = () => {
	const [smsNotifications, setSmsNotifications] = useState(false)
	const [emailNotifications, setEmailNotifications] = useState(false)

	useEffect(() => {
		const storedSms = localStorage.getItem("smsNotifications")
		const storedEmail = localStorage.getItem("emailNotifications")

		if (storedSms === "true") setSmsNotifications(true)
		if (storedEmail === "true") setEmailNotifications(true)
	}, [])

	const togglePreference = (
		preference: string,
		setter: React.Dispatch<React.SetStateAction<boolean>>,
	) => {
		setter((prev) => {
			const newState = !prev
			localStorage.setItem(preference, newState.toString())
			return newState
		})
	}

	return (
		<div className="p-6 space-y-6">
			<h2 className="text-xl font-semibold mb-2">
				Notification Preferences
			</h2>

			<div className="space-y-4">
				{/* sms notifications */}
				<div className="flex items-center justify-between p-3 bg-primary-light rounded-lg shadow-md">
					<span className="flex items-center gap-2">
						<MessageCircle size={20} /> SMS Notifications
					</span>
					<button
						onClick={() =>
							togglePreference(
								"smsNotifications",
								setSmsNotifications,
							)
						}
						className={`group h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200
                    hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y
                    ${
						smsNotifications
							? "bg-green-500 text-black"
							: "bg-gray-300 text-black"
					} px-6 font-body leading-tight tracking-tight`}>
						{smsNotifications ? "Disable" : "Enable"}
					</button>
				</div>

				{/* email notifications */}
				<div className="flex items-center justify-between p-3 bg-primary-light rounded-lg shadow-md">
					<span className="flex items-center gap-2">
						<Mail size={20} /> Email Notifications
					</span>
					<button
						onClick={() =>
							togglePreference(
								"emailNotifications",
								setEmailNotifications,
							)
						}
						className={`group h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200
                    hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y
                    ${
						emailNotifications
							? "bg-green-500 text-black"
							: "bg-gray-300 text-black"
					} px-6 font-body leading-tight tracking-tight`}>
						{emailNotifications ? "Disable" : "Enable"}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Preferences
