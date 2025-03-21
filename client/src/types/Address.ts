export interface Address {
    id: number;
    userId: number;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    type: "shipping" | "billing";
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}