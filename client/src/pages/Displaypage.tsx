/** @format */

import React, { useState, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import { useProducts } from "../hooks/useProducts"
import NotFound from "./NotFound"

export default function DisplayPage() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { products, loading, error, searchProducts, getProductsByCategory } =
		useProducts() // Fetch products from backend

	const [searchTerm, setSearchTerm] = useState<string>("")
	const [activeFilters, setActiveFilters] = useState<{
		[key: string]: boolean
	}>({
		mechanical: false,
		artisan: false,
		prebuilt: false,
	})
	const [priceRange, setPriceRange] = useState<number>(100)
	const [sortOption, setSortOption] = useState<string>("new")

	// Apply all filters and sorting
	useEffect(() => {
		const applyFilters = () => {
			// let updatedProducts = [...products]
			// // Apply active filters
			// const filterKeys = Object.keys(activeFilters).filter(
			// 	(key) => activeFilters[key],
			// )
			// if (filterKeys.length > 0) {
			// 	updatedProducts = updatedProducts.filter((product) =>
			// 		filterKeys.some((key) =>
			// 			product.data.name.toLowerCase().includes(key),
			// 		),
			// 	)
			// }
			// // Apply price filter
			// updatedProducts = updatedProducts.filter(
			// 	(product) => product.data.price <= priceRange,
			// )
			// // Apply sorting
			// switch (sortOption) {
			// 	case "price-asc":
			// 		updatedProducts.sort((a, b) => a.data.price - b.data.price)
			// 		break
			// 	case "price-desc":
			// 		updatedProducts.sort((a, b) => b.data.price - a.data.price)
			// 		break
			// 	case "rating":
			// 		updatedProducts.sort(
			// 			(a, b) => (b.data.rating || 0) - (a.data.rating || 0),
			// 		)
			// 		break
			// 	default:
			// 		break
			// }
			// setFilteredProducts(updatedProducts)
		}

		// Reapply filters whenever related state changes

		applyFilters()
	}, [searchTerm, activeFilters, priceRange, sortOption, products])

	// Handlers
	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		setSearchTerm((e.target as HTMLInputElement).value)
		if (e.key === "Enter") {
			searchProducts((e.target as HTMLInputElement).value)
		}
	}

	const handleSort = (option: string) => {
		setSortOption(option)
	}

	const handleFilterChange = (filterName: string) => {
		setActiveFilters((prev) => ({
			...prev,
			[filterName]: !prev[filterName],
		}))
	}

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPriceRange(parseInt(e.target.value, 10))
	}

	if (loading)
		return (
			<NotFound
				errorMessage="Loading..."
				bodyMessage="Loading products..."
			/>
		)
	if (error)
		return <NotFound errorMessage="400 - Bad Request" bodyMessage={error} />
	if (!products) return <NotFound bodyMessage="No products found" />

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Shop Banner */}
			<div className="text-center py-12 bg-primary bg-opacity-70 mt-20 rounded-xl shadow-xl">
				<h1 className="text-5xl font-bold text-secondary-dark font-display drop-shadow-lg">
					SHOP
				</h1>
				<p className="mt-2 text-xl font-display text-white drop-shadow-lg">
					New Halloween keycaps in stock!
				</p>
			</div>

			{/* Filters and Products Section */}
			<main className="container mx-auto flex flex-col lg:flex-row bg-primary bg-opacity-20">
				<aside className="w-full lg:w-1/5 bg-primary-dark bg-opacity-50 p-4 shadow-lg rounded-2xl space-y-4 mb-6 lg:mb-0 h-fit border border-gray-700">
					<h2 className="text-xl font-body text-gray-700">Filters</h2>
					<div>
						<h3 className="font-medium text-gray-600">Switches</h3>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={activeFilters.mechanical}
								onChange={() =>
									handleFilterChange("mechanical")
								}
								className="w-4 h-4 text-primary rounded focus:ring focus:ring-primary-dark"
							/>
							<label
								htmlFor="switches-filter"
								className="text-gray-600">
								Mechanical Switches
							</label>
						</div>
					</div>
					<div>
						<h3 className="font-medium text-gray-600">Keycaps</h3>
						<div className="flex items-center">
							<input
								type="checkbox"
								checked={activeFilters.artisan}
								onChange={() => handleFilterChange("artisan")}
								className="mr-2 w-4 h-4 text-primary rounded focus:ring focus:ring-primary-dark"
							/>
							<label
								htmlFor="keycaps-filter"
								className="text-gray-600">
								Artisan Keycaps
							</label>
						</div>
					</div>
					{/* Keyboards Filter */}
					<div>
						<h3 className="font-medium text-gray-600">Keyboards</h3>
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								checked={activeFilters.prebuilt}
								onChange={() => handleFilterChange("prebuilt")}
								className="w-4 h-4 text-primary rounded focus:ring focus:ring-primary-dark"
							/>
							<label
								htmlFor="keyboards-filter"
								className="text-gray-600">
								Prebuilt Keyboards
							</label>
						</div>
					</div>
					<div>
						<h3 className="font-medium text-gray-600">Price</h3>
						<input
							type="range"
							min="0"
							max="100"
							value={priceRange}
							onChange={handlePriceChange}
							className="w-full focus:ring focus:ring-primary-dark"
						/>
					</div>
					<div>
						<h3 className="font-medium text-gray-600">Color</h3>
						<div className="flex flex-wrap space-x-4">
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
								/>
								<span className="text-gray-600">Red</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
								/>
								<span className="text-gray-600">Blue</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
								/>
								<span className="text-gray-600">Green</span>
							</label>
						</div>
					</div>
					<div>
						<h3 className="font-medium text-gray-600">Size</h3>
						<div className="flex flex-wrap space-x-4">
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
								/>
								<span className="text-gray-600">Small</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
								/>
								<span className="text-gray-600">Medium</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
								/>
								<span className="text-gray-600">Large</span>
							</label>
						</div>
					</div>
				</aside>

				{/* Products Section */}
				<section className="w-full lg:w-3/4 p-4">
					{/* Search and Sorting */}
					<div className="flex items-center justify-between bg-white p-4 rounded-full shadow-md mb-6">
						<input
							type="text"
							placeholder="Search products"
							//value={searchTerm}
							onKeyDown={handleSearch}
							className="border-none outline-none px-4 py-2 w-2/3 text-gray-600 placeholder-gray-400 rounded-full"
						/>
						<div className="flex space-x-2">
							<button
								onClick={() => handleSort("new")}
								className="px-4 py-2 bg-primary-dark text-white rounded-full hover:bg-primary-darker">
								New
							</button>
							<button
								onClick={() => handleSort("price-asc")}
								className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
								Price ↑
							</button>
							<button
								onClick={() => handleSort("price-desc")}
								className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
								Price ↓
							</button>
							<button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
								Rating
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{products.map((product) => (
							<ProductCard
								key={product.data.id}
								product={product}
							/>
						))}
					</div>
				</section>
			</main>
		</div>
	)
}
