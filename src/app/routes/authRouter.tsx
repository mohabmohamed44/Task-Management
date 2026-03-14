import type { RouteObject } from "react-router";
import AuthLayout from "@/presentation/Layout/AuthLayout";
import { LoginPage } from "@/presentation/Pages/LoginPage";
import RegisterPage from "@/presentation/Pages/RegisterPage";

export const authRoutes: RouteObject[] = [ 
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
];