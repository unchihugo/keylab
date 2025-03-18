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
    const itemsPerPage = 5;

    useEffect(() => {
        inventoryService.getProducts().then(setProducts);
    }, []);

    const addProduct = async () => {
        const addedProduct = await inventoryService.createProduct(newProduct);
        setProducts([...products, addedProduct]);
        setNewProduct({ id: "", name: "", stock: 0, price: 0, image: "", description: "" });
    };

    const updateProduct = async () => {
        if (!editingProduct) return;
        await inventoryService.updateProduct(editingProduct.id, editingProduct);
        setProducts(products.map(p => (p.id === editingProduct.id ? editingProduct : p)));
        setEditingProduct(null);
    };

    const deleteProduct = async (id: string) => {
        await inventoryService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
    };

    const displayedProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold text-gray-700">Inventory Management</h2>
            
            <div className="mt-6 bg-blue-100 p-4 rounded shadow mb-4">
                <p className="text-gray-600">Manage your product stock and details.</p>
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
                <input type="text" placeholder="Name" className="p-2 border rounded w-full mb-2" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input type="number" placeholder="Stock" className="p-2 border rounded w-full mb-2" value={newProduct.stock || ""} onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, parseInt(e.target.value) || 0) })} />
                <input type="number" placeholder="Price" className="p-2 border rounded w-full mb-2" value={newProduct.price || ""} onChange={(e) => setNewProduct({ ...newProduct, price: Math.max(0, parseFloat(e.target.value) || 0) })} />
                <input type="text" placeholder="Image URL" className="p-2 border rounded w-full mb-2" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                <input type="text" placeholder="Description" className="p-2 border rounded w-full mb-2" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
            </div>

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
                                <td className={`py-2 px-4 ${product.stock < 5 ? "text-red-500" : ""}`}>{product.stock}</td>
                                <td className="py-2 px-4">£{product.price.toFixed(2)}</td>
                                <td className="py-2 px-4">{product.description}</td>
                                <td className="py-2 px-4 flex justify-center gap-2">
                                    <button onClick={() => setEditingProduct(product)} className="text-blue-500 hover:text-blue-700 flex items-center">
                                        <Edit className="mr-1" />
                                    </button>
                                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700 flex items-center">
                                        <Trash2 className="mr-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}