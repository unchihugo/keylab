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
import Product from "./pages/products/[slug]"
//import Cart from './pages/Cart'
import ProtectedRoute from "./components/ProtectedRoute"
import About from "./pages/About"

const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		children: [
			{ path: "/", element: <Home /> },
			//{ path: "/cart", element: <Cart /> },
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
			{ path: "/sign-in", element: <SignIn /> },
			{ path: "/register", element: <Register /> },
			{ path: "/products/:slug", element: <Product /> },
			{ path: "*", element: <NotFound /> },
			{ path: "/about", element: <About /> },
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
