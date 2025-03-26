import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchNewsById, editNews } from "../../api/news.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditNews() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [newsData, setNewsData] = useState(null);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState( "");
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

    if (!newsData) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Edit News</h2>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 text-green-700 border border-green-500 px-4 py-2 rounded-md text-center mb-4">
                    {successMessage}
                </div>
            )}

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 text-red-700 border border-red-500 px-4 py-2 rounded-md text-center mb-4">
                    {errors.general || errors.title?.[0] || errors.description?.[0] || errors.category?.[0] || errors.image?.[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        defaultValue={newsData.title}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description"
                           className="block text-sm font-semibold text-gray-700">Description</label>
                    <ReactQuill
                        theme="snow"
                        id="description"
                        name="description"
                        value={description}
                        onChange={setDescription}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        defaultValue={newsData.category}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

                {/* Image Upload & Preview */}
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
                        <label htmlFor="image" className="block text-sm font-semibold text-gray-700">Change Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400 file:border file:py-2 file:px-4 file:rounded-md file:bg-yellow-50 file:text-yellow-600"
                        />
                    </div>
                </div>

                {/* Active Checkbox */}
                <div className="form-control flex items-center">
                    <label className="cursor-pointer label">
                        <span className="label-text mr-2 text-gray-700">Active</span>
                        <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            defaultChecked={newsData.is_active}
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-yellow-400"
                        />
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-300"
                >
                    Update News
                </button>
            </form>
        </div>
    );
}
