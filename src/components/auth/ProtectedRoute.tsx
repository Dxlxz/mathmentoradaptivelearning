import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { AppRole } from "@/lib/auth/types";

interface ProtectedRouteProps {
  role?: AppRole;
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