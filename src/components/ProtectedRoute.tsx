import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  role?: "student" | "mentor";
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;