import Breadcrumb from "../../components/Breadcrumb";
import OrderCard from "../../components/OrderCard";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import NotFound from "../NotFound";

export default function AdminOrders() {
    const { orders, loading, error } = useAdminOrders();

    if (loading) return <div>Loading...</div>

    if (error)
            return <NotFound errorMessage="400 - Bad Request" bodyMessage={error} />
        if (!orders)
            return (
                <NotFound bodyMessage="No orders found" />
            )

    return (
        <div className="flex flex-col items-center justify-center">
            <Breadcrumb breadcrumbs={["Admin Dashboard", "Orders"]} />
            <h1 className="text-3xl font-semibold text-center">All Orders</h1>
            <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}