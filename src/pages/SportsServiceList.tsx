import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNearbySportsWorkers, SportsWorker } from "../services/Sports.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components
import NearbyPlayAreaCard from "../components/cards/Sports/NearByPlayArear";
import NearbySportsCard from "../components/cards/Sports/NearBySports";
import NearbyFitnessCard from "../components/cards/Beauty/NearByFittness";
import NearbyStadiumCard from "../components/cards/Sports/NearByStadium";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "gym" | "sports" | "play" | "stadium";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    gym: NearbyFitnessCard,
    sports: NearbySportsCard,
    play: NearbyPlayAreaCard,
    stadium: NearbyStadiumCard,
};

// ============================================================================
// HELPERS
// ============================================================================
const getCardKeyFromSubCategory = (subCategory: string | undefined): CardKey | null => {
    if (!subCategory) return null;
    const n = subCategory.toLowerCase();
    
    if (n.includes("gym") || n.includes("fitness") || n.includes("yoga")) return "gym";
    if (n.includes("stadium") || n.includes("ground")) return "stadium";
    if (n.includes("play") || n.includes("indoor") || n.includes("kids")) return "play";
    if (n.includes("sports") || n.includes("club") || n.includes("academy") || 
        n.includes("cricket") || n.includes("football") || n.includes("basketball") ||
        n.includes("tennis") || n.includes("badminton") || n.includes("swimming")) return "sports";
    
    return null;
};

const resolveCardKey = (sub: string | undefined): CardKey | null => {
    return getCardKeyFromSubCategory(sub);
};

const getSubCategoryFromUrl = (subcategory: string | undefined): string | undefined => {
    if (!subcategory) return undefined;
    return subcategory
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const normalizeSubCategory = (subCategory: string): string =>
    subCategory.toLowerCase().trim().replace(/\s+/g, " ");

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const SportsServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── state ────────────────────────────────────────────────────────────────
    const [nearbyServices, setNearbyServices] = useState<SportsWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // ── fetch nearby sports services with automatic location ─────────────────
    const fetchNearbySports = useCallback(async () => {
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

            console.log("Fetching nearby sports services with coordinates:", { latitude, longitude, distance });
            const response = await getNearbySportsWorkers(latitude, longitude, distance);
            console.log("Nearby sports API response:", response);

            if (response.success) {
                const allServices = response.data || [];
                console.log("All sports services fetched:", allServices);

                if (subcategory) {
                    const targetSubCategory = getSubCategoryFromUrl(subcategory);
                    if (targetSubCategory) {
                        const normalizedTarget = normalizeSubCategory(targetSubCategory);
                        const filtered = allServices.filter(s =>
                            s.subCategory && normalizeSubCategory(s.subCategory) === normalizedTarget
                        );
                        console.log(`Filtered services for ${targetSubCategory}:`, filtered);
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
            console.error("fetchNearbySports error:", err);
            setLocationError(
                err.message === "User denied Geolocation"
                    ? "Location access denied. Please enable location services to see nearby services."
                    : err.message || "Failed to get location. Please enable location services."
            );
            setNearbyServices([]);
        } finally {
            setLoading(false);
        }
    }, [subcategory]);

    useEffect(() => {
        console.log("Component mounted/updated. Subcategory:", subcategory);
        fetchNearbySports();
    }, [fetchNearbySports]);

    // ── navigation handlers ──────────────────────────────────────────────────
    const handleView = (id: string) => {
        console.log("Viewing sports service details:", id);
        navigate(`/sports-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(subcategory
            ? `/add-sports-service-form?subcategory=${subcategory}`
            : "/add-sports-service-form"
        );
    };

    // ── display helpers ──────────────────────────────────────────────────────
    const getDisplayTitle = () =>
        subcategory
            ? subcategory.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
            : "All Sports & Fitness Services";

    const getCardComponent = (): React.ComponentType<any> | null => {
        if (subcategory) {
            const key = resolveCardKey(subcategory);
            console.log("Card key from subcategory:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        if (nearbyServices.length > 0 && nearbyServices[0].subCategory) {
            const key = getCardKeyFromSubCategory(nearbyServices[0].subCategory);
            console.log("Card key from first service subCategory:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        // Default to sports card if no specific match
        console.log("Using default sports card component");
        return CARD_MAP.sports;
    };

    const CardComponent = getCardComponent();

    // ============================================================================
    // LOADING
    // ============================================================================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className={`${typography.body.small} text-gray-600`}>Loading sports services...</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">

            {/* ─── PAGE CONTENT ───────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle()}
                    </h1>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center"
                    >
                        + Add Post
                    </Button>
                </div>

                {/* ─── ERROR ──────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-lg">
                        <p className={`${typography.body.small} text-red-700 font-medium`}>{error}</p>
                    </div>
                )}

                {/* ─── LOCATION ERROR ──────────────────────────────────────── */}
                {locationError && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className={`${typography.body.small} text-yellow-800 font-semibold mb-1`}>
                                    Location Access Required
                                </p>
                                <p className={`${typography.body.xs} text-yellow-700`}>
                                    {locationError}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── NEARBY SECTION ─────────────────────────────── */}
                {CardComponent && (
                    <div>
                        <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                            <span className="shrink-0">🏃</span>
                            <span className="truncate">Nearby {getDisplayTitle()}</span>
                            {nearbyServices.length > 0 && (
                                <span className={`${typography.misc.badge} bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2`}>
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

export default SportsServicesList;