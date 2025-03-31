import { fetchAllNews, deleteNews } from '../../api/news';
import { useNavigate, useLoaderData, Link, useLocation } from 'react-router-dom';
import Pagination from "../../Pagination.jsx";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaUsers, FaNewspaper, FaChartLine, FaCog, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export async function loader({ request }) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 20;
    try {
        const response = await fetchAllNews(page, limit, false);
        return response;
    } catch (error) {
        console.error("Error in loader:", error);
        return { data: [], totalPages: 0, error: error.message };
    }
}

export default function Dashboard() {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const { data: news, totalPages, error } = useLoaderData();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = Number(searchParams.get('page')) || 1;
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalNews: 0,
        totalCryptos: 0
    });

    useEffect(() => {
        setCurrentPage(pageFromUrl);
        // Fetch dashboard stats
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/admin/stats");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, [location.search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`?page=${page}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await deleteNews(id);
                window.location.reload();
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const truncateText = (text, maxLength) => {
        const plainText = stripHtml(text);
        return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
    };

    if (!user?.admin) {
        navigate("/");
        return null;
    }

    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Admin Dashboard
                    </h1>
                    <Link
                        to="/admin/news/add"
                        className={`flex items-center px-4 py-2 rounded-lg ${isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        <FaPlus className="mr-2" />
                        Add News
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Users Card */}
                    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                <FaUsers className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</p>
                                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.totalUsers}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* News Card */}
                    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                                <FaNewspaper className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total News</p>
                                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.totalNews}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cryptos Card */}
                    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                                <FaChartLine className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            </div>
                            <div className="ml-4">
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Cryptos</p>
                                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.totalCryptos}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Table */}
                <div className={`rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="p-6">
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            News Management
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                            }`}>Title</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                            }`}>Category</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                            }`}>Status</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                            }`}>Created At</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                            }`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-gray-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    {news.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className={`px-6 py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                No news found.
                                            </td>
                                        </tr>
                                    ) : (
                                        news.map((item) => (
                                            <tr key={item.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                                }`}>
                                                <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {truncateText(item.title, 50)}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                    }`}>
                                                    {item.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active
                                                        ? isDarkMode
                                                            ? 'bg-green-900 text-green-200'
                                                            : 'bg-green-100 text-green-800'
                                                        : isDarkMode
                                                            ? 'bg-red-900 text-red-200'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                    }`}>
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => navigate(`/admin/news/edit/${item.id}`)}
                                                            className={`${isDarkMode
                                                                ? 'text-blue-400 hover:text-blue-300'
                                                                : 'text-blue-600 hover:text-blue-900'
                                                                }`}
                                                        >
                                                            <FaEdit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className={`${isDarkMode
                                                                ? 'text-red-400 hover:text-red-300'
                                                                : 'text-red-600 hover:text-red-900'
                                                                }`}
                                                        >
                                                            <FaTrash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
