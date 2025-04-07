import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import { useCryptoData } from "../../hooks/useCryptoData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "../../Pagination";
import CoinCard from "../coins/CoinCard";
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from "../../api/user";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const { isDarkMode } = useTheme();
    const { currentData, totalPages, isLoading, isError, error } = useCryptoData(currentPage, searchQuery, 20);
    const queryClient = useQueryClient();

    // Fetch watchlist with React Query
    const {
        data: watchlistResponse, // Renamed to reflect the API response structure
        isLoading: isWatchlistLoading,
        isError: isWatchlistError,
        error: watchlistError,
    } = useQuery({
        queryKey: ['watchlist'],
        queryFn: fetchWatchlist,
        staleTime: 60000, // 1 minute stale time
        refetchInterval: 60000, // Auto-refresh every minute
    });

    // Access the watchlist array from the 'data' property of the response
    const watchlist = Array.isArray(watchlistResponse?.data) ? watchlistResponse.data : [];

    // Mutations for adding/removing from watchlist
    const addMutation = useMutation({
        mutationFn: addToWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries(['watchlist']);
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWatchlist,
        onMutate: async (coinId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries(['watchlist']);

            // Snapshot the previous value
            const previousWatchlist = queryClient.getQueryData(['watchlist']);

            // Optimistically update to the new value
            queryClient.setQueryData(['watchlist'], old => ({
                ...old,
                data: old.data.filter(coin => coin.id !== coinId)
            }));

            // Return a context object with the snapshotted value
            return { previousWatchlist };
        },
        onError: (err, coinId, context) => {
            // Rollback to the previous value if error occurs
            queryClient.setQueryData(['watchlist'], context.previousWatchlist);
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries(['watchlist']);
        }
    });

    // Handle search with debounce
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Toggle coin in watchlist
    const toggleWatchlist = (coinId) => {
        const isInWatchlist = watchlist.some(coin => coin.id === coinId);

        if (isInWatchlist) {
            removeMutation.mutate(coinId);
        } else {
            addMutation.mutate(coinId);
        }
    };

    // Check if a coin is in watchlist
    const isInWatchlist = (coinId) => {
        return watchlist.some(coin => coin.id === coinId);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Loading state for watchlist */}
            {!isWatchlistLoading && (
                <div className="mb-10">
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Your Watchlist
                    </h2>
                    {watchlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {watchlist.map((watchedCoin) => (
                                <CoinCard
                                    key={watchedCoin.id}
                                    coin={watchedCoin}
                                    isInWatchlist={true}
                                    onToggleWatchlist={toggleWatchlist}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Your watchlist is empty. Add coins to track them here.
                        </p>
                    )}
                </div>
            )}
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
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





            {/* All Coins Table */}
            <div className="overflow-x-auto">
                <table className={`min-w-full text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    <thead>
                        <tr className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">24h Change</th>
                            <th className="p-4 text-left">Volume</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">Loading...</td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">Error: {error?.message}</td>
                            </tr>
                        ) : (
                            currentData.map((coin) => (
                                <tr
                                    key={coin.id}
                                    className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b`}
                                >
                                    <td className="p-4 flex items-center space-x-3">
                                        <img
                                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                                            alt={coin.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div>
                                            <div>{coin.name}</div>
                                            <div className="text-xs text-gray-400">{coin.symbol}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">${(coin.price || 0).toLocaleString()}</td>
                                    <td className={`p-4 ${coin.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        <div className="flex items-center">
                                            {coin.percent_change_24h >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                                            {(coin.percent_change_24h || 0).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="p-4">${(coin.volume_24h || 0).toLocaleString()}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleWatchlist(coin.id)}
                                            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                        >
                                            {isInWatchlist(coin.id) ? (
                                                <FaStar className="text-yellow-500 w-5 h-5" />
                                            ) : (
                                                <FaRegStar className="text-yellow-500 w-5 h-5" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}