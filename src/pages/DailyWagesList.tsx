import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data ──────────────────────────────────
import NearbyWorkersCard from "../components/cards/DailyWages/NearByLoadingWorkers";
import NearbyCleaningScreen from "../components/cards/DailyWages/NearByCleaning";
import NearbyConstructionScreen from "../components/cards/DailyWages/NearByConstructionScreen";
import WashmanScreen from "../components/cards/DailyWages/NearByWashman";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = "loading" | "cleaning" | "construction" | "watchmen";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    loading: NearbyWorkersCard,
    cleaning: NearbyCleaningScreen,
    construction: NearbyConstructionScreen,
    watchmen: WashmanScreen,
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

    // Loading/Unloading Workers
    if (
        normalized.includes("loading") ||
        normalized.includes("unloading") ||
        normalized.includes("material-handling") ||
        normalized.includes("material") ||
        normalized.includes("handling")
    ) {
        console.log("✅ Matched to NearbyWorkersCard (Loading)");
        return CARD_MAP.loading;
    }

    // Cleaning Helpers
    if (
        normalized.includes("cleaning") ||
        normalized.includes("house-cleaning") ||
        normalized.includes("housekeeping") ||
        normalized.includes("helper")
    ) {
        console.log("✅ Matched to NearbyCleaningScreen");
        return CARD_MAP.cleaning;
    }

    // Construction Labor
    if (
        normalized.includes("construction") ||
        normalized.includes("building") ||
        normalized.includes("mason") ||
        normalized.includes("carpenter")
    ) {
        console.log("✅ Matched to NearbyConstructionScreen");
        return CARD_MAP.construction;
    }

    // Watchmen/Security Guards
    if (
        normalized.includes("watchmen") ||
        normalized.includes("watchman") ||
        normalized.includes("security") ||
        normalized.includes("guard")
    ) {
        console.log("✅ Matched to WashmanScreen");
        return CARD_MAP.watchmen;
    }

    // Garden Workers - use loading workers card as generic
    if (
        normalized.includes("garden") ||
        normalized.includes("gardener") ||
        normalized.includes("landscaping")
    ) {
        console.log("✅ Matched to NearbyWorkersCard (Garden)");
        return CARD_MAP.loading;
    }

    // Event Helpers - use loading workers card as generic
    if (
        (normalized.includes("event") && normalized.includes("helper")) ||
        normalized.includes("event-worker") ||
        normalized.includes("event-staff")
    ) {
        console.log("✅ Matched to NearbyWorkersCard (Event)");
        return CARD_MAP.loading;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.loading; // Default to loading workers card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "loading", "unloading", "cleaning", "construction", "labor",
        "labour", "worker", "helper", "garden", "event", "watchmen",
        "watchman", "security", "guard", "housekeeping", "material",
        "handling", "building", "mason", "carpenter",
    ];

    const hasMatch = keywords.some(keyword => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined): string => {
    if (!subcategory) return "All Daily Wage Workers";
    return subcategory
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getCategoryIcon = (subcategory: string | undefined): string => {
    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("loading") || normalized.includes("unloading")) return "📦";
    if (normalized.includes("cleaning")) return "🧹";
    if (normalized.includes("construction")) return "👷";
    if (normalized.includes("garden")) return "🌱";
    if (normalized.includes("event")) return "🎪";
    if (normalized.includes("watchmen") || normalized.includes("watchman") || normalized.includes("security")) return "🛡️";

    return "👷";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const DailyWagesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading] = useState(false);
    const [error] = useState("");

    // ── navigation handlers ──────────────────────────────────────────────────
    const handleView = (worker: any) => {
        const id = worker.id || worker._id;
        console.log("Viewing worker details:", id);
        navigate(`/daily-wages/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-daily-wage-service-form?subcategory=${subcategory}`
                : "/add-daily-wage-service-form"
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading workers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
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
                        <div className="text-6xl mb-4">👷</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Workers Found
                        </h3>
                        <p className="text-gray-600">
                            Select a category or add a new worker listing!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyWagesList;