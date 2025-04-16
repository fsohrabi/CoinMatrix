import { createContext, useContext, useState, useEffect } from "react";
import { login, logout, fetchCurrentUser } from "../api/auth";
import Cookies from 'js-cookie';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });


    const [loading, setLoading] = useState(false);

    const handleLogin = async (userData) => {
        setLoading(true);
        try {
            const response = await login(userData);
            if (response.errors) return response;

            // Store the full response including user data and tokens
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            return response;
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('user');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
