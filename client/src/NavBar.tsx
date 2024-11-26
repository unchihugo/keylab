/** @format */

import React from "react"
import { Link } from "react-router-dom"
import LinkButton from "./components/LinkButton"
import keylabIcon from "./assets/keylab-icon.svg"
import { ShoppingCart, UserRound, Heart, Menu } from "lucide-react"
import { useAuth } from "./AuthContext"

const NavBar: React.FC = () => {
	const { isAuthenticated, logout } = useAuth() // gets auth state from AuthContext

	return (
		<nav className="bg-white/75 border-b backdrop-blur-sm fixed top-0 left-0 right-0">
			<div className="p-5 max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto">
				<div className="collapse md:visible flex w-1/3 h-5 items-center gap-3 xl:gap-6">
					<div className="hidden lg:block text-center text-black font-body">
						<Link to="/keyboard-designer">Keyboard Designer</Link>
					</div>
					<div className="text-center text-black font-body">
						<Link to="/shop">Switches</Link>
					</div>
					<div className="text-center text-black font-body">
						<Link to="/about">Keyboards</Link>
					</div>
				</div>
				<div className="w-1/3">
					<Link to="/" className="items-center justify-center flex">
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
                {/* TODO: add mobile menu implementation */}
					<button className="flex md:hidden">
                        <Menu />
                    </button>
                    
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
			</div>
		</nav>
	)
}

export default NavBar
