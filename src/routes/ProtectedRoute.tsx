import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/common/loaders/PageLoader";
import type { UserRole } from "../types/user";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

// ProtectedRoute guards admin and authenticated-only routes.
//
// The critical isLoading check is what fixes the refresh bug:
//   On first render, AuthContext has user=null / token=null (default state).
//   The useEffect in AuthProvider then reads localStorage and sets the real values.
//   Without the isLoading guard, this component would see isAuthenticated=false
//   and redirect to /login before that effect ever runs.
//   Returning <PageLoader /> while isLoading=true lets the effect complete first.
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Wait for the localStorage restore to finish before making auth decisions.
  if (isLoading) {
    return <PageLoader />;
  }

  // No valid session — send to login.
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Valid session but wrong role — send back to the storefront.
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
