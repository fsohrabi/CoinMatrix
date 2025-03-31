import { useEffect, useState } from "react";
import Pagination from "../../Pagination";
import { fetchAllNews } from "../../api/news.js";
import { useNavigate, useLoaderData, Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

// Function to truncate long text
const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

const truncateText = (text, maxLength) => {
    const plainText = stripHtml(text); // Remove HTML tags
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
};

// Loader function to fetch news
export async function loader({ request }) {
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || 1;
    const limit = url.searchParams.get("limit") || 10;
    try {
        const response = await fetchAllNews(page, limit, true);
        return response;
    } catch (error) {
        console.error("Error in loader:", error);
        return { data: [], totalPages: 0, error: error.message };
    }
}

export default function News() {
    const { data: news, totalPages, error } = useLoaderData();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [location.search]);

    useEffect(() => {
        if (news) setLoading(false);
    }, [news]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`?page=${page}`);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Latest News
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Stay updated with the latest cryptocurrency news and market insights
                </p>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {/* Error Handling */}
            {error && (
                <div className={`alert alert-error shadow-lg my-5 ${isDarkMode ? 'bg-red-900 text-white' : ''}`}>
                    <span>⚠️ Error fetching news: {error}</span>
                </div>
            )}

            {/* Display News Cards */}
            {!loading && news.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No News Available</h2>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Check back later for updates.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {news.map((item, index) => (
                        <div
                            key={index}
                            className={`card card-side shadow-md rounded-lg overflow-hidden transition transform hover:scale-105 duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                        >
                            <figure className="w-1/3">
                                <img
                                    src={item.image || "/default-news.jpg"}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            </figure>
                            <div className="card-body p-4 w-2/3">
                                <h2 className={`card-title text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    {truncateText(item.title, 50)}
                                </h2>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    } text-left`}>
                                    {truncateText(item.description, 100)}
                                </p>
                                <div className="card-actions justify-end">
                                    <Link
                                        className={`btn transition ${isDarkMode
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}
                                        to={`/news/${item.id}`}
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isDarkMode={isDarkMode}
                    />
                </div>
            )}
        </div>
    );
}