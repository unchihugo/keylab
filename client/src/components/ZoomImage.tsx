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
			className="relative overflow-hidden w-full h-full flex items-center justify-center"
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
				className="max-w-full max-h-full w-auto h-auto rounded-lg object-contain"
			/>
			<div
				className="absolute bg-no-repeat h-full w-full rounded-lg pointer-events-none transition-opacity duration-200 ease-in-out"
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
