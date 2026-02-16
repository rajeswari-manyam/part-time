import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import { getNearbyWorkers } from "../services/api.service";

// ── Nearby card components with dummy data
import NearbyMaidCard from "../components/cards/Home Repair/NearByMaidService";
import NearbyCookCard from "../components/cards/Home Repair/NearByCookingCard";
import BabySitterCard from "../components/cards/Home Repair/NearBy BabySitterServices";
import ElderCareCard from "../components/cards/Home Repair/NearByElderlyCareService";
import HousekeepingCard from "../components/cards/Home Repair/NearByHouseKeepingService";
import NearbyLaundryCard from "../components/cards/Home Repair/NearByLaundaryCard";
import MineralWaterSuppliers from "../components/cards/Home Repair/NearByWaterSuppliers";

// ============================================================================
// WORKER INTERFACE
// ============================================================================
export interface HomePersonalWorker {
    _id: string;
    userId: string;
    workerId: string;
    name: string;
    category: string[];
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    profilePic?: string;
    images?: string[];
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "maid" | "cook" | "baby" | "elder" | "housekeeping" | "laundry" | "water";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    maid: NearbyMaidCard,
    cook: NearbyCookCard,
    baby: BabySitterCard,
    elder: ElderCareCard,
    housekeeping: HousekeepingCard,
    laundry: NearbyLaundryCard,
    water: MineralWaterSuppliers,
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

    if (normalized.includes("maid")) {
        console.log("✅ Matched to NearbyMaidCard");
        return CARD_MAP.maid;
    }

    if (normalized.includes("cook")) {
        console.log("✅ Matched to NearbyCookCard");
        return CARD_MAP.cook;
    }

    if (normalized.includes("baby") || normalized.includes("sitter")) {
        console.log("✅ Matched to BabySitterCard");
        return CARD_MAP.baby;
    }

    if (normalized.includes("elder")) {
        console.log("✅ Matched to ElderCareCard");
        return CARD_MAP.elder;
    }

    if (normalized.includes("house") || normalized.includes("keeping")) {
        console.log("✅ Matched to HousekeepingCard");
        return CARD_MAP.housekeeping;
    }

    if (normalized.includes("laundry")) {
        console.log("✅ Matched to NearbyLaundryCard");
        return CARD_MAP.laundry;
    }

    if (normalized.includes("water")) {
        console.log("✅ Matched to MineralWaterSuppliers");
        return CARD_MAP.water;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.maid; // Default to maid card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "maid", "cook", "baby", "sitter", "elder", "care",
        "housekeeping", "laundry", "water", "service"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Home & Personal Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HomePersonalServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nearbyWorkers, setNearbyWorkers] = useState<HomePersonalWorker[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationError, setLocationError] = useState("");
    const [fetchingLocation, setFetchingLocation] = useState(false);

