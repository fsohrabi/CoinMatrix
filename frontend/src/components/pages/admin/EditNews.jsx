import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { fetchNewsById, editNews } from "../../api/news";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaArrowLeft } from "react-icons/fa";
import { useQueryClient } from '@tanstack/react-query';

export default function EditNews() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        is_active: true,
        image_url: ""
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const news = await fetchNewsById(id);
                setFormData({
                    title: news.data[0].title,
                    description: news.data[0].description,
                    category: news.data[0].category,
                    is_active: news.data[0].is_active,
                    image_url: news.data[0].image
                });
            } catch (error) {
                setErrors({ general: "Failed to fetch news item." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (!user?.admin) {
        navigate("/");
        return null;
    }

    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            description: content
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setSuccessMessage(null);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("is_active", formData.is_active ? "true" : "false");

        if (image) {
            data.append("image", image);
        }

        try {
            const res = await editNews(id, data);
            if (res.errors) {
                setErrors(res.errors);
                return;
            }

            setSuccessMessage("News updated successfully!");
            await queryClient.invalidateQueries(["news"]);
            setTimeout(() => navigate("/admin"), 2000);
        } catch (err) {
            setErrors({ general: "Something went wrong. Please try again." });
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-4xl w-full space-y-8">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate("/admin")}
                        className={`mr-4 p-2 rounded-full ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FaArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className={`text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Edit News
                    </h2>
                </div>

                <div className={`mt-8 p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {successMessage && (
                        <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                            {successMessage}
                        </div>
                    )}

                    {errors && (
                        <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                            {errors.general || (errors.image && errors.image[0]) || (errors.title && errors.title[0]) || (errors.description && errors.description[0]) || (errors.category && errors.category[0])}
                        </div>
                    )}

                    <Form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Description
                            </label>
                            <Editor
                                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                value={formData.description}
                                onEditorChange={handleEditorChange}
                                init={{
                                    height: 400,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | bold italic backcolor | ' +
                                        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                    content_style: isDarkMode
                                        ? 'body { background-color: #1f2937; color: white; font-family:Helvetica,Arial,sans-serif; font-size:14px; }'
                                        : 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }'
                                }}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} file:border file:py-2 file:px-4 file:rounded-md ${isDarkMode ? 'file:bg-gray-600 file:text-white' : 'file:bg-blue-50 file:text-blue-600'}`}
                            />
                            {!image && formData.image_url && (
                                <img
                                    src={formData.image_url}
                                    alt="Current"
                                    className="mt-4 max-w-xs rounded-md shadow-md"
                                />
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-11 h-6 rounded-full peer ${isDarkMode ? 'bg-gray-700 peer-checked:bg-blue-600' : 'bg-gray-200 peer-checked:bg-blue-500'} peer-focus:outline-none peer-focus:ring-4 ${isDarkMode ? 'peer-focus:ring-blue-800' : 'peer-focus:ring-blue-300'}`}>
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all ${isDarkMode ? 'bg-gray-300 peer-checked:translate-x-full peer-checked:bg-white' : 'bg-white peer-checked:translate-x-full'}`}></div>
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
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                Update News
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
