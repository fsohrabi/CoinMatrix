import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchNewsById } from "../../api/news.js";
import { useTheme } from "../../contexts/ThemeContext";
import { FaArrowLeft } from "react-icons/fa";

export default function NewsShow() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNewsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetchNewsById(id);
                console.log("Fetched news response:", response); // Debugging log

                if (!response || response.errors) {
                    setErrors(response.errors || [{ message: "Unknown error" }]);
                } else if (response.data && response.data.length > 0) {
                    const newsData = response.data[0];
                    console.log("News data:", newsData); // Debugging log
                    setNewsData(newsData);
                } else {
                    setErrors([{ message: "News not found" }]);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setErrors([{ message: "Failed to load news. Please try again later." }]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (errors) {
        return (
            <div className={`alert alert-error shadow-lg my-5 ${isDarkMode ? 'bg-red-900 text-white' : ''}`}>
                {errors.map((err, index) => (
                    <span key={index}>⚠️ {err.message}</span>
                ))}
            </div>
        );
    }

    // Debug log for the news object
    console.log("Current news object:", news);

    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <button
                    onClick={() => navigate("/news")}
                    className={`mr-4 p-2 rounded-full ${isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <FaArrowLeft className="w-5 h-5" />
                </button>
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {news?.title || "Untitled News"}
                </h1>
            </div>

            <div className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <img
                    src={news?.image || "/default-news.jpg"}
                    alt={news?.title || "News"}
                    className="w-full h-[400px] object-cover"
                />
                <div className="p-6">
                    <div className={`prose max-w-none text-left ${isDarkMode ? 'prose-invert' : ''}`}>
                        <div dangerouslySetInnerHTML={{ __html: news?.description || "No description available." }} />
                    </div>
                </div>
            </div>

            <div className={`text-sm text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Published on {news?.created_at ? new Date(news.created_at).toLocaleDateString() : 'Unknown date'}
            </div>
        </div>
    );
}