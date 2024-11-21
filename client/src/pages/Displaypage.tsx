import React, { useState } from "react";

// Define types for the product card
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-black">keylab</div>
        <nav className="space-x-4">
          <a href="/designer" className="text-gray-700">Keyboard Designer</a>
          <a href="/shop" className="text-gray-700">Shop</a>
          <a href="/about" className="text-gray-700">About</a>
        </nav>
        <div className="space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Sign In</button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">Register</button>
        </div>
      </header>

      {/* Shop Banner */}
      <div className="text-center py-8 bg-yellow-200">
        <h1 className="text-4xl font-bold text-black">SHOP</h1>
        <p className="mt-2 text-lg text-gray-600">New Halloween keycaps in stock!</p>
      </div>

      {/* Filters and Products Section */}
      <main className="flex">
        <aside className="w-1/4 bg-white p-4 space-y-4 shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Filters</h2>
          <div>
            <h3 className="font-medium text-gray-600">Switches</h3>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Description
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Keycaps</h3>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Description
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Keyboards</h3>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Description
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Prebuilt Keyboards</h3>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Description
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Price</h3>
            <input type="range" min="0" max="100" className="w-full" />
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Color</h3>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Label
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Label
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Label
            </label>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Size</h3>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Label
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Label
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" /> Label
            </label>
          </div>
        </aside>

        <section className="w-3/4 p-4">
          <div className="flex justify-between mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg px-4 py-2 w-2/3"
            />
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">New</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Price ascending</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Price descending</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">Rating</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="bg-gray-300 h-32 mb-4"></div>
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-gray-500">${product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DisplayPage;