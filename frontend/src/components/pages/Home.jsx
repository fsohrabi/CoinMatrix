import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import { useCryptoData } from "../hooks/useCryptoData";
import { lazy, Suspense } from "react";

const Pagination = lazy(() => import("../Pagination"));
const CryptoRow = lazy(() => import("../CryptoRow"));

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const itemsPerPage = 20;
    const { currentData, totalPages, paginatedData, isLoading, isError, error } = useCryptoData(currentPage, searchQuery, itemsPerPage);



    // Handle search with debounce
    const handleSearch = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);



    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Welcome to CoinMatrix
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your one-stop destination for cryptocurrency information
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search cryptocurrencies..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className={`w-full px-4 py-3 pl-12 rounded-lg border
                            ${isDarkMode
                                ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'}
                            focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                    />
                    <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
            </div>

            {/* Crypto Table with Suspense */}
            <div className={`overflow-x-auto rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {isLoading ? (
                    <div className="p-8">
                        <div className="animate-pulse space-y-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className={`h-12 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>
                ) : isError ? (
                    <div className={`p-8 text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        Error loading data: {error?.message || "Unknown error"}
                    </div>
                ) : (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                    {["Name", "Price", "1h Change", "24h Change", "7d Change"].map((header) => (
                                        <th
                                            key={header}
                                            className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-gray-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <Suspense fallback={
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="animate-pulse space-y-4">
                                                {[...Array(10)].map((_, i) => (
                                                    <div key={i} className={`h-12 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                }>
                                    {paginatedData.map((item) => (
                                        <CryptoRow key={item.id} item={item} isDarkMode={isDarkMode} />
                                    ))}
                                </Suspense>
                            </tbody>
                        </table>
                        {!isLoading && paginatedData.length === 0 && (
                            <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No cryptocurrencies found
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Pagination with Suspense */}
            {paginatedData.length > 0 && (
                <div className="flex justify-center">
                    <Suspense fallback={
                        <div className={`h-10 w-64 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    }>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            isDarkMode={isDarkMode}
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
}


