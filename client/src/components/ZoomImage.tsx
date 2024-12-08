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
			className="object-cover h-full relative overflow-hidden content-center"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={(e) => {
				const { left, top, width, height } =
					e.currentTarget.getBoundingClientRect()
				const x = ((e.clientX - left) / width) * 100
				const y = 100 - ((e.clientY - top) / height) * 100
				setMousePosition({ x, y })
			}}>
			<img
				src={src}
				alt={alt}
				className="w-full h-auto rounded-lg object-cover"
			/>
			<div
				className="absolute bg-no-repeat h-full content-center inset-0 pointer-events-none transition-opacity duration-200 ease-in-out"
				style={{
					opacity: isHovered ? 1 : 0,
					backgroundImage: `url(${src})`,
					backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
					backgroundSize: "200%",
				}}
			/>
		</div>
	)
}
