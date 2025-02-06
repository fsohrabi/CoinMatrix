import { Link, Form, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useState } from "react";

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null); // State to store errors

    // Handle form submission using the action data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const data = await handleLogin({ email, password });
        if (data && data.errors) { // Correctly check for errors
            setErrors(data.errors);
        } else if (data?.admin === true) {
            navigate("/admin"); // Navigate to admin dashboard
        }else{
            navigate("/");
        }
    };

    return (
        <div className="p-4 rounded-xl max-w-5xl flex items-center justify-center mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
                    Welcome to <span className="text-blue-600">CoinMatrix</span>
                </h2>

                {/* Display any errors */}
                {errors && <p className="text-red-500 text-sm mt-1">{errors[0]}</p>}

                {/* Form for login */}
                <Form method="post" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-blue-600 font-semibold py-2 rounded-md hover:bg-yellow-300"
                    >
                        Log In
                    </button>
                </Form>

                {/* Link to registration page */}
                <p className="text-center text-gray-700 mt-4">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-yellow-400 hover:text-yellow-300 underline font-medium"
                    >
                        Register Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
