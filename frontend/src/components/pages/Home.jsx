import { Link, useLoaderData } from "react-router-dom";
import { fetchAllNews } from "../api/news";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchCryptosAPI, searchCryptosAPI } from "../api/crypto.js";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export async function loader({ request }) {
    try {
        const response = await fetchAllNews(1, 10);
        return response;
    } catch (error) {
        console.error("Error in loader:", error);
    }
}

export default function Home() {
    const { data: news } = useLoaderData();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showData, setShowData] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    const fetchData = async () => {
        try {
            setShowData(false); // Start fade out
            await new Promise((r) => setTimeout(r, 300)); // Wait for fade-out effect
            setLoading(true);
            const response = await fetchCryptosAPI(currentPage, 20);
            setData(response.data.data);

            const totalItems = response.total;
            const itemsPerPage = 20;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
        } catch (err) {
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
            setShowData(true); // Start fade in
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            fetchData();
            return;
        }

        try {
            setLoading(true);
            const response = await searchCryptosAPI(query);
            setData(response.data);
            setTotalPages(1);
            setCurrentPage(1);
        } catch (err) {
            setError(err.message || "Failed to search cryptocurrencies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(intervalId);
    }, [currentPage]);

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Welcome to CoinMatrix
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your one-stop destination for cryptocurrency information
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search cryptocurrencies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full px-4 py-3 pl-12 rounded-lg border 
                        ${isDarkMode
                                ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} 
                        focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                    />
                    <svg
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                </div>
            ) : (
                <div className={`overflow-x-auto rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Name
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Price
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    1h Change
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    24h Change
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    7d Change
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y divide-gray-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            {data.map((item, index) => (
                                <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`}
                                                alt={item.name}
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <div className="ml-4">
                                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {item.name}
                                                </div>
                                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.symbol}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        ${item.price.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.percent_change_1h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        <div className="flex items-center">
                                            {item.percent_change_1h > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                            {Math.abs(item.percent_change_1h)}%
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.percent_change_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        <div className="flex items-center">
                                            {item.percent_change_24h > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                            {Math.abs(item.percent_change_24h)}%
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.percent_change_7d > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        <div className="flex items-center">
                                            {item.percent_change_7d > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                            {Math.abs(item.percent_change_7d)}%
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!searchQuery && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isDarkMode={isDarkMode}
                    />
                </div>
            )}

            {!user && (
                <div className="text-center mt-8">
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Want to track your favorite cryptocurrencies?
                    </p>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg
                        transition-colors duration-200"
                    >
                        Get Started
                    </button>
                </div>
            )}
        </div>
    );
}
