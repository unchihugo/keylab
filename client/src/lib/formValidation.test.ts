/** @format */

import { expect, test } from "vitest"
import {
	validateEmail,
	validatePassword,
	validateForename,
	validateSurname,
	validateMatch,
	validatePhoneNum,
	validateMessage,
	validateReview,
} from "./formValidation"

test("validateEmail", () => {
	expect(validateEmail("")).toBe("Email is required")
	expect(validateEmail("test")).toBe("Invalid email format")
	expect(validateEmail("test@")).toBe("Invalid email format")
	expect(validateEmail("test@test")).toBe("Invalid email format")
	expect(validateEmail("test@test.com")).toBe("")
	expect(validateEmail("a".repeat(321) + "@test.com")).toBe(
		"Email is too long",
	)
})

test("validatePassword", () => {
	expect(validatePassword("")).toBe("Password is required")
	expect(validatePassword("abc123")).toBe(
		"Password must be at least 8 characters",
	)
	expect(validatePassword("a".repeat(101))).toBe("Password is too long")
	expect(validatePassword("abcdefgh")).toBe(
		"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	)
	expect(validatePassword("ABCDEFGH123")).toBe(
		"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	)
	expect(validatePassword("abcdefAB")).toBe(
		"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	)
	expect(validatePassword("12345678")).toBe(
		"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	)
	expect(validatePassword("Abcdefg1")).toBe("")
})

test("validateForename", () => {
	expect(validateForename("")).toBe("First name is required")
	expect(validateForename("a")).toBe(
		"First name must be at least 2 characters",
	)
	expect(validateForename("a".repeat(101))).toBe("First name is too long")
	expect(validateForename("John123")).toBe(
		"First name must only contain letters and spaces",
	)
	expect(validateForename("John")).toBe("")
	expect(validateForename("Mary Jane")).toBe("")
})

test("validateSurname", () => {
	expect(validateSurname("")).toBe("Last name is required")
	expect(validateSurname("a")).toBe("Last name must be at least 2 characters")
	expect(validateSurname("a".repeat(101))).toBe("Last name is too long")
	expect(validateSurname("Smith123")).toBe(
		"Last name must only contain letters and spaces",
	)
	expect(validateSurname("Smith")).toBe("")
	expect(validateSurname("John Doe")).toBe("")
})

test("validateMatch", () => {
	expect(validateMatch("password", "different")).toBe("Strings do not match")
	expect(validateMatch("password", "password")).toBe("")
	expect(
		validateMatch(
			"email@example.com",
			"different@example.com",
			"Email addresses",
		),
	).toBe("Email addresses do not match")
	expect(
		validateMatch("email@example.com", "email@example.com", "Passwords"),
	).toBe("")
})

test("validatePhoneNum", () => {
	expect(validatePhoneNum("")).toBe("Phone number is required")
	expect(validatePhoneNum("notaphonenumber")).toBe(
		"Invalid phone number format",
	)
	expect(validatePhoneNum("123456789")).toBe("")
	expect(validatePhoneNum("+1 (123) 456-7890")).toBe("")
	expect(validatePhoneNum("+44 7123 456789")).toBe("")
})

test("validateMessage", () => {
	expect(validateMessage("")).toBe("Message is required")
	expect(validateMessage("Too short")).toBe(
		"Message must be at least 10 characters long",
	)
	expect(validateMessage("This message is long enough to be valid")).toBe("")
})

test("validateReview", () => {
	// Test invalid rating
	expect(validateReview({ rating: 0, comment: "Good product" })).toContain(
		"Rating must be between 1 and 5 stars",
	)
	expect(validateReview({ rating: 6, comment: "Good product" })).toContain(
		"Rating must be between 1 and 5 stars",
	)

	// Test invalid comment
	expect(validateReview({ rating: 4, comment: "" })).toContain(
		"Review comment must be at least 10 characters",
	)
	expect(validateReview({ rating: 4, comment: "Too short" })).toContain(
		"Review comment must be at least 10 characters",
	)
	expect(validateReview({ rating: 4, comment: "a".repeat(256) })).toContain(
		"Review comment cannot exceed 255 characters",
	)

	// Test multiple errors
	const multipleErrors = validateReview({ rating: 0, comment: "" })
	expect(multipleErrors).toHaveLength(2)
	expect(multipleErrors).toContain("Rating must be between 1 and 5 stars")
	expect(multipleErrors).toContain(
		"Review comment must be at least 10 characters",
	)

	// Test valid input
	expect(
		validateReview({
			rating: 5,
			comment: "This product is excellent and I would recommend it.",
		}),
	).toHaveLength(0)
})
