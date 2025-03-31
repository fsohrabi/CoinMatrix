import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-router-dom";
import { addNews } from "../../api/news.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaArrowLeft } from 'react-icons/fa';

export default function AddNews() {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [description, setDescription] = useState("");

    if (!user?.admin) {
        navigate("/");
        return null;
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setSuccessMessage(null);

        const formData = new FormData(e.target);
        formData.set("description", description);
        formData.set("is_active", e.target.is_active.checked ? "true" : "false");
        if (!image) {
            setErrors({ image: ["Image is required"] });
            return;
        }
        formData.append("image", image);

        try {
            const responseData = await addNews(formData);

            if (responseData.errors) {
                setErrors(responseData.errors);
                return;
            }

            setSuccessMessage("News created successfully!");
            setTimeout(() => navigate("/admin"), 2000);
        } catch (error) {
            setErrors({ general: "Something went wrong. Please try again." });
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-4xl w-full space-y-8">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate("/admin")}
                        className={`mr-4 p-2 rounded-full ${isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <FaArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className={`text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Add News
                    </h2>
                </div>

                <div className={`mt-8 p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {successMessage && (
                        <div className={`mb-4 p-4 rounded-lg ${isDarkMode
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {successMessage}
                        </div>
                    )}

                    {errors && (
                        <div className={`mb-4 p-4 rounded-lg ${isDarkMode
                            ? 'bg-red-900 text-red-200'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {errors.general || (errors.image && errors.image[0]) || (errors.title && errors.title[0]) || (errors.description && errors.description[0]) || (errors.category && errors.category[0])}
                        </div>
                    )}

                    <Form onSubmit={handleSubmit} method="post" className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter news title"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Description
                            </label>
                            <div className={`mt-1 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    required
                                    className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'image'],
                                            ['clean']
                                        ]
                                    }}
                                    formats={[
                                        'header',
                                        'bold', 'italic', 'underline', 'strike',
                                        'list', 'bullet',
                                        'link', 'image'
                                    ]}
                                />
                                <style>
                                    {`
                                        .ql-toolbar.ql-snow {
                                            ${isDarkMode ? `
                                                background-color: #1F2937;
                                                border-color: #4B5563;
                                                color: #E5E7EB;
                                            ` : `
                                                background-color: #F9FAFB;
                                                border-color: #E5E7EB;
                                                color: #111827;
                                            `}
                                        }
                                        .ql-container.ql-snow {
                                            ${isDarkMode ? `
                                                background-color: #374151;
                                                border-color: #4B5563;
                                                color: #E5E7EB;
                                            ` : `
                                                background-color: #FFFFFF;
                                                border-color: #E5E7EB;
                                                color: #111827;
                                            `}
                                        }
                                        .ql-editor {
                                            ${isDarkMode ? `
                                                color: #E5E7EB;
                                                min-height: 200px;
                                            ` : `
                                                color: #111827;
                                                min-height: 200px;
                                            `}
                                        }
                                        .ql-stroke {
                                            ${isDarkMode ? `
                                                stroke: #E5E7EB !important;
                                            ` : `
                                                stroke: #111827 !important;
                                            `}
                                        }
                                        .ql-fill {
                                            ${isDarkMode ? `
                                                fill: #E5E7EB !important;
                                            ` : `
                                                fill: #111827 !important;
                                            `}
                                        }
                                        .ql-picker {
                                            ${isDarkMode ? `
                                                color: #E5E7EB !important;
                                            ` : `
                                                color: #111827 !important;
                                            `}
                                        }
                                        .ql-picker-options {
                                            ${isDarkMode ? `
                                                background-color: #1F2937 !important;
                                                color: #E5E7EB !important;
                                                border-color: #4B5563 !important;
                                            ` : `
                                                background-color: #FFFFFF !important;
                                                color: #111827 !important;
                                                border-color: #E5E7EB !important;
                                            `}
                                        }
                                        .ql-snow .ql-picker.ql-expanded .ql-picker-options {
                                            ${isDarkMode ? `
                                                border-color: #4B5563 !important;
                                            ` : `
                                                border-color: #E5E7EB !important;
                                            `}
                                        }
                                        .ql-snow .ql-tooltip {
                                            ${isDarkMode ? `
                                                background-color: #1F2937 !important;
                                                color: #E5E7EB !important;
                                                border-color: #4B5563 !important;
                                            ` : `
                                                background-color: #FFFFFF !important;
                                                color: #111827 !important;
                                                border-color: #E5E7EB !important;
                                            `}
                                        }
                                        .ql-snow .ql-tooltip input[type=text] {
                                            ${isDarkMode ? `
                                                background-color: #374151 !important;
                                                color: #E5E7EB !important;
                                                border-color: #4B5563 !important;
                                            ` : `
                                                background-color: #FFFFFF !important;
                                                color: #111827 !important;
                                                border-color: #E5E7EB !important;
                                            `}
                                        }
                                        .ql-snow .ql-picker.ql-expanded .ql-picker-label {
                                            ${isDarkMode ? `
                                                border-color: #4B5563 !important;
                                            ` : `
                                                border-color: #E5E7EB !important;
                                            `}
                                        }
                                        .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
                                            ${isDarkMode ? `
                                                border-color: #4B5563 !important;
                                            ` : `
                                                border-color: #E5E7EB !important;
                                            `}
                                        }
                                        .ql-snow .ql-tooltip a {
                                            ${isDarkMode ? `
                                                color: #60A5FA !important;
                                            ` : `
                                                color: #2563EB !important;
                                            `}
                                        }
                                        .ql-snow.ql-toolbar button:hover,
                                        .ql-snow .ql-toolbar button:hover,
                                        .ql-snow.ql-toolbar button:focus,
                                        .ql-snow .ql-toolbar button:focus,
                                        .ql-snow.ql-toolbar button.ql-active,
                                        .ql-snow .ql-toolbar button.ql-active,
                                        .ql-snow.ql-toolbar .ql-picker-label:hover,
                                        .ql-snow .ql-toolbar .ql-picker-label:hover,
                                        .ql-snow.ql-toolbar .ql-picker-label.ql-active,
                                        .ql-snow .ql-toolbar .ql-picker-label.ql-active,
                                        .ql-snow.ql-toolbar .ql-picker-item:hover,
                                        .ql-snow .ql-toolbar .ql-picker-item:hover,
                                        .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
                                        .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
                                            ${isDarkMode ? `
                                                color: #60A5FA !important;
                                            ` : `
                                                color: #2563EB !important;
                                            `}
                                        }
                                        .ql-snow.ql-toolbar button:hover .ql-stroke,
                                        .ql-snow .ql-toolbar button:hover .ql-stroke,
                                        .ql-snow.ql-toolbar button:focus .ql-stroke,
                                        .ql-snow .ql-toolbar button:focus .ql-stroke,
                                        .ql-snow.ql-toolbar button.ql-active .ql-stroke,
                                        .ql-snow .ql-toolbar button.ql-active .ql-stroke,
                                        .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
                                        .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke {
                                            ${isDarkMode ? `
                                                stroke: #60A5FA !important;
                                            ` : `
                                                stroke: #2563EB !important;
                                            `}
                                        }
                                        .ql-snow.ql-toolbar button:hover .ql-fill,
                                        .ql-snow .ql-toolbar button:hover .ql-fill,
                                        .ql-snow.ql-toolbar button:focus .ql-fill,
                                        .ql-snow .ql-toolbar button:focus .ql-fill,
                                        .ql-snow.ql-toolbar button.ql-active .ql-fill,
                                        .ql-snow .ql-toolbar button.ql-active .ql-fill,
                                        .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
                                        .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill {
                                            ${isDarkMode ? `
                                                fill: #60A5FA !important;
                                            ` : `
                                                fill: #2563EB !important;
                                            `}
                                        }
                                    `}
                                </style>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                required
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter category"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent file:border file:py-2 file:px-4 file:rounded-md ${isDarkMode
                                        ? 'file:bg-gray-600 file:text-white'
                                        : 'file:bg-blue-50 file:text-blue-600'
                                    }`}
                            />
                            {image && (
                                <p className={`mt-1 text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    Image selected: {image.name}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        defaultChecked
                                        className="sr-only peer"
                                    />
                                    <div className={`w-11 h-6 rounded-full peer ${isDarkMode
                                        ? 'bg-gray-700 peer-checked:bg-blue-600'
                                        : 'bg-gray-200 peer-checked:bg-blue-500'
                                        } peer-focus:outline-none peer-focus:ring-4 ${isDarkMode
                                            ? 'peer-focus:ring-blue-800'
                                            : 'peer-focus:ring-blue-300'
                                        }`}>
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all ${isDarkMode
                                            ? 'bg-gray-300 peer-checked:translate-x-full peer-checked:bg-white'
                                            : 'bg-white peer-checked:translate-x-full'
                                            }`}></div>
                                    </div>
                                </div>
                                <span className={`ml-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Active
                                </span>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }`}
                            >
                                Add News
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}