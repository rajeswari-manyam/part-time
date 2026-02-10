import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import { MoreVertical, MapPin, Loader } from "lucide-react";
import { getNearbyBeautyWorkers } from "../services/Beauty.Service.service";

// Import beauty/wellness card components
import NearbyBeautyCard from "../components/cards/Beauty/NearByBeauty";
import NearbyFitnessCard from "../components/cards/Beauty/NearByFittness";
import NearbyMakeupCard from "../components/cards/Beauty/NearByMackup";
import NearbySalonCard from "../components/cards/Beauty/NearSaloane";
import NearbySpaServiceCard from "../components/cards/Beauty/NearbySpaServiceCard";
import NearbyYogaCard from "../components/cards/Beauty/NearbyYogaCard";
import NearbyTattooCard from "../components/cards/Beauty/NearTatoo";
import NearbyMehendiCard from "../components/cards/Beauty/NearByMehende";
import NearbySkinClinicCard from "../components/cards/Beauty/NearBySkinClik";

export interface BeautyServiceType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    serviceData?: {
        status: boolean;
        pincode: string;
        icon: string;
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        phone?: string;
        photos?: string[];
        price_range?: string;
        services?: string[];
        special_tags?: string[];
        years_in_business?: number;
    };
}

interface UserLocation {
    latitude: number;
    longitude: number;
}

// ============================================================================
// SUBCATEGORY -> CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "beauty-parlour" | "fitness" | "makeup" | "salon"
    | "spa" | "yoga" | "tattoo" | "mehendi" | "skin-clinic";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    "beauty-parlour": NearbyBeautyCard,
    "fitness": NearbyFitnessCard,
    "makeup": NearbyMakeupCard,
    "salon": NearbySalonCard,
    "spa": NearbySpaServiceCard,
    "yoga": NearbyYogaCard,
    "tattoo": NearbyTattooCard,
    "mehendi": NearbyMehendiCard,
    "skin-clinic": NearbySkinClinicCard,
};

