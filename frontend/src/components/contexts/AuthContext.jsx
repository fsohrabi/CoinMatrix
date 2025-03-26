import { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser, login, logout } from "../api/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAttemptedInitialAuth, setHasAttemptedInitialAuth] = useState(false); // New state

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const data = await fetchCurrentUser();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null); // Explicitly set user to null on error
            } finally {
                setLoading(false); // Ensure loading stops
                setHasAttemptedInitialAuth(true);
            }
        };

        if (!hasAttemptedInitialAuth) {
            initializeUser();
        }
    }, [hasAttemptedInitialAuth]);


    const handleLogin = async (userData) => {
        const response = await login(userData);
        if (response && response.errors) { // Check for errors property
            return response; // Return the whole response with errors
        }
        const data = await fetchCurrentUser();
        setUser(data);
        return data; // Return data on successful login
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout ,loading: !user && !hasAttemptedInitialAuth}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;

