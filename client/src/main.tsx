/** @format */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AuthProvider } from "./AuthContext"
import AppLayout from "./layouts/AppLayout"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import SignIn from "./pages/auth/sign-in"
import Register from "./pages/auth/register"
import Shop from "./pages/Shop"
import Product from "./pages/products/[slug]"
import Cart from "./pages/Cart"
import ProtectedRoute from "./components/ProtectedRoute"
import About from "./pages/About"
import Checkout from "./pages/Checkout"
import AdminDashboard from "./pages/Admin/Dashboard"
import KeyboardDesigner from "./pages/keyboard-designer"

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/cart", element: <Cart /> },
			{ path: "/checkout", element: <Checkout /> },
			{ path: "/example", element: <div>Example</div> },
			{
				path: "/protected",
				element: (
					<ProtectedRoute>
						{" "}
						<div>Protected</div>{" "}
					</ProtectedRoute>
				),
			},
			{
				path: "/Dashboard", element: <AdminDashboard/>,
			},
			{ path: "/sign-in", element: <SignIn /> },
			{ path: "/register", element: <Register /> },
			{ path: "/products/:slug", element: <Product /> },
			{ path: "*", element: <NotFound /> },
			{ path: "/about", element: <About /> },
			{ path: "/shop", element: <Shop /> },
			{ path: "/keyboard-designer", element: <KeyboardDesigner />},
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