// ============================================================================
// ACTION DROPDOWN COMPONENT
// ============================================================================
const ActionDropdown: React.FC<{
    serviceId: string;
    onEdit: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ serviceId, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-white/80 bg-white/60 backdrop-blur-sm rounded-full transition shadow-sm"
                aria-label="More options"
            >
                <MoreVertical size={18} className="text-gray-700" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-20">
                        <button
                            onClick={(e) => {
                                onEdit(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition"
                        >
                            ✏️ Edit
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={(e) => {
                                onDelete(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const BeautyServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<BeautyServiceType[]>([]);
    const [nearbyServices, setNearbyServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingNearby, setLoadingNearby] = useState(false);
    const [error, setError] = useState("");
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationError, setLocationError] = useState("");
    const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");

    // ============================================================================
    // LOCATION DETECTION
    // ============================================================================
    useEffect(() => {
        detectUserLocation();
    }, []);

    const detectUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setLocationPermission("denied");
            return;
        }

        setLoadingNearby(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setUserLocation(location);
                setLocationPermission("granted");
                setLocationError("");
                console.log("📍 Location detected:", location);
            },
            (error) => {
                console.error("Location error:", error);
                setLocationPermission("denied");
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Location access denied. Please enable location permissions.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Location information unavailable.");
                        break;
                    case error.TIMEOUT:
                        setLocationError("Location request timed out.");
                        break;
                    default:
                        setLocationError("An unknown error occurred while getting location.");
                }
                setLoadingNearby(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // ============================================================================
    // FETCH NEARBY SERVICES WHEN LOCATION IS AVAILABLE
    // ============================================================================
    useEffect(() => {
        if (userLocation && shouldShowNearbyCards()) {
            fetchNearbyServices();
        }
    }, [userLocation, subcategory]);

    const fetchNearbyServices = async () => {
        if (!userLocation) return;

        setLoadingNearby(true);
        try {
            const distance = 10; // 10 km radius
            const response = await getNearbyBeautyWorkers(
                userLocation.latitude,
                userLocation.longitude,
                distance
            );

            console.log("📊 Nearby API Response:", response);

            if (response.success && response.data) {
                // Filter by subcategory if needed
                let filteredData = response.data;

                if (subcategory) {
                    const normalized = normalizeSubcategory(subcategory);
                    filteredData = response.data.filter((worker: any) => {
                        const category = worker.category?.toLowerCase() || "";
                        const services = worker.services?.map((s: string) => s.toLowerCase()) || [];

                        return matchesSubcategory(normalized, category, services);
                    });
                }

                setNearbyServices(filteredData);
                console.log(`✅ Loaded ${filteredData.length} nearby services`);
            } else {
                setNearbyServices([]);
            }
        } catch (err) {
            console.error("Error fetching nearby services:", err);
            setNearbyServices([]);
        } finally {
            setLoadingNearby(false);
        }
    };

    // Helper to match subcategory with worker data
    const matchesSubcategory = (normalized: string, category: string, services: string[]): boolean => {
        // Check category match
        if (category.includes(normalized)) return true;

        // Check services match
        const serviceMatch = services.some(service => {
            if (normalized.includes("beauty") && service.includes("beauty")) return true;
            if (normalized.includes("fitness") && service.includes("fitness")) return true;
            if (normalized.includes("makeup") && service.includes("makeup")) return true;
            if (normalized.includes("salon") && service.includes("salon")) return true;
            if (normalized.includes("spa") && service.includes("spa")) return true;
            if (normalized.includes("yoga") && service.includes("yoga")) return true;
            if (normalized.includes("tattoo") && service.includes("tattoo")) return true;
            if (normalized.includes("mehendi") && service.includes("mehendi")) return true;
            if (normalized.includes("skin") && service.includes("skin")) return true;
            return false;
        });

        return serviceMatch;
    };

    // -- navigation helpers -------------------------------------------------
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing beauty service details:", id);
        navigate(`/beauty-services/details/${id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-beauty-service-form/${id}`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            setServices((prev) => prev.filter((s) => s.id !== id));
            alert("Service deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete service");
        }
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-beauty-service-form?subcategory=${subcategory}`
                : "/add-beauty-service-form"
        );
    };

    const handleRetryLocation = () => {
        setLocationError("");
        detectUserLocation();
    };

    // -- display helpers ----------------------------------------------------
    const getDisplayTitle = () => {
        if (!subcategory) return "All Beauty & Wellness Services";
        return subcategory
            .split("-")
            .map((w) => (w === "&" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
            .join(" ");
    };

    // ✅ Normalize subcategory to handle different route formats
    const normalizeSubcategory = (sub: string | undefined): string => {
        if (!sub) return "";
        const normalized = sub.toLowerCase();
        console.log("📍 Raw subcategory:", sub);
        console.log("📍 Normalized subcategory:", normalized);
        return normalized;
    };

    // ✅ Smart matching function to handle route variations
    const getCardComponentForSubcategory = (
        subcategory: string | undefined
    ): React.ComponentType<any> | null => {
        if (!subcategory) return null;

        const normalized = normalizeSubcategory(subcategory);

        // BEAUTY PARLOUR MATCHING
        if (
            (normalized.includes("beauty") && normalized.includes("parlour")) ||
            normalized.includes("beautyparlour") ||
            normalized.includes("beautician")
        ) {
            console.log("✅ Matched to NearbyBeautyCard");
            return NearbyBeautyCard;
        }

        // FITNESS MATCHING
        if (normalized.includes("fitness") || normalized.includes("gym")) {
            console.log("✅ Matched to NearbyFitnessCard");
            return NearbyFitnessCard;
        }

        // MAKEUP MATCHING
        if (normalized.includes("makeup") || normalized.includes("make-up")) {
            console.log("✅ Matched to NearbyMakeupCard");
            return NearbyMakeupCard;
        }

        // SALON MATCHING
        if (
            normalized.includes("salon") ||
            normalized.includes("saloon") ||
            normalized.includes("hair")
        ) {
            console.log("✅ Matched to NearbySalonCard");
            return NearbySalonCard;
        }

        // SPA MATCHING
        if (normalized.includes("spa") || normalized.includes("massage")) {
            console.log("✅ Matched to NearbySpaServiceCard");
            return NearbySpaServiceCard;
        }

        // YOGA MATCHING
        if (normalized.includes("yoga")) {
            console.log("✅ Matched to NearbyYogaCard");
            return NearbyYogaCard;
        }

        // TATTOO MATCHING
        if (normalized.includes("tattoo")) {
            console.log("✅ Matched to NearbyTattooCard");
            return NearbyTattooCard;
        }

        // MEHENDI MATCHING
        if (normalized.includes("mehendi") || normalized.includes("mehndi")) {
            console.log("✅ Matched to NearbyMehendiCard");
            return NearbyMehendiCard;
        }

        // SKIN CLINIC MATCHING
        if (
            (normalized.includes("skin") && normalized.includes("clinic")) ||
            normalized.includes("dermatologist") ||
            normalized.includes("skincare")
        ) {
            console.log("✅ Matched to NearbySkinClinicCard");
            return NearbySkinClinicCard;
        }

        console.warn(`⚠️ No matching card component for: "${subcategory}"`);
        return null;
    };

    // Helper function to check if subcategory should show nearby cards
    const shouldShowNearbyCards = (): boolean => {
        if (!subcategory) return false;

        const normalized = normalizeSubcategory(subcategory);

        const keywords = [
            "beauty",
            "parlour",
            "fitness",
            "gym",
            "makeup",
            "salon",
            "spa",
            "massage",
            "yoga",
            "tattoo",
            "mehendi",
            "mehndi",
            "skin",
            "clinic",
            "dermatologist",
            "skincare",
            "hair",
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

        return hasMatch;
    };

    // Render nearby cards with API data
    const renderNearbyCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        return (
            <div className="space-y-8">
                {/* Location Status Banner */}
                {locationError && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <MapPin className="text-amber-600 mt-0.5 shrink-0" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-amber-800 font-medium mb-2">{locationError}</p>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleRetryLocation}
                                className="text-xs"
                            >
                                🔄 Retry Location
                            </Button>
                        </div>
                    </div>
                )}

                {userLocation && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                        <MapPin className="text-green-600" size={18} />
                        <span className="text-sm text-green-800 font-medium">
                            Location detected • Showing nearby services
                        </span>
                    </div>
                )}

                {/* Nearby Services from API */}
                <div>
                    <h2 className={`${typography.heading.h4} text-gray-800 mb-4 sm:mb-6 flex items-center gap-2`}>
                        <span className="shrink-0">💆</span>
                        <span className="truncate">Nearby {getDisplayTitle()}</span>
                        {loadingNearby && <Loader className="animate-spin text-rose-500" size={20} />}
                    </h2>

                    {loadingNearby ? (
                        <div className="text-center py-12">
                            <Loader className="animate-spin text-rose-500 mx-auto mb-4" size={40} />
                            <p className="text-gray-600">Finding nearby services...</p>
                        </div>
                    ) : nearbyServices.length > 0 ? (
                        <CardComponent
                            nearbyData={nearbyServices}
                            onViewDetails={handleView}
                            userLocation={userLocation}
                        />
                    ) : userLocation ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <div className="text-5xl mb-3">🔍</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                No Nearby Services Found
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Try expanding your search radius or check back later
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <MapPin className="mx-auto text-gray-400 mb-3" size={48} />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Enable Location
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Allow location access to see nearby services
                            </p>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleRetryLocation}
                            >
                                📍 Enable Location
                            </Button>
                        </div>
                    )}
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                💆 Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <CardComponent
                                        job={service}
                                        onViewDetails={handleView}
                                        userLocation={userLocation}
                                    />
                                    <div className="absolute top-3 right-3 z-10">
                                        <ActionDropdown
                                            serviceId={service.id}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    // ============================================================================
    // LOADING
    // ============================================================================
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-lg font-light text-gray-600 tracking-wide">Loading services...</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className={`${typography.heading.h3} text-gray-800 tracking-tight mb-2`}>
                            {getDisplayTitle()}
                        </h1>
                        <p className={`${typography.body.small} text-gray-500 font-light tracking-wide`}>
                            Manage your beauty & wellness services
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center"
                    >
                        <span className="text-lg mr-2">✨</span>
                        Add Post
                    </Button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <span className={typography.body.small}>{error}</span>
                    </div>
                )}

                {/* Content Rendering */}
                {shouldShowNearbyCards() ? (
                    // Render nearby cards with API data
                    renderNearbyCardsSection()
                ) : (
                    // Regular display for other subcategories or no subcategory
                    <>
                        {services.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">💆</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    No Services Found
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to add a service in this category!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="relative group bg-white rounded-xl border border-gray-200 hover:border-rose-500 hover:shadow-lg transition cursor-pointer overflow-hidden"
                                        onClick={() => handleView(service)}
                                    >
                                        {/* Dropdown */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <ActionDropdown
                                                serviceId={service.id}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </div>

                                        {/* Service Badge */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                            <span>{service.serviceData?.icon || "💆"}</span>
                                            <span>{service.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-rose-50 to-pink-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {service.serviceData?.icon || "💆"}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                {service.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {service.location}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {service.serviceData?.pincode && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">📍</span>
                                                    <span className="text-gray-700">
                                                        Pincode: {service.serviceData.pincode}
                                                    </span>
                                                </div>
                                            )}

                                            {service.serviceData?.status !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${service.serviceData.status
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <span className="mr-1">
                                                            {service.serviceData.status ? "✓" : "✗"}
                                                        </span>
                                                        {service.serviceData.status ? "Available" : "Busy"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BeautyServicesList;