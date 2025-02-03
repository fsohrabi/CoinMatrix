import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {user && user.admin && (
                <div>
                    <p>Welcome, {user.username}!</p>
                    {/* Add admin-specific content here */}
                </div>
            )}
        </div>
    );
}