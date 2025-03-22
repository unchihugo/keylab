/** @format */

import { Link } from "react-router-dom"

interface BreadcrumbProps {
	breadcrumbs: string[]
}

export default function Breadcrumb({ breadcrumbs }: BreadcrumbProps) {
	return (
		<nav className="flex items-center">
			<ol className="flex items-center space-x-2">
				{breadcrumbs.map((breadcrumb, index) => (
					<li key={index}>
						{index === 0 && (
							<>
								<Link to={"/"}>
									<span className="underline">Home</span>
								</Link>
								<span> — </span>
							</>
						)}
						{breadcrumb === "Shop" ? (
							<Link to={"/shop"}>
								<span className="underline">{breadcrumb}</span>
							</Link>
						) : (
							<span>{breadcrumb}</span>
						)}
						{index < breadcrumbs.length - 1 && <span> — </span>}
					</li>
				))}
			</ol>
		</nav>
	)
}
