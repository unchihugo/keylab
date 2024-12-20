/** @format */

import React from "react"
import { Link } from "react-router-dom"
import LinkButton from "./components/LinkButton"
import keylabIcon from "./assets/keylab-icon.svg"
import { ShoppingCart, UserRound, Heart, Menu, X } from "lucide-react"
import { useAuth } from "./AuthContext"
import Divider from "./components/Divider"
import NavLink from "./components/NavLink"

export default function NavBar() {
	const { isAuthenticated, isLoading, logout } = useAuth() // gets auth state from AuthContext
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen)
	}

	// close mobile menu when window is resized to Tailwind's medium media query or larger
	React.useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setMobileMenuOpen(false)
			}
		}

		// add event listener for window resize (fires handleResize when window is resized)
		window.addEventListener("resize", handleResize)
		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	return (
		<nav
			className={`bg-white/75 border-b backdrop-blur-lg fixed top-0 left-0 right-0 z-50 duration-500 ease-in-out
          				${mobileMenuOpen ? "h-full bg-white/100" : "h-20 delay-150 bg-white/75"}`}>
			<div className="p-5 max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto">
				<div className="hidden md:flex w-1/3 h-5 items-center gap-3 xl:gap-6">
					<NavLink
						to="/keyboard-designer"
						text="Keyboard Designer"
						className="hidden lg:block"
					/>
					<NavLink to="/shop/switches" text="Switches" />
					<NavLink to="/shop/keyboards" text="Keyboards" />
				</div>
				<div className="w-1/3">
					<Link
						to="/"
						className="items-center md:justify-center flex">
						<img
							src={keylabIcon}
							alt="keylab icon"
							className="h-8 w-8 me-1"
						/>
						<div className="text-center text-xl text-black font-display">
							keylab
						</div>
					</Link>
				</div>
				<div className="flex w-1/3 justify-end items-center">
					<div className="hidden md:flex">
						{!isLoading && (
							<>
								{isAuthenticated ? (
									<>
										{/* Signed in view */}
										{/* TODO: remove temporary logout button */}
										<button
											onClick={() => logout()}
											className="bg-secondary-dark text-white px-6 py-2 text-sm rounded-full">
											temp logout btn
										</button>
										<LinkButton
											to="/profile"
											buttonClassNames="ms-2 h-10 w-10 bg-white"
											Icon={UserRound}
										/>
										<LinkButton
											to="/favorites"
											buttonClassNames="ms-2 h-10 w-10 bg-white"
											Icon={Heart}
										/>
									</>
								) : (
									<>
										{/* Not signed in view */}
										<LinkButton
											to="/sign-in"
											text="Sign in"
											buttonClassNames="bg-white px-3 lg:px-6 hidden md:block"
										/>
										<LinkButton
											to="/register"
											text="Register"
											buttonClassNames="bg-secondary-dark px-3 lg:px-6 hidden md:block ms-2"
										/>
									</>
								)}
							</>
						)}
						<LinkButton
							to="/cart"
							buttonClassNames="ms-2 h-10 w-10 bg-white"
							Icon={ShoppingCart}
						/>
					</div>
				</div>
				<button onClick={toggleMobileMenu} className="flex md:hidden">
					{mobileMenuOpen ? <X /> : <Menu />}
				</button>

				<div
					className={`
						absolute left-0 top-0 h-full w-full
						transition-all duration-300 ease-in-out
						z-40 mt-16
						${
							mobileMenuOpen
								? "opacity-100 translate-x-0 visible delay-200"
								: "opacity-0 -translate-x-full invisible delay-500"
						}
					`}>
					<div className="flex flex-col p-6 gap-y-2">
						<NavLink
							to="/keyboard-designer"
							text="Keyboard Designer"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-100" : "-translate-x-full delay-250"}`}
							onClick={() => setMobileMenuOpen(false)}
						/>
						<NavLink
							to="/shop/switches"
							text="Switches"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-150" : "-translate-x-full delay-200"}`}
							onClick={() => setMobileMenuOpen(false)}
						/>
						<NavLink
							to="/shop/keyboards"
							text="Keyboards"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-200" : "-translate-x-full delay-150"}`}
							onClick={() => setMobileMenuOpen(false)}
						/>
						{mobileMenuOpen ? (
							<Divider />
						) : (
							<div className="my-3" />
						)}
						{isAuthenticated ? (
							<>
								{/* Signed in view */}
								<NavLink
									to="/profile"
									text="Profile"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-250" : "-translate-x-full delay-100"}`}
									onClick={() => setMobileMenuOpen(false)}
								/>
								<NavLink
									to="/favorites"
									text="Favorites"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-300" : "-translate-x-full delay-50"}`}
									onClick={() => setMobileMenuOpen(false)}
								/>
								<button
									onClick={() => logout()}
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-350" : "-translate-x-full delay-0"}`}>
									Logout
								</button>
							</>
						) : (
							<>
								{/* Not signed in view */}
								<NavLink
									to="/sign-in"
									text="Sign in"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-250" : "-translate-x-full delay-50"}`}
									onClick={() => setMobileMenuOpen(false)}
								/>
								<NavLink
									to="/register"
									text="Register"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-300" : "-translate-x-full"}`}
									onClick={() => setMobileMenuOpen(false)}
								/>
							</>
						)}
						<NavLink
							to="/cart"
							text="Cart"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-350" : "-translate-x-full"}`}
							onClick={() => setMobileMenuOpen(false)}
						/>
					</div>
				</div>
			</div>
		</nav>
	)
}
