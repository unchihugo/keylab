/** @format */

import { Link } from "react-router-dom"

interface NavLinkProps {
	text: string
	className?: string
	onClick?: () => void
	to: string
}

export default function NavLink({
	text,
	className,
	onClick,
	to,
}: NavLinkProps) {
	return (
		<div className={`${className}`}>
			<Link
				to={to}
				onClick={onClick}
				className="duration-200 text-black/75 hover:text-black/100">
				{text}
			</Link>
		</div>
	)
}
