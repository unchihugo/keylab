/** @format */

export interface CartItem {
    items: never[]
    data: {
        product: string
        name: string
        quantity: number 
        price: number
    }
}