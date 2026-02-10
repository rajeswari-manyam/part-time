import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import PetClinicCard from "../components/cards/PetService/NearByPetClinic";
import PetShopCard from "../components/cards/PetService/NearByPetShops";
import PetGroomingCard from "../components/cards/PetService/NearByPetGrooming";
import DogTrainingCard from "../components/cards/PetService/NearByPetTraining";

// ── Import API service
import { getNearbyPetWorkers, PetWorker, PetWorkerResponse } from "../services/PetWorker.service";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "clinic" | "shop" | "grooming" | "training";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    clinic: PetClinicCard,
    shop: PetShopCard,
    grooming: PetGroomingCard,
    training: DogTrainingCard,
};

// ============================================================================
// HELPERS
// ============================================================================
const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return "";
    return sub.toLowerCase();
};

const getCardComponentForSubcategory = (
    subcategory: string | undefined
): React.ComponentType<any> | null => {
    if (!subcategory) return null;

    const normalized = normalizeSubcategory(subcategory);

    if (
        (normalized.includes("vet") && normalized.includes("clinic")) ||
        (normalized.includes("pet") && normalized.includes("clinic")) ||
        normalized.includes("vet-clinic") ||
        normalized.includes("pet-clinic")
    ) {
        return CARD_MAP.clinic;
    }

    if (
        (normalized.includes("pet") && normalized.includes("shop")) ||
        normalized.includes("petshop") ||
        normalized.includes("pet-shop")
    ) {
        return CARD_MAP.shop;
    }

    if (
        (normalized.includes("pet") && normalized.includes("groom")) ||
        normalized.includes("grooming") ||
        normalized.includes("pet-grooming")
    ) {
        return CARD_MAP.grooming;
    }

    if (
        (normalized.includes("dog") && normalized.includes("train")) ||
        (normalized.includes("pet") && normalized.includes("train")) ||
        normalized.includes("dog-training") ||
        normalized.includes("pet-training")
    ) {
        return CARD_MAP.training;
    }

    return CARD_MAP.clinic; // Default to clinic card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;
    const normalized = normalizeSubcategory(subcategory);
    const keywords = ["vet", "clinic", "pet", "shop", "groom", "train"];
    return keywords.some((keyword) => normalized.includes(keyword));
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Pet Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getSubcategoryIcon = (subcategory: string | undefined): string => {
    if (!subcategory) return "🐾";
    const normalized = normalizeSubcategory(subcategory);
    if (normalized.includes("clinic") || normalized.includes("vet")) return "🏥";
    if (normalized.includes("shop")) return "🛒";
    if (normalized.includes("groom")) return "✂️";
    if (normalized.includes("train")) return "🐕";
    return "🐾";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const PetServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── State management ─────────────────────────────────────────────
    const [nearbyData, setNearbyData] = useState<PetWorker[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [distance, setDistance] = useState<number>(10);

    // ── Get user location ────────────────────────────────────────────
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    console.error("❌ Error getting user location:", err);
                    setError("Unable to get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    // ── Fetch nearby pet services ────────────────────────────────────
    useEffect(() => {
        const fetchNearbyPetServices = async () => {
            if (!userLocation) return;

            try {
                setLoading(true);
                setError(null);

                const response: PetWorkerResponse = await getNearbyPetWorkers(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    setNearbyData(response.data);
                } else {
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby pet services:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userLocation && shouldShowNearbyCards(subcategory)) {
            fetchNearbyPetServices();
        } else if (userLocation) {
            setLoading(false);
        }
    }, [userLocation, distance, subcategory]);

    // ── Navigation handlers ──────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        navigate(`/pet-services/details/${id}`);
    };

    // ✅ Navigate to /add-pet-service-form with optional subcategory param
    const handleAddPost = () => {
        if (subcategory) {
            navigate(`/add-pet-service-form?subcategory=${subcategory}`);
        } else {
            navigate("/add-pet-service-form");
        }
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) return null;

        if (loading) {
            return (
                <div className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                Loading nearby services...
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Getting your location and finding services near you
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{error}</h3>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Header with distance filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className={`${typography.heading.h4} text-gray-800 flex items-center gap-2`}>
                        <span className="shrink-0">{getSubcategoryIcon(subcategory)}</span>
                        <span className="truncate">Available {getDisplayTitle(subcategory)}</span>
                    </h2>

                    {/* Distance Filter */}
                    <div className="flex items-center gap-2 shrink-0">
                        <label className="text-sm text-gray-600 whitespace-nowrap">Within:</label>
                        <select
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                <div>
                    {nearbyData.length > 0 ? (
                        <CardComponent
                            onViewDetails={handleView}
                            nearbyData={nearbyData}
                            userLocation={userLocation}
                        />
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="text-5xl mb-3">📍</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                No services found nearby
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Try increasing the search distance or be the first to add a service!
                            </p>
                            <button
                                onClick={handleAddPost}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                + Add a Service
                            </button>
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

                {/* ─── HEADER ── title + "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight flex items-center gap-2`}>
                        <span className="shrink-0">{getSubcategoryIcon(subcategory)}</span>
                        <span className="truncate">{getDisplayTitle(subcategory)}</span>
                    </h1>

                    {/* ✅ Button navigates to /pet-services/add */}
                    <button
                        onClick={handleAddPost}
                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <span className="text-lg leading-none">+</span>
                        <span>Add Post</span>
                    </button>
                </div>

                {/* ─── CONTENT RENDERING ─────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    renderCardsSection()
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🐾</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Services Found
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Select a category or add a new service!
                        </p>
                        <button
                            onClick={handleAddPost}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            + Add New Service
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PetServicesList;