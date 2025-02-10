import { fetchAllNews, deleteNews } from '../../api/news';
import { useNavigate, useLoaderData, Link, useLocation } from 'react-router-dom';
import Pagination from "../../Pagination.jsx";
import { useState, useEffect } from "react";

export async function loader({ request }) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 20;
    try {
        const response = await fetchAllNews(page, limit,false);
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
            window.location.reload();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const truncateText = (text, maxLength) => {
        const plainText = stripHtml(text); // Remove HTML tags
        return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
    };

    if (error) {
        return <div className="text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">News Dashboard</h2>
                <Link to="news/add" className="btn bg-blue-600 hover:bg-blue-700 text-white transition">Add News</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse text-sm text-left text-gray-500">
                    <thead className="bg-[#f6f8fe]">
                    <tr>
                        <th className="py-2 px-4 text-left w-1/5">Title</th>
                        <th className="py-2 px-4 text-left w-1/4">Description</th>
                        <th className="py-2 px-4 text-left">Category</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Created At</th>
                        <th className="py-2 px-4 text-left">Updated At</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {news.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-gray-500">
                                No news found.
                            </td>
                        </tr>
                    ) : (
                        news.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4 max-w-[150px] truncate hover:overflow-visible"
                                    title={item.title}>
                                    {truncateText(item.title, 30)}
                                </td>
                                <td className="py-2 px-4 max-w-[200px] truncate hover:overflow-visible"
                                    title={item.description}>
                                    {truncateText(item.description, 50)}
                                </td>
                                <td className="py-2 px-4">{item.category}</td>
                                <td className="py-2 px-4">
                                    <span className={`px-2 py-1 rounded text-white text-xs 
                                        ${item.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    {item.created_at ? new Date(item.created_at).toLocaleString() : '-'}
                                </td>
                                <td className="py-2 px-4">
                                    {item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'}
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
