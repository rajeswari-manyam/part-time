import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import VoiceIcon from "../assets/icons/Voice.png";
import locationIcon from "../assets/icons/Location.png";

import CategoriesData from "../data/categories.json";
import SubCategoriesData from "../data/subcategories.json";

import VoiceService from "../services/voiceService";
import { createJob, CreateJobPayload } from "../services/api.service";

/* ================= TYPES ================= */
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

interface FormData {
    title: string;
    category: string;
    subcategory: string;
    price: string;
    location: string;
    description: string;
    images: File[];
    latitude?: number;
    longitude?: number;
}

/* ================= DATA ================= */
const categories: Category[] = CategoriesData.categories;
const subcategoryGroups: SubCategoryGroup[] = SubCategoriesData.subcategories || [];
const allSubcategories: SubCategory[] = subcategoryGroups.flatMap((group) => group.items);

/* ================= COMPONENT ================= */
const UserProfile: React.FC = () => {
    const navigate = useNavigate();

    // Logged-in user
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [formData, setFormData] = useState<FormData>({
        title: "",
        category: "",
        subcategory: "",
        price: "",
        location: "",
        description: "",
        images: [],
        latitude: undefined,
        longitude: undefined,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ================= LOCATION ================= */
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }));
            },
            (err) => console.error("Location error:", err)
        );
    }, []);

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
            images: Array.from(files),
        }));
    };

    const handleVoiceClickFor = (field: keyof FormData) => () => {
        const voiceService = VoiceService.getInstance();

        if (!voiceService.isSpeechRecognitionSupported()) {
            alert("Speech recognition not supported");
            return;
        }

        voiceService.startListening(
            (result) => {
                setFormData((prev) => ({
                    ...prev,
                    [field]: `${prev[field] || ""} ${result.transcript}`,
                }));
            },
            (error) => alert(error)
        );
    };

    /* ================= VALIDATION ================= */
    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            alert("Please enter a job title");
            return false;
        }

        if (!formData.category) {
            alert("Please select a category");
            return false;
        }

        if (!formData.description.trim()) {
            alert("Please enter a description");
            return false;
        }

        if (!formData.latitude || !formData.longitude) {
            alert("Location is required. Please enable location access.");
            return false;
        }

        if (!user?._id) {
            alert("User not logged in. Please log in first.");
            return false;
        }

        return true;
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // ✅ FIX: Ensure category is sent as string (without extra spaces)
            const jobData: CreateJobPayload = {
                userId: user._id,
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(), // ✅ Trim to remove spaces
                latitude: formData.latitude!,
                longitude: formData.longitude!,
                images: formData.images,
            };

            console.log("Submitting job data:", jobData); // Debug log

            const response = await createJob(jobData);

            console.log("API Response:", response); // Debug log

            if (response.success && response.data?._id) {
                const jobId = response.data._id;
                console.log("Navigating to job:", jobId); // Debug log

                // Small delay to ensure backend is ready
                setTimeout(() => {
                    navigate(`/listed-jobs/${jobId}`);
                }, 500);
            } else {
                alert(response.message || "Job created but couldn't redirect");
                navigate("/jobs");
            }
        } catch (error: any) {
            console.error("Error creating job:", error);
            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to create job. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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

                <h1 className="text-3xl font-bold text-center mb-8">
                    Post a Job
                </h1>

                <div className="space-y-5">
                    {/* TITLE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Job Title *
                        </label>
                        <input
                            name="title"
                            placeholder="e.g., Fix leaking kitchen sink"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SUBCATEGORY */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Subcategory
                        </label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select Subcategory (Optional)</option>
                            {allSubcategories.map((sub, i) => (
                                <option key={i} value={sub.name}>
                                    {sub.icon} {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* PRICE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Budget/Price</label>
                        <div className="relative">
                            <input
                                name="price"
                                placeholder="e.g., ₹500 - ₹1000"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleVoiceClickFor("price")}
                                className="absolute right-3 top-3 hover:opacity-70"
                            >
                                <img src={VoiceIcon} className="w-5 h-5" alt="Voice input" />
                            </button>
                        </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Location *</label>
                        <div className="relative">
                            <input
                                name="location"
                                placeholder="Your location (auto-detected)"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <img
                                src={locationIcon}
                                className="w-5 h-5 absolute right-3 top-3"
                                alt="Location"
                            />
                        </div>
                        {formData.latitude && formData.longitude && (
                            <p className="text-xs text-green-600 mt-1">
                                ✓ Location detected: {formData.latitude.toFixed(4)},{" "}
                                {formData.longitude.toFixed(4)}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            placeholder="Describe the job in detail..."
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            required
                        />
                    </div>

                    {/* IMAGES */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Images (Optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {formData.images.length > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                                {formData.images.length} image(s) selected
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
                    >
                        {isSubmitting ? "Creating Job..." : "Submit Job"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;