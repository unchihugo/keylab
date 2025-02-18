/** @format */

import { useEffect, useState } from "react";
import { cartServices } from "../services/cartServices";
import { Carts } from "../types/Carts";

export const useCart = (user_id: number) => {
    const [carts, setCarts] = useState<Carts[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true)
                const response = await cartServices.getCartByUser(user_id)
                setCarts(response.cartItems);
            }
            catch(err) {
                setError(
                    err instanceof Error
						? err.message
						: "An error occurred while getting cart"
                )
            } finally {
                setLoading(false)
            } 
        }
        fetchCart(); 
    }, [user_id]);

    return { carts, loading, error};
    
}