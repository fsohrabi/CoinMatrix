import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function Home() {
    const news = [
        {
            id: 1,
            title: "Exciting New Feature Released!",
            image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040",
        },
        {
            id: 2,
            title: "2023 Development Updates Announced!",
            image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040",
        },
        {
            id: 3,
            title: "New Crypto Trends to Watch!",
            image: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=040",
        },
    ];

    const marketData = [
        { currency: "BTC", name: "Bitcoin", price: "$45,000", change1h: 1.2, change24h: 5.6, change7d: 8.5, icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" },
        { currency: "ETH", name: "Ethereum", price: "$3,000", change1h: 0.5, change24h: 3.1, change7d: 4.4, icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040" },
        { currency: "ADA", name: "Cardano", price: "$2.50", change1h: -0.8, change24h: 2.0, change7d: 3.2, icon: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=040" }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Table Section */}
            <div className="col-span-12 lg:col-span-9 p-4 bg-white rounded-xl overflow-x-auto">
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
                    <tbody className="text-black font-medium">
                    {marketData.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 text-left flex items-center space-x-2">
                                <img src={item.icon} alt={item.currency} className="w-6 h-6 object-cover"/>
                                <span>{item.currency}</span>
                            </td>
                            <td className="py-2 px-4 text-left">{item.price}</td>
                            <td className={`py-2 px-4 text-left ${item.change1h > 0 ? "text-green-500" : "text-red-500"}`}>
                                {item.change1h > 0 ? <FaArrowUp className="inline text-green-500"/> :
                                    <FaArrowDown className="inline text-red-500"/>}
                                {item.change1h}%
                            </td>
                            <td className={`py-2 px-4 text-left ${item.change24h > 0 ? "text-green-500" : "text-red-500"}`}>
                                {item.change24h > 0 ? <FaArrowUp className="inline text-green-500"/> :
                                    <FaArrowDown className="inline text-red-500"/>}
                                {item.change24h}%
                            </td>
                            <td className={`py-2 px-4 text-left ${item.change7d > 0 ? "text-green-500" : "text-red-500"}`}>
                                {item.change7d > 0 ? <FaArrowUp className="inline text-green-500"/> :
                                    <FaArrowDown className="inline text-red-500"/>}
                                {item.change7d}%
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="join bg-white mt-5  mb-3">
                    <input
                        className="join-item btn btn-square bg-[#f6f8fe]"
                        type="radio"
                        name="options"
                        aria-label="1"
                        defaultChecked/>
                    <input className="join-item btn btn-square bg-[#f6f8fe]" type="radio" name="options" aria-label="2"/>
                    <input className="join-item btn btn-square bg-[#f6f8fe]" type="radio" name="options" aria-label="3"/>
                    <input className="join-item btn btn-square bg-[#f6f8fe]" type="radio" name="options" aria-label="4"/>
                </div>
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
                        <div
                            key={item.id}
                            className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-8 h-8 object-cover rounded-lg"
                            />
                            <h4 className="text-sm font-medium text-gray-700 text-left">{item.title}</h4>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
