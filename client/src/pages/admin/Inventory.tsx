import React, { useState, useMemo } from "react";
import { Trash2, PlusCircle, Edit } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";
import { Product } from "../../types/Product";

export default function Inventory() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } =
    useInventory();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    data: {
      id: 0,
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      category_id: 0,
      imageUrl: "",
    },
    message: "",
  });

  const itemsPerPage = 5;

  const handleAddProduct = () => {
    if (
      !newProduct.data.name ||
      !newProduct.data.stock ||
      !newProduct.data.price ||
      !newProduct.data.description
    ) {
      alert("All fields are required!");
      return;
    }
    addProduct(newProduct);
    setNewProduct({
      data: {
        id: 0,
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        category_id: 0,
        imageUrl: "",
      },
      message: "",
    });
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.data.id.toString(), editingProduct);
      setEditingProduct(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    console.log("Product deleted");
  };

  const displayedProducts = useMemo(() => {
    return products
      .filter((product: Product) =>
        product.data.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [products, searchTerm, currentPage]);

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
          value={newProduct.data.name}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              data: { ...newProduct.data, name: e.target.value },
            })
          }
        />
        <input
          type="number"
          placeholder="Stock"
          className="p-2 border rounded w-full mb-2"
          value={newProduct.data.stock || ""}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              data: {
                ...newProduct.data,
                stock: Math.max(0, parseInt(e.target.value) || 0),
              },
            })
          }
        />
        <input
          type="number"
          placeholder="Price"
          className="p-2 border rounded w-full mb-2"
          value={newProduct.data.price || ""}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              data: {
                ...newProduct.data,
                price: Math.max(0, parseFloat(e.target.value) || 0),
              },
            })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          className="p-2 border rounded w-full mb-2"
          value={newProduct.data.imageUrl || ""}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              data: { ...newProduct.data, imageUrl: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded w-full mb-2"
          value={newProduct.data.description}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              data: { ...newProduct.data, description: e.target.value },
            })
          }
        />
        <button
          onClick={handleAddProduct}
          className="bg-secondary/50 text-black px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      {loading && <div className="text-center">Loading...</div>}

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
            {displayedProducts.map((product: Product) => (
              <tr key={product.data.id} className="border-b border-gray-200">
                <td className="py-2 px-4">
                <img 
                    src={product.data.product_images?.[0]?.url || ''}
                    alt={product.data.name || 'Product image'} 
                    className="w-16 h-16 rounded object-contain"
                />

                </td>
                <td className="py-2 px-4">{product.data.name}</td>
                <td
                  className={
                    product.data.stock < 5 ? "text-red-500" : ""
                  }
                >
                  {product.data.stock}
                </td>
                <td className="py-2 px-4">
                  £{product.data.price.toFixed(2)}
                </td>
                <td className="py-2 px-4">{product.data.description}</td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <Edit className="mr-1" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.data.id.toString())}
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
            value={editingProduct.data.name}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                data: { ...editingProduct.data, name: e.target.value },
              })
            }
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="number"
            value={editingProduct.data.stock}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                data: {
                  ...editingProduct.data,
                  stock: Math.max(0, parseInt(e.target.value) || 0),
                },
              })
            }
            className="p-2 border rounded w-full mb-2"
          />
          <input
            type="number"
            value={editingProduct.data.price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                data: {
                  ...editingProduct.data,
                  price: Math.max(0, parseFloat(e.target.value) || 0),
                },
              })
            }
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleUpdateProduct}
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