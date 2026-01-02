import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { API_BASE_URL, getJobById } from "../services/api.service";

import Button from "../components/ui/Buttons";
import CategoriesData from "../data/categories.json";
import SubCategoriesData from "../data/subcategories.json";

interface Category {
    id: number;
    name: string;
    icon: string;
}

interface SubCategory {
    name: string;
    icon: string;
}

interface SubCategoryGroup {
    categoryId: number;
    items: SubCategory[];
}

interface JobData {
    _id: string;
    title: string;
    category: string;
    subcategory?: string;
    description: string;
    price?: string;
    location?: string;
    images: (string | File)[];
    latitude: number;
    longitude: number;
}

const UpdateJob: React.FC = () => {
    const navigate = useNavigate();
    const { jobId } = useParams<{ jobId: string }>();

    // Original job data (for display on left side)
    const [originalData, setOriginalData] = useState<JobData | null>(null);

    // Form data (for editing on right side)
    const [formData, setFormData] = useState<JobData>({
        _id: "",
        title: "",
        category: "",
        subcategory: "",
        description: "",
        price: "",
        location: "",
        images: [],
        latitude: 0,
        longitude: 0,
    });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories: Category[] = CategoriesData.categories;
    const subcategoryGroups: SubCategoryGroup[] = SubCategoriesData.subcategories || [];
    const allSubcategories: SubCategory[] = subcategoryGroups.flatMap(
        (group) => group.items
    );

    useEffect(() => {
        if (!jobId) return;

        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await getJobById(jobId);

                // FIXED: Check for res.data instead of res.job
                if (res.success && res.data) {
                    const job = res.data;

                    // Include URLs in images array
                    const images = job.images?.map((img: string) =>
                        img.startsWith("http") ? img : `${API_BASE_URL}/${img}`
                    ) || [];

                    const jobData = {
                        _id: job._id,
                        title: job.title,
                        category: job.category,
                        subcategory: job.subcategory || "",
                        description: job.description,
                        price: job.price || "",
                        location: job.location || "",
                        images: images,
                        latitude: job.latitude,
                        longitude: job.longitude,
                    };

                    // Set both original and form data
                    setOriginalData(jobData);
                    setFormData(jobData);
                } else {
                    alert("Failed to load job data");
                }
            } catch (err) {
                console.error("Fetch job error:", err);
                alert("Error loading job data");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    /* ================= HANDLERS ================= */
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...Array.from(files)],
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    /* ================= SUBMIT WITH FORMDATA ================= */
    const handleSubmit = async () => {
        if (!formData.title || !formData.category || !formData.description) {
            alert("Title, category and description are required");
            return;
        }

        try {
            setIsSubmitting(true);

            // Create FormData object
            const formDataToSend = new FormData();

            // Append all text fields
            formDataToSend.append("title", formData.title);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("description", formData.description);

            if (formData.subcategory) {
                formDataToSend.append("subcategory", formData.subcategory);
            }
            if (formData.price) {
                formDataToSend.append("price", formData.price);
            }
            if (formData.location) {
                formDataToSend.append("location", formData.location);
            }

            formDataToSend.append("latitude", formData.latitude.toString());
            formDataToSend.append("longitude", formData.longitude.toString());

            // Append only new File objects (not existing URLs)
            formData.images.forEach((img) => {
                if (img instanceof File) {
                    formDataToSend.append("images", img);
                }
            });

            // Send request with FormData
            const response = await fetch(`${API_BASE_URL}/updateJob/${jobId}`, {
                method: "PUT",
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                alert("Job updated successfully!");
                navigate("/listed-jobs");
            } else {
                alert(result.message || "Failed to update job");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("Error updating job");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Loading job data...</p>
            </div>
        );
    }

    if (!originalData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-red-600">Job not found</p>
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold">Update Job</h1>
                </div>

                {/* Split View Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT SIDE - Current Job Details */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Current Job Details</h2>

                        {/* Images */}
                        {originalData.images.length > 0 && (
                            <div className="mb-4">
                                <img
                                    src={typeof originalData.images[0] === "string"
                                        ? originalData.images[0]
                                        : URL.createObjectURL(originalData.images[0])}
                                    alt={originalData.title}
                                    className="w-full h-64 object-cover rounded-xl"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
                                    }}
                                />
                            </div>
                        )}

                        {/* Title & Category */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">{originalData.title}</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                {originalData.category}
                            </span>
                        </div>

                        {/* Subcategory */}
                        {originalData.subcategory && (
                            <div className="mb-3">
                                <span className="text-sm font-medium text-gray-600">Subcategory: </span>
                                <span className="text-sm text-gray-800">{originalData.subcategory}</span>
                            </div>
                        )}

                        {/* Price */}
                        {originalData.price && (
                            <div className="mb-3">
                                <span className="text-sm font-medium text-gray-600">Price: </span>
                                <span className="text-lg font-bold text-green-600">{originalData.price}</span>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
                            <p className="text-gray-700 leading-relaxed">{originalData.description}</p>
                        </div>

                        {/* Location */}
                        {originalData.location && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Location</h4>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin size={16} className="text-blue-600" />
                                    <span>{originalData.location}</span>
                                </div>
                            </div>
                        )}

                        {/* Map Link */}
                        <button
                            onClick={() =>
                                window.open(
                                    `https://www.google.com/maps?q=${originalData.latitude},${originalData.longitude}`,
                                    "_blank"
                                )
                            }
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
                        >
                            <MapPin size={16} /> View on Google Maps
                        </button>
                    </div>

                    {/* RIGHT SIDE - Edit Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Job Information</h2>

                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Job Title *</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Enter job title"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Subcategory</label>
                                <select
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select Subcategory</option>
                                    {allSubcategories.map((sub, i) => (
                                        <option key={i} value={sub.name}>
                                            {sub.icon} {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Description *</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Enter job description"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Price</label>
                                <input
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g., $50/hour"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Enter location"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />

                                {formData.images.length > 0 && (
                                    <div className="flex flex-wrap mt-4 gap-3">
                                        {formData.images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative w-24 h-24 border-2 border-gray-200 rounded-xl overflow-hidden group"
                                            >
                                                <img
                                                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                                    alt="Job"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition mt-6"
                            >
                                {isSubmitting ? "Updating Job..." : "Update Job"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateJob;