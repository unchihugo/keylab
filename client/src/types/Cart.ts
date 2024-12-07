/** @format  */

import { CartItems } from "./CartItems"

export interface Cart {
    items: any
    data: {
        
        totalPrice: number
        itemsInBasket: CartItems[]

    }
}