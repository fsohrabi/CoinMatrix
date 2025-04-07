import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaStar, FaRegStar } from "react-icons/fa";


export default function CoinCard({ coin, isInWatchlist, onToggleWatchlist }) {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    const getCoinColor = (symbol) => {
        const colors = {
            BTC: "bg-orange-500",
            ETH: "bg-blue-500",
            BNB: "bg-yellow-500",
            XRP: "bg-gray-500",
            ADA: "bg-blue-600",
            DOGE: "bg-yellow-400",
            DOT: "bg-purple-500",
            SOL: "bg-purple-400",
            SHIB: "bg-orange-400",
            MATIC: "bg-purple-600",
            LINK: "bg-blue-400",
            UNI: "bg-pink-500",
            AAVE: "bg-red-500",
            COMP: "bg-green-500",
            YFI: "bg-blue-500",
            default: "bg-gray-500",
        };
        return colors[symbol] || colors.default;
    };

    const handleToggleWatchlist = (e) => {
        e.preventDefault();
        if (user && onToggleWatchlist) {
            onToggleWatchlist(coin.id);
        }
    };

    return (

        <div
            className={`p-4 rounded-lg border ${isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
                } shadow-md hover:shadow-lg transition-all duration-200`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${getCoinColor(coin.symbol)} flex items-center justify-center`}>
                        <img
                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full"
                        />
                    </div>
                    <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {coin.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {coin.symbol.toUpperCase()}
                        </p>
                    </div>
                </div>
                {user && (
                    <button
                        onClick={handleToggleWatchlist}
                        className={`p-2 rounded-full ${isDarkMode
                            ? 'text-yellow-500 hover:bg-gray-700'
                            : 'text-yellow-500 hover:bg-gray-100'
                            }`}
                    >
                        {isInWatchlist ? (
                            <FaStar className="w-5 h-5" />
                        ) : (
                            <FaRegStar className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            <div className="space-y-2">
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${(coin.price || 0).toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                    <p className={`text-sm ${(coin.percent_change_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(coin.percent_change_24h || 0) >= 0 ? '+' : ''}
                        {(coin.percent_change_24h || 0).toFixed(2)}%
                        <span className="ml-2">(24h)</span>
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Vol: ${(coin.volume_24h || 0).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>

    );
} 