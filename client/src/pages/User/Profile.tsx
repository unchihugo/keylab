/** @format */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Archive, Settings, User, CreditCard, Lock } from "lucide-react"
import { authService } from "../../services/authService"
import { userService } from "../../services/userService"
import { useAuth } from "../../AuthContext"
import AccountDetails from "./AccountDetails"
import ChangePassword from "./ChangePassword"
import PaymentDetails from "./PaymentDetails"
import Preferences from "./Preferences"

const Profile = () => {
	const [activeTab, setActiveTab] = useState("Account Details")
	const [user, setUser] = useState({
		forename: "",
		surname: "",
		email: "",
		phoneNumber: "",
	})
	const [userId, setUserId] = useState<number | null>(null)
	const navigate = useNavigate()
	const { logout } = useAuth()

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await authService.validateSession()
				const loggedInUser = response.data
				if (!loggedInUser || !loggedInUser.id) {
					console.error("No valid user found in session response.")
					setUserId(null)
					return
				}
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

	const handleLogout = async () => {
		await logout()
		navigate("/")
	}

	return (
		<div className="bg-[#faf6ed] min-h-screen flex flex-col items-center py-12">
			<div className="w-full max-w-screen-xl flex gap-8 py-10 my-24">
				{/* Sidebar Section */}
				<div className="w-1/4 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex-none h-fit">
					<h2 className="text-lg font-semibold mb-4 text-gray-900">
						Hi {user.forename}
					</h2>
					<nav className="space-y-2">
						{[
							"Account Details",
							"Orders",
							"Payment Details",
							"Change Password",
							"Preferences",
						].map((tab, index) => (
							<div key={tab}>
								<div
									className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-200 ${
										activeTab === tab
											? "bg-secondary font-semibold"
											: "hover:bg-secondary/50"
									}`}
									onClick={() => setActiveTab(tab)}>
									{tab === "Account Details" && (
										<User size={20} />
									)}
									{tab === "Orders" && <Archive size={20} />}
									{tab === "Payment Details" && (
										<CreditCard size={20} />
									)}
									{tab === "Change Password" && (
										<Lock size={20} />
									)}
									{tab === "Preferences" && (
										<Settings size={20} />
									)}
									{tab}
								</div>
								{index !== 5 && (
									<hr className="border-gray-300 my-2" />
								)}
							</div>
						))}
					</nav>
					<p
						onClick={handleLogout}
						className="mt-6 text-red-600 cursor-pointer underline text-center hover:text-red-800">
						Log Out
					</p>
				</div>

				{/* content section */}
				<div className="flex-1 bg-white p-8 rounded-lg shadow-md border border-gray-200">
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
					{activeTab === "Payment Details" && <PaymentDetails />}
					{activeTab === "Preferences" && <Preferences />}
				</div>
			</div>
		</div>
	)
}

export default Profile
