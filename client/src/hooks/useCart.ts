/** @format */

import { useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { CartItems } from "../types/CartItems";
import { Cart } from "../types/Cart";

export const useCart = (user: string) => {
    const [cart, setCart] = useState<Cart | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true)
                const response = await cartService.getCartByUser(user)
                setCart(response)
            }
            catch(error) {
                setError(
                    error instanceof Error
						? error.message
						: "An error occurred"
                )
            } finally {
                setLoading(false)
            } 
        }
        fetchCart(); 
    }, []);
    
    return {cart, loading, error}
}