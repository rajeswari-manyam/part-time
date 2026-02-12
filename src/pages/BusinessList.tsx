import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import CharteredAccountantCard from "../components/cards/Business/NearByCharteredAccountant";
import EventOrganizersScreen from "../components/cards/Business/NearByEvents";
import InsuranceAgentsCard from "../components/cards/Business/NearByInsuranceAgents";
import NearbyLawyerCard from "../components/cards/Business/NearByLawyers";
import MarketingAgenciesCard from "../components/cards/Business/NearByMarketingAgents";
import NearbyNotaryCard from "../components/cards/Business/NearByNotaryCard";
import RegistrationConsultantsCard from "../components/cards/Business/NearByConsultantCard";
import NearbyPrintingCard from "../components/cards/Business/NearByPrinitingCard";
import PlacementServicesScreen from "../components/cards/Business/NearByPlacement";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey = 
    | "ca" 
    | "event" 
    | "insurance" 
    | "lawyer" 
    | "marketing" 
    | "notary" 
    | "consultant" 
    | "printing" 
    | "placement";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    ca: CharteredAccountantCard,
    event: EventOrganizersScreen,
    insurance: InsuranceAgentsCard,
    lawyer: NearbyLawyerCard,
    marketing: MarketingAgenciesCard,
    notary: NearbyNotaryCard,
    consultant: RegistrationConsultantsCard,
    printing: NearbyPrintingCard,
    placement: PlacementServicesScreen,
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

    // ✅ CHARTERED ACCOUNTANT / CA / TAX CONSULTANTS MATCHING
    if (
        (normalized.includes("chartered") && normalized.includes("accountant")) ||
        normalized === "ca" ||
        normalized.includes("ca-") ||
        (normalized.includes("tax") && normalized.includes("consultant"))
    ) {
        console.log("✅ Matched to CharteredAccountantCard");
        return CARD_MAP.ca;
    }

    // ✅ EVENT PLANNERS / ORGANIZERS MATCHING
    if (
        normalized.includes("event") && (
            normalized.includes("planner") ||
            normalized.includes("organizer")
        )
    ) {
        console.log("✅ Matched to EventOrganizersScreen");
        return CARD_MAP.event;
    }

    // ✅ INSURANCE AGENTS MATCHING
    if (normalized.includes("insurance") && normalized.includes("agent")) {
        console.log("✅ Matched to InsuranceAgentsCard");
        return CARD_MAP.insurance;
    }

    // ✅ LAWYERS MATCHING
    if (normalized.includes("lawyer")) {
        console.log("✅ Matched to NearbyLawyerCard");
        return CARD_MAP.lawyer;
    }

    // ✅ MARKETING AGENCIES MATCHING
    if (normalized.includes("marketing") && normalized.includes("agenc")) {
        console.log("✅ Matched to MarketingAgenciesCard");
        return CARD_MAP.marketing;
    }

    // ✅ NOTARY MATCHING
    if (normalized.includes("notary")) {
        console.log("✅ Matched to NearbyNotaryCard");
        return CARD_MAP.notary;
    }

    // ✅ REGISTRATION CONSULTANTS MATCHING
    if (
        normalized.includes("registration") && normalized.includes("consultant")
    ) {
        console.log("✅ Matched to RegistrationConsultantsCard");
        return CARD_MAP.consultant;
    }

    // ✅ PLACEMENT MATCHING
    if (normalized.includes("placement")) {
        console.log("✅ Matched to PlacementServicesScreen");
        return CARD_MAP.placement;
    }

    // ✅ PRINTING & PUBLISHING SERVICES MATCHING
    if (
        (normalized.includes("printing") || normalized.includes("xerox")) && (
            normalized.includes("publishing") ||
            normalized.includes("service") ||
            normalized.includes("shop")
        )
    ) {
        console.log("✅ Matched to NearbyPrintingCard");
        return CARD_MAP.printing;
    }

    // ✅ CONSULTANT (generic) MATCHING
    if (normalized.includes("consultant")) {
        console.log("✅ Matched to RegistrationConsultantsCard");
        return CARD_MAP.consultant;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return null;
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "chartered", "accountant", "ca", "tax",
        "event", "insurance", "lawyer", "marketing",
        "notary", "registration", "printing", "xerox",
        "publishing", "placement", "consultant"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Business & Professional Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const getServiceIcon = (subcategory: string | undefined): string => {
    if (!subcategory) return "💼";

    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("chartered") || normalized.includes("ca") || normalized.includes("tax")) return "💰";
    if (normalized.includes("event")) return "🎉";
    if (normalized.includes("insurance")) return "🛡️";
    if (normalized.includes("lawyer")) return "⚖️";
    if (normalized.includes("marketing")) return "📢";
    if (normalized.includes("notary")) return "📝";
    if (normalized.includes("registration")) return "📋";
    if (normalized.includes("printing")) return "🖨️";
    if (normalized.includes("placement")) return "👥";

    return "💼";
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const BusinessServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [loading] = useState(false);
    const [error] = useState("");

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing service details:", id);
        navigate(`/business-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-business-service-form?subcategory=${subcategory}`
                : "/add-business-service-form"
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        // Special handling for EventOrganizersScreen which is a full screen component
        if (CardComponent === EventOrganizersScreen) {
            return (
                <div className="space-y-8">
                    <div>
                        <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                            <span className="shrink-0">{getServiceIcon(subcategory)}</span>
                            <span className="truncate">Nearby {getDisplayTitle(subcategory)}</span>
                        </h2>
                        <EventOrganizersScreen onViewDetails={handleView} />
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Nearby Card Components - renders built-in dummy data */}
                <div>
                    <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                        <span className="shrink-0">{getServiceIcon(subcategory)}</span>
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle(subcategory)}
                    </h1>

                    <Button
                        variant="gradient-blue"
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
                        <div className="text-6xl mb-4">{getServiceIcon(subcategory)}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Services Found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Select a category or add a new service!
                        </p>
                        <Button 
                            variant="gradient-blue" 
                            size="md" 
                            onClick={handleAddPost}
                        >
                            + Add Your Service
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessServicesList;