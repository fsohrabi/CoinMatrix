import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    // Simulated authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogout = () => {
        setIsAuthenticated(false); // Log out the user
    };

    return (
        <div className="navbar p-4 " >
            {/* Logo */}
            <div className="flex-1">
                <Link
                    to="/"
                    className="font-bold text-2xl no-underline text-yellow-400 hover:text-yellow-400"
                    style={{ display: "inline-flex", textDecoration: "none", cursor: "pointer" }}
                >
                    Coin<span className="text-blue-600">Matrix</span>
                </Link>
            </div>

            {/* Login or Profile Dropdown */}
            <div className="flex-none">
                {isAuthenticated ? (
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link
                        to="login"
                        className="text-xl font-semibold text-blue-600 hover:underline hover:text-blue-800"
                        style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}
