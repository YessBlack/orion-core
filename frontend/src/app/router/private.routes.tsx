import { lazy } from "react"
import { type RouteObject } from "react-router-dom"
import AuthGuard from "@/shared/routing/AuthGuard"
import AppLayout from "@/layouts/AppLayout"

const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"))

export const privateRoutes: RouteObject[] = [
	{
		element: <AuthGuard />,
		children: [
			{
				element: <AppLayout />,
				children: [
					{ path: "/", element: <DashboardPage /> },
				],
			},
		],
	},
]
