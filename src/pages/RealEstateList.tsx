import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import { getNearbyRealEstates, RealEstateWorker } from "../services/RealEstate.service";

// ── Nearby card components with dummy data
import NearbyPropertyDealersCard from "../components/cards/RealEstate/NearProperty";
import NearbyBuildersCard from "../components/cards/RealEstate/NearByBuilders";
import NearbyInteriorDesignersCard from "../components/cards/RealEstate/NearByInteriorDesigns";
import NearbyRentLeaseCard from "../components/cards/RealEstate/NearByrental";
import NearbyConstructionContractorsCard from "../components/cards/RealEstate/NearByConstructorContractors";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "property" | "builder" | "interior" | "rental" | "construction";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    property: NearbyPropertyDealersCard,
    builder: NearbyBuildersCard,
    interior: NearbyInteriorDesignersCard,
    rental: NearbyRentLeaseCard,
    construction: NearbyConstructionContractorsCard,
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

    // Property dealers matching
    if (normalized.includes("property") && (normalized.includes("dealer") || normalized.includes("agent"))) {
        console.log("✅ Matched to NearbyPropertyDealersCard");
        return CARD_MAP.property;
    }

    // Builders matching
    if (normalized.includes("builder") || normalized.includes("construction")) {
        console.log("✅ Matched to NearbyBuildersCard");
        return CARD_MAP.builder;
    }

    // Interior designers matching
    if (normalized.includes("interior") && (normalized.includes("design") || normalized.includes("decorator"))) {
        console.log("✅ Matched to NearbyInteriorDesignersCard");
        return CARD_MAP.interior;
    }

    // Rent/Lease matching
    if (normalized.includes("rent") || normalized.includes("lease") || normalized.includes("rental")) {
        console.log("✅ Matched to NearbyRentLeaseCard");
        return CARD_MAP.rental;
    }

    // Construction contractors matching
    if (normalized.includes("contractor")) {
        console.log("✅ Matched to NearbyConstructionContractorsCard");
        return CARD_MAP.construction;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.property; // Default to property card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "property", "builder", "interior", "rent", "lease", "rental",
        "construction", "contractor", "dealer", "agent", "design"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Real Estate Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const RealEstateList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nearbyRealEstates, setNearbyRealEstates] = useState<RealEstateWorker[]>([]);
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

    // ── Fetch nearby real estates when location is available ──
    useEffect(() => {
        const fetchNearbyRealEstates = async () => {
            if (!userLocation) return;

            setLoading(true);
            setError("");

            try {
                const response = await getNearbyRealEstates(
                    userLocation.latitude,
                    userLocation.longitude,
                    10 // 10 km range
                );

                if (response.success && response.data) {
                    const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                    setNearbyRealEstates(dataArray);
                    console.log("✅ Nearby real estates:", dataArray);
                } else {
                    setNearbyRealEstates([]);
                }
            } catch (err) {
                console.error("Error fetching nearby real estates:", err);
                setError("Failed to load nearby properties");
                setNearbyRealEstates([]);
            } finally {
                setLoading(false);
            }
        };

        if (userLocation) {
            fetchNearbyRealEstates();
        }
    }, [userLocation]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (realEstate: any) => {
        const id = realEstate.id || realEstate._id;
        console.log("Viewing real estate details:", id);
        navigate(`/real-estate/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new listing. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-real-estate-form?subcategory=${subcategory}`
                : "/add-real-estate-form"
        );
    };

    // ── Helper functions ──
    const openDirections = (realEstate: RealEstateWorker) => {
        if (realEstate.latitude && realEstate.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${realEstate.latitude},${realEstate.longitude}`,
                "_blank"
            );
        } else if (realEstate.area || realEstate.city) {
            const addr = encodeURIComponent(
                [realEstate.address, realEstate.area, realEstate.city, realEstate.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
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

    // ── Render Real Estate Card ──
    const renderRealEstateCard = (realEstate: RealEstateWorker) => {
        const id = realEstate._id || "";
        const location = [realEstate.area, realEstate.city, realEstate.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const amenitiesList: string[] = (realEstate.amenities && typeof realEstate.amenities === 'string')
            ? realEstate.amenities.split(',').map(a => a.trim()).filter(Boolean)
            : (Array.isArray(realEstate.amenities) ? realEstate.amenities : []);

        // Calculate distance if user location is available
        let distance: string | null = null;
        if (userLocation && realEstate.latitude && realEstate.longitude) {
            const dist = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                realEstate.latitude,
                realEstate.longitude
            );
            distance = dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`;
        }

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative cursor-pointer"
                style={{ border: '1px solid #e5e7eb' }}
                onClick={() => handleView(realEstate)}
            >
                {/* Distance Badge */}
                {distance && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow-md">
                            <span>📍</span> {distance} away
                        </span>
                    </div>
                )}

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                        {realEstate.propertyType} - {realEstate.listingType}
                    </h2>

                    {/* Owner Name */}
                    <p className="text-sm font-medium text-gray-700">
                        {realEstate.name}
                    </p>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Property Type and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {realEstate.propertyType && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🏠</span>
                                <span className="truncate">{realEstate.propertyType}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${realEstate.availabilityStatus === 'Available'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${realEstate.availabilityStatus === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {realEstate.availabilityStatus}
                        </span>
                    </div>

                    {/* Description */}
                    {realEstate.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {realEstate.description}
                        </p>
                    )}

                    {/* Property Details */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            {realEstate.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 text-sm">🛏️</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {realEstate.bedrooms} BHK
                                    </span>
                                </div>
                            )}
                            {realEstate.areaSize && (
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 text-sm">📏</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {realEstate.areaSize} sq ft
                                    </span>
                                </div>
                            )}
                        </div>
                        {realEstate.price && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {realEstate.listingType}
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{realEstate.price.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Amenities */}
                    {amenitiesList.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Amenities
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {amenitiesList.slice(0, 3).map((amenity, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-green-500">●</span> {amenity}
                                    </span>
                                ))}
                                {amenitiesList.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{amenitiesList.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                openDirections(realEstate);
                            }}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                realEstate.phone && openCall(realEstate.phone);
                            }}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{realEstate.phone || "No Phone"}</span>
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

    // ── Render Nearby Real Estates ──────────────────────────────────
    const renderNearbyRealEstates = () => {
        if (fetchingLocation) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Detecting your location...</p>
                </div>
            );
        }

        if (locationError) {
            return (
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-3">📍</div>
                    <p className="text-yellow-800 font-medium mb-2">{locationError}</p>
                    <p className="text-sm text-yellow-700">Enable location services to see nearby properties</p>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading nearby properties...</p>
                </div>
            );
        }

        if (nearbyRealEstates.length === 0) {
            return (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Nearby Properties Found
                    </h3>
                    <p className={`${typography.body.small} text-gray-500`}>
                        Try exploring other areas or add your own listing!
                    </p>
                </div>
            );
        }

        return (
            <div>
                <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                    <span className="shrink-0">📍</span>
                    <span className="truncate">Nearby Properties ({nearbyRealEstates.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nearbyRealEstates.map(renderRealEstateCard)}
                </div>
            </div>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    if (loading && !nearbyRealEstates.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading properties...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Listing" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle(subcategory)}
                    </h1>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center bg-green-600 hover:bg-green-700"
                    >
                        + Add Listing
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* ─── NEARBY REAL ESTATES (LIVE DATA) ─────────────────── */}
                {renderNearbyRealEstates()}

                {/* ─── DUMMY CARD COMPONENTS ─────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) && (
                    <div className="mt-8">
                        {renderCardsSection()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealEstateList;