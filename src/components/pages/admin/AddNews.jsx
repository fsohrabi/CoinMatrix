import { useNavigate } from "react-router-dom";
import { Form } from "react-router-dom";
import { addNews } from "../../api/news.js";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddNews() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [description, setDescription] = useState( "");

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

            setSuccessMessage("News created successfully!"); // More general message
            setTimeout(() => navigate("/admin"), 2000);

        } catch (error) {
            setErrors({ general: "Something went wrong. Please try again." });
        }
    };

    return (
        <div className=" max-w-4xl mx-auto rounded-lg shadow-lg">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Add News</h2>

                {successMessage && (
                    <div className="text-green-500 text-center mb-4">{successMessage}</div>
                )}

                {errors && (
                    <div className="text-red-500 text-center mb-4">
                        {errors.general || (errors.image && errors.image[0]) || (errors.title && errors.title[0]) || (errors.description && errors.description[0]) || (errors.category && errors.category[0])}
                    </div>
                )}

                <Form onSubmit={handleSubmit} method="post" className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
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

                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
                        <input
                            id="category"
                            name="category"
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-semibold text-gray-700">Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-yellow-400 file:border file:py-2 file:px-4 file:rounded-md file:bg-yellow-50 file:text-yellow-600"
                        />
                        {image && <p className="text-green-500 text-sm mt-1">Image selected: {image.name}</p>}
                    </div>

                    <div className="form-control flex items-center">
                        <label className="cursor-pointer label">
                            <span className="label-text mr-2 text-gray-700">Active</span>
                            <input
                                id="is_active"
                                name="is_active"
                                type="checkbox"
                                defaultChecked
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-yellow-400"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-300"
                    >
                        Add News
                    </button>
                </Form>
            </div>
        </div>
    );
}