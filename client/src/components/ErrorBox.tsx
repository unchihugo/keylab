/** @format */

import React from "react"

interface ErrorBoxProps {
	children: string[] | null
}

/**
 * Component to display error messages in a bulleted list
 * Pass an array of error messages to display them and unhide the component
 */
const ErrorBox: React.FC<ErrorBoxProps> = ({ children }) => {
	if (children === null || children.length === 0) {
		return null
	}
	return (
		<div className="p-3 bg-red-100 text-red-800 border border-red-300 rounded-lg">
			<ul className="list-none">
				{children.map((error, index) => (
					<li key={index} className="pl-3 pr-1 -indent-2 text-sm">
						• {error}
					</li>
				))}
			</ul>
		</div>
	)
}

export default ErrorBox
