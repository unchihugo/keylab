/** @format */

import React from "react"
import { Link } from "react-router-dom"
import LinkButton from "./components/LinkButton"
import keylabIcon from "./assets/keylab-icon.svg"
import { ShoppingCart, UserRound, Heart, Menu, X } from "lucide-react"
import { useAuth } from "./AuthContext"
import Divider from "./components/Divider"

export default function NavBar() {
	const { isAuthenticated, logout } = useAuth() // gets auth state from AuthContext
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen)
	}

	return (
		<nav
			className={`bg-white/75 border-b backdrop-blur-lg fixed top-0 left-0 right-0 z-50 duration-500 ease-in-out
          				${mobileMenuOpen ? "h-full bg-white/100" : "h-20 delay-150 bg-white/75"}`}>
			<div className="p-5 max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto">
				<div className="hidden md:flex w-1/3 h-5 items-center gap-3 xl:gap-6">
					<div className="hidden lg:block text-center text-black font-body">
						<Link to="/keyboard-designer">Keyboard Designer</Link>
					</div>
					<div className="text-center text-black font-body">
						<Link to="/shop/switches">Switches</Link>
					</div>
					<div className="text-center text-black font-body">
						<Link to="/shop/keyboards">Keyboards</Link>
					</div>
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
          				left-0 top-0 h-full w-full
          				transition-transform duration-100 ease-in-out
          				 z-40
          				${mobileMenuOpen ? "translate-x-0 delay-200" : "-translate-x-full delay-500"}
        			`}>
					<div className="flex flex-col p-6 gap-y-2">
						<Link
							to="/keyboard-designer"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-100" : "-translate-x-full delay-250"}`}
							onClick={() => setMobileMenuOpen(false)}>
							Keyboard Designer
						</Link>
						<Link
							to="/shop/switches"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-150" : "-translate-x-full delay-200"}`}
							onClick={() => setMobileMenuOpen(false)}>
							Switches
						</Link>
						<Link
							to="/shop/keyboards"
							className={`text-xl font-body py-2 duration-300 ease-in-out
								${mobileMenuOpen ? "translate-x-0 delay-200" : "-translate-x-full delay-150"}`}
							onClick={() => setMobileMenuOpen(false)}>
							Keyboards
						</Link>
						{mobileMenuOpen ? (
							<Divider />
						) : (
							<div className="my-3" />
						)}
						{isAuthenticated ? (
							<>
								{/* Signed in view */}
								<Link
									to="/profile"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-250" : "-translate-x-full delay-100"}`}
									onClick={() => setMobileMenuOpen(false)}>
									Profile
								</Link>
								<Link
									to="/favorites"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-300" : "-translate-x-full delay-50"}`}
									onClick={() => setMobileMenuOpen(false)}>
									Favorites
								</Link>
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
								<Link
									to="/sign-in"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-250" : "-translate-x-full delay-50"}`}
									onClick={() => setMobileMenuOpen(false)}>
									Sign in
								</Link>
								<Link
									to="/register"
									className={`text-xl font-body py-2 duration-300 ease-in-out
										${mobileMenuOpen ? "translate-x-0 delay-300" : "-translate-x-full"}`}
									onClick={() => setMobileMenuOpen(false)}>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	)
}
