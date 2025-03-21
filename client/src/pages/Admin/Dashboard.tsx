/** @format */
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";

import Breadcrumb from "../../components/Breadcrumb";
import Divider from "../../components/Divider";
import ErrorBox from "../../components/ErrorBox";
import Card from "../../components/Card";


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interface for the dashboard stats 
interface DashboardStats {
  totalSalesToday: number;
  totalSalesThisWeek: number;
  totalSalesThisMonth: number;
  newOrders: number;
  incomingOrders: number;
  ordersToProcess: number;
  newCustomers: number;
  lowStockProducts: { id: number; name: string; stock: number }[];
  salesTrend: { date: string; sales: number }[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        //placeholder data
        const placeholderData: DashboardStats = {
          totalSalesToday: 1250,
          totalSalesThisWeek: 8500,
          totalSalesThisMonth: 35000,
          newOrders: 50,
          incomingOrders: 75,
          ordersToProcess: 30,
          newCustomers: 25,
          lowStockProducts: [
            { id: 1, name: "Keyboards", stock: 5 },
            { id: 2, name: "KeyCaps", stock: 2 },
          ],
          salesTrend: [
            { date: "2024-01-01", sales: 1000 },
            { date: "2024-01-02", sales: 1200 },
            { date: "2024-01-03", sales: 1500 },
            { date: "2024-01-04", sales: 1100 },
            { date: "2024-01-05", sales: 1300 },
          ],
        };
        setStats(placeholderData);
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setLoading(false);
            }
          };
        //const res = await fetch("");
        //if (!res.ok) throw new Error("Failed to fetch dashboard data");
        //const data = await res.json();
        //setStats(data);
      //} catch (err) {
        //setError((err as Error).message);
      //} finally {
        //setLoading(false);
      //}
    //};

    fetchDashboardStats();
  }, []);

  const salesTrendChartData = {
    labels: stats?.salesTrend.map((item) => item.date) || [],
    datasets: [
      {
        label: "Sales",
        data: stats?.salesTrend.map((item) => item.sales) || [],
        backgroundColor: "#A8B9FF",
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/25">
        <p className="text-xl text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/25">
        <ErrorBox children={[error || "No data available"]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary/25 mt-10 py-14">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-6">
      <aside className="w-full lg:w-1/5 bg-white p-6 rounded-lg shadow-lg mb-6 lg:mb-0 h-fit border border-gray-300 mr-4">
    <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
    <nav className="space-y-4">
        {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Inventory", to: "/inventory" },
            { label: "Order Managemet", to: "/order-management " },
            { label: "Customer Managment", to: "/customers-management" },
            { label: "Settings", to: "/settings"  },
        ].map((item, index) => (
            <div key={item.label}>
                <div
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-200 ${
                        window.location.pathname === item.to
                            ? "bg-secondary font-bold"
                            : "hover:bg-secondary/50"
                    }`}
                    onClick={() => {
                        window.location.href = item.to; 
                    }}
                >
                    {item.label}
                </div>
                {index !== 3 && <hr className="border-secondary-dark/30 my-2" />}
            </div>
        ))}
    </nav>
</aside>
        {/* Main Dashboard Content */}
        <main className="flex-1 bg-white rounded-2xl p-14 shadow border">
          <Breadcrumb breadcrumbs={["Admin Dashboard", "Overview"]} />
          <Divider />

          {/* Sales Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Total Sales Today" value={`£${stats.totalSalesToday.toLocaleString()}`} />
              <Card title="Total Sales This Week" value={`£${stats.totalSalesThisWeek.toLocaleString()}`} />
              <Card title="Total Sales This Month" value={`£${stats.totalSalesThisMonth.toLocaleString()}`} />
            </div>
            <div className="mt-4">
              <Card title="New Orders" value={stats.newOrders.toLocaleString()} />
            </div>
            <Divider />
            <h3 className="text-xl font-bold mb-2">Sales Trend</h3>
            {stats.salesTrend.length ? (
              <div className="w-full">
                <Bar
                  data={salesTrendChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },

                  }}
                />
              </div>
            ) : (
              <p>No sales trend data available.</p>
            )}
          </section>

          {/* Inventory Status */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Inventory Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Incoming Orders" value={stats.incomingOrders.toLocaleString()} />
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Low Stock Alerts</h3>
                {stats.lowStockProducts.length ? (
                  <ul className="list-disc list-inside">
                    {stats.lowStockProducts.map((prod) => (
                      <li key={prod.id}>
                        {prod.name} - {prod.stock} left
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">No products are low on stock.</p>
                )}
              </div>
            </div>
          </section>

          {/* Order Processing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Order Processing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="Orders to Process" value={stats.ordersToProcess.toLocaleString()} />
            </div>
          </section>

          {/* Customer Overview */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Customer Overview</h2>
            <Card title="New Customers" value={stats.newCustomers.toLocaleString()} />
          </section>
        </main>
      </div>
    </div>
  );
}