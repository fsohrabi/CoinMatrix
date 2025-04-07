import { fetchAllNews, deleteNews } from '../../api/news';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaPlus } from "react-icons/fa";

// Lazy load the NewsTable
const NewsTable = lazy(() => import('./NewsTable'));

export default function Dashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = Number(searchParams.get('page')) || 1;

    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalNews: 0,
        totalCryptos: 0
    });

    const {
        data: newsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["news", currentPage],
        queryFn: () => fetchAllNews(currentPage, 10, false),
        staleTime: 60000,
        keepPreviousData: true,
    });

    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`?page=${page}`);
    };
    const handleDelete = async (id) => {
        try {
            await deleteNews(id);
            queryClient.invalidateQueries(["news"]); // 👈 Force refresh
        } catch (err) {
            console.error("Failed to delete news:", err);
        }
    };

    if (!user?.admin) {
        navigate("/");
        return null;
    }

    if (isError) {
        return <div className="text-center text-red-600">Error: {error.message}</div>;
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
                    {/* ... Stats Cards as before ... */}
                </div>

                {/* Lazy-loaded News Table */}
                <Suspense fallback={<div className="text-center text-gray-500">Loading news...</div>}>
                    <NewsTable
                        news={newsData?.data || []}
                        totalPages={newsData?.totalPages || 1}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        handleDelete={handleDelete}
                    />
                </Suspense>
            </div>
        </div>
    );
}
