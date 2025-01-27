import { FaLinkedin, FaGithub } from "react-icons/fa";
import aboutImg from "../../assets/images/about-image.webp"
export default function AboutPage() {
    return (
        <div className=" rounded-xl max-w-4xl mx-auto p-6">
            <div className="card bg-white shadow-md rounded-lg overflow-hidden mb-6">
                {/* Profile Picture */}
                <figure className="relative w-full overflow-hidden rounded-md">
                    <img
                        src={aboutImg}
                        alt="Woman Coding"
                        className="w-full h-64 object-cover"
                    />
                </figure>

                {/* Profile Content */}
                <div className="card-body p-6">
                    <h2 className="card-title text-xl font-semibaold text-gray-800 mb-2">
                        About Me
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed">
                        I’m a dynamic backend developer with 7+ years of experience in PHP
                        (Laravel, Symfony) and am currently transitioning into Full-Stack
                        Development. Passionate about creating innovative and efficient
                        applications, I’m expanding my expertise in React, Tailwind CSS,
                        TypeScript, Flask, and more. Recently, I built a cryptocurrency
                        tracker combining Python and React to deliver real-time updates and
                        user-friendly functionality.
                    </p>

                    {/* Links */}
                    <div className="flex justify-start items-center mt-4 space-x-4">
                        <a
                            href="https://www.linkedin.com/in/fatemeh-sohrabi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200"
                        >
                            <FaLinkedin size={24} />
                            <span className="ml-2">LinkedIn</span>
                        </a>
                        <a
                            href="https://github.com/fsohrabi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-gray-900 transition duration-200"
                        >
                            <FaGithub size={24} />
                            <span className="ml-2">GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
