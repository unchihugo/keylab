import React from "react"
import { Link } from "react-router-dom";
import { Product } from "../types/Product";


const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <Link to={`/product/${product.data.id}`} className="block w-full p-4 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4">
          <img src={product.data.imageUrl} alt={product.data.name} className="w-full h-full object-cover rounded-md" />
        </div>
        <h3 className="text-lg font-medium text-gray-800">{product.data.name}</h3>
        <p className="text-gray-600 mt-2">${product.data.price}</p>
      </Link>
    );
  };

  export default ProductCard;