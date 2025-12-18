import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import VoiceService from "../services/voiceService";
import { VoiceRecognitionResult } from "../types/search.types";
import VoiceIcon from "../assets/icons/Voice.png";
import CategoriesData from "../components/data/Categories.json";
import SubCategoriesData from "../components/data/SubCategories.json";

// Import new components
import ProfilePhotoUpload from "../components/WorkerProfile/ProfilePhotoUpload";
import VoiceInputField from "../components/WorkerProfile/VoiceInputField";
import CategorySelector from "../components/WorkerProfile/CategorySelector";
import ServiceChargesSection from "../components/WorkerProfile/ServiceCharges";
import LocationSection from "../components/WorkerProfile/LocationSection";
import AvailabilitySection from "../components/WorkerProfile/AvailabilitySection";
import WorkImagesUpload from "../components/WorkerProfile/WorkImagesUpload";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");

    // Location State
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Service Charges State
    const [chargeType, setChargeType] = useState<"hourly" | "daily" | "fixed">("hourly");
    const [chargeAmount, setChargeAmount] = useState("");

    // Availability State
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTo, setAvailableTo] = useState("");
    const [workingDays, setWorkingDays] = useState<string[]>([]);

    // Category State
    const [selectedCategory, setSelectedCategory] = useState<number | "">("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    // Media State
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [workImages, setWorkImages] = useState<string[]>([]);

    // Voice State
    const [isListening, setIsListening] = useState<VoiceField>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [voiceService] = useState(() => VoiceService.getInstance());
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);

    const categories: Category[] = CategoriesData.categories;
    const subcategories: SubcategoryGroup[] = SubCategoriesData.subcategories;

    // Get subcategories for selected category
    const availableSubcategories = selectedCategory
        ? subcategories.find((sub) => sub.categoryId === selectedCategory)?.items || []
        : [];

    useEffect(() => {
        setIsVoiceSupported(voiceService.isSpeechRecognitionSupported());
    }, [voiceService]);

    // Voice Recognition Handlers
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
            setVoiceError(t("welcome.voiceNotSupported"));
            return;
        }
        setIsListening(field);
        voiceService.startListening(handleVoiceResult(field), handleVoiceError);
    };

    const stopListening = () => {
        voiceService.stopListening();
        setIsListening(null);
    };

    // Media Upload Handlers
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhoto(reader.result as string);
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

    // Category Handlers
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === "" ? "" : parseInt(e.target.value);
        setSelectedCategory(value);
        setSelectedSubcategory("");
    };

    // Availability Handlers
    const toggleWorkingDay = (day: string) => {
        setWorkingDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = () => {
        const profileData = {
            fullName,
            email,
            bio,
            skills,
            location: { address, city, state, pincode },
            serviceCharges: { type: chargeType, amount: chargeAmount },
            availability: { from: availableFrom, to: availableTo, workingDays },
            category: selectedCategory,
            subcategory: selectedSubcategory,
            profilePhoto,
            workImages,
        };

        console.log("Profile Data:", profileData);

        // ✅ Navigate to Service Marketplace
        navigate("/service-marketplace");
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
                        {t("workerProfile.title")}
                    </h2>

                    {/* Profile Photo */}
                    <ProfilePhotoUpload
                        profilePhoto={profilePhoto}
                        onPhotoUpload={handlePhotoUpload}
                    />

                    {/* Voice Fill All Button */}
                    <Button
                        onClick={() => startListening("all")}
                        disabled={!isVoiceSupported}
                        variant="gradient-blue"
                        size="lg"
                        className={`w-full mb-6 flex items-center justify-center gap-3 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] ${isListening === "all" ? "animate-pulse" : ""
                            }`}
                    >
                        <img src={VoiceIcon} className="w-5 h-5" alt="Voice" />
                        {t("workerProfile.fillVoice")}
                    </Button>

                    {voiceError && (
                        <p className={`${typography.form.error} mb-4`}>{voiceError}</p>
                    )}

                    {/* Basic Info Fields */}
                    <VoiceInputField
                        label={t("workerProfile.fullName")}
                        value={fullName}
                        onChange={setFullName}
                        onVoiceClick={() => startListening("fullName")}
                        isListening={isListening === "fullName"}
                        placeholder={t("workerProfile.fullNamePlaceholder")}
                        required
                    />

                    <VoiceInputField
                        label={t("workerProfile.email")}
                        value={email}
                        onChange={setEmail}
                        onVoiceClick={() => startListening("email")}
                        isListening={isListening === "email"}
                        placeholder="your@email.com"
                        type="email"
                    />

                    {/* Category Selection */}
                    <CategorySelector
                        categories={categories}
                        subcategories={availableSubcategories}
                        selectedCategory={selectedCategory}
                        selectedSubcategory={selectedSubcategory}
                        onCategoryChange={handleCategoryChange}
                        onSubcategoryChange={setSelectedSubcategory}
                    />

                    {/* Skills */}
                    <VoiceInputField
                        label={t("workerProfile.skills")}
                        value={skills}
                        onChange={setSkills}
                        onVoiceClick={() => startListening("skills")}
                        isListening={isListening === "skills"}
                        placeholder={t("workerProfile.skillsPlaceholder")}
                    />

                    {/* Service Charges */}
                    <ServiceChargesSection
                        chargeType={chargeType}
                        chargeAmount={chargeAmount}
                        onChargeTypeChange={setChargeType}
                        onChargeAmountChange={setChargeAmount}
                        onVoiceClick={() => startListening("serviceCharges")}
                        isListening={isListening === "serviceCharges"}
                    />

                    {/* Bio */}
                    <div className="mb-6">
                        <label className={typography.form.label}>{t("workerProfile.bio")}</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-[#0B0E92] focus:outline-none"
                            placeholder={t("workerProfile.bioPlaceholder")}
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => startListening("bio")}
                            className={`mt-3 flex gap-2 ${isListening === "bio" ? "animate-pulse" : ""
                                }`}
                        >
                            <img src={VoiceIcon} className="w-4 h-4" alt="Voice" />
                            {t("workerProfile.speakBio")}
                        </Button>
                    </div>

                    {/* Work Images */}
                    <WorkImagesUpload
                        workImages={workImages}
                        onImagesUpload={handleWorkImagesUpload}
                        onRemoveImage={removeWorkImage}
                    />

                    {/* Location */}
                    <LocationSection
                        address={address}
                        city={city}
                        state={state}
                        pincode={pincode}
                        onAddressChange={setAddress}
                        onCityChange={setCity}
                        onStateChange={setState}
                        onPincodeChange={setPincode}
                        onAddressVoice={() => startListening("location")}
                        onCityVoice={() => startListening("city")}
                        isAddressListening={isListening === "location"}
                        isCityListening={isListening === "city"}
                    />

                    {/* Availability */}
                    <AvailabilitySection
                        availableFrom={availableFrom}
                        availableTo={availableTo}
                        workingDays={workingDays}
                        onAvailableFromChange={setAvailableFrom}
                        onAvailableToChange={setAvailableTo}
                        onToggleWorkingDay={toggleWorkingDay}
                    />

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        size="xl"
                        fullWidth
                        className="rounded-2xl bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white hover:opacity-90 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {t("workerProfile.saveContinue")}
                    </Button>

                    {!isFormValid && (
                        <p className="text-center text-sm text-red-500 mt-3">
                            {t("workerProfile.validationError")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerProfileScreen;