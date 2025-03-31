import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import { FaHome, FaChartLine, FaNewspaper, FaInfoCircle, FaUser, FaSignInAlt, FaBars, FaTimes, FaMoon, FaSun, FaUserPlus, FaCog } from "react-icons/fa";
import { useState } from "react";

const MenuItem = ({ to, icon: Icon, children, isActive }) => (
    <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive
            ? "bg-yellow-500 text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
    >
        <Icon className="text-xl" />
        <span>{children}</span>
    </Link>
);

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
        >
            {isDarkMode ? (
                <>
                    <FaSun className="text-xl" />
                    <span>Light Mode</span>
                </>
            ) : (
                <>
                    <FaMoon className="text-xl" />
                    <span>Dark Mode</span>
                </>
            )}
        </button>
    );
};

export default function Menu() {
    const location = useLocation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const adminMenuItems = [
        { to: "/admin", icon: FaCog, label: "Dashboard" },
    ];

    const userMenuItems = [
        { to: "/", icon: FaHome, label: "Home" },
        { to: "/news", icon: FaNewspaper, label: "News" },
        { to: "/about", icon: FaInfoCircle, label: "About" },
        { to: "/profile", icon: FaUser, label: "Profile" },
    ];

    const guestMenuItems = [
        { to: "/", icon: FaHome, label: "Home" },
        { to: "/news", icon: FaNewspaper, label: "News" },
        { to: "/about", icon: FaInfoCircle, label: "About" },
        { to: "/login", icon: FaSignInAlt, label: "Login" },
        { to: "/register", icon: FaUserPlus, label: "Register" },
    ];

    const menuItems = user?.admin ? adminMenuItems : user ? userMenuItems : guestMenuItems;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 right-4 z-[55] p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 md:hidden"
            >
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Mobile Menu Background */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-[65] md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <FaTimes size={24} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                to={item.to}
                                icon={item.icon}
                                isActive={location.pathname === item.to}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                        <ThemeToggle />
                    </nav>
                </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-lg relative z-40">
                <div className="p-4">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <MenuItem
                                key={item.to}
                                to={item.to}
                                icon={item.icon}
                                isActive={location.pathname === item.to}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                        <ThemeToggle />
                    </div>
                </div>
            </nav>
        </>
    );
}