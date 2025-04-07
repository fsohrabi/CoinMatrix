import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Pagination from "../../Pagination";
import { fetchAllNews } from "../../api/news.js";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const NewsCard = lazy(() => import("./NewsCard"));

// Function to truncate long text
const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

const truncateText = (text, maxLength) => {
    const plainText = stripHtml(text);
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
};

export default function News() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);

    // Fetch news data with React Query
    const {
        data: newsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["news", currentPage],
        queryFn: () => fetchAllNews(currentPage, 10, true),
        staleTime: 60000, // 1 minute cache
        keepPreviousData: true,
    });

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [location.search]);

    const handlePageChange = (page) => {
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
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className={`animate-pulse rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md h-48`}
                        >
                            <div className={`h-full w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Handling */}
            {isError && (
                <div className={`alert alert-error shadow-lg my-5 ${isDarkMode ? 'bg-red-900 text-white' : ''}`}>
                    <span>⚠️ Error fetching news: {error.message}</span>
                </div>
            )}

            {/* Display News Cards */}
            {!isLoading && newsData?.data?.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No News Available</h2>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Check back later for updates.</p>
                </div>
            ) : (
                <Suspense fallback={<div>Loading news...</div>}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {newsData?.data?.map((item) => (
                            <NewsCard
                                key={item.id}
                                item={item}
                                isDarkMode={isDarkMode}
                                truncateText={truncateText}
                            />
                        ))}
                    </div>
                </Suspense>
            )}

            {/* Pagination */}
            {newsData?.totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={newsData?.totalPages || 1}
                        onPageChange={handlePageChange}
                        isDarkMode={isDarkMode}
                    />
                </div>
            )}
        </div>
    );
}