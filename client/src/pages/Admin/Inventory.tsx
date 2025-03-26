/** @format */

import React, { useState, useMemo } from "react"
import { Trash2, PlusCircle, Edit, Search } from "lucide-react"
import { useInventory } from "../../hooks/useInventory"
import { Product } from "../../types/Product"
import Breadcrumb from "../../components/Breadcrumb"
import Divider from "../../components/Divider"
import LinkButton from "../../components/LinkButton"

export default function Inventory() {
	const {
		products,
		loading,
		error,
		addProduct,
		updateProduct,
		deleteProduct,
	} = useInventory()

	const [searchTerm, setSearchTerm] = useState<string>("")
	const [currentPage, setCurrentPage] = useState(1)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
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
			product_images: [],
		},
		message: "",
	})

	const itemsPerPage = 5

	const handleAddProduct = () => {
		if (
			!newProduct.data.name ||
			!newProduct.data.stock ||
			!newProduct.data.price ||
			!newProduct.data.description
		) {
			alert("All fields are required!")
			return
		}
		addProduct(newProduct)
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
				product_images: [],
			},
			message: "",
		})
	}

	const handleUpdateProduct = () => {
		if (editingProduct) {
			updateProduct(editingProduct.data.id.toString(), editingProduct)
			setEditingProduct(null)
		}
	}

	const handleEditProduct = (product: Product) => {
		setEditingProduct({ ...product })
	}

	const handleDeleteProduct = (id: string) => {
		deleteProduct(id)
		console.log("Product deleted")
	}

	const displayedProducts = useMemo(() => {
		return products
			.filter((product: Product) =>
				product.data.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
			)
			.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	}, [products, searchTerm, currentPage])

	const totalPages = Math.ceil(
		products.filter((product: Product) =>
			product.data.name.toLowerCase().includes(searchTerm.toLowerCase()),
		).length / itemsPerPage,
	)

	return (
		<div className="min-h-screen bg-primary/25 py-6">
			<div className="container mx-auto px-6 flex flex-col md:flex-row gap-6">
				{/* Sidebar Navigation */}
				<aside className="w-full lg:w-1/5 bg-primary-dark/25 p-4 rounded-2xl space-y-4 mb-6 lg:mb-0 h-fit border border-gray-700 mr-4">
					<h2 className="text-xl font-bold mb-4">Admin Panel</h2>
					<div className="flex flex-col space-y-2">
						<LinkButton
							to="/admin/dashboard"
							text="Dashboard"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/orders"
							text="Orders"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/inventory"
							text="Inventory"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/customers"
							text="Customer Management"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
						<LinkButton
							to="/admin/settings"
							text="Change Password"
							buttonClassNames="border-black bg-primary text-black hover:bg-primary-dark hover:shadow-[4px_4px_0px_black]"
						/>
					</div>
				</aside>

				<main className="flex-1 bg-white rounded-2xl p-6 border border-black">
					<Breadcrumb
						breadcrumbs={["Admin Dashboard", "Inventory"]}
					/>
					<Divider />
					<h2 className="text-2xl font-bold mb-4">
						Inventory Management
					</h2>

					<div className="bg-blue-100 p-4 rounded shadow mb-4">
						<p className="text-black">
							Manage your product stock and details. Add new
							products or update existing ones.
						</p>
					</div>

					{/* Search */}
					<div className="flex items-center justify-between mb-4">
						<div className="relative w-full max-w-md">
							<form className="flex">
								<input
									type="text"
									placeholder="Search products..."
									className="w-full px-4 py-2 border border-black rounded-l-full focus:outline-none focus:ring-2 focus:ring-primary"
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
								/>
								<button
									type="submit"
									className="px-4 py-2 bg-primary border-t border-e border-b border-black rounded-r-full hover:bg-primary-dark transition-colors">
									<Search />
								</button>
							</form>
						</div>
					</div>

					{/* Add Product Form */}
					<div className="mb-6 bg-white p-4 rounded shadow border border-gray-200">
						<h3 className="text-lg font-bold mb-2">
							Add New Product
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								placeholder="Name"
								className="p-2 border rounded w-full"
								value={newProduct.data.name}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										data: {
											...newProduct.data,
											name: e.target.value,
										},
									})
								}
							/>
							<input
								type="number"
								placeholder="Stock"
								className="p-2 border rounded w-full"
								value={newProduct.data.stock || ""}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										data: {
											...newProduct.data,
											stock: Math.max(
												0,
												parseInt(e.target.value) || 0,
											),
										},
									})
								}
							/>
							<input
								type="number"
								placeholder="Price"
								className="p-2 border rounded w-full"
								value={newProduct.data.price || ""}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										data: {
											...newProduct.data,
											price: Math.max(
												0,
												parseFloat(e.target.value) || 0,
											),
										},
									})
								}
							/>
							<input
								type="text"
								placeholder="Image URL"
								className="p-2 border rounded w-full"
								value={newProduct.data.imageUrl || ""}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										data: {
											...newProduct.data,
											imageUrl: e.target.value,
										},
									})
								}
							/>
							<textarea
								placeholder="Description"
								className="p-2 border rounded w-full md:col-span-2"
								value={newProduct.data.description}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										data: {
											...newProduct.data,
											description: e.target.value,
										},
									})
								}
							/>
						</div>
						<div className="mt-4">
							<button
								onClick={handleAddProduct}
								className="flex items-center bg-primary border border-black px-4 py-2 rounded-full hover:bg-primary-dark hover:shadow-[4px_4px_0px_black] transition-all"
								disabled={loading}>
								<PlusCircle className="mr-2" size={16} />
								{loading ? "Adding..." : "Add Product"}
							</button>
						</div>
					</div>

					{error && (
						<div className="text-red-500 mb-4 p-3 bg-red-100 rounded-lg">
							Error: {error}
						</div>
					)}

					{/* Products Table */}
					<div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
						{loading ? (
							<div className="text-center p-8">
								<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
								<p className="mt-2">
									Loading inventory data...
								</p>
							</div>
						) : (
							<>
								<table className="w-full text-left border-collapse">
									<thead className="bg-gray-50">
										<tr className="border-b border-gray-300">
											<th className="py-3 px-4">Image</th>
											<th className="py-3 px-4">
												Product
											</th>
											<th className="py-3 px-4">Stock</th>
											<th className="py-3 px-4">Price</th>
											<th className="py-3 px-4">
												Description
											</th>
											<th className="py-3 px-4 text-center">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{displayedProducts.length === 0 ? (
											<tr>
												<td
													colSpan={6}
													className="py-8 text-center text-gray-500">
													No products found. Add a new
													product or adjust your
													search.
												</td>
											</tr>
										) : (
											displayedProducts.map(
												(product: Product) => (
													<tr
														key={product.data.id}
														className="border-b border-gray-200 hover:bg-gray-50">
														<td className="py-3 px-4">
															<img
																src={
																	product.data
																		.product_images?.[0]
																		?.url ||
																	product.data
																		.imageUrl ||
																	""
																}
																alt={
																	product.data
																		.name ||
																	"Product image"
																}
																className="w-16 h-16 rounded object-contain border border-gray-200"
															/>
														</td>
														<td className="py-3 px-4 font-medium">
															{product.data.name}
														</td>
														<td
															className={`py-3 px-4 ${
																product.data
																	.stock < 5
																	? "text-red-500 font-medium"
																	: ""
															}`}>
															{product.data.stock}
															{product.data
																.stock < 5 &&
																" (Low)"}
														</td>
														<td className="py-3 px-4">
															£
															{product.data.price.toFixed(
																2,
															)}
														</td>
														<td className="py-3 px-4 max-w-xs truncate">
															{
																product.data
																	.description
															}
														</td>
														<td className="py-3 px-4">
															<div className="flex justify-center gap-3">
																<button
																	onClick={() =>
																		handleEditProduct(
																			product,
																		)
																	}
																	className="text-blue-600 hover:text-blue-800 flex items-center p-1 rounded-full hover:bg-blue-50"
																	title="Edit product">
																	<Edit
																		size={
																			18
																		}
																	/>
																</button>
																<button
																	onClick={() =>
																		handleDeleteProduct(
																			product.data.id.toString(),
																		)
																	}
																	className="text-red-600 hover:text-red-800 flex items-center p-1 rounded-full hover:bg-red-50"
																	title="Delete product">
																	<Trash2
																		size={
																			18
																		}
																	/>
																</button>
															</div>
														</td>
													</tr>
												),
											)
										)}
									</tbody>
								</table>

								{/* Pagination Controls */}
								{totalPages > 1 && (
									<div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200">
										<button
											onClick={() =>
												setCurrentPage((prev) =>
													Math.max(prev - 1, 1),
												)
											}
											disabled={currentPage === 1}
											className={`px-3 py-1 rounded ${
												currentPage === 1
													? "text-gray-400 cursor-not-allowed"
													: "text-blue-600 hover:bg-blue-50"
											}`}>
											Previous
										</button>
										<div className="flex gap-1">
											{Array.from(
												{ length: totalPages },
												(_, i) => i + 1,
											).map((page) => (
												<button
													key={page}
													onClick={() =>
														setCurrentPage(page)
													}
													className={`w-8 h-8 rounded-full ${
														currentPage === page
															? "bg-primary text-black font-bold"
															: "hover:bg-gray-100"
													}`}>
													{page}
												</button>
											))}
										</div>
										<button
											onClick={() =>
												setCurrentPage((prev) =>
													Math.min(
														prev + 1,
														totalPages,
													),
												)
											}
											disabled={
												currentPage === totalPages
											}
											className={`px-3 py-1 rounded ${
												currentPage === totalPages
													? "text-gray-400 cursor-not-allowed"
													: "text-blue-600 hover:bg-blue-50"
											}`}>
											Next
										</button>
									</div>
								)}
							</>
						)}
					</div>

					{/* Edit Product Form (conditionally shown) */}
					{editingProduct && (
						<div className="mt-6 bg-white p-6 rounded-lg shadow border border-gray-200">
							<h3 className="text-lg font-bold mb-4">
								Edit Product
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input
									type="text"
									value={editingProduct.data.name}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											data: {
												...editingProduct.data,
												name: e.target.value,
											},
										})
									}
									className="p-2 border rounded w-full"
									placeholder="Product Name"
								/>
								<input
									type="number"
									value={editingProduct.data.stock}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											data: {
												...editingProduct.data,
												stock: Math.max(
													0,
													parseInt(e.target.value) ||
														0,
												),
											},
										})
									}
									className="p-2 border rounded w-full"
									placeholder="Stock"
								/>
								<input
									type="number"
									value={editingProduct.data.price}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											data: {
												...editingProduct.data,
												price: Math.max(
													0,
													parseFloat(
														e.target.value,
													) || 0,
												),
											},
										})
									}
									className="p-2 border rounded w-full"
									placeholder="Price"
								/>
								<textarea
									value={editingProduct.data.description}
									onChange={(e) =>
										setEditingProduct({
											...editingProduct,
											data: {
												...editingProduct.data,
												description: e.target.value,
											},
										})
									}
									className="p-2 border rounded w-full md:col-span-2"
									placeholder="Description"
								/>
							</div>
							<div className="mt-4 flex gap-3">
								<button
									onClick={handleUpdateProduct}
									className="bg-primary border border-black px-4 py-2 rounded-full hover:bg-primary-dark hover:shadow-[4px_4px_0px_black] transition-all"
									disabled={loading}>
									{loading ? "Updating..." : "Update Product"}
								</button>
								<button
									onClick={() => setEditingProduct(null)}
									className="border border-black px-4 py-2 rounded-full hover:bg-gray-100 hover:shadow-[2px_2px_0px_black] transition-all">
									Cancel
								</button>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
