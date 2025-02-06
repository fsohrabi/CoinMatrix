import { fetchAllNews, deleteNews } from '../../api/news';
import { useNavigate, useLoaderData, Link, useLocation } from 'react-router-dom';
import Pagination from "../../Pagination.jsx";
import { useState, useEffect } from "react";

export async function loader({ request }) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 20;
    try {
        const response = await fetchAllNews(page, limit);
        return response;
    } catch (error) {
        console.error("Error in loader:", error);
        return { data: [], totalPages: 0, error: error.message };
    }
}

export default function Dashboard() {
    const { data: news, totalPages, error } = useLoaderData();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [location.search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`?page=${page}`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteNews(id);
            window.location.reload(); // Reload data after deletion
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const limitDescription = (description, limit = 50) => {
        // Limit description to a certain number of characters and add "..." at the end
        if (description.length > limit) {
            return description.substring(0, limit) + '...';
        }
        return description;
    };

    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            {/* Table Section */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">News Dashboard</h2>
                    <Link to="news/add" className="btn btn-primary">Add New News</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse text-sm text-left text-gray-500">
                        <thead className="bg-[#f6f8fe]">
                        <tr>
                            <th className="py-2 px-4 text-left">Title</th>
                            <th className="py-2 px-4 text-left">Description</th>
                            <th className="py-2 px-4 text-left">Category</th>
                            <th className="py-2 px-4 text-left">Created At</th>
                            <th className="py-2 px-4 text-left">Updated At</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {news.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No news found.
                                </td>
                            </tr>
                        ) : (
                            news.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-100">
                                    <td className="py-2 px-4">{item.title}</td>
                                    <td className="py-2 px-4">{limitDescription(item.description, 50)}</td>
                                    <td className="py-2 px-4">{item.category}</td>
                                    <td className="py-2 px-4">
                                        {item.created_at ? new Date(item.created_at).toLocaleString('en-US', options) : '-'}
                                    </td>
                                    <td className="py-2 px-4">
                                        {item.updated_at ? new Date(item.updated_at).toLocaleString('en-US', options) : '-'}
                                    </td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => navigate(`/admin/news/edit/${item.id}`)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
        </div>
    );
}
