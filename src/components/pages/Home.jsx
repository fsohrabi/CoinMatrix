import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchCryptosAPI } from "../../../api.js";
import Pagination from "../Pagination";

export default function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showData, setShowData] = useState(true);

    const news = [
        { id: 1, title: "Exciting New Feature Released!", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" },
        { id: 2, title: "2023 Development Updates Announced!", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040" },
        { id: 3, title: "New Crypto Trends to Watch!", image: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=040" },
    ];

    const fetchData = async () => {
        try {
            setShowData(false); // Start fade out
            await new Promise((r) => setTimeout(r, 300)); // Wait for fade-out effect
            setLoading(true);
            const response = await fetchCryptosAPI(currentPage, 20);
            setData(response.data.data);

            const totalItems = response.total;
            const itemsPerPage = 20;
            setTotalPages(Math.ceil(totalItems / itemsPerPage));
        } catch (err) {
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
            setShowData(true); // Start fade in
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const cryptosElements = data.map((item, index) => (
        <tr key={index}>
            <td className="py-2 px-4 text-left flex items-center space-x-2">
                <img
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`}
                    alt={item.name}
                    className="w-6 h-6 object-cover"
                />
                <span>{`${item.symbol} ${item.name}`}</span>
            </td>
            <td className="py-2 px-4 text-left">${item.price}</td>
            <td className={`py-2 px-4 text-left ${item.percent_change_1h > 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center space-x-1">
                    {item.percent_change_1h > 0 ? <FaArrowUp/> : <FaArrowDown/>}
                    <span>{item.percent_change_1h}%</span>
                </div>
            </td>
            <td className={`py-2 px-4 text-left ${item.percent_change_24h > 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center space-x-1">
                    {item.percent_change_24h > 0 ? <FaArrowUp/> : <FaArrowDown/>}
                    <span>{item.percent_change_24h}%</span>
                </div>
            </td>
            <td className={`py-2 px-4 text-left ${item.percent_change_7d > 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center space-x-1">
                    {item.percent_change_7d > 0 ? <FaArrowUp/> : <FaArrowDown/>}
                    <span>{item.percent_change_7d}%</span>
                </div>
            </td>
        </tr>

    ));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Table Section */}
            <div className="col-span-12 lg:col-span-9 p-4 bg-white rounded-xl overflow-x-auto">
                <div className={`transition-opacity duration-300 ${showData ? "opacity-100" : "opacity-0"}`}>
                    <table className="table-auto border-collapse w-full mt-5">
                        <thead className="bg-[#f6f8fe] text-black">
                        <tr>
                            <th className="py-2 px-4 text-left">Currency Name</th>
                            <th className="py-2 px-4 text-left">Price</th>
                            <th className="py-2 px-4 text-left">1h%</th>
                            <th className="py-2 px-4 text-left">24h%</th>
                            <th className="py-2 px-4 text-left">7 Days</th>
                        </tr>
                        </thead>
                        <tbody className="text-black font-medium text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    <div
                                        className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full mx-auto"></div>
                                </td>
                            </tr>
                        ) : cryptosElements}
                        {error && (
                            <tr>
                                <td colSpan={5} className="text-red-500 text-center">
                                    {error}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 &&
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                }
            </div>
            {/* News Section */}
            <aside className="col-span-12 lg:col-span-3 bg-white rounded-xl p-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">News</h3>
                    <Link to="/news" className="text-sm text-blue-500 hover:underline">
                        See All
                    </Link>
                </div>
                <div className="space-y-4">
                    {news.map((item) => (
                        <div key={item.id} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition">
                            <img src={item.image} alt={item.title} className="w-8 h-8 object-cover rounded-lg" />
                            <h4 className="text-sm font-medium text-gray-700 text-left">{item.title}</h4>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
