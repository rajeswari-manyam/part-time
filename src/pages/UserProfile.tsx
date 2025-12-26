import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Back arrow
import VoiceIcon from "../assets/icons/Voice.png";
import Button from "../components/ui/Buttons";
import typography, { combineTypography } from "../styles/typography";
import locationIcon from "../assets/icons/Location.png";
import BudgetIcon from "../assets/icons/Budget.png";

import CategoriesData from "../../src/data/categories.json";
import SubCategoriesData from "../../src/data/subcategories.json";

import VoiceService from "../services/voiceService";

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
    name: string;
    email: string;
    type: string;
    category: string;
    subcategory: string;
    budget: string;
    location: string;
    description: string;
    preferredDates: string[];
    images: File[];
}

const categories: Category[] = CategoriesData.categories;
const subcategoryGroups: SubCategoryGroup[] = SubCategoriesData.subcategories;
const allSubcategories: SubCategory[] = subcategoryGroups.flatMap(
    (group) => group.items
);

const UserProfile: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        type: "",
        category: "",
        subcategory: "",
        budget: "",
        location: "",
        description: "",
        preferredDates: [],
        images: [],
    });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const dates = e.target.value.split(",").map((d) => d.trim());
        setFormData((prev) => ({ ...prev, preferredDates: dates }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormData((prev) => ({ ...prev, images: Array.from(files) }));
        }
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
        alert("Job details submitted!");
        navigate("/matched-workers");
    };

    const handleVoiceClickFor = (fieldName: keyof FormData) => () => {
        const voiceService = VoiceService.getInstance();
        if (!voiceService.isSpeechRecognitionSupported()) {
            alert("Speech recognition not supported in your browser");
            return;
        }

        voiceService.startListening(
            (result) => {
                setFormData((prev) => ({
                    ...prev,
                    [fieldName]: prev[fieldName] + " " + result.transcript,
                }));
            },
            (error) => alert(error)
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto relative">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 top-0 p-3 rounded-full hover:bg-gray-200"
                >
                    <ArrowLeft size={24} />
                </button>

                <h1
                    className={combineTypography(
                        typography.heading.h2,
                        "text-gray-900 mb-8 text-center"
                    )}
                >
                    User Profile
                </h1>

                <div className="space-y-6">
                    {/* Name */}
                    <div className="relative">
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleVoiceClickFor("name")}
                            className="absolute right-3 top-3/4 transform -translate-y-1/2 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] p-2 rounded-full"
                        >
                            <img src={VoiceIcon} alt="Voice" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleVoiceClickFor("email")}
                            className="absolute right-3 top-3/4 transform -translate-y-1/2 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] p-2 rounded-full"
                        >
                            <img src={VoiceIcon} alt="Voice" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Job Type Dropdown */}
                    <div>
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Job Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Job Type</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="project">Project-based</option>
                        </select>
                    </div>

                    {/* Preferred Dates */}
                    <div>
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Preferred Dates (comma separated)
                        </label>
                        <input
                            type="text"
                            name="preferredDates"
                            value={formData.preferredDates.join(", ")}
                            onChange={handleDateChange}
                            placeholder="YYYY-MM-DD, YYYY-MM-DD"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Upload Images */}
                    <div>
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Upload Images
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full text-gray-700"
                        />
                    </div>

                    {/* Service Category */}
                    <div>
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Select Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Choose a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service SubCategory */}
                    <div>
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Select SubCategory
                        </label>
                        <select
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select SubCategory</option>
                            {allSubcategories.map((sub, index) => (
                                <option key={index} value={sub.name}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Budget */}
                    <div className="relative">
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block flex items-center gap-2"
                            )}
                        >
                            <img src={BudgetIcon} alt="Budget" className="w-5 h-5" />
                            Service Charges
                        </label>
                        <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            placeholder="Enter budget"
                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleVoiceClickFor("budget")}
                            className="absolute right-3 top-3/4 transform -translate-y-1/2 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] p-2 rounded-full"
                        >
                            <img src={VoiceIcon} alt="Voice" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Location */}
                    <div className="relative">
                        <label className="flex items-center gap-2 mb-2">
                            <img src={locationIcon} alt="Location" className="w-5 h-5" />
                            Service Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter service address"
                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleVoiceClickFor("location")}
                            className="absolute right-3 top-3/4 transform -translate-y-1/2 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] p-2 rounded-full"
                        >
                            <img src={VoiceIcon} alt="Voice" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Description */}
                    <div className="relative">
                        <label
                            className={combineTypography(
                                typography.form.label,
                                "text-gray-700 mb-2 block"
                            )}
                        >
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={6}
                            placeholder="Describe the work in detail..."
                            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                        <button
                            type="button"
                            onClick={handleVoiceClickFor("description")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] p-2 rounded-full"
                        >
                            <img src={VoiceIcon} alt="Voice" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Submit */}
                    <Button
                        onClick={handleSubmit}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl font-semibold hover:opacity-90 shadow-lg"
                    >
                        Submit Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
