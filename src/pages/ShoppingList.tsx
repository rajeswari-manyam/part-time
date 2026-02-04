import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNearbyShoppingStores, ShoppingStore } from "../services/ShoppingService.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import NearbySupermarketCard from "../components/cards/Shopping/NearBysuperMarket";
import NearbyStationaryCard from "../components/cards/Shopping/NearbyStationaryCard";
import NearbyShoeCard from "../components/cards/Shopping/NearByShoeCard";
import NearbyOpticalCard from "../components/cards/Shopping/NearByOpticalCard";
import NearbyMobileCard from "../components/cards/Shopping/NearByMobileCard";
import NearbyJewelleryCard from "../components/cards/Shopping/NearByjewellar";
import NearbyGiftCard from "../components/cards/Shopping/NearByGiftCard";
import NearbyFurnitureCard from "../components/cards/Shopping/NearbyFurnitureCard";
import NearbyElectronicCard from "../components/cards/Shopping/NearbyElectronicCard";
import NearbyClothingCard from "../components/cards/Shopping/NearByClothingCard";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "supermarket" | "stationary" | "shoe" | "optical" | "mobile"
    | "jewellery" | "gift" | "furniture" | "electronic" | "clothing";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    supermarket: NearbySupermarketCard,
    stationary: NearbyStationaryCard,
    shoe: NearbyShoeCard,
    optical: NearbyOpticalCard,
    mobile: NearbyMobileCard,
    jewellery: NearbyJewelleryCard,
    gift: NearbyGiftCard,
    furniture: NearbyFurnitureCard,
    electronic: NearbyElectronicCard,
    clothing: NearbyClothingCard,
};

// ============================================================================
// HELPERS
// ============================================================================
const getCardKeyFromType = (type: string | undefined): CardKey | null => {
    if (!type) return null;
    const n = type.toLowerCase();
    if (n.includes("supermarket") || n.includes("grocery")) return "supermarket";
    if (n.includes("stationar")) return "stationary";
    if (n.includes("shoe")) return "shoe";
    if (n.includes("optical")) return "optical";
    if (n.includes("mobile")) return "mobile";
    if (n.includes("jeweller") || n.includes("jewelry")) return "jewellery";
    if (n.includes("gift")) return "gift";
    if (n.includes("furniture")) return "furniture";
    if (n.includes("electronic")) return "electronic";
    if (n.includes("clothing") || n.includes("cloth")) return "clothing";
    return null;
};

