import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchNewsById, editNews } from "../../api/news.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaArrowLeft } from 'react-icons/fa';

export default function EditNews() {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [newsData, setNewsData] = useState(null);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchNewsById(id);
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setNewsData(data.data[0]);
                    setDescription(data.data[0].description);
                }
            } catch (error) {
                setErrors({ general: "Error loading news data" });
            }
        };

        loadData();
    }, [id]);

    useEffect(() => {
        if (successMessage) {
            setTimeout(() => {
                navigate("/admin");
            }, 2000);
        }
    }, [successMessage, navigate]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("title", e.target.title.value);
        formData.append("description", description);
        formData.append("category", e.target.category.value);
        formData.set("is_active", e.target.is_active.checked ? "true" : "false");

        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await editNews(id, formData);
            if (response.errors) {
                setErrors(response.errors);
            } else {
                setSuccessMessage("News updated successfully!");
            }
        } catch (error) {
            setErrors({ general: "Something went wrong. Please try again." });
        }
    };

    if (!user?.admin) {
        navigate("/");
        return null;
    }

    if (!newsData) {
        return (
            <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto">
                    <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

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
                        Edit News
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

                    {Object.keys(errors).length > 0 && (
                        <div className={`mb-4 p-4 rounded-lg ${isDarkMode
                            ? 'bg-red-900 text-red-200'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {errors.general || errors.title?.[0] || errors.description?.[0] || errors.category?.[0] || errors.image?.[0]}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={newsData.title}
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
                                defaultValue={newsData.category}
                                required
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter category"
                            />
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="w-1/4 flex justify-center">
                                {image ? (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                                    />
                                ) : (
                                    newsData.image && (
                                        <img
                                            src={newsData.image}
                                            alt="Current"
                                            className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                                        />
                                    )
                                )}
                            </div>

                            <div className="flex-1">
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Change Image
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
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        defaultChecked={newsData.is_active}
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
                                Update News
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
