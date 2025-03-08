/** @format */

export interface User {
    id: number
    forename: string
    surname: string
    email: string
    phoneNumber?: string
    createdAt?: string | null
    updatedAt?: string | null
}