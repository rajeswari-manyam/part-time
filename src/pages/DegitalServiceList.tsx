import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import NearbyCCTVCard from "../components/cards/Tech&DigitalService/NearByCCTVCard";
import NearbyDigitalMarketingCard from "../components/cards/Tech&DigitalService/NearByDigitalMarketingCard";
import NearbyGraphicDesignerCard from "../components/cards/Tech&DigitalService/NearByGraphicCard";
import NearbyInternetWebsiteCard from "../components/cards/Tech&DigitalService/NearbyInternetWebsiteCard";
import NearbyLaptopRepairCard from "../components/cards/Tech&DigitalService/NearByLaptop";
import NearbyMobileRepairCard from "../components/cards/Tech&DigitalService/NearByMobileCard";
import NearbySoftwareCard from "../components/cards/Tech&DigitalService/NearBysoftwareCard";
import NearbyWebsiteCard from "../components/cards/Tech&DigitalService/NearByWebsiteCard";

// ── Import API service
import { getNearbyDigitalWorkers, DigitalWorker, DigitalWorkerResponse } from "../services/DigitalService.service";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "cctv" | "digital-marketing" | "graphic-design" | "internet-website"
    | "laptop-repair" | "mobile-repair" | "software" | "website";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    "cctv": NearbyCCTVCard,
    "digital-marketing": NearbyDigitalMarketingCard,
    "graphic-design": NearbyGraphicDesignerCard,
    "internet-website": NearbyInternetWebsiteCard,
    "laptop-repair": NearbyLaptopRepairCard,
    "mobile-repair": NearbyMobileRepairCard,
    "software": NearbySoftwareCard,
    "website": NearbyWebsiteCard,
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

    // CCTV/Security matching
    if (normalized.includes("cctv") || (normalized.includes("security") && normalized.includes("system"))) {
        console.log("✅ Matched to NearbyCCTVCard");
        return CARD_MAP.cctv;
    }

    // Digital Marketing matching
    if (normalized.includes("digital") && normalized.includes("marketing")) {
        console.log("✅ Matched to NearbyDigitalMarketingCard");
        return CARD_MAP["digital-marketing"];
    }

    // Graphic Design matching
    if (normalized.includes("graphic") && normalized.includes("design")) {
        console.log("✅ Matched to NearbyGraphicDesignerCard");
        return CARD_MAP["graphic-design"];
    }

    // Internet Website matching
    if (normalized.includes("internet") && normalized.includes("website")) {
        console.log("✅ Matched to NearbyInternetWebsiteCard");
        return CARD_MAP["internet-website"];
    }

    // Laptop Repair matching
    if (normalized.includes("laptop") && normalized.includes("repair")) {
        console.log("✅ Matched to NearbyLaptopRepairCard");
        return CARD_MAP["laptop-repair"];
    }

    // Mobile Repair matching
    if (normalized.includes("mobile") && normalized.includes("repair")) {
        console.log("✅ Matched to NearbyMobileRepairCard");
        return CARD_MAP["mobile-repair"];
    }

    // Software matching
    if (normalized.includes("software") && (normalized.includes("service") || normalized.includes("development"))) {
        console.log("✅ Matched to NearbySoftwareCard");
        return CARD_MAP.software;
    }

    // Website Development matching
    if (normalized.includes("website") && normalized.includes("development")) {
        console.log("✅ Matched to NearbyWebsiteCard");
        return CARD_MAP.website;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.website; // Default to website card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);
    
    const keywords = [
        "cctv", "security", "digital", "marketing", "graphic", "design",
        "internet", "website", "laptop", "mobile", "repair", "software", "development"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Tech & Digital Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const DigitalServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── State management ─────────────────────────────────────────────
    const [nearbyData, setNearbyData] = useState<DigitalWorker[]>([]);
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

    // ── Fetch nearby digital services ────────────────────────────────
    useEffect(() => {
        const fetchNearbyServices = async () => {
            if (!userLocation) return;

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Fetching nearby digital services...", {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    distance,
                });

                const response: DigitalWorkerResponse = await getNearbyDigitalWorkers(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    console.log("✅ Nearby digital services fetched:", response.data);
                    setNearbyData(response.data);
                } else {
                    console.warn("⚠️ No nearby digital services found");
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby services:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userLocation && shouldShowNearbyCards(subcategory)) {
            fetchNearbyServices();
        } else {
            setLoading(false);
        }
    }, [userLocation, distance, subcategory]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing service details:", id);
        navigate(`/tech-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-digital-service-form?subcategory=${subcategory}`
                : "/add-digital-service-form"
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
                        <span className="shrink-0">💻</span>
                        <span className="truncate">Available {getDisplayTitle(subcategory)}</span>
                    </h2>

                    {/* Distance Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Within:</label>
                        <select
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-white">
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
                        <div className="text-6xl mb-4">💻</div>
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

export default DigitalServicesList;