/** @format */
import { useState, useEffect } from "react"
import { Archive, Heart, User, CreditCard, Lock, LogOut } from "lucide-react"
import { authService } from "../../services/authService"
import { userService } from "../../services/userService"
import AccountDetails from "./AccountDetails"
import ChangePassword from "./ChangePassword"

const Profile = () => {
	const [activeTab, setActiveTab] = useState("Account Details")
	const [user, setUser] = useState({
		forename: "",
		surname: "",
		email: "",
		phoneNumber: "",
	})
	const [userId, setUserId] = useState<number | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await authService.validateSession()
				const loggedInUser = response.user || response

				if (!loggedInUser || !loggedInUser.id) return
				setUserId(loggedInUser.id)

				const userData = await userService.getUserProfile(
					loggedInUser.id,
				)
				if (userData && userData.data) {
					setUser(userData.data)
				}
			} catch (error) {
				console.error("Failed to fetch user profile", error)
			}
		}
		fetchUser()
	}, [])

	return (
		<div className="bg-primary/25 min-h-screen flex flex-col items-center py-12">
			<div className="w-full max-w-screen-xl flex gap-8 py-10 my-24">
				{/* sidebar section */}
				<div className="w-1/4 bg-primary-dark/25 p-6 rounded-lg shadow-lg border border-gray-300">
					<h2 className="text-lg font-semibold mb-4">
						Hi {user.forename}
					</h2>
					<nav className="space-y-4">
						{[
							"Account Details",
							"Orders",
							"Favourites",
							"Payment Details",
							"Change Password",
							"Sign Out",
						].map((tab, index) => (
							<div key={tab}>
								<div
									className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-200 ${
										activeTab === tab
											? "bg-secondary font-bold"
											: "hover:bg-secondary/50"
									}`}
									onClick={() => setActiveTab(tab)}>
									{tab === "Account Details" && (
										<User size={20} />
									)}
									{tab === "Orders" && <Archive size={20} />}
									{tab === "Favourites" && (
										<Heart size={20} />
									)}
									{tab === "Payment Details" && (
										<CreditCard size={20} />
									)}
									{tab === "Change Password" && (
										<Lock size={20} />
									)}
									{tab === "Sign Out" && <LogOut size={20} />}
									{tab}
								</div>
								{index !== 5 && (
									<hr className="border-secondary-dark/30 my-2" />
								)}{" "}
							</div>
						))}
					</nav>
				</div>

				{/* content section */}
				<div className="flex-1 bg-primary-dark/25 p-6 rounded-lg shadow-lg border border-gray-300">
					{activeTab === "Account Details" && (
						<AccountDetails
							user={user}
							userId={userId}
							setUser={setUser}
						/>
					)}
					{activeTab === "Change Password" && userId !== null && (
						<ChangePassword userId={userId} />
					)}
				</div>
			</div>
		</div>
	)
}

export default Profile
