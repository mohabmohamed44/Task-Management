import { createBrowserRouter } from "react-router";
import MainLayout from "../presentation/Layout/MainLayout";
import AuthLayout from "../presentation/Layout/AuthLayout";
import HomePage from "../presentation/Pages/HomePage";
import TaskPage from "../presentation/Pages/TaskPage";
import RegisterPage from "@/presentation/Pages/RegisterPage";
import ProfilePage from "@/presentation/Pages/ProfilePage";
import { LoginPage } from "../presentation/Pages/LoginPage";
import NotFoundPage from "@/presentation/Pages/NotFoundPage";
import StatisticsPage from "@/presentation/Pages/StatisticsPage";
import ProtectedRoute from "./routes/protectedRoute";
import PublicRoute from "@/app/routes/publicRoute";
import CreateTask from "@/presentation/Pages/CreateTask";
import TaskDetails from "@/presentation/Pages/TaskDetails";

export const appRouter = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/tasks", element: <TaskPage /> },
            { path: "/statistics", element: <StatisticsPage /> },
            { path: "/profile", element: <ProfilePage /> },
            { path: "/create-task", element: <CreateTask /> },
            { path: "/tasks/:id", element: <TaskDetails /> },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />,
    children : [
        {
            path: "/auth",
            element: <AuthLayout />,
            children: [
                { path: "login", element: <LoginPage /> },
                { path: "register", element: <RegisterPage /> },
            ],
        }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
