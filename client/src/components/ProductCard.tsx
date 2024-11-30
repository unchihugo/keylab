import React from "react"
import { Link } from "react-router-dom";

interface Product {
id: number;
name: string;
price: number;
imageUrl: string; 
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="block w-full p-4 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
        </div>
        <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">${product.price}</p>
      </Link>
    );
  };

  export default ProductCard;