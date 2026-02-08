import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/presentation/hooks/useAuth"; // your auth hook

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
