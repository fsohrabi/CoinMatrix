import { useParams } from "react-router-dom";

export default function NewsShow() {
    const { id } = useParams();
    const news = {
        title: "Aliens Open a Cafe in the Suburbs",
        description:
            "In an event that seems straight out of a science-fiction novel, an alien species has reportedly opened a quaint café in the heart of suburban America. The establishment, aptly named 'Out of This World Coffee,' boasts a menu that includes gravity-defying cappuccinos, intergalactic lattes, and pastries shaped like constellations. \
            Locals have reported seeing extraterrestrial beings managing the counter, taking orders, and even serving customers. Despite initial skepticism, the café has already drawn crowds from neighboring cities, with visitors curious to get a glimpse of this otherworldly phenomenon. Scientists and government officials are monitoring the situation, while the aliens maintain their focus on delivering exceptional customer service.",
        category: "Science",
        imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4",
    };

    return (
        <div className=" rounded-xl max-w-4xl mx-auto">
            <div className="card bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <figure className="relative w-full overflow-hidden rounded-md">
                    <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full sm:h-48 md:h-64 object-cover"
                    />
                </figure>
                <div className="card-body p-4">
                    <h2 className="card-title text-xl font-semibold text-gray-800 mb-2">
                        {news.title}
                    </h2>
                    <p className="text-base text-gray-700 text-left leading-relaxed">
                        {news.description}
                    </p>
                    <div className="card-actions justify-end mt-4">
                        <div className="badge bg-gray-700 text-white px-3 py-1 rounded-md">
                            {news.category}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
