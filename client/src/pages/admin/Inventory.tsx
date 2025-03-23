import React, { useState, useEffect } from "react";
import { Trash2, PlusCircle, Edit } from "lucide-react";
import { inventoryService } from "../../services/inventoryService";

interface Product {
    id: string;
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
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({
        id: "", name: "", stock: 0, price: 0, image: "", description: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const fetchedProducts = await inventoryService.getProducts();
                setProducts(fetchedProducts);
            } catch (error) {
                setErrorMessage("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async () => {
        if (!newProduct.name || !newProduct.stock || !newProduct.price || !newProduct.image || !newProduct.description) {
            setErrorMessage("All fields are required!");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const addedProduct = await inventoryService.createProduct(newProduct);
            if (addedProduct) {
                setProducts([...products, addedProduct]);
                alert("Product added successfully!");
            } else {
                setErrorMessage("Failed to add product.");
            }
        } catch (error) {
            setErrorMessage("Error adding product.");
        } finally {
            setLoading(false);
            setNewProduct({ id: "", name: "", stock: 0, price: 0, image: "", description: "" });
        }
    };

    const updateProduct = async () => {
        if (!editingProduct) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            const updated = await inventoryService.updateProduct(editingProduct.id, editingProduct);
            if (updated) {
                setProducts(products.map(p => (p.id === editingProduct.id ? updated : p)));
                alert("Product updated successfully!");
            } else {
                setErrorMessage("Failed to update product.");
            }
        } catch (error) {
            setErrorMessage("Error updating product.");
        } finally {
            setLoading(false);
            setEditingProduct(null);
        }
    };

    const deleteProduct = async (id: string) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const deleted = await inventoryService.deleteProduct(id);
            if (deleted) {
                setProducts(products.filter(p => p.id !== id));
                alert("Product deleted successfully!");
            } else {
                setErrorMessage("Failed to delete product.");
            }
        } catch (error) {
            setErrorMessage("Error deleting product.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct({ ...product });
    };

    const displayedProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 min-h-screen bg-[#faf6ed]">

            <div className="mt-16 bg-blue-100 p-4 rounded shadow mb-4">
                <p className="text-black">Manage your product stock and details.</p>
            </div>

            <input
                type="text"
                placeholder="Search products..."
                className="p-2 border rounded w-full mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Add Product Form */}
            <div className="mb-4 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-2">Add Product</h3>
                <input
                    type="text"
                    placeholder="Name"
                    className="p-2 border rounded w-full mb-2"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    className="p-2 border rounded w-full mb-2"
                    value={newProduct.stock || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    className="p-2 border rounded w-full mb-2"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Math.max(0, parseFloat(e.target.value) || 0) })}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    className="p-2 border rounded w-full mb-2"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    className="p-2 border rounded w-full mb-2"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <button
                    onClick={addProduct}
                    className="bg-secondary/50 text-black px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </div>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
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
                        {displayedProducts.map((product) => (
                            <tr key={product.id} className="border-b border-gray-200">
                                <td className="py-2 px-4">
                                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded" />
                                </td>
                                <td className="py-2 px-4">{product.name}</td>
                                <td className={product.stock < 5 ? "text-red-500" : ""}>{product.stock}</td>
                                <td className="py-2 px-4">£{product.price.toFixed(2)}</td>
                                <td className="py-2 px-4">{product.description}</td>
                                <td className="py-2 px-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="text-blue-500 hover:text-blue-700 flex items-center"
                                    >
                                        <Edit className="mr-1" />
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
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

            {editingProduct && (
                <div className="mt-4 bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-2">Edit Product</h3>
                    <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="p-2 border rounded w-full mb-2"
                    />
                    <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="p-2 border rounded w-full mb-2"
                    />
                    <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="p-2 border rounded w-full mb-2"
                    />
                    <button
                        onClick={updateProduct}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </div>
            )}
        </div>
    );
}
