/** @format */

/**
 * Validates emails based on the following criteria:
 * - Is not empty
 * - Is not longer than 320 characters
 * - Follows the format of an email (valid string @ string . string)
 * @param email Email address to validate
 * @returns Error message if email is invalid, otherwise an empty string
 */
export const validateEmail = (email: string) => {
	const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
	if (!email) {
		return "Email is required"
	}
	if (email.length > 320) {
		return "Email is too long"
	}
	if (!regex.test(email)) {
		return "Invalid email format"
	}
	return ""
}

/**
 * Validates passwords based on the following criteria:
 * - Is not empty
 * - Is at least 8 characters long
 * - Is not longer than 100 characters
 * - Contains at least one uppercase letter, one lowercase letter, and one number
 * @param password Password to validate
 * @returns Error message if password is invalid, otherwise an empty string
 */
export const validatePassword = (password: string) => {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/
	if (!password) {
		return "Password is required"
	}
	if (password.length < 8) {
		return "Password must be at least 8 characters"
	}
	if (password.length > 100) {
		return "Password is too long"
	}
	if (!regex.test(password)) {
		return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
	}
	return ""
}

/**
 * Validates names based on the following criteria:
 * - Is not empty
 * - Is at least `min` characters long
 * - Is not longer than 100 characters
 * - Contains only letters and spaces
 * @param name Name to validate
 * @param type Type of name being validated
 * @param min Minimum length of the name
 * @returns Error message if name is invalid, otherwise an empty string
 */
export const validateName = (name: string, type: string, min: number) => {
	const regex = /^[a-zA-Z\s]*$/
	if (!name) {
		return `${type} is required`
	}
	if (name.length < min) {
		return `${type} must be at least ${min} characters`
	}
	if (name.length > 100) {
		return `${type} is too long`
	}
	if (!regex.test(name)) {
		return `${type} must only contain letters and spaces`
	}
	return ""
}

/**
 * Validates first names based on the criteria of the `validateName` function
 * - Minimum length is 2 characters
 * @see validateName
 * @param forename First name to validate
 * @returns Error message if first name is invalid, otherwise an empty string
 */
export const validateForename = (forename: string) => {
	return validateName(forename, "First name", 2)
}

/**
 * Validates last names based on the criteria of the `validateName` function
 * - Minimum length is 2 characters
 * @see validateName
 * @param surname Last name to validate
 * @returns Error message if last name is invalid, otherwise an empty string
 */
export const validateSurname = (surname: string) => {
	return validateName(surname, "Last name", 2)
}

/**
 * Matches two strings and returns an error message if they do not match
 * @param string1 First string to compare
 * @param string2 Second string to compare
 * @param type Type of strings being compared (default is "Strings")
 * @returns Error message if strings do not match, otherwise an empty string
 */
export const validateMatch = (
	string1: string,
	string2: string,
	type: string = "Strings",
) => {
	if (string1 !== string2) {
		return `${type} do not match`
	}
	return ""
}

/**
 * Validates phone numbers based on the following criteria:
 * - Isn't empty
 * - Should match a phone number pattern (e.g., format like +1234567890)
 * @param phoneNum Phone number to validate
 * @returns Error message if phone number is invalid, otherwise an empty string
 */
export const validatePhoneNum = (phoneNum: string) => {
	const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
	if (!phoneNum) {
		return "Phone number is required"
	}
	if (!regex.test(phoneNum)) {
		return "Invalid phone number format"
	}
	return ""
}

/**
 * Validates messages based on the following criteria:
 * - Is not empty
 * - Should be at least 10 characters long
 * @param message Message to validate
 * @returns Error message if message is invalid, otherwise an empty string
 */
export const validateMessage = (message: string) => {
	if (!message) {
		return "Message is required"
	}
	if (message.length < 10) {
		return "Message must be at least 10 characters long"
	}
	return ""
}
