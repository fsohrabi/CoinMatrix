// Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";

export default function Layout() {
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Menu />
                <main className="flex-1 p-4">
                    <div className={`max-w-7xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}