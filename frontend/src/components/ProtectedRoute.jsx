import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    // Handle admin routes
    if (location.pathname.startsWith('/admin')) {
        if (!user.admin) {
            return <Navigate to="/user/watchlist" replace />; // Redirect non-admin users to their dashboard
        }
        return <Outlet />;
    }

    // Handle user routes
    if (location.pathname.startsWith('/user')) {
        if (user.admin) {
            return <Navigate to="/admin" replace />; // Redirect admin users to admin dashboard
        }
        return <Outlet />;
    }

    return <Outlet />; // Allow access to other protected routes
}
