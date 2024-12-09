/** @format */

const CONTACT_API_URL = "http://localhost:8080/contact"

/**
 * Service that handles contact requests to the backend
 * @module services/contact
 * @see ../../../../server/handlers/Contact.go
 */

export const contactService = {
	/**
	 * Submit a contact us request
	 * @param {string} forename the user's first name
	 * @param {string} surname the user's last name
	 * @param {string} phoneNum the user's phone number
	 * @param {string} email the user's email
	 * @param {string} message the message from the user
	 * @returns {Promise} a promise that resolves when contact request is submitted
	 * @throws {Error} an error from the API request
	 */
	async submitContactRequest(forename: string, surname: string, phoneNum: string, email: string, message: string) {
		// where we make a request to backend to submit the contact request 
		const response = await fetch(`${CONTACT_API_URL}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ forename, surname, phoneNum, email, message }),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || "Failed to submit contact request")
		}

		return response.json()
	},
}
