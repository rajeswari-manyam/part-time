import React, { useEffect, useState } from "react";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import VoiceService from "../services/voiceService";
import { VoiceRecognitionResult } from "../types/search.types";
import VoiceIcon from "../assets/icons/Voice.png";
import CategoriesData from "../components/data/Categories.json";
import SubCategoriesData from "../components/data/SubCategories.json";

type VoiceField = "all" | "fullName" | "email" | "bio" | "skills" | "location" | "city" | "serviceCharges" | null;

interface Category {
    id: number;
    name: string;
    icon: string;
}

interface SubcategoryItem {
    name: string;
    icon: string;
}

interface SubcategoryGroup {
    categoryId: number;
    items: SubcategoryItem[];
}

const WorkerProfileScreen: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");

    // Location Fields
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Service Charges
    const [chargeType, setChargeType] = useState<"hourly" | "daily" | "fixed">("hourly");
    const [chargeAmount, setChargeAmount] = useState("");

    // Available Dates
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTo, setAvailableTo] = useState("");
    const [workingDays, setWorkingDays] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [workImages, setWorkImages] = useState<string[]>([]);
    const [isListening, setIsListening] = useState<VoiceField>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    const [voiceService] = useState(() => VoiceService.getInstance());
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);

    const categories: Category[] = CategoriesData.categories;
    const subcategories: SubcategoryGroup[] = SubCategoriesData.subcategories;

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Get subcategories for selected category
    const availableSubcategories = selectedCategory
        ? subcategories.find((sub) => sub.categoryId === selectedCategory)?.items || []
        : [];

    useEffect(() => {
        setIsVoiceSupported(voiceService.isSpeechRecognitionSupported());
    }, [voiceService]);

    const handleVoiceResult = (field: VoiceField) => (result: VoiceRecognitionResult) => {
        if (!result.isFinal) return;

        switch (field) {
            case "fullName":
                setFullName(result.transcript);
                break;
            case "email":
                setEmail(result.transcript.replace(/\s/g, ""));
                break;
            case "bio":
                setBio(prev => `${prev} ${result.transcript}`.trim());
                break;
            case "skills":
                setSkills(prev => `${prev} ${result.transcript}`.trim());
                break;
            case "location":
                setAddress(result.transcript);
                break;
            case "city":
                setCity(result.transcript);
                break;
            case "serviceCharges":
                const numbers = result.transcript.match(/\d+/);
                if (numbers) {
                    setChargeAmount(numbers[0]);
                }
                break;
            case "all":
                setBio(result.transcript);
                break;
        }

        stopListening();
    };

    const handleVoiceError = (message: string) => {
        setVoiceError(message);
        stopListening();
        setTimeout(() => setVoiceError(null), 3000);
    };

    const startListening = (field: VoiceField) => {
        if (!isVoiceSupported) {
            setVoiceError("Voice recognition is not supported in your browser");
            return;
        }

        setIsListening(field);
        voiceService.startListening(
            handleVoiceResult(field),
            handleVoiceError
        );
    };

    const stopListening = () => {
        voiceService.stopListening();
        setIsListening(null);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWorkImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result as string);
                    if (newImages.length === files.length) {
                        setWorkImages((prev) => [...prev, ...newImages]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeWorkImage = (index: number) => {
        setWorkImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === "" ? "" : parseInt(e.target.value);
        setSelectedCategory(value);
        setSelectedSubcategory("");
    };

    const toggleWorkingDay = (day: string) => {
        setWorkingDays((prev) =>
            prev.includes(day)
                ? prev.filter((d) => d !== day)
                : [...prev, day]
        );
    };

    const handleSubmit = () => {
        const profileData = {
            fullName,
            email,
            bio,
            skills,
            location: {
                address,
                city,
                state,
                pincode,
            },
            serviceCharges: {
                type: chargeType,
                amount: chargeAmount,
            },
            availability: {
                from: availableFrom,
                to: availableTo,
                workingDays,
            },
            category: selectedCategory,
            subcategory: selectedSubcategory,
            profilePhoto,
            workImages,
        };
        console.log("Profile Data:", profileData);
        alert("Profile saved successfully!");
    };

    const isFormValid =
        fullName.trim() !== "" &&
        selectedCategory !== "" &&
        selectedSubcategory !== "" &&
        city.trim() !== "" &&
        chargeAmount.trim() !== "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-6">
                    <h2 className={`${typography.heading.h3} text-gray-800 mb-6`}>
                        Create Your Worker Profile
                    </h2>

                    {/* Photo Upload Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center shadow-lg">
                                {profilePhoto ? (
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="w-16 h-16 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                )}
                            </div>
                            {profilePhoto && (
                                <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="photoUpload"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />

                        <label htmlFor="photoUpload">
                            <div className="cursor-pointer px-8 py-3 rounded-full border-2 border-[#0B0E92] text-[#0B0E92] font-semibold hover:bg-blue-50 transition-colors">
                                {profilePhoto ? "Change Photo" : "Upload Photo"}
                            </div>
                        </label>
                    </div>

                    {/* Voice All */}
                    <Button
                        onClick={() => startListening("all")}
                        disabled={!isVoiceSupported}
                        variant="gradient-blue"
                        size="lg"
                        className={`w-full mb-6 flex items-center justify-center gap-3 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "all" ? "animate-pulse" : ""}`}
                    >
                        <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                        Fill profile using voice
                    </Button>

                    {voiceError && (
                        <p className={`${typography.form.error} mb-4`}>
                            {voiceError}
                        </p>
                    )}

                    {/* Full Name */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Full Name *</label>
                        <div className="flex gap-2">
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                placeholder="Your full name"
                            />
                            <Button
                                variant="primary"
                                onClick={() => startListening("fullName")}
                                className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "fullName" ? "animate-pulse" : ""}`}
                            >
                                <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                            </Button>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Email (Optional)</label>
                        <div className="flex gap-2">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                placeholder="your@email.com"
                            />
                            <Button
                                variant="primary"
                                onClick={() => startListening("email")}
                                className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "email" ? "animate-pulse" : ""}`}
                            >
                                <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                            </Button>
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Select Category *</label>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                        >
                            <option value="">Choose a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Dropdown */}
                    {selectedCategory && (
                        <div className="mb-6 animate-fade-in">
                            <label className={typography.form.label}>Select Subcategory *</label>
                            <select
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                            >
                                <option value="">Choose a subcategory</option>
                                {availableSubcategories.map((sub, index) => (
                                    <option key={index} value={sub.name}>
                                        {sub.icon} {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Skills */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Skills & Expertise</label>
                        <div className="flex gap-2">
                            <input
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                placeholder="e.g., Plumbing, AC Repair, 5 years experience"
                            />
                            <Button
                                variant="primary"
                                onClick={() => startListening("skills")}
                                className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "skills" ? "animate-pulse" : ""}`}
                            >
                                <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                            </Button>
                        </div>
                    </div>

                    {/* Service Charges Section */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            💰 Service Charges *
                        </h3>

                        <div className="mb-4">
                            <label className={typography.form.label}>Charge Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setChargeType("hourly")}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${chargeType === "hourly"
                                        ? "bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white"
                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#0B0E92]"
                                        }`}
                                >
                                    Per Hour
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChargeType("daily")}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${chargeType === "daily"
                                        ? "bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white"
                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#0B0E92]"
                                        }`}
                                >
                                    Per Day
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChargeType("fixed")}
                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${chargeType === "fixed"
                                        ? "bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white"
                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#0B0E92]"
                                        }`}
                                >
                                    Fixed
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={typography.form.label}>
                                Amount (₹) *
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={chargeAmount}
                                        onChange={(e) => setChargeAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => startListening("serviceCharges")}
                                    className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "serviceCharges" ? "animate-pulse" : ""}`}
                                >
                                    <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                {chargeType === "hourly" && "Charge per hour of work"}
                                {chargeType === "daily" && "Charge per day of work"}
                                {chargeType === "fixed" && "Fixed charge per project"}
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Bio / Experience</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-[#0B0E92] focus:outline-none"
                            placeholder="Tell us about your experience and services..."
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => startListening("bio")}
                            className={`mt-3 flex gap-2 ${isListening === "bio" ? "animate-pulse" : ""}`}
                        >
                            <img src={VoiceIcon} className="w-4 h-4" alt="Voice" />
                            Speak Bio
                        </Button>
                    </div>

                    {/* Work Images Upload */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Upload Work Images</label>
                        <p className="text-sm text-gray-500 mb-3">Show examples of your work (up to 5 images)</p>

                        <input
                            type="file"
                            id="workImages"
                            accept="image/*"
                            multiple
                            onChange={handleWorkImagesUpload}
                            className="hidden"
                            disabled={workImages.length >= 5}
                        />

                        <label htmlFor="workImages">
                            <div className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0B0E92] transition-colors ${workImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-600 font-medium">
                                    {workImages.length >= 5 ? 'Maximum 5 images reached' : 'Click to upload work images'}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        </label>

                        {/* Display uploaded work images */}
                        {workImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {workImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Work ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            onClick={() => removeWorkImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-green-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            📍 Location Details *
                        </h3>

                        {/* Address */}
                        <div className="mb-4">
                            <label className={typography.form.label}>Street Address</label>
                            <div className="flex gap-2">
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                    placeholder="House/Building, Street"
                                />
                                <Button
                                    variant="primary"
                                    onClick={() => startListening("location")}
                                    className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "location" ? "animate-pulse" : ""}`}
                                >
                                    <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                                </Button>
                            </div>
                        </div>

                        {/* City and State */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={typography.form.label}>City *</label>
                                <div className="flex gap-2">
                                    <input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                        placeholder="City"
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={() => startListening("city")}
                                        className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "city" ? "animate-pulse" : ""}`}
                                    >
                                        <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className={typography.form.label}>State</label>
                                <input
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                    placeholder="State"
                                />
                            </div>
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className={typography.form.label}>Pincode</label>
                            <input
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                placeholder="6-digit pincode"
                                maxLength={6}
                            />
                        </div>
                    </div>

                    {/* Available Dates Section */}
                    <div className="mb-8 p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            📅 Availability
                        </h3>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={typography.form.label}>Available From</label>
                                <input
                                    type="date"
                                    value={availableFrom}
                                    onChange={(e) => setAvailableFrom(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className={typography.form.label}>Available Until</label>
                                <input
                                    type="date"
                                    value={availableTo}
                                    onChange={(e) => setAvailableTo(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B0E92] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Working Days */}
                        <div>
                            <label className={typography.form.label}>Working Days</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {weekDays.map((day) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleWorkingDay(day)}
                                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${workingDays.includes(day)
                                            ? "bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#0B0E92]"
                                            }`}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Select the days you're available to work
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        size="xl"
                        fullWidth
                        className="rounded-2xl bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white hover:opacity-90 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        Save & Continue
                    </Button>

                    {!isFormValid && (
                        <p className="text-center text-sm text-red-500 mt-3">
                            Please fill in all required fields: Name, Category, Subcategory, City, and Service Charges
                        </p>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default WorkerProfileScreen;