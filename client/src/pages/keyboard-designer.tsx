/** @format */

import React from "react"
import Divider from "../components/Divider"

export default function KeyboardDesigner() {
	return (
		<div className="flex justify-start items-start bg-[#B0C4DE] min-h-screen pl-12 pt-10">
			<div className="w-full max-w-5xl">
				{/* Keyboard Designer Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-16 p-6">
					{/* Keyboard Designer Container */}
					<div className="bg-white drop-shadow-cartoon rounded-lg border border-black p-6 h-[600px]">
						<div className="text-3xl font-display mb-4">
							Keyboard Designer
						</div>
						<Divider />

						{/* Color Customizer */}
						<div className="bg-white border border-black rounded-lg p-4 ">
							<h3 className="text-2x1 font-display mb-4">
								Color Customizer
							</h3>
							<hr className="my-2" />

							{/* Color Options */}
							<div className="space-y-3">
								<div className="flex gap-6 hover:bg-[#A78B71] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Retro</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#F5E6CC]" />
										<div className="w-10 h-8 bg-[#D6BFAA]" />
										<div className="w-10 h-8 bg-[#FFDD57]" />
									</div>
								</div>

								<div className="flex gap-6 hover:bg-[#8A6794] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Lavender</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#EAE6FF]" />
										<div className="w-10 h-8 bg-[#D8BFD8]" />
										<div className="w-10 h-8 bg-[#B19CD9]" />
									</div>
								</div>

								<div className="flex gap-6 hover:bg-[#C0C0C0] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Futuristic</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#000000] " />
										<div className="w-10 h-8 bg-[#4B4B4B] " />
										<div className="w-10 h-8 bg-[#00AEEF] " />
									</div>
								</div>

								<div className="flex gap-6 hover:bg-[#9CAF88] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Forest</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#2E8B57]" />
										<div className="w-10 h-8 bg-[#004B23]" />
										<div className="w-10 h-8 bg-[#000000]" />
									</div>
								</div>
								<div className="flex gap-6 hover:bg-[#A35426] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Rose</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#E5E5E0]" />
										<div className="w-10 h-8 bg-[#7A8676]" />
										<div className="w-10 h-8 bg-[#B15C66]" />
									</div>
								</div>
								<div className="flex gap-6 hover:bg-[#5069A5] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Ocean</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#001F3F]" />
										<div className="w-10 h-8 bg-[#4CA6A8]" />
										<div className="w-10 h-8 bg-[#87CEEB]" />
									</div>
								</div>
								<div className="flex gap-6 hover:bg-[#312778] hover:text-white rounded-lg p-2 cursor-pointer transition duration-200 shadow-md">
									<span>Electric</span>
									<div className="flex ml-auto">
										<div className="w-10 h-8 bg-[#0D0D0D]" />
										<div className="w-10 h-8 bg-[#8A2BE2]" />
										<div className="w-10 h-8 bg-[#00FFFF]" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
