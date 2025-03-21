import { Address } from "./Address";

export interface Order {
    id: number;
    userId: number;
    orderDate: string | null;
    status: "pending" | "shipped" | "delivered" | "cancelled" | "returned";
    total: number;
    shippingAddressId: number;
    billingAddressId: number;
    shippingAddress: Address | null;
    billingAddress: Address | null;
    createdAt: string;
    updatedAt: string;
}