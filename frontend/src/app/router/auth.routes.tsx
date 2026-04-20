import { lazy } from "react"
import { type RouteObject } from "react-router-dom"
import AuthLayout from "@/layouts/AuthLayout"
import { GuestGuard } from "@/shared/routing/GuestGuard"

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"))

export const authRoutes: RouteObject[] = [
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: "/login", element: <LoginPage /> }],
      },
    ],
  },
]
