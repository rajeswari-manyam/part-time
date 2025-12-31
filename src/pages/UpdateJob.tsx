import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL, updateJob, getJobById } from "../services/api.service";

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
    const subcategoryGroups: SubCategoryGroup[] =
        SubCategoriesData.subcategories || [];
    const allSubcategories: SubCategory[] = subcategoryGroups.flatMap(
        (group) => group.items
    );

    useEffect(() => {
        if (!jobId) return;

        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await getJobById(jobId);
                if (res.success && res.job) {
                    const job = res.job;

                    // Include URLs in images array
                    const images = job.images?.map((img: string) =>
                        img.startsWith("http") ? img : `${API_BASE_URL}/${img}`
                    ) || [];

                    setFormData({
                        _id: job._id,
                        title: job.title,
                        category: job.category,
                        subcategory: job.subcategory || "",
                        description: job.description,
                        price: job.price || "",
                        location: job.location || "",
                        images: images, // <-- existing images
                        latitude: job.latitude,
                        longitude: job.longitude,
                    });
                } else {
                    alert("Failed to load job data");
                }
            } catch (err) {
                console.error("Fetch job error:", err);
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

    /* ================= SUBMIT DYNAMIC UPDATE ================= */
    const handleSubmit = async () => {
        if (!formData.title || !formData.category || !formData.description) {
            alert("Title, category and description are required");
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare payload dynamically
            const payload: any = { ...formData };

            // Only include images that are File objects (skip URLs)
            payload.images = formData.images.filter((img) => img instanceof File);

            const response = await updateJob(jobId!, payload);

            if (response.success) {
                alert("Job updated successfully!");
                navigate(`/listed-jobs/${jobId}`);
            } else {
                alert(response.message || "Failed to update job");
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
                <p>Loading job data...</p>
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 top-0 p-3 rounded-full hover:bg-gray-200"
                >
                    <ArrowLeft size={24} />
                </button>

                <h1 className="text-2xl font-bold text-center mb-8">Update Job</h1>

                <div className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                        <label className="block text-sm font-medium mb-1">Subcategory</label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                        {formData.images.length > 0 && (
                            <div className="flex flex-wrap mt-2 gap-2">
                                {formData.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative w-20 h-20 border rounded overflow-hidden"
                                    >
                                        {typeof img === "string" ? (
                                            <img
                                                src={`${API_BASE_URL}/${img}`}
                                                alt="Job"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt="Job"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
                    >
                        {isSubmitting ? "Updating Job..." : "Update Job"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UpdateJob;
