import type { RouteObject } from "react-router";
import AuthLayout from "@/presentation/Layout/AuthLayout";
import { AuthCallback, LoginPage, RegisterPage } from "@/app/routes/LazyPages";

export const authRoutes: RouteObject[] = [ 
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "callback", element: <AuthCallback /> },
    ],
  },
];