import { Link } from "react-router-dom";
import { lazy } from "react";
import { Suspense } from "react";

const LazyImage = lazy(() => import("./LazyImage"));

export default function NewsCard({ item, isDarkMode, truncateText }) {
    return (
        <div
            className={`card card-side shadow-md rounded-lg overflow-hidden transition transform hover:scale-105 duration-300 hover:shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            <figure className="w-1/3">
                <Suspense fallback={<div className="h-full w-full bg-gray-300"></div>}>
                    <LazyImage
                        src={item.image || "/default-news.jpg"}
                        alt={item.title}
                        className="h-full w-full object-cover"
                    />
                </Suspense>
            </figure>
            <div className="card-body p-4 w-2/3">
                <h2
                    className={`card-title text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                >
                    {truncateText(item.title, 50)}
                </h2>
                <p
                    className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        } text-left`}
                >
                    {truncateText(item.description, 100)}
                </p>
                <div className="card-actions justify-end">
                    <Link
                        className={`btn transition ${isDarkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        to={`/news/${item.id}`}
                    >
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    );
}