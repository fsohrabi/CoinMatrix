import { Link, useNavigate } from "react-router-dom";
import { Form, useActionData } from "react-router-dom";
import { registerUser } from "../../api/auth.js";
import { useEffect } from "react";

export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");


    const data = await registerUser({ name, email, password });
    if (data.errors) {
        return { errors: data.errors };
    }
    return { success: "Registration successful! Redirecting to login..." };

}

export default function Register() {
    const response = useActionData(); // Get response from action()
    const navigate = useNavigate();

    // Redirect to login page after successful registration
    useEffect(() => {
        if (response?.success) {
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [response, navigate]);

    return (
        <div className="p-4 rounded-xl max-w-5xl flex items-center justify-center mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
                    Join <span className="text-blue-600">CoinMatrix</span>
                </h2>

                {/* Success Message */}
                {response?.success && (
                    <h3 className="text-green-500 text-center">{response.success}</h3>
                )}

                <Form replace method="post" className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                        />
                        {response?.errors?.name && (
                            <p className="text-red-500 text-sm mt-1">{response.errors.name[0]}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white   text-gray-800 focus:ring-2 focus:ring-yellow-400"
                        />
                        {response?.errors?.email && (
                            <p className="text-red-500 text-sm mt-1">{response.errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                        />
                        {response?.errors?.password && (
                            <p className="text-red-500 text-sm mt-1">{response.errors.password[0]}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-blue-600 font-semibold py-2 rounded-md hover:bg-yellow-300"
                    >
                        Register
                    </button>
                </Form>

                <p className="text-center text-gray-700 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-yellow-400 hover:text-yellow-300 underline font-medium">
                        Log In Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
