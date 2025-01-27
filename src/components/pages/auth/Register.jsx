import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div className="p-4 rounded-xl max-w-5xl flex items-center justify-center mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6">
                    Join <span className="text-blue-600">CoinMatrix</span>
                </h2>
                <form>
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
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-blue-600 font-semibold py-2 rounded-md hover:bg-yellow-300"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-700 mt-4">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-yellow-400 hover:text-yellow-300 underline font-medium"
                    >
                        Log In Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
