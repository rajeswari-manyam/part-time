import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNearbyHotels, Hotel } from "../services/HotelService.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import NearbyHotelsCard from "../components/cards/Hotel/NearByHotel";
import NearbyResortsCard from "../components/cards/Hotel/NearByResort";
import NearbyLodgesCard from "../components/cards/Hotel/NearByLodge";
import NearbyGuestHouseCard from "../components/cards/Hotel/NearByGuestHouse";
import NearbyTravelCard from "../components/cards/Hotel/NearByTravel";
import NearbyTaxiServiceCard from "../components/cards/Hotel/NearByTaxiService";
import NearbyTrainServiceCard from "../components/cards/Hotel/NearByTrains";
import NearbyBusServiceCard from "../components/cards/Hotel/NearByBuses";
import NearbyVehicleCard from "../components/cards/Hotel/NearByBikeCard";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "hotel" | "resort" | "lodge" | "guest"
    | "travel" | "taxi" | "train" | "bus" | "vehicle";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    hotel: NearbyHotelsCard,
    resort: NearbyResortsCard,
    lodge: NearbyLodgesCard,
    guest: NearbyGuestHouseCard,
    travel: NearbyTravelCard,
    taxi: NearbyTaxiServiceCard,
    train: NearbyTrainServiceCard,
    bus: NearbyBusServiceCard,
    vehicle: NearbyVehicleCard,
};

// ============================================================================
// HELPERS
// ============================================================================
const getCardKeyFromType = (type: string | undefined): CardKey | null => {
    if (!type) return null;
    const n = type.toLowerCase();
    if (n.includes("resort")) return "resort";
    if (n.includes("lodge")) return "lodge";
    if (n.includes("guest")) return "guest";
    if (n.includes("travel") || n.includes("agenc")) return "travel";
    if (n.includes("taxi")) return "taxi";
    if (n.includes("train")) return "train";
    if (n.includes("bus")) return "bus";
    if (n.includes("vehicle") || n.includes("rental") || n.includes("bike")) return "vehicle";
    if (n.includes("hotel")) return "hotel";
    return null;
};

const resolveCardKey = (sub: string | undefined): CardKey | null => {
    if (!sub) return null;
    const n = sub.toLowerCase();
    if (n.includes("resort")) return "resort";
    if (n.includes("lodge")) return "lodge";
    if (n.includes("guest")) return "guest";
    if (n.includes("travel") || n.includes("tour") || n.includes("agenc")) return "travel";
    if (n.includes("taxi")) return "taxi";
    if (n.includes("train")) return "train";
    if (n.includes("bus")) return "bus";
    if (n.includes("vehicle") || n.includes("rental") || n.includes("bike")) return "vehicle";
    if (n.includes("hotel")) return "hotel";
    return null;
};

const getTypeFromSubcategory = (subcategory: string | undefined): string | undefined => {
    if (!subcategory) return undefined;
    return subcategory
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const normalizeType = (type: string): string =>
    type.toLowerCase().trim().replace(/\s+/g, " ");

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HotelServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── state ────────────────────────────────────────────────────────────────
    const [nearbyServices, setNearbyServices] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // ── fetch nearby hotels with automatic location ──────────────────────────
    const fetchNearbyHotels = useCallback(async () => {
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

            console.log("Fetching nearby hotels with coordinates:", { latitude, longitude, distance });
            const response = await getNearbyHotels(latitude, longitude, distance);
            console.log("Nearby hotels API response:", response);

            if (response.success) {
                const allServices = response.data || [];
                console.log("All services fetched:", allServices);

                if (subcategory) {
                    const targetType = getTypeFromSubcategory(subcategory);
                    if (targetType) {
                        const normalizedTarget = normalizeType(targetType);
                        const filtered = allServices.filter(s =>
                            s.type && normalizeType(s.type) === normalizedTarget
                        );
                        console.log(`Filtered services for ${targetType}:`, filtered);
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
            console.error("fetchNearbyHotels error:", err);
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
        fetchNearbyHotels();
    }, [fetchNearbyHotels]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (id: string) => {
        console.log("Viewing hotel details:", id);
        navigate(`/hotel-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(subcategory
            ? `/add-hotel-service-form?subcategory=${subcategory}`
            : "/add-hotel-service-form"
        );
    };

    // ── display helpers ──────────────────────────────────────────────────────
    const getDisplayTitle = () =>
        subcategory
            ? subcategory.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
            : "All Hotel & Travel Services";

    const getCardComponent = (): React.ComponentType<any> | null => {
        if (subcategory) {
            const key = resolveCardKey(subcategory);
            console.log("Card key from subcategory:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        if (nearbyServices.length > 0 && nearbyServices[0].type) {
            const key = getCardKeyFromType(nearbyServices[0].type);
            console.log("Card key from first service type:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        // Default to hotel card if no specific match
        console.log("Using default hotel card component");
        return CARD_MAP.hotel;
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
                    <p className={`${typography.body.small} text-gray-600`}>Loading services...</p>
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
                            <span className="shrink-0">🏨</span>
                            <span className="truncate">Nearby {getDisplayTitle()}</span>
                            {nearbyServices.length > 0 && (
                                <span className={`${typography.misc.badge} bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2`}>
                                    {nearbyServices.length}
                                </span>
                            )}
                        </h2>

                        {/* Always render the CardComponent - it will handle its own dummy data */}
                        <CardComponent
                            onViewDetails={(hotel: any) => {
                                const id = hotel.id || hotel._id;
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

export default HotelServicesList;