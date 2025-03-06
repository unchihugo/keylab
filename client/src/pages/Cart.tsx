/** @format */

import { useState } from "react"
import Divider from "../components/Divider"
import InputBox from "../components/InputBox"
import LinkButton from "../components/LinkButton"
import { LockKeyhole, Minus, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useCart } from "../hooks/useCarts";
import { cartServices } from "../services/cartServices";
import NotFound from "./NotFound"

export default function Cart() {
    const { carts, loading, error }= useCart();

    // the function that displays the total amount in the order summary section
    const totalPrice = carts
        ?.reduce(
            (accumulator, product) =>
                accumulator + product.price * product.quantity,
            0,
        )
        .toFixed(2)


    // function that lets users decrease quantity
    const handleDelete = async (item: {
        quantity: number
        product: number
    }) => {
		try {
			if(item.quantity > 1) {
				await cartServices.updateCartItemQuantity(
					item.product, item.quantity - 1
				);
			} 
			else {
				await cartServices.deleteCartItem
				(item.product)
			}
		} 
		catch(error) {
			console.error("Failed to adjust quantity", error);
		} 
	};

    // function allowing users to increase quantity
	const handleAdd = async (item: { quantity: number; product: number }) => {
		try {
			if(item.quantity >= 0) {
				await cartServices.updateCartItemQuantity(
					item.product, item.quantity + 1
				)
			}
		}
		catch(error) {
			console.error("Failed to adjust quantity", error);
		}
	};

	if (loading) return <div>Loading...</div>
	if (error) {
        return <NotFound errorMessage="400 - Bad Request" bodyMessage={error || "An unexpected error occurred."}/>
    }
    
                    
    {
        /* product section of the cart page where users can see their products and add/remove */
    }
    return (
        <div className="flex bg-primary/50 justify-center items-start pt-40 pb-20">
            <div className="flex flex-col w-full md:flex-row max-w-screen-lg gap-10 p-4 lg:p-0">
                <div className="w-full lg:w-1/2 bg-white drop-shadow-cartoon rounded-lg border border-black h-fit">
                    <div className="text-3xl font-display pl-6 my-6">
                        Basket Summary
                    </div>
                    <Divider />
                    <div className="p-6 font-display">
                        Your Items:
                        <div className="Items space-y-4 font-body">
                            {carts.map((product) => (
                                <div>
                                    <div className="opacity-25">
                                        <Divider />
                                    </div>
                                    <div className="p-3">
                                        <ul
                                            key={product.product}
                                            className="flex justify-between items-center font-medium text-lg border-black">
                                            <li>{product.name}</li>
                                            <Divider />
                                            <li>
                                                £{product.price * product.quantity}
                                            </li>
                                        </ul>
                                        <div className="text-black/50 flex items-center gap-x-3">
                                            <span className="">Qty:</span>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product)
                                                }
                                                className="p-1 border rounded-full">
                                                <Minus size={16} />
                                            </button>
                                            <span className="">
                                                {product.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleAdd(product)}
                                                className="p-1 border rounded-full">
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* order section of the cart page */}
                <div className="w-full lg:w-1/2 flex flex-col items-end">
                    <div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black w-full">
                        <div className="text-4xl font-display">
                            Order Summary
                        </div>
                        <Divider />
                        <div className="p-4 mt-9 font-body border-t border-b border-black">
                            <text>Subtotal: </text>£{totalPrice}
                        </div>
                        <div className="text-2xl font-body mt-3 ml-9">
                            Do you have a code?
                        </div>
                        {/* @ts-expect-error Async*/}
                        <InputBox />
                        <div className="flex flex-col w-full">
                            <LinkButton
                                to="/checkout"
                                buttonClassNames="px-10 py-5 bg-secondary-dark w-full mt-12"
                                text="Checkout"
                                Icon={LockKeyhole}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



