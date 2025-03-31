import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Login() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
        // Clear server error when user starts typing
        setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await handleLogin(formData);

            // Check if response has errors array
            if (response.errors && Array.isArray(response.errors)) {
                setServerError(response.errors[0]); // Display the first error message
                return;
            }

            // Successful login
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            // Handle different types of errors
            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                if (Array.isArray(apiErrors)) {
                    setServerError(apiErrors[0]); // Display the first error message
                } else if (typeof apiErrors === 'object') {
                    setErrors(apiErrors);
                } else {
                    setServerError(apiErrors);
                }
            } else {
                setServerError(error.message || "An error occurred during login. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className={`max-w-md w-full space-y-8 p-10 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div>
                    <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Sign in to your account
                    </h2>
                    <p className={`mt-2 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Or{" "}
                        <Link to="/register" className={`font-medium ${isDarkMode ? 'text-yellow-500 hover:text-yellow-400' : 'text-blue-600 hover:text-blue-500'}`}>
                            create a new account
                        </Link>
                    </p>
                </div>

                {serverError && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border`} role="alert">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{serverError}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2.5 border ${errors.email ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                                    } placeholder-gray-500 ${isDarkMode ? 'text-white' : 'text-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200`}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-2.5 border ${errors.password ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                                    } placeholder-gray-500 ${isDarkMode ? 'text-white' : 'text-gray-900'} focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors duration-200`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${isLoading
                                ? 'bg-yellow-400 cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
                                } transition-colors duration-200`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 