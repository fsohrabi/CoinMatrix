import { FaLinkedin, FaGithub } from "react-icons/fa";
import aboutImg from "../../assets/images/about-image.webp";

export default function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto p-10">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden text-gray-900 relative">
                {/* Profile Header with Image */}
                <div className="relative">
                    <img
                        src={aboutImg}
                        alt="Woman Coding"
                        className="w-full h-72 object-cover opacity-90 transition duration-300 hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                </div>

                {/* Profile Content */}
                <div className="p-10 grid md:grid-cols-3 gap-10">
                    {/* Left Column - Profile Summary */}
                    <div className="md:col-span-1 text-center md:text-left">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">About Me</h2>
                        <p className="text-lg text-gray-700">Backend Developer | Full-Stack Enthusiast</p>
                        <div className="mt-6 flex justify-center md:justify-start space-x-6">
                            <a
                                href="https://www.linkedin.com/in/fatemeh-sohrabi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-indigo-500 transition duration-300 transform hover:scale-105"
                            >
                                <FaLinkedin size={28} />
                                <span className="ml-2 text-lg">LinkedIn</span>
                            </a>
                            <a
                                href="https://github.com/fsohrabi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-indigo-500 transition duration-300 transform hover:scale-105"
                            >
                                <FaGithub size={28} />
                                <span className="ml-2 text-lg">GitHub</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column - About & Projects */}
                    <div className="md:col-span-2 space-y-6">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            I have over 7 years of experience as a backend developer specializing in PHP (Laravel, Symfony). Currently, I am transitioning into Full-Stack Development, focusing on React, Tailwind CSS, TypeScript, Flask, and PostgreSQL.
                        </p>

                        {/* Key Projects */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg shadow-md text-white hover:shadow-xl transition duration-300">
                                <h3 className="text-xl font-semibold">🚀 Cryptocurrency Tracker</h3>
                                <p className="text-gray-200">
                                    Built a real-time cryptocurrency tracker using React, Tailwind CSS, and Python, allowing users to track market trends with an intuitive interface.
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg shadow-md text-white hover:shadow-xl transition duration-300">
                                <h3 className="text-xl font-semibold">🎬 MovieApp Platform</h3>
                                <p className="text-gray-200">
                                    Developed a dynamic movie listing and rating platform using Flask and React, featuring user authentication, search filters, and API integrations.
                                </p>
                            </div>
                        </div>

                        {/* Future Plans */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-900">What's Next?</h3>
                            <p className="text-gray-700">
                                My focus is on building scalable, secure, and user-friendly applications while deepening my knowledge in modern backend and frontend frameworks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
