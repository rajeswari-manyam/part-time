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

  jobType: "FULL_TIME" | "PART_TIME"; // ✅ NEW
  servicecharges: string;

  startDate: string; // ✅ NEW (ISO date string)
  endDate: string;   // ✅ NEW

  description: string;

  area: string;
  city: string;
  state: string;
  pincode: string;

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
const reverseGeocode = async (lat: number, lng: number) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  return res.json();
};

    // Logged-in user
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [formData, setFormData] = useState<FormData>({
  title: "",
  category: "",
  subcategory: "",

  jobType: "FULL_TIME", // default
  servicecharges: "",

  startDate: "",
  endDate: "",

  description: "",

  area: "",
  city: "",
  state: "",
  pincode: "",

  images: [],
  latitude: undefined,
  longitude: undefined,
});

    const [isSubmitting, setIsSubmitting] = useState(false);
const handleUseCurrentLocation = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const data = await reverseGeocode(latitude, longitude);

        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          area:
            data.address.suburb ||
            data.address.neighbourhood ||
            "",
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
        }));
      } catch (err) {
        alert("Failed to fetch address");
      }
    },
    () => alert("Location permission denied")
  );
};

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
                console.log("Navigating to job:", jobId);

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
                   {/* JOB TYPE */}
<div>
  <label className="block text-sm font-medium mb-1">
    Job Type *
  </label>
  <select
    name="jobType"
    value={formData.jobType}
    onChange={handleInputChange}
    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    required
  >
    <option value="FULL_TIME">Full Time</option>
    <option value="PART_TIME">Part Time</option>
  </select>
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

                 {/* SERVICE CHARGES */}
<div>
  <label className="block text-sm font-medium mb-1">
    Service Charges (₹) *
  </label>
  <input
    name="servicecharges"
    type="number"
    placeholder="e.g., 2000"
    value={formData.servicecharges}
    onChange={handleInputChange}
    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
    required
  />
</div>


{/* DATE RANGE */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">
      Start Date *
    </label>
    <input
      type="date"
      name="startDate"
      value={formData.startDate}
      onChange={handleInputChange}
      className="w-full p-3 border rounded-xl"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      End Date *
    </label>
    <input
      type="date"
      name="endDate"
      value={formData.endDate}
      onChange={handleInputChange}
      className="w-full p-3 border rounded-xl"
      required
    />
  </div>
</div>


                {/* LOCATION DETAILS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-1">Area *</label>
    <input
      name="area"
      placeholder="e.g., Madhapur"
      value={formData.area}
      onChange={handleInputChange}
      className="w-full p-3 border rounded-xl"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">City *</label>
    <input
      name="city"
      placeholder="e.g., Hyderabad"
      value={formData.city}
      onChange={handleInputChange}
      className="w-full p-3 border rounded-xl"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">State *</label>
    <input
      name="state"
      placeholder="e.g., Telangana"
      value={formData.state}
      onChange={handleInputChange}
      className="w-full p-3 border rounded-xl"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Pincode *</label>
    <input
      name="pincode"
      placeholder="e.g., 500081"
      value={formData.pincode}
      onChange={handleInputChange}
      className="w-full p-3 border rounded-xl"
      required
    />
  </div>
</div>
<div className="flex justify-end">
  <button
    type="button"
    onClick={handleUseCurrentLocation}
    className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
  >
    <img src={locationIcon} className="w-4 h-4" />
    Use Current Location
  </button>
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