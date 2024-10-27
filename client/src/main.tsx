import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AuthProvider } from './AuthContext'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SignIn from './pages/sign-in'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/example", element: <div>Example</div> },
      { path: "/protected", element: <ProtectedRoute> <div>Protected</div> </ProtectedRoute> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "*", element: <NotFound /> },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
