/** @format */

import React from "react"
import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"

interface LinkButtonProps {
	to: string
	text?: string
	buttonClassNames?: string
	textClassNames?: string
	Icon?: LucideIcon
	iconRight?: boolean
}

const LinkButton: React.FC<LinkButtonProps> = ({
	to,
	text,
	buttonClassNames,
	textClassNames,
	Icon,
	iconRight,
}) => {
	return (
		<Link to={to}>
			<div
				className={`group h-9 p-2 rounded-full border border-black justify-center items-center gap-2 inline-flex duration-200 
                hover:-translate-y-1 hover:drop-shadow-cartoon-y active:translate-y-0 active:drop-shadow-none active:shadow-inner-cartoon-y
                ${buttonClassNames}`}>
				{Icon && !iconRight ? (
					<Icon
						size={20}
						strokeWidth={1.75}
						absoluteStrokeWidth={true}
                        className="duration-200 group-active:translate-y-0.5"
					/>
				) : null}
				{text ? (
					<div
						className={`text-black font-body leading-tight tracking-tight duration-200 group-active:translate-y-0.5 ${textClassNames}`}>
						{text}
					</div>
				) : null}
				{Icon && iconRight ? (
					<Icon
						size={20}
						strokeWidth={1.75}
						absoluteStrokeWidth={true}
                        className="duration-200 group-active:translate-y-0.5"
					/>
				) : null}
			</div>
		</Link>
	)
}

export default LinkButton
