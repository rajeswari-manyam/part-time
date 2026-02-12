import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data ───────────────────────────────────
import NearbyCourierCard from "../components/cards/Courier/NearByCourier";
import PackersMoversListing from "../components/cards/Courier/NearByPackers";
import ParcelServicesListing from "../components/cards/Courier/NearByParcelServices";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "courier" | "packers" | "parcel";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    courier: NearbyCourierCard,
    packers: PackersMoversListing,
    parcel: ParcelServicesListing,
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

    // Packers & Movers — check before generic courier
    if (
        normalized.includes("packer") ||
        normalized.includes("mover") ||
        (normalized.includes("packers") && normalized.includes("movers"))
    ) {
        console.log("✅ Matched to PackersMoversListing");
        return CARD_MAP.packers;
    }

    // Parcel / logistics
    if (normalized.includes("parcel") || normalized.includes("logistics")) {
        console.log("✅ Matched to ParcelServicesListing");
        return CARD_MAP.parcel;
    }

    // Generic courier
    if (normalized.includes("courier") || normalized.includes("delivery") || normalized.includes("cargo")) {
        console.log("✅ Matched to NearbyCourierCard");
        return CARD_MAP.courier;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.courier; // Default to courier card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "courier", "parcel", "packer", "mover",
        "logistics", "delivery", "cargo", "transport",
    ];

    const hasMatch = keywords.some(keyword => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined): string => {
    if (!subcategory) return "All Courier Services";
    return subcategory
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const CourierServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading] = useState(false);
    const [error] = useState("");

    // ── navigation handlers ──────────────────────────────────────────────────
    const handleView = (courier: any) => {
        const id = courier.id || courier._id;
        console.log("Viewing courier details:", id);
        navigate(`/courier-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-courier-service-form?subcategory=${subcategory}`
                : "/add-courier-service-form"
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
                        <span className="shrink-0">📦</span>
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title + "+ Add Post" ─────────────────── */}
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

                {/* ─── CONTENT RENDERING ──────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with dummy data built-in
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
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

export default CourierServicesList;