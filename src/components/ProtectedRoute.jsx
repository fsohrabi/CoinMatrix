import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    if (!user.admin) {
        return <Navigate to="/" replace />; // Redirect to home if not an admin
    }

    return <Outlet />; // Allow access to admin routes
}
