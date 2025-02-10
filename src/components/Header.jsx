import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { FaUserCircle } from 'react-icons/fa'; // Anonymous icon

export default function Header() {
    const { user, handleLogout } = useAuth();

    return (
        <div className="navbar px-14 pt-8 ">
            {/* Logo */}
            <div className="flex-1">
                <Link
                    to={user?.admin?"admin": "/"}
                    className="font-bold text-2xl no-underline text-yellow-400 hover:text-yellow-400"
                    style={{ display: "inline-flex", textDecoration: "none", cursor: "pointer" }}
                >
                    Coin<span className="text-blue-600">Matrix</span>
                </Link>
            </div>

            {/* Login or Profile Dropdown */}
            <div className="flex-none">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar"> {/* Use label for dropdown trigger */}
                            <FaUserCircle className="w-10 h-10 text-gray-500" /> {/* Only the icon */}
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <span className="px-4 py-2 text-gray-700">{user.name}</span> {/* User name in the dropdown */}
                            </li>
                            <li>
                                <button className="btn btn-error w-full" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Link
                            to="login"
                            className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Login
                        </Link>
                        <Link
                            to="register"
                            className="text-xl font-semibold text-yellow-400 hover:text-yellow-500"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
