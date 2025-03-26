import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function GuestRoute() {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    if (user) {
        return user.admin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
    }

    return <Outlet />;
}
