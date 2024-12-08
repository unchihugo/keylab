/** @format */

import { useState } from "react"

interface ZoomImageProps {
	src: string | undefined
	alt: string
}

export default function ZoomImage({ src, alt }: ZoomImageProps) {
	const [isHovered, setIsHovered] = useState(false)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={(e) => {
				const { left, top } = e.currentTarget.getBoundingClientRect()
				setMousePosition({
					x: e.clientX - left,
					y: e.clientY - top,
				})
			}}>
			<img src={src} alt={alt} className="w-full h-auto rounded-lg" />
			{isHovered && (
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						backgroundImage: `url(${src})`,
						backgroundPosition: `${-mousePosition.x}px ${-mousePosition.y}px`,
						backgroundSize: "200%",
					}}
				/>
			)}
		</div>
	)
}
