import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import BorewellServiceCard from "../components/cards/Industrial/NearByBoreWell";
import FabricatorServiceCard from "../components/cards/Industrial/NearByfabricators";
import TransporterServiceCard from "../components/cards/Industrial/NearByTransport";
import WaterTankCleaningCard from "../components/cards/Industrial/NearByWaterTankCleaning";
import ScrapDealerCard from "../components/cards/Industrial/NearByScrapDealers";
import MachineWorkCard from "../components/cards/Industrial/NearByMachine";

// ── Import API service
import { getNearbyIndustrialWorkers, IndustrialWorker, IndustrialWorkerResponse } from "../services/IndustrialService.service";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "borewell" | "fabricators" | "transporters"
    | "water-tank-cleaning" | "scrap-dealers" | "machine-repair";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    borewell: BorewellServiceCard,
    fabricators: FabricatorServiceCard,
    transporters: TransporterServiceCard,
    "water-tank-cleaning": WaterTankCleaningCard,
    "scrap-dealers": ScrapDealerCard,
    "machine-repair": MachineWorkCard,
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

    // Borewell matching
    if (normalized.includes("borewell") || normalized.includes("bore") || normalized.includes("well")) {
        console.log("✅ Matched to BorewellServiceCard");
        return CARD_MAP.borewell;
    }

    // Fabricator matching
    if (normalized.includes("fabricat") || normalized.includes("steel") || normalized.includes("metal")) {
        console.log("✅ Matched to FabricatorServiceCard");
        return CARD_MAP.fabricators;
    }

    // Transporter matching
    if (normalized.includes("transport") || normalized.includes("logistics") || normalized.includes("cargo")) {
        console.log("✅ Matched to TransporterServiceCard");
        return CARD_MAP.transporters;
    }

    // Water tank cleaning matching
    if (normalized.includes("water") || normalized.includes("tank") || normalized.includes("cleaning")) {
        console.log("✅ Matched to WaterTankCleaningCard");
        return CARD_MAP["water-tank-cleaning"];
    }

    // Scrap dealer matching
    if (normalized.includes("scrap") || normalized.includes("recycle") || normalized.includes("waste")) {
        console.log("✅ Matched to ScrapDealerCard");
        return CARD_MAP["scrap-dealers"];
    }

    // Machine repair matching
    if (normalized.includes("machine") || normalized.includes("repair") || normalized.includes("maintenance")) {
        console.log("✅ Matched to MachineWorkCard");
        return CARD_MAP["machine-repair"];
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.borewell; // Default to borewell card
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Industrial Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getCategoryIcon = (subcategory: string | undefined) => {
    if (!subcategory) return "🏭";

    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("borewell") || normalized.includes("bore")) return "🚜";
    if (normalized.includes("fabricat") || normalized.includes("steel")) return "🔧";
    if (normalized.includes("transport") || normalized.includes("logistics")) return "🚛";
    if (normalized.includes("water") || normalized.includes("tank")) return "💧";
    if (normalized.includes("scrap") || normalized.includes("recycle")) return "♻️";
    if (normalized.includes("machine") || normalized.includes("repair")) return "⚙️";
    if (normalized.includes("mover") || normalized.includes("packer")) return "📦";

    return "🏭";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const IndustrialServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── State management ─────────────────────────────────────────────
    const [nearbyData, setNearbyData] = useState<IndustrialWorker[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
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

    // ── Fetch nearby industrial services ─────────────────────────────
    useEffect(() => {
        const fetchNearbyServices = async () => {
            if (!userLocation) return;

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Fetching nearby industrial services...", {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    distance,
                });

                const response: IndustrialWorkerResponse = await getNearbyIndustrialWorkers(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                    console.log("✅ Nearby industrial services fetched:", dataArray);
                    setNearbyData(dataArray);
                } else {
                    console.warn("⚠️ No nearby industrial services found");
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby industrial services:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userLocation) {
            fetchNearbyServices();
        } else {
            setLoading(false);
        }
    }, [userLocation, distance, subcategory]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing industrial service details:", id);
        navigate(`/industrial-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-industrial-service-form?subcategory=${subcategory}`
                : "/add-industrial-service-form"
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">{getCategoryIcon(subcategory)}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No Services Found
                    </h3>
                    <p className="text-gray-600">
                        Select a category or add a new service!
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
                        <span className="shrink-0">{getCategoryIcon(subcategory)}</span>
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

                {/* Loading indicator while fetching */}
                {loading && (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-2">⏳</div>
                        <p className="text-gray-600">Loading nearby services...</p>
                    </div>
                )}

                {/* Always render card component - it will show dummy data or real data */}
                <div className="mb-6">
                    <CardComponent
                        onViewDetails={handleView}
                        nearbyData={nearbyData}
                        userLocation={userLocation}
                    />
                </div>
            </div>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight flex items-center gap-3`}>
                        <span className="text-4xl">{getCategoryIcon(subcategory)}</span>
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
                {renderCardsSection()}
            </div>
        </div>
    );
};

export default IndustrialServicesList;