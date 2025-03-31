import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
    const { user, handleLogout } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoutClick = async () => {
        try {
            await handleLogout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className={`navbar px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative z-10`}>
            {/* Logo */}
            <div className="flex-1">
                <Link
                    to={user?.admin ? "admin" : "/"}
                    className={`font-bold text-2xl no-underline ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} hover:text-yellow-600`}
                    style={{ display: "inline-flex", textDecoration: "none", cursor: "pointer" }}
                >
                    Coin<span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>Matrix</span>
                </Link>
            </div>

            {/* Login or Profile Dropdown */}
            <div className="flex-none sm:ml-auto">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label
                            tabIndex={0}
                            className={`btn btn-ghost btn-circle avatar ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            <FaUserCircle className="w-10 h-10" />
                        </label>
                        <ul
                            tabIndex={0}
                            className={`dropdown-content menu p-2 shadow rounded-box w-52 mt-4 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                        >
                            <li>
                                <button
                                    className={`btn btn-error w-full ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
                                    onClick={handleLogoutClick}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link
                            to="/login"
                            className={`btn btn-ghost ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="btn btn-primary bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
