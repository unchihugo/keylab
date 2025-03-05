import React, { useState, useEffect } from "react";
import { Trash2, PlusCircle, Edit } from "lucide-react";

interface Product {
    name: string;
    stock: number;
    price: number;
    image: string;
    description: string;
}

export default function Inventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<keyof Product | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [editingImage, setEditingImage] = useState<number | null>(null);
    const [newImage, setNewImage] = useState<string>("");

    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState<Product | null>(null);

    useEffect(() => {
        const storedProducts = localStorage.getItem("inventory");
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("inventory", JSON.stringify(products));
    }, [products]);

    const addProduct = () => {
        setIsAddingProduct(true);
        setNewProduct({
            name: "",
            stock: 0,
            price: 0,
            image: "https://via.placeholder.com/100",
            description: "",
        });
    };

    const cancelAddProduct = () => {
        setIsAddingProduct(false);
        setNewProduct(null);
    };

    const saveNewProduct = () => {
        if (newProduct) {
            setProducts(prevProducts => [...prevProducts, newProduct]);
            setIsAddingProduct(false);
            setNewProduct(null);
        }
    };

    const handleNumberChange = (field: keyof Product, value: string) => {
        const numericValue = value === "" ? "" : Number(value);

        if (numericValue !== "" && numericValue < 0) {
            setNewProduct(prevProduct => ({
                ...prevProduct!,
                [field]: 0,
            }));
        } else {
            setNewProduct(prevProduct => ({
                ...prevProduct!,
                [field]: numericValue,
            }));
        }
    };

    const startEditing = (index: number, field: keyof Product) => {
        setEditingIndex(index);
        setEditingField(field);
        setEditValue(products[index][field].toString());
    };

    const saveEdit = () => {
        if (editingIndex === null || editingField === null) return;
        const updatedProducts = [...products];
        if (editingField === "stock" || editingField === "price") {
            const numericValue = Number(editValue);
            if (isNaN(numericValue)) {
                alert("Please enter a valid number.");
                return;
            }
            updatedProducts[editingIndex][editingField] = Math.max(numericValue, 0);
        } else {
            updatedProducts[editingIndex][editingField] = editValue;
        }
        setProducts(updatedProducts);
        setEditingIndex(null);
        setEditingField(null);
        setEditValue("");
    };

    const startEditingImage = (index: number) => {
        setEditingImage(index);
        setNewImage(products[index].image);
    };

    const saveImageEdit = (index: number) => {
        const updatedProducts = [...products];
        updatedProducts[index].image = newImage;
        setProducts(updatedProducts);
        setEditingImage(null);
    };

    const displayedProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mt-16"></div>

            <section className="bg-blue-600 py-6 px-8 text-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold">Inventory Management</h2>
                <p className="mt-2">Manage product stock levels.</p>
            </section>

            <div className="max-w-screen-lg mx-auto mt-6">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="p-2 border rounded w-full mb-4" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />

                <button onClick={addProduct} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 mb-4">
                    <PlusCircle className="mr-2" /> Add Product
                </button>

                {isAddingProduct && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                        <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                        <input
                            type="text"
                            value={newProduct?.name || ""}
                            onChange={(e) => setNewProduct({ ...newProduct!, name: e.target.value })}
                            placeholder="Product Name"
                            className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                            type="number"
                            value={newProduct?.stock || ""}
                            onChange={(e) => handleNumberChange('stock', e.target.value)}
                            placeholder="Stock"
                            className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                            type="number"
                            value={newProduct?.price || ""}
                            onChange={(e) => handleNumberChange('price', e.target.value)}
                            placeholder="Price"
                            className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                            type="text"
                            value={newProduct?.image || ""}
                            onChange={(e) => setNewProduct({ ...newProduct!, image: e.target.value })}
                            placeholder="Image URL"
                            className="p-2 border rounded mb-2 w-full"
                        />
                        <textarea
                            value={newProduct?.description || ""}
                            onChange={(e) => setNewProduct({ ...newProduct!, description: e.target.value })}
                            placeholder="Description"
                            className="p-2 border rounded mb-4 w-full"
                        />
                        <div className="flex justify-between">
                            <button onClick={cancelAddProduct} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                            <button onClick={saveNewProduct} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-2 px-4">Image</th>
                                <th className="py-2 px-4">Product</th>
                                <th className="py-2 px-4">Stock</th>
                                <th className="py-2 px-4">Price</th>
                                <th className="py-2 px-4">Description</th>
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedProducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-2 px-4">
                                        {editingImage === index ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={newImage}
                                                    onChange={(e) => setNewImage(e.target.value)}
                                                    className="border p-1 rounded w-full"
                                                />
                                                <button onClick={() => saveImageEdit(index)} className="text-blue-500 ml-2">
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <img src={product.image} alt={product.name} className="w-16 h-16 rounded" />
                                                <button 
                                                    onClick={() => startEditingImage(index)} 
                                                    className="ml-2 text-blue-500"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    {(["name", "stock", "price", "description"] as (keyof Product)[]).map(field => (
                                        <td key={field} className="py-2 px-4">
                                            {editingIndex === index && editingField === field ? (
                                                <input 
                                                    type={field === "stock" || field === "price" ? "number" : "text"} 
                                                    value={editValue} 
                                                    onChange={(e) => setEditValue(e.target.value)} 
                                                    onBlur={saveEdit} 
                                                    autoFocus 
                                                    className="border p-1 rounded"
                                                />
                                            ) : (
                                                <span>
                                                    {field === "price" ? `£${product[field].toFixed(2)}` : product[field]} 
                                                    <button 
                                                        onClick={() => startEditing(index, field)} 
                                                        className="ml-2 text-blue-500"
                                                    >
                                                        Edit
                                                    </button>
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="py-2 px-4 flex justify-center gap-2">
                                        <button 
                                            onClick={() => setProducts(products.filter((_, i) => i !== index))} 
                                            className="text-red-500 hover:text-red-700 flex items-center"
                                        >
                                            <Trash2 className="mr-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
