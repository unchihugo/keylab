/** @format  */

import { CartItem } from "./CartItems"

export interface Cart {
    data: {
        user: string
        totalPrice: number
        itemsInBasket: CartItem[]

    }
}