/** @format */

import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import ProductCard from "../components/ProductCard"
import { useProducts } from "../hooks/useProducts"
import NotFound from "./NotFound"

export default function DisplayPage() {
	const location = useLocation(); 
    const searchParams = new URLSearchParams(location.search);
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
	const [filteredProducts, setFilteredProducts] = useState(products); 

	const [activeColors, setActiveColors] = useState<string[]>([]);
	const [activeSizes, setActiveSizes] = useState<string[]>([]);

	const [activeBrands, setActiveBrands] = useState<string[]>([]);

	useEffect(() => {
		const categoryParam = searchParams.get('category');
        if (categoryParam) {
            if (categoryParam === 'keyboards') {
                getProductsByCategory("keyboards").then(() => {
                    setFilteredProducts(products);
                })
            } else if (categoryParam === 'keycaps') {
                getProductsByCategory("keycaps").then(() => {
                    setFilteredProducts(products);
                })
            } else if (categoryParam === 'switches'){
                getProductsByCategory("switches").then(() => {
                    setFilteredProducts(products);
                })
            } else if (categoryParam === 'accessories'){
                getProductsByCategory("accessories").then(() => {
                    setFilteredProducts(products);
                })
            }
        }
        const applyFilters = () => {
            let updatedProducts = products; // Start with all products

            if (products && Array.isArray(products) && products.length > 0){
                // Filter by active filters (mechanical, artisan, prebuilt)
                const filterKeys = Object.keys(activeFilters).filter(
                    (key) => activeFilters[key]
                );
                if (filterKeys.length > 0) {
                    updatedProducts = updatedProducts.filter((product) =>
                        filterKeys.some((key) => {
                            const productName = product.data.name.toLowerCase();
                            return productName.includes(key);
                        })
                    );
                }
                // Filter by price range
                updatedProducts = updatedProducts.filter(
                    (product) => product.data.price <= priceRange
                );
            }
			// Filter by color
            if (activeColors.length > 0) {
                updatedProducts = updatedProducts.filter((product) =>
                    activeColors.some((color) => product.data.color === color)
                );
            }

            // Filter by size
            if (activeSizes.length > 0) {
                updatedProducts = updatedProducts.filter((product) =>
                    activeSizes.some((size) => product.data.size === size)
                );
            }
			// Filter by brand
            if (activeBrands.length > 0) {
                updatedProducts = updatedProducts.filter((product) =>
                    activeBrands.some((brand) => product.data.brand === brand)
                );
            }
            setFilteredProducts(updatedProducts); 
        };

        applyFilters(); 
    }, [products, activeFilters, priceRange, activeColors, activeSizes, activeBrands, location.search, getProductsByCategory]);

	

	//const [sortOption, setSortOption] = useState<string>("new")
	
	// Apply all filters and sorting
	// useEffect(() => {
	// 	const applyFilters = () => {
	// 		// let updatedProducts = [...products]
	// 		// // Apply active filters
	// 		// const filterKeys = Object.keys(activeFilters).filter(
	// 		// 	(key) => activeFilters[key],
	// 		// )
	// 		// if (filterKeys.length > 0) {
	// 		// 	updatedProducts = updatedProducts.filter((product) =>
	// 		// 		filterKeys.some((key) =>
	// 		// 			product.data.name.toLowerCase().includes(key),
	// 		// 		),
	// 		// 	)
	// 		// }
	// 		// // Apply price filter
	// 		// updatedProducts = updatedProducts.filter(
	// 		// 	(product) => product.data.price <= priceRange,
	// 		// )
	// 		// // Apply sorting
	// 		// switch (sortOption) {
	// 		// 	case "price-asc":
	// 		// 		updatedProducts.sort((a, b) => a.data.price - b.data.price)
	// 		// 		break
	// 		// 	case "price-desc":
	// 		// 		updatedProducts.sort((a, b) => b.data.price - a.data.price)
	// 		// 		break
	// 		// 	case "rating":
	// 		// 		updatedProducts.sort(
	// 		// 			(a, b) => (b.data.rating || 0) - (a.data.rating || 0),
	// 		// 		)
	// 		// 		break
	// 		// 	default:
	// 		// 		break
	// 		// }
	// 		// setFilteredProducts(updatedProducts)
	// 	}

	// 	// Reapply filters whenever related state changes

	// 	applyFilters()
	// }, [searchTerm, activeFilters, priceRange, sortOption, products])

	const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			try {
				await searchProducts(searchTerm)
				setFilteredProducts(products);
				console.log("Search results:", products)

				// Check if products is an array
				if (!Array.isArray(products)) {
					return (
						<NotFound bodyMessage="Invalid product data received" />
					)
				}

				if (loading) {
					// return (
					// 	<NotFound
					// 		errorMessage="Loading..."
					// 		bodyMessage="Loading products..."
					// 	/>
					// )
				}
			} catch (err) {
				console.error("Search error:", err)
			}
		}
	}

	const handleSort = (option: string) => {
		const sortedProducts = [...filteredProducts]; 

		switch (option) {
			case "new":
				sortedProducts.sort((a, b) => b.data.id - a.data.id);
				break;
			case "price-asc":
				sortedProducts.sort((a, b) => a.data.price - b.data.price);
				break;
			case "price-desc":
				sortedProducts.sort((a, b) => b.data.price - a.data.price);
				break;
			case "rating":
				sortedProducts.sort((a, b) => (b.data.rating || 0) - (a.data.rating || 0));
				break;
			default:
				break;
		}
	
		setFilteredProducts(sortedProducts);
	};


	const handleFilterChange = (filterName: string) => {
		setActiveFilters((prev) => ({
			...prev,
			[filterName]: !prev[filterName],
		}))
	}

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPriceRange(parseInt(e.target.value, 10))
	}
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedCategory = e.target.value
		if (selectedCategory) {
			getProductsByCategory(selectedCategory).then(() => {
				setFilteredProducts(products); // Update filtered products after category change.
            }); // Fetch products for the selected category
        } else {
            setFilteredProducts(products); // Reset if no category is selected.
        }
    }

	const handleColorChange = (color: string) => {
		if (activeColors.includes(color)) {
			setActiveColors(activeColors.filter((c) => c !== color));
		} else {
			setActiveColors([...activeColors, color]);
		}
	};
	
	const handleSizeChange = (size: string) => {
		if (activeSizes.includes(size)) {
			setActiveSizes(activeSizes.filter((s) => s !== size));
		} else {
			setActiveSizes([...activeSizes, size]);
		}
	};

	const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedBrand = e.target.value;
		if (selectedBrand) {
			setActiveBrands([selectedBrand]); 
		} else {
			setActiveBrands([]); 
		}
	};

	if (loading)
		if (error)
			// return (
			// 	<NotFound
			// 		errorMessage="Loading..."
			// 		bodyMessage="Loading products..."
			// 	/>
			// )
			return (
				<NotFound
					errorMessage="400 - Bad Request"
					bodyMessage={error}
				/>
			)
	if (!products) return <NotFound bodyMessage="No products found" />
	console.log("Products:", products)

	return (
		<div className="min-h-screen bg-primary/25 py-24">
			{/* Shop Banner */}
			<div className="container mx-auto px-24 py-12 bg-white text-black rounded-2xl my-4 border border-black">
				<div className="w-full text-black/50">Home — Shop</div>
				<h1 className="text-5xl font-display">SHOP</h1>
				<p className="mt-4 leading-5 opacity-50">
					Christmas keycaps in stock! <br /> Browse our selection of
					keycaps, switches, and keyboards.
				</p>
				<div className="mt-3 flex items-center gap-12">
					<p>Filter:</p>
					<select
						className="p-1 border-gray-300 rounded-lg font-bold"
						onChange={handleCategoryChange} // Call onChange handler
					>
						<option value="0">By Category</option>
						<option value="1">Keyboards</option>
						<option value="7">Keycaps</option>
						<option value="8">Switches</option>
						<option value="10">Accessories</option>
					</select>
					<select className="p-1 border-gray-300 rounded-lg font-bold"
					    onChange={handleBrandChange}
					>
						<option value="">By Brand</option>
						<option value="switches">Switches</option>
						<option value="keycaps">Keycaps</option>
						<option value="keyboards">Keyboards</option>
						<option value="accessories">Accessories</option>
					</select>
				</div>
			</div>

			{/* Filters and Products Section */}
			<main className="container mx-auto flex flex-col lg:flex-row">
				<aside className="w-full lg:w-1/5 bg-primary-dark/25 p-4 rounded-2xl space-y-4 mb-6 lg:mb-0 h-fit border border-gray-700 mr-4">
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
									checked={activeColors.includes("Red")}
									onChange={() => handleColorChange("Red")}
								/>
								<span className="text-gray-600">Red</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
									checked={activeColors.includes("Blue")}
									onChange={() => handleColorChange("Blue")}
								/>
								<span className="text-gray-600">Blue</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
									checked={activeColors.includes("Green")}
									onChange={() => handleColorChange("Green")}
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
									checked={activeSizes.includes("Small")}
									onChange={() => handleSizeChange("Small")}
								/>
								<span className="text-gray-600">Small</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
									checked={activeSizes.includes("Medium")}
									onChange={() => handleSizeChange("Medium")}
								/>
								<span className="text-gray-600">Medium</span>
							</label>
							<label className="flex items-center space-x-2">
								<input
									type="checkbox"
									className="w-4 h-4 text-primary rounded"
									checked={activeSizes.includes("Large")}
									onChange={() => handleSizeChange("Large")}
								/>
								<span className="text-gray-600">Large</span>
							</label>
						</div>
					</div>
				</aside>

			{/* Products Section */}
			<section className="w-full lg:w-4/5">
					{/* Search and Sorting */}
					<div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-black mb-6">
						<input
							type="text"
							placeholder="Search products"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={handleSearch}
							className="border border-black/50 outline-secondary-darker px-4 py-2 w-2/3 text-gray-600 placeholder-gray-400 rounded-xl"
						/>
						<div className="flex justify-start space-x-4 mt-6 ml-2">
							<button
								onClick={() => handleSort("new")}
								className="px-6 py-2 rounded-full border-1 border-black bg-secondary-dark text-black transition-all duration-200 ease-in-out hover:bg-secondary-darker hover:shadow-[4px_4px_0px_black]">
								New
							</button>
							<button
								onClick={() => handleSort("price-asc")}
								className="px-6 py-2 rounded-full border-1 border-black bg-secondary-dark text-black transition-all duration-200 ease-in-out hover:bg-secondary-darker hover:shadow-[4px_4px_0px_black]">
								Price ↑
							</button>
							<button
								onClick={() => handleSort("price-desc")}
								className="px-6 py-2 rounded-full border-1 border-black bg-secondary-dark text-black transition-all duration-200 ease-in-out hover:bg-secondary-darker hover:shadow-[4px_4px_0px_black]">
								Price ↓
							</button>
							<button 
							    onClick={() => handleSort("rating")}
							    className="px-6 py-2 rounded-full border-1 border-black bg-secondary-dark text-black transition-all duration-200 ease-in-out hover:bg-secondary-darker hover:shadow-[4px_4px_0px_black]">
								Rating
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
						{Array.isArray(filteredProducts) ? (
							filteredProducts.map((product) => (
								<ProductCard
									key={product.data.id}
									product={product}
								/>
							))
						) : (
							<div>No products found</div>
						)}
					</div>
				</section>
			</main>
		</div>
	)
}