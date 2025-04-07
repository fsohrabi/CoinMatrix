import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function CryptoRow({ item, isDarkMode }) {
    return (
        <tr className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <img
                        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`}
                        alt={item.name}
                        className="h-8 w-8 rounded-full"
                        loading="lazy"
                    />
                    <div className="ml-4">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {item.symbol}
                        </div>
                    </div>
                </div>
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ${item.price.toLocaleString()}
            </td>
            {['1h', '24h', '7d'].map((period) => {
                const changeKey = `percent_change_${period}`;
                const change = item[changeKey];
                const isPositive = change > 0;

                return (
                    <td
                        key={period}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                    >
                        <div className="flex items-center">
                            {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                            {Math.abs(change)}%
                        </div>
                    </td>
                );
            })}
        </tr>
    );
}
