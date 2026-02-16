import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// Import wedding-related card components
import NearbyChoreographerCard from "../components/cards/Wedding/NearByChoreographer";
import NearbyFlowerDecoration from "../components/cards/Wedding/NearByFlowerDecoration";
import NearbyPanditService from "../components/cards/Wedding/NearByPandit";
import NearbyWeddingBands from "../components/cards/Wedding/NearByWeddingMusic";
import NearbyWeddingPlanner from "../components/cards/Wedding/NearByWeddingPlaners";

// Import utility functions
import { isWeddingSubcategory, getMainWeddingCategory } from "../utils/SubCategories";

// Import API service
import { getNearbyWeddingWorkers, WeddingWorkerResponse, WeddingWorker } from "../services/Wedding.service";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "wedding-planners" | "poojari" | "music-team" | "flower-decoration" | "sangeet-choreographers";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    "wedding-planners": NearbyWeddingPlanner,
    "poojari": NearbyPanditService,
    "music-team": NearbyWeddingBands,
    "flower-decoration": NearbyFlowerDecoration,
    "sangeet-choreographers": NearbyChoreographerCard,
};

// ============================================================================
// HELPERS
// ============================================================================
const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return "";
    const normalized = sub.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-");
    console.log("📍 Raw subcategory:", sub);
    console.log("📍 Normalized subcategory:", normalized);
    return normalized;
};

const getCardComponentForSubcategory = (
    subcategory: string | undefined
): React.ComponentType<any> | null => {
    if (!subcategory) return null;

    const normalized = normalizeSubcategory(subcategory);
    const mainCategory = getMainWeddingCategory(normalized);

    console.log("🎯 Main Wedding Category:", mainCategory);

    if (!mainCategory) {
        console.warn(`⚠️ No matching card component for: "${subcategory}"`);
        return null;
    }

    const CardComponent = CARD_MAP[mainCategory as CardKey];

    if (CardComponent) {
        console.log(`✅ Matched to ${mainCategory} -> ${CardComponent.name}`);
    }

    return CardComponent || null;
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);
    const isWedding = isWeddingSubcategory(normalized);

    console.log(`📊 Should show nearby cards for "${subcategory}":`, isWedding);

    return isWedding;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Wedding Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getCategoryIcon = (subcategory: string | undefined): string => {
    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("planner")) return "📋";
    if (normalized.includes("poojari") || normalized.includes("pandit")) return "🕉️";
    if (normalized.includes("music") || normalized.includes("band")) return "🎵";
    if (normalized.includes("flower") || normalized.includes("decoration")) return "💐";
    if (normalized.includes("choreographer") || normalized.includes("sangeet")) return "💃";
    if (normalized.includes("catering")) return "🍽️";
    if (normalized.includes("photography")) return "📸";

    return "💒";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const WeddingServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // State management
    const [nearbyData, setNearbyData] = useState<WeddingWorker[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [distance, setDistance] = useState<number>(10); // Default 10km radius

    // Get user location
    useEffect(() => {
        console.log("🌍 Getting user location...");
        
        if (!navigator.geolocation) {
            console.error("❌ Geolocation not supported");
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setUserLocation(location);
                console.log("✅ User location obtained:", location);
            },
            (err) => {
                console.error("❌ Error getting user location:", err);
                setError("Unable to get your location. Please enable location services.");
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    // Fetch nearby wedding services
    useEffect(() => {
        const fetchNearbyWeddingServices = async () => {
            if (!userLocation) {
                console.log("⏳ Waiting for user location...");
                return;
            }

            if (!shouldShowNearbyCards(subcategory)) {
                console.log("⏭️ Skipping nearby fetch - not a wedding subcategory");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Fetching nearby wedding services...", {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    distance,
                    subcategory
                });

                const response: WeddingWorkerResponse = await getNearbyWeddingWorkers(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    console.log("✅ Nearby wedding services fetched:", response.data.length);
                    
                    // Filter by subcategory if specified
                    let filteredData = response.data;
                    if (subcategory) {
                        const normalizedSubcat = normalizeSubcategory(subcategory);
                        filteredData = response.data.filter(service => {
                            const serviceSubcat = normalizeSubcategory(service.subCategory);
                            return serviceSubcat.includes(normalizedSubcat) || normalizedSubcat.includes(serviceSubcat);
                        });
                        console.log(`🔍 Filtered to ${filteredData.length} services for subcategory: ${subcategory}`);
                    }
                    
                    setNearbyData(filteredData);
                } else {
                    console.warn("⚠️ No nearby wedding services found");
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby wedding services:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchNearbyWeddingServices();
    }, [userLocation, distance, subcategory]);

    // Navigation handlers
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("👁️ Viewing service details:", id);
        navigate(`/wedding-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("➕ Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-wedding-service-form?subcategory=${subcategory}`
                : "/add-wedding-service-form"
        );
    };

    // Render Cards Section
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">💒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Wedding Service Category Not Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                        This wedding service category is not yet configured.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="bg-pink-600 hover:bg-pink-700"
                    >
                        + Add Service
                    </Button>
                </div>
            );
        }

        // Show loading state
        if (loading) {
            return (
                <div className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600"></div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Finding services near you...
                            </h3>
                            <p className="text-gray-600">
                                Getting your location and searching for nearby services
                            </p>
                        </div>
                    </div>
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
                        className="mt-4 bg-pink-600 hover:bg-pink-700"
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
                        <span className="shrink-0">{getCategoryIcon(subcategory)}</span>
                        <span className="truncate">Available {getDisplayTitle(subcategory)}</span>
                    </h2>

                    {/* Distance Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Within:</label>
                        <select
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
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
        <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* HEADER - title + "+ Add Post" */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl">{getCategoryIcon(subcategory)}</span>
                        <div>
                            <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                                {getDisplayTitle(subcategory)}
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Find the perfect vendors for your special day
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center bg-pink-600 hover:bg-pink-700"
                    >
                        + Add Post
                    </Button>
                </div>

                {/* CONTENT RENDERING */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with real API data
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">💒</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Select a Wedding Service Category
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Choose a category from the menu to view available services
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleAddPost}
                            className="bg-pink-600 hover:bg-pink-700"
                        >
                            + Add New Service
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeddingServicesList;