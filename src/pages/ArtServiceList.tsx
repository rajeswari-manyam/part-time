import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import CraftBusinessCard from "../components/cards/Art Service/NearByCraft";
import CaricatureArtistListing from "../components/cards/Art Service/NearByCaricature";
import PainterListing from "../components/cards/Art Service/NearByPrinter";
import WallMuralListing from "../components/cards/Art Service/NearByWallMural";
import NearByHandMadeGifts from "../components/cards/Art Service/NearByHandMadeGifts";

// ── Import API service - CORRECTED IMPORT PATH
import {
    getNearbyCreativeArtWorkers,
    CreativeArtWorker,
    CreativeArtWorkerResponse
} from "../services/Creative.service";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "craft" | "caricature" | "painting" | "mural" | "gift";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    craft: CraftBusinessCard,
    caricature: CaricatureArtistListing,
    painting: PainterListing,
    mural: WallMuralListing,
    gift: NearByHandMadeGifts,
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

    // Craft Training matching
    if (
        (normalized.includes("craft") && normalized.includes("training")) ||
        normalized.includes("craft-training")
    ) {
        console.log("✅ Matched to CraftBusinessCard (Training)");
        return CARD_MAP.craft;
    }

    // Caricature matching
    if (
        normalized.includes("caricature") ||
        normalized.includes("digital-caricature") ||
        normalized.includes("sketch-artist")
    ) {
        console.log("✅ Matched to CaricatureArtistListing");
        return CARD_MAP.caricature;
    }

    // Painting matching
    if (
        (normalized.includes("painting") && normalized.includes("artist")) ||
        normalized.includes("painting-artist") ||
        normalized.includes("sketch-painting") ||
        normalized.includes("3d-painting") ||
        normalized.includes("canvas-painting") ||
        normalized.includes("portrait-artist")
    ) {
        console.log("✅ Matched to PainterListing");
        return CARD_MAP.painting;
    }

    // Wall Mural matching
    if (
        (normalized.includes("wall") && normalized.includes("mural")) ||
        normalized.includes("wall-mural") ||
        normalized.includes("wall-art") ||
        normalized.includes("mural-painting")
    ) {
        console.log("✅ Matched to WallMuralListing");
        return CARD_MAP.mural;
    }

    // Handmade Gifts matching
    if (
        (normalized.includes("handmade") && normalized.includes("gift")) ||
        normalized.includes("handmade-gift") ||
        normalized.includes("gift-designer") ||
        normalized.includes("craft-gift") ||
        normalized.includes("custom-gift")
    ) {
        console.log("✅ Matched to NearByHandMadeGifts");
        return CARD_MAP.gift;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return null;
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "craft", "training", "caricature", "painting", "artist",
        "wall", "mural", "handmade", "gift", "sketch", "3d", "canvas", "portrait", "art"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Creative & Art Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getCategoryIcon = (subcategory: string | undefined): string => {
    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("caricature")) return "🎨";
    if (normalized.includes("painting")) return "🖌️";
    if (normalized.includes("mural")) return "🖼️";
    if (normalized.includes("gift")) return "🎁";
    if (normalized.includes("craft") || normalized.includes("training")) return "✂️";

    return "🎨";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ArtServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── State management ─────────────────────────────────────────────
    const [nearbyData, setNearbyData] = useState<CreativeArtWorker[]>([]);
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

    // ── Fetch nearby art services ────────────────────────────────────
    useEffect(() => {
        const fetchNearbyArtServices = async () => {
            if (!userLocation) return;

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Fetching nearby art services...", {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    distance,
                });

                const response: CreativeArtWorkerResponse = await getNearbyCreativeArtWorkers(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    console.log("✅ Nearby art services fetched:", response.data);
                    setNearbyData(response.data);
                } else {
                    console.warn("⚠️ No nearby art services found");
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby art services:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userLocation && shouldShowNearbyCards(subcategory)) {
            fetchNearbyArtServices();
        } else {
            setLoading(false);
        }
    }, [userLocation, distance, subcategory]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (art: any) => {
        const id = art.id || art._id;
        console.log("Viewing art service details:", id);
        navigate(`/art-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-art-service-form?subcategory=${subcategory}`
                : "/add-art-service-form"
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Art Service Category Not Found
                    </h3>
                    <p className="text-gray-600">
                        This art service category is not yet configured.
                    </p>
                </div>
            );
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
                        className="mt-4 bg-amber-600 hover:bg-amber-700"
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
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
        <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title + "+ Add Post" ─────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl">{getCategoryIcon(subcategory)}</span>
                        <div>
                            <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                                {getDisplayTitle(subcategory)}
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Discover talented artists and creative professionals
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center bg-amber-600 hover:bg-amber-700"
                    >
                        + Add Post
                    </Button>
                </div>

                {/* ─── CONTENT RENDERING ──────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with real API data
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">{getCategoryIcon(subcategory)}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Art Services Found
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

export default ArtServicesList;