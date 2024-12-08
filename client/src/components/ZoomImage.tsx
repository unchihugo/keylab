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
		// TODO: fix oveflow issue
		<div
			className="object-cover relative overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={(e) => {
				const { left, top } = e.currentTarget.getBoundingClientRect()
				setMousePosition({
					x: e.clientX - left,
					y: e.clientY - top,
				})
			}}>
			<img src={src} alt={alt} className="w-full h-auto rounded-lg object-cover" />
			<div
				className="absolute inset-0 pointer-events-none transition-opacity duration-200 ease-in-out"
				style={{
					opacity: isHovered ? 1 : 0,
					backgroundImage: `url(${src})`,
					backgroundPosition: `${-mousePosition.x}px ${-mousePosition.y}px`,
					backgroundSize: "200%",
				}}
			/>
		</div>
	)
}
