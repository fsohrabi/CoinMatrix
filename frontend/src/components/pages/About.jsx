import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

export default function AboutPage() {
    const { isDarkMode } = useTheme();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    About CoinMatrix
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your trusted platform for cryptocurrency information and market analysis
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Our Mission
                    </h2>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        CoinMatrix aims to provide real-time cryptocurrency data and market insights to help users make informed decisions in the crypto market.
                    </p>
                </div>

                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Features
                    </h2>
                    <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>• Real-time cryptocurrency prices</li>

                        <li>• Portfolio tracking</li>
                        <li>• News updates</li>

                    </ul>
                </div>
            </div>

            <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h2 className={`text-2xl font-semibold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Connect With Us
                </h2>
                <div className="flex justify-center space-x-6">
                    <a
                        href="https://www.linkedin.com/in/fatemeh-sohrabi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-yellow-500' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-300`}
                    >
                        <FaLinkedin size={24} />
                        <span>LinkedIn</span>
                    </a>
                    <a
                        href="https://github.com/fsohrabi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-yellow-500' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-300`}
                    >
                        <FaGithub size={24} />
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </div>
    );
}