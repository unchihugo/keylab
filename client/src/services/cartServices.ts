/** @format */

const CART_API_URL = "http://localhost:8080/cart" 

/**
 * @module services/cart
 * @see ../../../../server/handlers/cart_items.go
*/

export const cartServices = {

    /**
    * fetch cart items for the specific user
    * @returns {Promise} 
    * @throws {Error} throws error from API request 
    */

    async ListCartItems() {
      const response = await fetch(`${CART_API_URL}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      
      if (response.status === 401) {
        throw new Error("Please log in to view your basket");
      }

      if(!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to get cart items"
          )
        }

      return response.json();
      },

      /**
      * adds an item to the cart
      * @returns {Promise}
      * @param {id} number the products id
      * @param {quantity} number the quantity of items 
      * @throws {Error} throws Error from API request 
      */

    async AddCartItem(id: number, quantity: number) {
      const response = await fetch(`${CART_API_URL}/${id}/${quantity}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productID: id, quantity })
        })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || "Failed to add item to cart"

          )
        }

      return response.json()
    }, 

     /**
     * deletes a cart item
     * @returns {Promise}  
     * @param {number} id the products id 
     * @throws {Error} throws error from API request
     */

    async deleteCartItem(id: number) {
      const response = await fetch(`${CART_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || "Failed to delete cart item",

        )

      }

      return response.json()
    },

     /**
     * update the quantity of items in the cart
     * @returns {Promise}  
     * @param {id} number the products id
     * @param {quantity} number the quantity of items
     * @throws {Error} throws error from API request
     */

    async updateCartItemQuantity(id: number, quantity: number) {
      const response = await fetch(`${CART_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update quantity"

        )
      }

      return response.json();
    },


  }