const resolveCardKey = (sub: string | undefined): CardKey | null => {
    if (!sub) return null;
    const n = sub.toLowerCase();
    if (n.includes("supermarket") || n.includes("grocery")) return "supermarket";
    if (n.includes("stationar")) return "stationary";
    if (n.includes("shoe")) return "shoe";
    if (n.includes("optical")) return "optical";
    if (n.includes("mobile")) return "mobile";
    if (n.includes("jeweller") || n.includes("jewelry")) return "jewellery";
    if (n.includes("gift")) return "gift";
    if (n.includes("furniture")) return "furniture";
    if (n.includes("electronic")) return "electronic";
    if (n.includes("clothing") || n.includes("cloth")) return "clothing";
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
const ShoppingList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── state ────────────────────────────────────────────────────────────────
    const [nearbyStores, setNearbyStores] = useState<ShoppingStore[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    // ── fetch nearby stores with automatic location ──────────────────────────
    const fetchNearbyStores = useCallback(async () => {
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

            console.log("Fetching nearby stores with coordinates:", { latitude, longitude, distance });
            const response = await getNearbyShoppingStores(latitude, longitude, distance);
            console.log("Nearby stores API response:", response);

            if (response.success) {
                const allStores = response.data || [];
                console.log("All stores fetched:", allStores);

                if (subcategory) {
                    const targetType = getTypeFromSubcategory(subcategory);
                    if (targetType) {
                        const normalizedTarget = normalizeType(targetType);
                        const filtered = allStores.filter(s =>
                            s.storeType && normalizeType(s.storeType) === normalizedTarget
                        );
                        console.log(`Filtered stores for ${targetType}:`, filtered);
                        setNearbyStores(filtered);
                    } else {
                        setNearbyStores(allStores);
                    }
                } else {
                    setNearbyStores(allStores);
                }
            } else {
                console.warn("API returned success=false:", response);
                setNearbyStores([]);
            }
        } catch (err: any) {
            console.error("fetchNearbyStores error:", err);
            setLocationError(
                err.message === "User denied Geolocation"
                    ? "Location access denied. Please enable location services to see nearby stores."
                    : err.message || "Failed to get location. Please enable location services."
            );
            setNearbyStores([]);
        } finally {
            setLoading(false);
        }
    }, [subcategory]);

    useEffect(() => {
        console.log("Component mounted/updated. Subcategory:", subcategory);
        fetchNearbyStores();
    }, [fetchNearbyStores]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (id: string) => {
        console.log("Viewing store details:", id);
        navigate(`/shopping/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(subcategory
            ? `/add-shopping-form?subcategory=${subcategory}`
            : "/add-shopping-form"
        );
    };

    // ── display helpers ──────────────────────────────────────────────────────
    const getDisplayTitle = () =>
        subcategory
            ? subcategory.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
            : "All Shopping & Retail";

    const getCardComponent = (): React.ComponentType<any> | null => {
        if (subcategory) {
            const key = resolveCardKey(subcategory);
            console.log("Card key from subcategory:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        if (nearbyStores.length > 0 && nearbyStores[0].storeType) {
            const key = getCardKeyFromType(nearbyStores[0].storeType);
            console.log("Card key from first store type:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        // Default to supermarket card if no specific match
        console.log("Using default supermarket card component");
        return CARD_MAP.supermarket;
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
                    <p className={`${typography.body.small} text-gray-600`}>Loading stores...</p>
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
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-4 sm:space-y-6 md:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight text-xl sm:text-2xl md:text-3xl`}>
                        {getDisplayTitle()}
                    </h1>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center !py-2 sm:!py-2.5 !text-sm sm:!text-base"
                    >
                        + Add Post
                    </Button>
                </div>

                {/* ─── ERROR ──────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-2.5 sm:p-3 md:p-4 rounded-lg">
                        <p className={`${typography.body.small} text-red-700 font-medium text-xs sm:text-sm`}>{error}</p>
                    </div>
                )}

                {/* ─── LOCATION ERROR ──────────────────────────────────────── */}
                {locationError && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2.5 sm:p-3 md:p-4 rounded-lg">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <span className="text-xl sm:text-2xl">📍</span>
                            <div className="flex-1 min-w-0">
                                <p className={`${typography.body.small} text-yellow-800 font-semibold mb-1 text-xs sm:text-sm`}>
                                    Location Access Required
                                </p>
                                <p className={`${typography.body.xs} text-yellow-700 text-xs`}>
                                    {locationError}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── NEARBY SECTION ─────────────────────────────── */}
                {CardComponent && (
                    <div>
                        <h2 className={`${typography.heading.h4} text-gray-800 mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl`}>
                            <span className="shrink-0 text-lg sm:text-xl md:text-2xl">🛒</span>
                            <span className="truncate flex-1 min-w-0">Nearby {getDisplayTitle()}</span>
                            {nearbyStores.length > 0 && (
                                <span className={`${typography.misc.badge} bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ml-1 sm:ml-2 text-xs sm:text-sm shrink-0`}>
                                    {nearbyStores.length}
                                </span>
                            )}
                        </h2>

                        {/* Always render the CardComponent - it will handle its own dummy data */}
                        <CardComponent
                            onViewDetails={(store: any) => {
                                const id = store.id || store._id;
                                console.log("Card view details clicked:", id);
                                handleView(id);
                            }}
                            nearbyData={nearbyStores.length > 0 ? nearbyStores : undefined}
                            userLocation={userLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingList;