import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data ──────────────────────────────────
import TractorServiceCard from "../components/cards/Agriculture/NearByTractor";
import WaterPumpServiceCard from "../components/cards/Agriculture/NearByWaterPumpService";
import FertilizerDealerCard from "../components/cards/Agriculture/NearByFertilizerShops";
import SeedDealerCard from "../components/cards/Agriculture/NearBySeedDealer";
import FarmingToolCard from "../components/cards/Agriculture/NearByFarmingTools";
import VeterinaryClinicCard from "../components/cards/Agriculture/NearByVetenary";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "tractor" | "waterpump" | "fertilizer" | "seed" | "tools" | "veterinary";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    tractor: TractorServiceCard,
    waterpump: WaterPumpServiceCard,
    fertilizer: FertilizerDealerCard,
    seed: SeedDealerCard,
    tools: FarmingToolCard,
    veterinary: VeterinaryClinicCard,
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

    // Tractor Service
    if (normalized.includes("tractor")) {
        console.log("✅ Matched to TractorServiceCard");
        return CARD_MAP.tractor;
    }

    // Water Pump Service
    if (normalized.includes("water") || normalized.includes("pump")) {
        console.log("✅ Matched to WaterPumpServiceCard");
        return CARD_MAP.waterpump;
    }

    // Fertilizer Dealer
    if (normalized.includes("fertilizer")) {
        console.log("✅ Matched to FertilizerDealerCard");
        return CARD_MAP.fertilizer;
    }

    // Seed Dealer
    if (normalized.includes("seed")) {
        console.log("✅ Matched to SeedDealerCard");
        return CARD_MAP.seed;
    }

    // Farming Tools
    if (normalized.includes("tool") || normalized.includes("equipment") || normalized.includes("implement")) {
        console.log("✅ Matched to FarmingToolCard");
        return CARD_MAP.tools;
    }

    // Veterinary Services
    if (normalized.includes("veterinary") || normalized.includes("vet") || normalized.includes("animal") || normalized.includes("livestock")) {
        console.log("✅ Matched to VeterinaryClinicCard");
        return CARD_MAP.veterinary;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.tractor; // Default to tractor card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "tractor", "water", "pump", "fertilizer", "seed", "tool",
        "equipment", "implement", "veterinary", "vet", "animal", "livestock",
        "irrigation", "spray", "plow", "harvest"
    ];

    const hasMatch = keywords.some(keyword => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined): string => {
    if (!subcategory) return "All Agriculture Services";
    return subcategory
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getCategoryIcon = (subcategory: string | undefined): string => {
    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("tractor")) return "🚜";
    if (normalized.includes("water") || normalized.includes("pump")) return "💧";
    if (normalized.includes("fertilizer")) return "🌱";
    if (normalized.includes("seed")) return "🌾";
    if (normalized.includes("tool") || normalized.includes("equipment")) return "🔧";
    if (normalized.includes("veterinary") || normalized.includes("vet") || normalized.includes("animal")) return "🐄";

    return "🌾";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const AgricultureServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading] = useState(false);
    const [error] = useState("");

    // ── navigation handlers ──────────────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing service details:", id);
        navigate(`/agriculture-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-agriculture-service-form?subcategory=${subcategory}`
                : "/add-agriculture-service-form"
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────────────
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
                        <span className="shrink-0">{getCategoryIcon(subcategory)}</span>
                        <span className="truncate">Nearby {getDisplayTitle(subcategory)}</span>
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>
            </div>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title + "+ Add Post" ─────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl sm:text-4xl">{getCategoryIcon(subcategory)}</span>
                        <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                            {getDisplayTitle(subcategory)}
                        </h1>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center bg-green-600 hover:bg-green-700"
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

                {/* ─── CONTENT RENDERING ──────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with dummy data built-in
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🌾</div>
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

export default AgricultureServicesList;