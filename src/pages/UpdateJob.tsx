import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { API_BASE_URL, updateJob, getJobById } from "../services/api.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import categoriesData from "../data/categories.json";
import subcategoriesData from "../data/subcategories.json";

interface JobData {
    _id: string;
    description: string;
    category: string;
    subcategory?: string;
    jobType?: string;
    servicecharges?: string | number;
    startDate?: string;
    endDate?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
}

const UpdateJob: React.FC = () => {
    const navigate = useNavigate();
    const { jobId } = useParams<{ jobId: string }>();

    const [originalData, setOriginalData] = useState<JobData | null>(null);
    const [formData, setFormData] = useState({
        description: "",
        category: "",
        subcategory: "",
        jobType: "FULL_TIME",
        servicecharges: "",
        startDate: "",
        endDate: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        latitude: 0,
        longitude: 0,
    });
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);

    // Get categories and subcategories
    const categories = categoriesData.categories;
    const subcategories = subcategoriesData.subcategories;

    useEffect(() => {
        if (!jobId) return;

        const fetchJob = async () => {
            try {
                setLoading(true);
                const res = await getJobById(jobId);

                if (res.success && res.data) {
                    const job = res.data;

                    setOriginalData(job);
                    setFormData({
                        description: job.description || "",
                        category: job.category || "",
                        subcategory: job.subcategory || "",
                        jobType: job.jobType || "FULL_TIME",
                        servicecharges: job.servicecharges || "",
                        startDate: job.startDate ? job.startDate.split("T")[0] : "",
                        endDate: job.endDate ? job.endDate.split("T")[0] : "",
                        area: job.area || "",
                        city: job.city || "",
                        state: job.state || "",
                        pincode: job.pincode || "",
                        latitude: job.latitude || 0,
                        longitude: job.longitude || 0,
                    });
                    setExistingImages(job.images || []);

                    // Set filtered subcategories based on loaded category
                    if (job.category) {
                        const selectedCategory = categories.find(cat => cat.name === job.category);
                        if (selectedCategory) {
                            const subList = subcategories.find(sub => sub.categoryId === selectedCategory.id);
                            setFilteredSubcategories(subList?.items || []);
                        }
                    }
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

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const categoryName = e.target.value;
        setFormData((prev) => ({ ...prev, category: categoryName, subcategory: "" }));

        // Find the selected category by name
        const selectedCategory = categories.find(cat => cat.name === categoryName);

        if (selectedCategory) {
            // Find subcategories for this category
            const subList = subcategories.find(sub => sub.categoryId === selectedCategory.id);
            setFilteredSubcategories(subList?.items || []);
        } else {
            setFilteredSubcategories([]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setNewImages((prev) => [...prev, ...Array.from(files)]);
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!jobId) return;

        if (!formData.category || !formData.description) {
            alert("Category and description are required");
            return;
        }

        try {
            setIsSubmitting(true);

            const fd = new FormData();

            // ===== REQUIRED FIELDS =====
            fd.append("jobType", formData.jobType);
            fd.append("description", formData.description);
            fd.append("category", formData.category);
            fd.append("latitude", String(formData.latitude));
            fd.append("longitude", String(formData.longitude));

            // ===== OPTIONAL FIELDS =====
            if (formData.subcategory) fd.append("subcategory", formData.subcategory);
            if (formData.area) fd.append("area", formData.area);
            if (formData.city) fd.append("city", formData.city);
            if (formData.state) fd.append("state", formData.state);
            if (formData.pincode) fd.append("pincode", formData.pincode);
            if (formData.servicecharges)
                fd.append("servicecharges", String(formData.servicecharges));

            // ===== DATE FORMAT (DD-MM-YYYY) =====
            if (formData.startDate) {
                const [y, m, d] = formData.startDate.split("-");
                fd.append("startDate", `${d}-${m}-${y}`);
            }

            if (formData.endDate) {
                const [y, m, d] = formData.endDate.split("-");
                fd.append("endDate", `${d}-${m}-${y}`);
            }

            // ===== IMAGES =====
            newImages.forEach((file) => {
                fd.append("images", file);
            });

            // ===== API CALL =====
            const response = await fetch(
                `${API_BASE_URL}/updateJob/${jobId}`,
                {
                    method: "PUT",
                    body: fd,
                }
            );

            const result = await response.json();

            if (result.success) {
                alert("Job updated successfully!");
                navigate("/listed-jobs");
            } else {
                alert(result.message || "Failed to update job");
            }
        } catch (error) {
            console.error("Update Job Error:", error);
            alert("Something went wrong while updating the job");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (!originalData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className={`${typography.body.large} text-red-600`}>Job not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 sm:p-3 rounded-full hover:bg-gray-200 transition"
                    >
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <h1 className={typography.heading.h3}>Update Job</h1>
                </div>

                {/* Split View Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* LEFT SIDE - Current Job Details */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-fit lg:sticky lg:top-6">
                        <h2 className={`${typography.heading.h5} mb-4 text-gray-800`}>Current Job Details</h2>

                        {/* Images */}
                        {existingImages.length > 0 && (
                            <>
                                <div className="mb-4">
                                    <img
                                        src={`${API_BASE_URL}/${existingImages[selectedImage]}`}
                                        alt="job"
                                        className="w-full h-48 sm:h-64 object-cover rounded-lg sm:rounded-xl"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
                                        }}
                                    />
                                </div>

                                {existingImages.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        {existingImages.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`relative w-full h-16 sm:h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i
                                                    ? "border-blue-500 ring-2 ring-blue-300"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <img
                                                    src={`${API_BASE_URL}/${img}`}
                                                    alt={`thumb-${i}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Details */}
                        <div className="space-y-3">
                            <div>
                                <span className={`${typography.body.small} font-medium text-gray-600`}>Category: </span>
                                <span className={`${typography.body.small} text-gray-800`}>{originalData.category}</span>
                            </div>

                            {originalData.subcategory && (
                                <div>
                                    <span className={`${typography.body.small} font-medium text-gray-600`}>Subcategory: </span>
                                    <span className={`${typography.body.small} text-gray-800`}>{originalData.subcategory}</span>
                                </div>
                            )}

                            {originalData.jobType && (
                                <div>
                                    <span className={`${typography.body.small} font-medium text-gray-600`}>Job Type: </span>
                                    <span className={`${typography.body.small} text-gray-800`}>{originalData.jobType}</span>
                                </div>
                            )}

                            {originalData.servicecharges && (
                                <div>
                                    <span className={`${typography.body.small} font-medium text-gray-600`}>Service Charges: </span>
                                    <span className={`${typography.body.base} font-bold text-green-600`}>₹{originalData.servicecharges}</span>
                                </div>
                            )}

                            <div>
                                <h4 className={`${typography.body.small} font-medium text-gray-600 mb-2`}>Description</h4>
                                <p className={`${typography.body.small} text-gray-700 leading-relaxed`}>{originalData.description}</p>
                            </div>

                            {(originalData.area || originalData.city || originalData.state) && (
                                <div>
                                    <h4 className={`${typography.body.small} font-medium text-gray-600 mb-2`}>Location</h4>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                                        <span className={typography.body.small}>
                                            {[originalData.area, originalData.city, originalData.state, originalData.pincode]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {originalData.latitude && originalData.longitude && (
                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps?q=${originalData.latitude},${originalData.longitude}`,
                                            "_blank"
                                        )
                                    }
                                    className={`w-full mt-4 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2.5 sm:py-3 rounded-lg hover:bg-blue-100 transition ${typography.body.small} font-medium`}
                                >
                                    <MapPin size={16} /> View on Google Maps
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE - Edit Form */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                        <h2 className={`${typography.heading.h5} mb-4 sm:mb-6 text-gray-800`}>Edit Job Information</h2>

                        <div className="space-y-4 sm:space-y-5">
                            {/* Category */}
                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
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
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Subcategory</label>
                                <select
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    disabled={!formData.category || filteredSubcategories.length === 0}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {!formData.category
                                            ? "Select category first"
                                            : filteredSubcategories.length === 0
                                                ? "No subcategories available"
                                                : "Select Subcategory"}
                                    </option>
                                    {filteredSubcategories.map((sub, index) => (
                                        <option key={index} value={sub.name}>
                                            {sub.icon} {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Job Type */}
                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Job Type *</label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                >
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Description *</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none ${typography.form.input}`}
                                    placeholder="Enter job description"
                                />
                            </div>

                            {/* Service Charges */}
                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Service Charges</label>
                                <input
                                    name="servicecharges"
                                    type="number"
                                    value={formData.servicecharges}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                    placeholder="Enter amount"
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Start Date</label>
                                    <input
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block ${typography.form.label} mb-2 text-gray-700`}>End Date</label>
                                    <input
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                    />
                                </div>
                            </div>

                            {/* Location Fields */}
                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Area</label>
                                <input
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                    placeholder="Enter area"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block ${typography.form.label} mb-2 text-gray-700`}>City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div>
                                    <label className={`block ${typography.form.label} mb-2 text-gray-700`}>State</label>
                                    <input
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                        placeholder="Enter state"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Pincode</label>
                                <input
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.form.input}`}
                                    placeholder="Enter pincode"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className={`block ${typography.form.label} mb-2 text-gray-700`}>Add New Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className={`w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${typography.body.small} file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:text-sm file:font-medium`}
                                />

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mt-4">
                                        <p className={`${typography.body.xs} text-gray-600 mb-2`}>Current Images:</p>
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {existingImages.map((img, index) => (
                                                <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden group">
                                                    <img
                                                        src={`${API_BASE_URL}/${img}`}
                                                        alt="Job"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {newImages.length > 0 && (
                                    <div className="mt-4">
                                        <p className={`${typography.body.xs} text-gray-600 mb-2`}>New Images to Upload:</p>
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {newImages.map((img, index) => (
                                                <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24 border-2 border-green-300 rounded-lg sm:rounded-xl overflow-hidden group">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt="New"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full py-3 sm:py-4 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-lg sm:rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition mt-6 ${typography.body.base}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={20} className="animate-spin" />
                                        Updating Job...
                                    </span>
                                ) : (
                                    "Update Job"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateJob;