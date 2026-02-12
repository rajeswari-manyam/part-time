import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// Import beauty/wellness card components with dummy data
import NearbyBeautyCard from "../components/cards/Beauty/NearByBeauty";
import NearbyFitnessCard from "../components/cards/Beauty/NearByFittness";
import NearbyMakeupCard from "../components/cards/Beauty/NearByMackup";
import NearbySalonCard from "../components/cards/Beauty/NearSaloane";
import NearbySpaServiceCard from "../components/cards/Beauty/NearbySpaServiceCard";
import NearbyYogaCard from "../components/cards/Beauty/NearbyYogaCard";
import NearbyTattooCard from "../components/cards/Beauty/NearTatoo";
import NearbyMehendiCard from "../components/cards/Beauty/NearByMehende";
import NearbySkinClinicCard from "../components/cards/Beauty/NearBySkinClik";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "beauty-parlour" | "fitness" | "makeup" | "salon"
    | "spa" | "yoga" | "tattoo" | "mehendi" | "skin-clinic";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    "beauty-parlour": NearbyBeautyCard,
    "fitness": NearbyFitnessCard,
    "makeup": NearbyMakeupCard,
    "salon": NearbySalonCard,
    "spa": NearbySpaServiceCard,
    "yoga": NearbyYogaCard,
    "tattoo": NearbyTattooCard,
    "mehendi": NearbyMehendiCard,
    "skin-clinic": NearbySkinClinicCard,
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

    // BEAUTY PARLOUR MATCHING
    if (
        (normalized.includes("beauty") && normalized.includes("parlour")) ||
        normalized.includes("beautyparlour") ||
        normalized.includes("beautician")
    ) {
        console.log("✅ Matched to NearbyBeautyCard");
        return CARD_MAP["beauty-parlour"];
    }

    // FITNESS MATCHING
    if (normalized.includes("fitness") || normalized.includes("gym")) {
        console.log("✅ Matched to NearbyFitnessCard");
        return CARD_MAP["fitness"];
    }

    // MAKEUP MATCHING
    if (normalized.includes("makeup") || normalized.includes("make-up")) {
        console.log("✅ Matched to NearbyMakeupCard");
        return CARD_MAP["makeup"];
    }

    // SALON MATCHING
    if (
        normalized.includes("salon") ||
        normalized.includes("saloon") ||
        normalized.includes("hair")
    ) {
        console.log("✅ Matched to NearbySalonCard");
        return CARD_MAP["salon"];
    }

    // SPA MATCHING
    if (normalized.includes("spa") || normalized.includes("massage")) {
        console.log("✅ Matched to NearbySpaServiceCard");
        return CARD_MAP["spa"];
    }

    // YOGA MATCHING
    if (normalized.includes("yoga")) {
        console.log("✅ Matched to NearbyYogaCard");
        return CARD_MAP["yoga"];
    }

    // TATTOO MATCHING
    if (normalized.includes("tattoo")) {
        console.log("✅ Matched to NearbyTattooCard");
        return CARD_MAP["tattoo"];
    }

    // MEHENDI MATCHING
    if (normalized.includes("mehendi") || normalized.includes("mehndi")) {
        console.log("✅ Matched to NearbyMehendiCard");
        return CARD_MAP["mehendi"];
    }

    // SKIN CLINIC MATCHING
    if (
        (normalized.includes("skin") && normalized.includes("clinic")) ||
        normalized.includes("dermatologist") ||
        normalized.includes("skincare")
    ) {
        console.log("✅ Matched to NearbySkinClinicCard");
        return CARD_MAP["skin-clinic"];
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP["beauty-parlour"]; // Default to beauty card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "beauty", "parlour", "fitness", "gym", "makeup", "salon",
        "spa", "massage", "yoga", "tattoo", "mehendi", "mehndi",
        "skin", "clinic", "dermatologist", "skincare", "hair",
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Beauty & Wellness Services";
    return subcategory
        .split("-")
        .map((w) => (w === "&" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const BeautyServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading] = useState(false);
    const [error] = useState("");

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing beauty service details:", id);
        navigate(`/beauty-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-beauty-service-form?subcategory=${subcategory}`
                : "/add-beauty-service-form"
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
                        <span className="shrink-0">💆</span>
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
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

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* ─── CONTENT RENDERING ─────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with dummy data built-in
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">💆</div>
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

export default BeautyServicesList;