import React, { useState } from 'react';
import Divider from "../components/Divider";
import InputBox from "../components/InputBox";


export default function Cart() {

  {/* Example basket before getting products from database */}

  const [itemsInBasket, setItemsinBasket] = useState([
    { product: 1, name: "Keyboard", quantity: 2, price: 35 },
    { product: 2, name: "Switch", quantity: 1, price: 5 },
    { product: 3, name: "Key-cap", quantity: 3, price: 5 },
  ]);

  const [quanitity, setQuantity] = useState(1);

  const getProducts = () => itemsInBasket;

  const totalPrice = getProducts().reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0).toFixed(2);
  
  // allows users to decrease quanitity of orders
  const handleDelete = (product: number) => {
    const newItem = itemsInBasket.filter((item) => item.product !== product);
    setItemsinBasket(newItem);
  };
  
 
  //ToDo: Create function to handle increasing quantity of items in basket

    
    {/* Product section of the cart page where users can see their products and add/remove */}
    return (       
        <div className="flex bg-primary items-start">
          <div className="w-1/2 bg-white ml-10 mt-40 drop-shadow-cartoon rounded-lg border border-black">
            <div className="text-3xl font-display pl-2 mt-6">Basket Summary</div>
            <Divider />
            <div className="p-2 font-display">Your Items:
              <Divider />
              <div className="Items space-y-4">
                {itemsInBasket.map((item) => (
                 <div>
                  <ul key={item.product} className="flex justify-between items-center border-black pb-2">
                    <li>{item.name}</li>
                    <Divider />
                    <li className="text-gray-400">{item.quantity}</li>
                  </ul>
                  <button onClick = {() => handleDelete(item.product)} className="px-2 py-1 bg-red-600 rounded-lg text-white">-</button>
                 </div>
                ))}
              </div>
            </div>
          </div>


        {/* Order section of the cart page */}
        <div className="flex flex-col pr-10 items-end justify-center h-screen w-1/2">
          
            <div className="px-8 py-8 pb-40 mt-20 bg-white drop-shadow-cartoon rounded-lg border border-black">
              <div className="text-4xl font-display">Order Summary</div>
              <Divider />
              <div className="p-4 mt-9 font-display border-t border-b border-black"> 
                <text>Subtotal: </text>£{totalPrice}
              </div> 
              <div className="text-2xl font-display mt-3 ml-9">Do you have a code?</div>
              {/* @ts-expect-error Async*/}
              <InputBox />
              <div className="flex justify-center">
              <button className="px-10 py-5 bg-sky-400 text-white rounded-lg absolute bottom-5">Checkout</button>
              </div>
            </div>
          </div>
       </div>

    );
}