    // ── Get user's location on component mount ──
    useEffect(() => {
        const getUserLocation = () => {
            setFetchingLocation(true);
            setLocationError("");

            if (!navigator.geolocation) {
                setLocationError("Geolocation is not supported by your browser");
                setFetchingLocation(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    setFetchingLocation(false);
                    console.log("📍 User location:", latitude, longitude);
                },
                (error) => {
                    console.error("Location error:", error);
                    setLocationError("Unable to retrieve your location. Please enable location services.");
                    setFetchingLocation(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        };

        getUserLocation();
    }, []);

    // ── Fetch nearby workers when location is available ──
    useEffect(() => {
        const fetchNearbyWorkers = async () => {
            if (!userLocation) return;

            setLoading(true);
            setError("");

            try {
                const response = await getNearbyWorkers(
                    userLocation.latitude,
                    userLocation.longitude,
                    10,              // range in km
                    "home",          // category
                    subcategory || "" // subcategory from URL param
                );

                if (response.success && response.workers) {
                    console.log('📊 Total workers from API:', response.workers.length);
                    setNearbyWorkers(response.workers);
                    console.log("✅ Nearby home & personal workers:", response.workers);
                } else {
                    setNearbyWorkers([]);
                }
            } catch (err) {
                console.error("Error fetching nearby workers:", err);
                setError("Failed to load nearby workers");
                setNearbyWorkers([]);
            } finally {
                setLoading(false);
            }
        };

        if (userLocation) {
            fetchNearbyWorkers();
        }
    }, [userLocation, subcategory]);

    // ── Navigation handlers ──────────────────────────────────────────
    const handleView = (worker: any) => {
        const id = worker.id || worker._id;
        console.log("Viewing worker details:", id);
        navigate(`/home-personal-services/worker/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-home-service-form?subcategory=${subcategory}`
                : "/add-home-service-form"
        );
    };

    // ── Helper functions ──
    const openDirections = (worker: HomePersonalWorker) => {
        if (worker.latitude && worker.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${worker.latitude},${worker.longitude}`,
                "_blank"
            );
        } else if (worker.area || worker.city) {
            const addr = encodeURIComponent(
                [worker.area, worker.city, worker.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // ── Render Worker Card ──
    const renderWorkerCard = (worker: HomePersonalWorker) => {
        const id = worker._id || "";
        const location = [worker.area, worker.city, worker.state]
            .filter(Boolean)
            .join(", ") || "Location not set";

        // Calculate distance if user location is available
        let distance: string | null = null;
        if (userLocation && worker.latitude && worker.longitude) {
            const dist = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                worker.latitude,
                worker.longitude
            );
            distance = dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`;
        }

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative cursor-pointer"
                style={{ border: '1px solid #e5e7eb' }}
                onClick={() => handleView(worker)}
            >
                {/* Distance Badge */}
                {distance && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                            <span>📍</span> {distance} away
                        </span>
                    </div>
                )}

                {/* Profile Image */}
                {worker.profilePic && (
                    <div className="w-full h-40 overflow-hidden bg-gray-100">
                        <img
                            src={worker.profilePic}
                            alt={worker.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Name */}
                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {worker.name || "Unnamed Worker"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Subcategory and Charge Type Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {worker.subCategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🏠</span>
                                <span className="truncate">{worker.subCategory}</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium bg-purple-50 text-purple-700 border-purple-200 capitalize">
                            {worker.chargeType}
                        </span>
                    </div>

                    {/* Skill */}
                    {worker.skill && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            🛠️ {worker.skill}
                        </p>
                    )}

                    {/* Charge Info */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500">Charge Type</p>
                            <p className="text-sm font-semibold text-gray-900 capitalize">
                                Per {worker.chargeType}
                            </p>
                        </div>
                        {worker.serviceCharge && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Charges
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{worker.serviceCharge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                openDirections(worker);
                            }}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleView(worker);
                            }}
                            className="w-full sm:flex-1 justify-center gap-1.5"
                        >
                            <span className="shrink-0">👁️</span>
                            <span>View Details</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        return (
            <div className="space-y-8">
                {/* Nearby Card Components - renders built-in dummy data */}
                <div>
                    <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                        <span className="shrink-0">🏠</span>
                        <span className="truncate">Nearby {getDisplayTitle(subcategory)}</span>
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>
            </div>
        );
    };

    // ── Render Nearby Workers ────────────────────────────────────────
    const renderNearbyWorkers = () => {
        if (fetchingLocation) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Detecting your location...</p>
                </div>
            );
        }

        if (locationError) {
            return (
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-3">📍</div>
                    <p className="text-yellow-800 font-medium mb-2">{locationError}</p>
                    <p className="text-sm text-yellow-700">Enable location services to see nearby workers</p>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading nearby workers...</p>
                </div>
            );
        }

        if (nearbyWorkers.length === 0) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Nearby Workers Found
                    </h3>
                    <p className={`${typography.body.small} text-gray-500`}>
                        Try exploring other areas or add your own service!
                    </p>
                </div>
            );
        }

        return (
            <div>
                <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                    <span className="shrink-0">📍</span>
                    <span className="truncate">Nearby Workers ({nearbyWorkers.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nearbyWorkers.map(renderWorkerCard)}
                </div>
            </div>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    if (loading && !nearbyWorkers.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading workers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title + "+ Add Post" ─────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle(subcategory)}
                    </h1>

                    <Button
                        variant="gradient-blue"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center"
                    >
                        + Add Post
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* ─── NEARBY WORKERS (LIVE DATA) ──────────────────── */}
                {renderNearbyWorkers()}

                {/* ─── DUMMY CARD COMPONENTS ──────────────────────────── */}
                {shouldShowNearbyCards(subcategory) && (
                    <div className="mt-8">
                        {renderCardsSection()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePersonalServicesList;