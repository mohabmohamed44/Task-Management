import { createBrowserRouter } from "react-router";
import { NotFoundPage } from "@/app/routes/LazyPages";
import ProtectedRoute from "@/app/routes/protectedRoute";
import PublicRoute from "@/app/routes/publicRoute";
import { mainRoutes } from "@/app/routes/mainRouter";
import { authRoutes } from "@/app/routes/authRouter";

export const appRouter = createBrowserRouter([
  // Main Routes - Protected (requires authentication)
  {
    element: <ProtectedRoute />,
    children: [mainRoutes],
  },

  // Auth Routes - Public (redirects authenticated users)
  {
    element: <PublicRoute />,
    children: authRoutes,
  },

  // 404 Not Found
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);