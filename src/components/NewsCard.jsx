import {Link} from "react-router-dom";

export default function NewsCard(props) {
    {/* News Section */}
    return (
        <aside className="col-span-12 lg:col-span-3 bg-white rounded-xl p-2 h-fit">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">News</h3>
                <Link to="/news" className="text-sm text-blue-500 hover:underline">
                    See All
                </Link>
            </div>
            <div className="space-y-4">
                {props.news.map((item) => (
                    <div key={item.id}
                         className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50 transition">
                        <img src={item.image} alt={item.title} className="w-8 h-8 object-cover rounded-lg"/>
                        <h4 className="text-sm font-medium text-gray-700 text-left line-clamp-2">{item.title}</h4>
                    </div>
                ))}
            </div>
        </aside>
    )

}