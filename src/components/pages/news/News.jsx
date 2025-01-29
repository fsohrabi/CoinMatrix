import  { useState } from "react";
import {Link} from "react-router-dom";
import Pagination from "../../Pagination";

const newsItems = [
    {
        id:1,
        title: "Record-breaking Snowfall Stuns City",
        description:
            "A surprise blizzard paralyzed the metropolitan area this weekend, leaving locals in awe...",
        category: "Weather",
        imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    },
    {
        id:2,
        title: "Scientists Discover New Galaxy",
        description:
            "A team of astronomers made history by identifying a galaxy never seen before, using...",
        category: "Science",
        imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    },
    {
        id:3,
        title: "Dogs Now Driving Cars",
        description:
            "A small town witnessed an unusual event where multiple dogs were seen navigating traffic...",
        category: "Oddities",
        imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    },
    {
        id:4,
        title: "Ice Cream Diet Declared Superfood",
        description:
            "Health professionals worldwide are shocked by a new study proving ice cream to be...",
        category: "Lifestyle",
        imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    },
    {
        id:5,
        title: "Aliens Open a Cafe in the Suburbs",
        description:
            "The new café, boasting the slogan 'Out of This World Coffee,' has sparked both curiosity...",
        category: "Science",
        imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    },
];

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 2;

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const paginatedItems = newsItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4  rounded-xl  max-w-4xl  mx-auto">
            {/* Display News Cards */}
            {paginatedItems.map((news, index) => (
                <div
                    key={index}
                    className="card card-side bg-white shadow-md rounded-lg overflow-hidden mb-6"
                >
                    <figure className="w-1/3">
                        <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="h-full w-full object-cover"
                        />
                    </figure>
                    <div className="card-body p-4 w-2/3">
                        <h2 className="card-title text-lg font-semibold text-gray-800">
                            {news.title}
                        </h2>
                        <p className="text-sm text-gray-600 text-left ">{news.description}</p>
                        <div className="card-actions justify-end">
                            <Link className="btn btn-primary hover:bg-blue-700 transition" to={`/news/${news.id}`}>
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 &&
               <Pagination
                currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
            }

        </div>
    );
}
