import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchNewsById, editeNews } from "../../api/news.js";

export default function EditNews() {
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming you're using React Router params to get the ID
    const [newsData, setNewsData] = useState(null);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        // Fetch existing news data by ID
        const loadData = async () => {
            try {
                const data = await fetchNewsById(id);
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setNewsData(data.data[0]); // Since the response is wrapped in a "data" array
                }
            } catch (error) {
                setErrors([{ message: "Error loading news data" }]);
            }
        };

        loadData();
    }, [id]); // Fetch data when the component mounts

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("title", e.target.title.value);
        formData.append("description", e.target.description.value);
        formData.append("category", e.target.category.value);
        formData.set("is_active", e.target.is_active.checked ? "true" : "false");

        if (image) {
            formData.append("image", image);  // Append the image file if selected
        }

        try {
            const response = await editeNews(id, formData); // Send the FormData object
            if (response.errors) {
                setErrors(response.errors);
            } else {
                setSuccessMessage("News updated successfully!");
                setTimeout(() => navigate("/admin"), 2000); // Redirect after success
            }
        } catch (error) {
            setErrors([{ message: "Something went wrong. Please try again." }]);
        }
    };


    if (!newsData) {
        return <div>Loading...</div>; // Show loading state while data is being fetched
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Edit News</h2>

            {successMessage && (
                <div className="text-green-500 text-center mb-4">{successMessage}</div>
            )}

            {errors && (
                <div className="text-red-500 text-center mb-4">
                    {errors[0]?.message || "An error occurred"}
                </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
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

                <div>
                    <label htmlFor="description"
                           className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={newsData.description}
                        required
                        className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                    />
                </div>

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

                <div className="flex items-center space-x-6">
                    {/* Image Preview (left side of file input) */}
                    <div className="w-1/4 flex justify-center">
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)} // Temporary URL for preview
                                alt="Preview"
                                className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                            />
                        ) : (
                            newsData.image && (
                                <img
                                    src={newsData.image} // Show the existing image if no new image is selected
                                    alt="Current"
                                    className="max-w-full h-32 object-cover rounded-md border border-gray-300"
                                />
                            )
                        )}
                    </div>

                    {/* File Input (right side of image preview) */}
                    <div className="w-3/4">
                        <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                            Image
                        </label>
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
                {/* Is Active Checkbox */}
                <div className="form-control flex items-start">
                    <label className="cursor-pointer label">
                        <span className="label-text">Active</span>
                        <input
                            id="is_active"
                            name="is_active"
                            type="checkbox"
                            checked={newsData?.is_active || false} // Avoids undefined errors
                            onChange={(e) => setNewsData({...newsData, is_active: e.target.checked})}
                            className="checkbox checkbox-primary"/>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-yellow-400 text-blue-600 font-semibold py-2 rounded-md hover:bg-yellow-300"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
