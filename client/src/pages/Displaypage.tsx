import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

// Define types for the product card
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating?: number; 
}

const DisplayPage: React.FC = () => {
  // Example products data (will be taken from a database)
  const [products] = useState<Product[]>([
    { id: 1, name: "Keycap Set A", price: 30, imageUrl: "" },
    { id: 2, name: "Keycap Set B", price: 40, imageUrl: "" },
    { id: 3, name: "Keycap Set C", price: 25, imageUrl: "" },
    { id: 4, name: "Keycap Set D", price: 50, imageUrl: "" },
    { id: 5, name: "Keycap Set E", price: 35, imageUrl: "" },
    { id: 6, name: "Keycap Set F", price: 60, imageUrl: "" },
  ]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({
    mechanical: false,
    artisan: false,
    prebuilt: false,
  });
  const [priceRange, setPriceRange] = useState<number>(100);
  const [sortOption, setSortOption] = useState<string>("new");

  // Apply all filters and sorting
  const applyFilters = () => {
    let updatedProducts = [...products];

    // Apply search filter
    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply active filters
    const filterKeys = Object.keys(activeFilters).filter((key) => activeFilters[key]);
    if (filterKeys.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        filterKeys.some((key) => product.name.toLowerCase().includes(key))
      );
    }

    // Apply price filter
    updatedProducts = updatedProducts.filter((product) => product.price <= priceRange);

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating": 
        updatedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break; // "new" shows original order
    }

    setFilteredProducts(updatedProducts);
  };

  // Reapply filters whenever related state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, activeFilters, priceRange, sortOption ]);

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
  };

  const handleFilterChange = (filterName: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(parseInt(e.target.value, 10));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shop Banner */}
      <div className="text-center py-12 bg-primary mt-20 rounded-xl shadow-xl">
        <h1 className="text-5xl font-bold text-secondary-dark font-display drop-shadow-lg">
          SHOP
          </h1>
          <p className="mt-2 text-xl font-display text-white drop-shadow-lg">
            New Halloween keycaps in stock!
            </p>
      </div>

      {/* Filters and Products Section */}
      <main className="container mx-auto flex flex-col lg:flex-row">
        <aside className="w-full lg:w-1/4 bg-white p-4 shadow-lg rounded-2xl space-y-4 mb-6 lg:mb-0">
          <h2 className="text-xl font-body text-gray-700">Filters</h2>
          <div>
            <h3 className="font-medium text-gray-600">Switches</h3>
            <div className="flex items-center space-x-2">
            <input
               type="checkbox" 
               checked={activeFilters.mechanical}
               onChange={() => handleFilterChange("mechanical")}
               className="w-4 h-4 text-primary rounded focus:ring focus:ring-primary-dark" 
               /> 
               <label htmlFor="switches-filter" className="text-gray-600">
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
              <label htmlFor="keycaps-filter" className="text-gray-600">
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
              <label htmlFor="keyboards-filter" className="text-gray-600">
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
                <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                <span className="text-gray-600">Red</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                  <span className="text-gray-600">Blue</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                    <span className="text-gray-600">Green</span>
                  </label>
              </div>
          </div>
          <div>
    <h3 className="font-medium text-gray-600">Size</h3>
    <div className="flex flex-wrap space-x-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
        <span className="text-gray-600">Small</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
        <span className="text-gray-600">Medium</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" className="w-4 h-4 text-primary rounded" />
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
    value={searchTerm}
    onChange={handleSearch}
    className="border-none outline-none px-4 py-2 w-2/3 text-gray-600 placeholder-gray-400 rounded-full"
  />
  <div className="flex space-x-2">
    <button onClick={() => handleSort("new")} className="px-4 py-2 bg-primary-dark text-white rounded-full hover:bg-primary-darker">
      New
    </button>
    <button onClick={() => handleSort("price-asc")} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
      Price ↑
    </button>
    <button onClick={() => handleSort("price-desc")}  className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
      Price ↓
    </button>
    <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
      Rating
    </button>
  </div>
</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DisplayPage;