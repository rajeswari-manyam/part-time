import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

// ── Import API service
import { getNearbyHotels, Hotel, HotelResponse } from "../services/HotelService.service";

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
const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return "";
    const normalized = sub.toLowerCase();
    console.log("📍 Raw subcategory:", sub);
    console.log("📍 Normalized subcategory:", normalized);
    return normalized;
};

const getCardComponentForSubcategory = (
    subcategory: string | undefined
): React.ComponentType<any> | null => {
    if (!subcategory) return null;

    const normalized = normalizeSubcategory(subcategory);

    // Resort matching
    if (normalized.includes("resort")) {
        console.log("✅ Matched to NearbyResortsCard");
        return CARD_MAP.resort;
    }

    // Lodge matching
    if (normalized.includes("lodge")) {
        console.log("✅ Matched to NearbyLodgesCard");
        return CARD_MAP.lodge;
    }

    // Guest house matching
    if (normalized.includes("guest")) {
        console.log("✅ Matched to NearbyGuestHouseCard");
        return CARD_MAP.guest;
    }

    // Travel agency matching
    if (normalized.includes("travel") || normalized.includes("tour") || normalized.includes("agenc")) {
        console.log("✅ Matched to NearbyTravelCard");
        return CARD_MAP.travel;
    }

    // Taxi matching
    if (normalized.includes("taxi")) {
        console.log("✅ Matched to NearbyTaxiServiceCard");
        return CARD_MAP.taxi;
    }

    // Train matching
    if (normalized.includes("train")) {
        console.log("✅ Matched to NearbyTrainServiceCard");
        return CARD_MAP.train;
    }

    // Bus matching
    if (normalized.includes("bus")) {
        console.log("✅ Matched to NearbyBusServiceCard");
        return CARD_MAP.bus;
    }

    // Vehicle/Bike rental matching
    if (normalized.includes("vehicle") || normalized.includes("rental") || normalized.includes("bike")) {
        console.log("✅ Matched to NearbyVehicleCard");
        return CARD_MAP.vehicle;
    }

    // Hotel matching (default)
    if (normalized.includes("hotel")) {
        console.log("✅ Matched to NearbyHotelsCard");
        return CARD_MAP.hotel;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.hotel; // Default to hotel card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "hotel", "resort", "lodge", "guest",
        "travel", "taxi", "train", "bus", "vehicle", "rental", "bike"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Hotel & Travel Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HotelServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── State management ─────────────────────────────────────────────
    const [nearbyData, setNearbyData] = useState<Hotel[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [distance, setDistance] = useState<number>(10); // Default 10km radius

    // ── Get user location ────────────────────────────────────────────
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(location);
                    console.log("📍 User location obtained:", location);
                },
                (err) => {
                    console.error("❌ Error getting user location:", err);
                    setError("Unable to get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            console.error("❌ Geolocation not supported");
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    // ── Fetch nearby hotels ──────────────────────────────────────────
    useEffect(() => {
        const fetchNearbyHotels = async () => {
            if (!userLocation) return;

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Fetching nearby hotels...", {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    distance,
                });

                const response: HotelResponse = await getNearbyHotels(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    console.log("✅ Nearby hotels fetched:", response.data);
                    setNearbyData(response.data);
                } else {
                    console.warn("⚠️ No nearby hotels found");
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby hotels:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userLocation && shouldShowNearbyCards(subcategory)) {
            fetchNearbyHotels();
        } else {
            setLoading(false);
        }
    }, [userLocation, distance, subcategory]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (hotel: any) => {
        const id = hotel.id || hotel._id;
        console.log("Viewing hotel details:", id);
        navigate(`/hotel-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-hotel-service-form?subcategory=${subcategory}`
                : "/add-hotel-service-form"
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        // Show loading state
        if (loading) {
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Loading nearby services...
                    </h3>
                    <p className="text-gray-600">
                        Getting your location and finding services near you
                    </p>
                </div>
            );
        }

        // Show error state
        if (error) {
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {error}
                    </h3>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Header with distance filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                        <span className="shrink-0">🏨</span>
                        <span className="truncate">Available {getDisplayTitle(subcategory)}</span>
                    </h2>

                    {/* Distance Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Within:</label>
                        <select
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                            <option value={50}>50 km</option>
                            <option value={100}>100 km</option>
                        </select>
                    </div>
                </div>

                {/* Nearby Cards with Real Data */}
                <div className="mb-6">
                    {nearbyData.length > 0 ? (
                        <CardComponent
                            onViewDetails={handleView}
                            nearbyData={nearbyData}
                            userLocation={userLocation}
                        />
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <div className="text-5xl mb-3">📍</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                No services found nearby
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try increasing the search distance or check back later
                            </p>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleAddPost}
                            >
                                Add a Service
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle(subcategory)}
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

                {/* ─── CONTENT RENDERING ─────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with real API data
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏨</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Services Found
                        </h3>
                        <p className="text-gray-600">
                            Select a category or add a new service!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelServicesList;