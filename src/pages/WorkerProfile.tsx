import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import VoiceService from "../services/voiceService";
import VoiceIcon from "../assets/icons/Voice.png";
import CategoriesData from "../components/data/Categories.json";
import SubCategoriesData from "../components/data/SubCategories.json";

// Import new components
import ProfilePhotoUpload from "../components/WorkerProfile/ProfilePhotoUpload";
import VoiceInputField from "../components/WorkerProfile/VoiceInputField";
import CategorySelector from "../components/WorkerProfile/CategorySelector";
import ServiceChargesSection from "../components/WorkerProfile/ServiceCharges";
import LocationSection from "../components/WorkerProfile/LocationSection";

import WorkImagesUpload from "../components/WorkerProfile/WorkImagesUpload";
import { VoiceRecognitionResult } from "../components/Auth/OtpVerification/types";

// Import API functions
import {
    createWorker,
    CreateWorkerPayload
} from "../services/api.service";

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

    // Get userId from localStorage (assuming you store it after login)
    const [userId] = useState(() => localStorage.getItem("userId") || "");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

    // Location State
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);

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
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [workImages, setWorkImages] = useState<string[]>([]);
    const [workImageFiles, setWorkImageFiles] = useState<File[]>([]);

    // Voice State
    const [isListening, setIsListening] = useState<VoiceField>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [voiceService] = useState(() => VoiceService.getInstance());
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);

    // Loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const categories: Category[] = CategoriesData.categories;
    const subcategories: SubcategoryGroup[] = SubCategoriesData.subcategories;

    // Get subcategories for selected category
    const availableSubcategories = selectedCategory
        ? subcategories.find((sub) => sub.categoryId === selectedCategory)?.items || []
        : [];
    // Convert typed address into lat/lng automatically
    const forwardGeocode = async (
        area: string,
        city: string,
        state: string,
        pincode: string
    ): Promise<{ latitude: number; longitude: number } | null> => {
        try {
            const query = `${area}, ${city}, ${state}, ${pincode}, India`;
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&limit=1`
            );
            const data = await res.json();
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                };
            }
            return null;
        } catch (err) {
            console.error("Forward geocoding error:", err);
            return null;
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setIsGeocodingLoading(true);

                try {
                    // Reverse geocode using OpenStreetMap / Nominatim
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    setAddress(data.address?.suburb || data.address?.neighbourhood || "");
                    setCity(
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        ""
                    );
                    setState(data.address?.state || "");
                    setPincode(data.address?.postcode || "");
                    setLatitude(latitude);
                    setLongitude(longitude);
                } catch (err) {
                    console.error(err);
                    alert("Failed to fetch location details");
                } finally {
                    setIsGeocodingLoading(false);
                }
            },
            () => alert("Location permission denied")
        );
    };
    useEffect(() => {
        const detectLatLng = async () => {
            if (address && city && state && pincode) {
                setIsGeocodingLoading(true);

                const coords = await forwardGeocode(address, city, state, pincode);
                if (coords) {
                    setLatitude(coords.latitude);
                    setLongitude(coords.longitude);
                }

                setIsGeocodingLoading(false);
            }
        };

        const timer = setTimeout(detectLatLng, 1500); // debounce 1.5s
        return () => clearTimeout(timer);
    }, [address, city, state, pincode]);

    useEffect(() => {
        setIsVoiceSupported(voiceService.isSpeechRecognitionSupported());

        // Get user's current location
        getUserLocation();
    }, [voiceService]);

    // Get user's current location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    };

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
            setVoiceError("Voice input is not supported in your browser");
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
            setProfilePhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleWorkImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setWorkImageFiles(prev => [...prev, ...newFiles]);

            const newImages: string[] = [];
            newFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result as string);
                    if (newImages.length === newFiles.length) {
                        setWorkImages((prev) => [...prev, ...newImages]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeWorkImage = (index: number) => {
        setWorkImages((prev) => prev.filter((_, i) => i !== index));
        setWorkImageFiles((prev) => prev.filter((_, i) => i !== index));
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

    // Map chargeType to API format
    const getChargeTypeForAPI = (): "hour" | "day" | "fixed" => {
        if (chargeType === "hourly") return "hour";
        if (chargeType === "daily") return "day";
        return "fixed";
    };

    // Get category name from ID
    const getCategoryName = (categoryId: number | ""): string => {
        if (categoryId === "") return "";
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || "";
    };

    const handleSubmit = async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId || !/^[a-f\d]{24}$/i.test(userId)) {
                alert("Session expired. Please login again.");
                localStorage.clear();
                navigate("/login");
                return;
            }

            if (!fullName || !selectedCategory || !selectedSubcategory || !chargeAmount) {
                alert("Please fill all required fields");
                return;
            }

            setIsSubmitting(true);
            setSubmitError(null);

            const payload: CreateWorkerPayload = {
                userId, // ✅ CORRECT
                name: fullName.trim(),
                email: email || undefined,
                category: getCategoryName(selectedCategory),
                subCategories: selectedSubcategory,
                skills: skills || undefined,
                bio: bio || undefined,
                serviceCharge: Number(chargeAmount),
                chargeType: getChargeTypeForAPI(),

                area: address,        // ✅ REQUIRED
                city,
                state,
                pincode,

                latitude,
                longitude,

                images: workImageFiles.length ? workImageFiles : undefined,
                profilePic: profilePhotoFile || undefined,
            };

            console.log("📤 Creating worker:", payload);

            const response = await createWorker(payload);

            if (response.success) {
                alert("Worker profile created successfully 🎉");
                navigate("/worker-dashboard");
            } else {
                setSubmitError(response.message || "Failed to create worker profile");
            }
        } catch (error: any) {
            console.error(error);
            setSubmitError(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        fullName.trim() !== "" &&
        selectedCategory !== "" &&
        selectedSubcategory !== "" &&
        chargeAmount.trim() !== "" &&
        !isSubmitting;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-6">
                    <h2 className={`${typography.heading.h3} text-gray-800 mb-6`}>
                        Create Worker Profile
                    </h2>

                    {submitError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{submitError}</p>
                        </div>
                    )}


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
                        Fill with Voice
                    </Button>

                    {voiceError && (
                        <p className={`${typography.form.error} mb-4`}>{voiceError}</p>
                    )}

                    {/* Basic Info Fields */}
                    <VoiceInputField
                        label="Full Name *"
                        value={fullName}
                        onChange={setFullName}
                        onVoiceClick={() => startListening("fullName")}
                        isListening={isListening === "fullName"}
                        placeholder="Enter your full name"
                        required
                    />

                    <VoiceInputField
                        label="Email"
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
                        label="Skills"
                        value={skills}
                        onChange={setSkills}
                        onVoiceClick={() => startListening("skills")}
                        isListening={isListening === "skills"}
                        placeholder="e.g., Wiring, Switch Boards, Maintenance"
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
                        <label className={typography.form.label}>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-[#0B0E92] focus:outline-none"
                            placeholder="Tell clients about your experience and expertise"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => startListening("bio")}
                            className={`mt-3 flex gap-2 ${isListening === "bio" ? "animate-pulse" : ""
                                }`}
                        >
                            <img src={VoiceIcon} className="w-4 h-4" alt="Voice" />
                            Speak Bio
                        </Button>
                    </div>

                    {/* Work Images */}
                    <WorkImagesUpload
                        workImages={workImages}
                        onImagesUpload={handleWorkImagesUpload}
                        onRemoveImage={removeWorkImage}
                    />
                    <LocationSection
                        address={address}
                        city={city}
                        state={state}
                        pincode={pincode}
                        latitude={latitude}
                        longitude={longitude}
                        isGeocodingLoading={isGeocodingLoading}

                        onAddressChange={setAddress}
                        onCityChange={setCity}
                        onStateChange={setState}
                        onPincodeChange={setPincode}

                        onAddressVoice={() => startListening("location")}
                        onCityVoice={() => startListening("city")}
                        onUseCurrentLocation={handleUseCurrentLocation}

                        isAddressListening={isListening === "location"}
                        isCityListening={isListening === "city"}
                    />



                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        size="xl"
                        fullWidth
                        className="rounded-2xl bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white hover:opacity-90 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isSubmitting ? "Creating Profile..." : "Save & Continue"}
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default WorkerProfileScreen;