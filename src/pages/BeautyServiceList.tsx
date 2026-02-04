import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNearbyBeautyWorkers, BeautyWorker } from "../services/Beauty.Service.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

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
// HELPERS
// ============================================================================

const resolveCardKey = (sub: string | undefined): CardKey | null => {
    if (!sub) return null;
    const n = sub.toLowerCase();

    if ((n.includes("beauty") && n.includes("parlour")) || n.includes("beautyparlour")) return "beauty-parlour";
    if (n.includes("fitness") || n.includes("gym")) return "fitness";
    if (n.includes("makeup") || n.includes("make-up")) return "makeup";
    if (n.includes("salon") || n.includes("saloon") || n.includes("hair")) return "salon";
    if (n.includes("spa") || n.includes("massage")) return "spa";
    if (n.includes("yoga")) return "yoga";
    if (n.includes("tattoo")) return "tattoo";
    if (n.includes("mehendi") || n.includes("mehndi")) return "mehendi";
    if ((n.includes("skin") && n.includes("clinic")) || n.includes("dermatologist") || n.includes("skincare")) return "skin-clinic";

    return null;
};

/**
 * Maps URL subcategory slug -> array of DB category values.
 * Must match beautyCategories[] in BeautyServiceForm exactly.
 */
const getCategoriesFromSubcategory = (subcategory: string | undefined): string[] | undefined => {
    if (!subcategory) return undefined;
    const n = subcategory.toLowerCase();

    if (n.includes("spa") || n.includes("massage")) return ["Spa Therapist", "Massage Therapist"];
    if (n.includes("fitness") || n.includes("gym")) return ["Fitness Trainer"];
    if (n.includes("makeup") || n.includes("make-up")) return ["Makeup Artist"];
    if (n.includes("salon") || n.includes("saloon") || n.includes("hair")) return ["Hair Stylist"];
    if (n.includes("yoga")) return ["Yoga Instructor"];
    if (n.includes("tattoo")) return ["Tattoo Artist"];
    if (n.includes("mehendi") || n.includes("mehndi")) return ["Mehendi Artist"];
    if (n.includes("nail")) return ["Nail Technician"];
    if ((n.includes("skin") && n.includes("clinic")) || n.includes("dermatologist") || n.includes("skincare"))
        return ["Skincare Specialist"];
    if ((n.includes("beauty") && n.includes("parlour")) || n.includes("beautyparlour") || n.includes("beautician"))
        return ["Beautician", "Beauty Parlour"];
    return undefined;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const BeautyServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();
    const mountedRef = useRef(true);

    // -- state --------------------------------------------------------------
    const [nearbyServices, setNearbyServices] = useState<BeautyWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // -- cleanup ref on unmount ---------------------------------------------
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    // -- fetch nearby beauty workers with automatic location ----------------
    const fetchNearbyBeautyWorkers = useCallback(async () => {
        setLoading(true);
        setError("");
        setLocationError("");

        try {
            // Get current location
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation not supported"));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // Cache for 5 minutes
                });
            });

            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            const distance = 10; // 10 km radius

            console.log("Fetching nearby beauty workers with coordinates:", { latitude, longitude, distance });
            const response = await getNearbyBeautyWorkers(latitude, longitude, distance);
            console.log("Nearby beauty workers API response:", response);

            if (!mountedRef.current) return;

            if (response.success) {
                const allServices: BeautyWorker[] = response.data || [];
                console.log("All services fetched:", allServices);

                if (subcategory) {
                    const targetCategories = getCategoriesFromSubcategory(subcategory);
                    if (targetCategories && targetCategories.length > 0) {
                        const lowerTargets = targetCategories.map(c => c.toLowerCase());
                        const filtered = allServices.filter(s =>
                            s.category && lowerTargets.includes(s.category.toLowerCase())
                        );
                        console.log("Filtered for [" + targetCategories.join(", ") + "]:", filtered);
                        setNearbyServices(filtered);
                    } else {
                        setNearbyServices(allServices);
                    }
                } else {
                    setNearbyServices(allServices);
                }
            } else {
                console.warn("API returned success=false:", response);
                setNearbyServices([]);
            }
        } catch (err: any) {
            console.error("fetchNearbyBeautyWorkers error:", err);
            if (mountedRef.current) {
                setLocationError(
                    err.message === "User denied Geolocation"
                        ? "Location access denied. Please enable location services to see nearby services."
                        : err.message || "Failed to get location. Please enable location services."
                );
                setNearbyServices([]);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [subcategory]);

    useEffect(() => {
        console.log("Component mounted/updated. Subcategory:", subcategory);
        fetchNearbyBeautyWorkers();
    }, [fetchNearbyBeautyWorkers]);

    // -- navigation helpers -------------------------------------------------
    const handleView = (id: string) => {
        console.log("Viewing beauty service details:", id);
        navigate(`/beauty-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(subcategory
            ? `/add-beauty-service-form?subcategory=${subcategory}`
            : "/add-beauty-service-form"
        );
    };

    // -- display helpers ----------------------------------------------------
    const getDisplayTitle = () =>
        subcategory
            ? subcategory
                .split("-")
                .map(w => w === "&" ? "&" : w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")
            : "All Beauty & Wellness Services";

    const getCardComponent = (): React.ComponentType<any> | null => {
        if (subcategory) {
            const key = resolveCardKey(subcategory);
            console.log("Card key from subcategory:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        if (nearbyServices.length > 0 && nearbyServices[0].category) {
            const normalized = nearbyServices[0].category.toLowerCase().replace(/\s+/g, "-");
            const key = resolveCardKey(normalized);
            console.log("Card key from first service category:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        // Default to beauty-parlour card if no specific match
        console.log("Using default beauty-parlour card component");
        return CARD_MAP["beauty-parlour"];
    };

    const CardComponent = getCardComponent();

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
                            Discover talented professionals near you
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
                        <button
                            onClick={fetchNearbyBeautyWorkers}
                            className="ml-auto text-sm text-red-600 underline hover:text-red-800 cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* LOCATION WARNING (non-blocking) */}
                {locationError && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📍</span>
                            <div className="flex-1">
                                <p className={`${typography.body.small} text-yellow-800 font-semibold mb-1`}>
                                    Location Access Required
                                </p>
                                <p className={`${typography.body.xs} text-yellow-700`}>
                                    {locationError}
                                </p>
                            </div>
                            <button
                                onClick={fetchNearbyBeautyWorkers}
                                className="text-xs text-yellow-700 underline hover:text-yellow-900 cursor-pointer whitespace-nowrap"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* SERVICES LIST */}
                {CardComponent && (
                    <div>
                        <h2 className={`${typography.heading.h4} text-gray-800 mb-4 sm:mb-6 flex items-center gap-2`}>
                            <span className="shrink-0">💆</span>
                            <span className="truncate">Nearby {getDisplayTitle()}</span>
                            {nearbyServices.length > 0 && (
                                <span className={`${typography.misc.badge} px-3 py-1 bg-rose-100 text-rose-700 rounded-full ml-2`}>
                                    {nearbyServices.length}
                                </span>
                            )}
                        </h2>

                        {/* Always render the CardComponent - it will handle its own dummy data */}
                        <CardComponent
                            onViewDetails={(service: any) => {
                                const id = service.id || service._id;
                                console.log("Card view details clicked:", id);
                                handleView(id);
                            }}
                            nearbyData={nearbyServices.length > 0 ? nearbyServices : undefined}
                            userLocation={userLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BeautyServicesList;