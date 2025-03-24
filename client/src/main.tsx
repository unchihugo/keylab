/** @format */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AuthProvider } from "./AuthContext"
import AppLayout from "./layouts/AppLayout"
import AdminLayout from "./layouts/AdminLayout"

import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import SignIn from "./pages/auth/sign-in"
import Register from "./pages/auth/register"
import AdminLogin from "./pages/auth/adminlogin"
import Shop from "./pages/Shop"
import Product from "./pages/products/[slug]"
import Cart from "./pages/Cart"
import ProtectedRoute from "./components/ProtectedRoute"
import About from "./pages/About"
import Checkout from "./pages/Checkout"
import Inventory from "./pages/Admin/Inventory"
import Profile from "./pages/User/Profile"
import AdminDashboard from "./pages/Admin/Dashboard"
import KeyboardDesigner from "./pages/keyboard-designer"
import AdminOrders from "./pages/Admin/Orders"
import CustomerManagement from "./pages/Admin/CustomerManagement"
import Payment from "./pages/Payment"
import AdminChangePassword from "./pages/Admin/AdminChangePassword"

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/cart", element: <Cart /> },
			{ path: "/payment", element: <Payment /> },
			{
				path: "/checkout",
				element: (
					<ProtectedRoute>
						<Checkout />
					</ProtectedRoute>
				),
			},
			// { path: "/example", element: <div>Example</div> }, - No longer needed?
			{
				path: "/protected",
				element: (
					<ProtectedRoute>
						{" "}
						<div>Protected</div>{" "}
					</ProtectedRoute>
				),
			},

			{ path: "/sign-in", element: <SignIn /> },
			{ path: "/register", element: <Register /> },
			{ path: "/admin/login", element: <AdminLogin /> },
			{ path: "/products/:slug", element: <Product /> },
			{ path: "*", element: <NotFound /> },
			{ path: "/about", element: <About /> },
			{ path: "/shop", element: <Shop /> },

			{ path: "/keyboard-designer", element: <KeyboardDesigner />},
			{
				path: "/profile",
				element: (
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				),
			},
		],
	},
	{
		path: "/admin",
		element: (
			<ProtectedRoute>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{ path: "dashboard", element: <AdminDashboard />},
			{ path: "customers", element: <CustomerManagement /> },
			{ path: "orders", element: <AdminOrders /> },

			{ path: "inventory", element: <Inventory /> }

			{ path: "settings", element: <AdminChangePassword /> },

		],
	},
])

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
)
