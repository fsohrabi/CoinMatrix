import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchNewsById } from "../../api/news.js";

export default function NewsShow() {
    const { id } = useParams();
    const [news, setNewsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetchNewsById(id);
                console.log("Fetched news:", response); // Debugging log

                if (!response || response.errors) {
                    setErrors(response.errors || [{ message: "Unknown error" }]);
                } else if (response.data && response.data.length > 0) {
                    setNewsData(response.data[0]);
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

    // Show loading state
    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // Show error message
    if (errors) {
        return (
            <div className="alert alert-error shadow-lg my-5">
                {errors.map((err, index) => (
                    <span key={index}>⚠️ {err.message}</span>
                ))}
            </div>
        );
    }

    // Show news details
    return (
        <div className="rounded-xl max-w-4xl mx-auto">
            <div className="card bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <figure className="relative w-full overflow-hidden rounded-md">
                    <img
                        src={news?.image || "/default-news.jpg"} // Fallback image
                        alt={news?.title || "News"}
                        className="w-full sm:h-48 md:h-64 object-cover"
                    />
                </figure>
                <div className="card-body p-4">
                    <h2 className="card-title text-xl font-semibold text-gray-800 mb-2">
                        {news?.title || "Untitled News"}
                    </h2>
                    <div
                        className="text-base text-gray-700 text-left leading-relaxed"
                        dangerouslySetInnerHTML={{__html: news?.description || "No description available."}}
                    ></div>
                    <div className="card-actions justify-end mt-4">
                        <div className="badge bg-gray-700 text-white px-3 py-1 rounded-md">
                            {news?.category || "Uncategorized"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
