import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Import industrial service card components
import BorewellServiceCard from "../components/cards/Industrial/NearByBoreWell";
import FabricatorServiceCard from "../components/cards/Industrial/NearByfabricators";
import TransporterServiceCard from "../components/cards/Industrial/NearByTransport";
import WaterTankCleaningCard from "../components/cards/Industrial/NearByWaterTankCleaning";
import ScrapDealerCard from "../components/cards/Industrial/NearByScrapDealers";
import MachineWorkCard from "../components/cards/Industrial/NearByMachine";

export interface IndustrialServiceType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    jobData?: {
        status: boolean;
        pincode: string;
        icon: string;
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        phone?: string;
        photos?: string[];
        price_range?: string;
        services?: string[];
        special_tags?: string[];
        years_in_business?: number;
        verified?: boolean;
        trending?: boolean;
        popular?: boolean;
        responsive?: boolean;
        response_time?: string;
        starts_from?: string;
        services_available?: boolean;
        suggestions?: string;
        top_search?: boolean;
        offers?: number;
    };
}

const ActionDropdown: React.FC<{
    serviceId: string;
    onEdit: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ serviceId, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-white/80 bg-white/60 backdrop-blur-sm rounded-full transition shadow-sm"
                aria-label="More options"
            >
                <MoreVertical size={18} className="text-gray-700" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-20">
                        <button
                            onClick={(e) => {
                                onEdit(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition"
                        >
                            ✏️ Edit
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={(e) => {
                                onDelete(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const IndustrialServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<IndustrialServiceType[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    const handleView = (service: any) => {
        navigate(`/industrial-services/details/${service.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-industrial-service-form/${id}`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            setServices((prev) => prev.filter((s) => s.id !== id));
            alert("Service deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete service");
        }
    };

    const handleAddPost = () => {
        navigate("/add-industrial-service-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Industrial Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    /**
     * Normalize subcategory to handle different route formats
     * Converts to lowercase and logs for debugging
     */
    const normalizeSubcategory = (sub: string | undefined): string => {
        if (!sub) return "";
        const normalized = sub.toLowerCase();
        console.log("📍 Raw subcategory:", sub);
        console.log("📍 Normalized subcategory:", normalized);
        return normalized;
    };

    /**
     * Smart matching function to handle route variations
     * Returns the appropriate card component based on subcategory
     * 
     * ✅ FIXED ISSUES:
     * - Removed duplicate checks
     * - Fixed operator precedence for water tank cleaning
     * - Added more comprehensive keyword matching
     * - Added missing variants (drilling, logistics, recycling, etc.)
     */
    const getCardComponentForSubcategory = (
        subcategory: string | undefined
    ): React.ComponentType<any> | null => {
        if (!subcategory) return null;

        const normalized = normalizeSubcategory(subcategory);

        // BOREWELL SERVICES MATCHING
        // Matches: borewell, bore-well, bore well, borewell-services, borewell-drilling, etc.
        if (
            normalized.includes("borewell") ||
            normalized.includes("bore well") ||
            normalized.includes("bore-well") ||
            normalized.includes("drilling")
        ) {
            console.log("✅ Matched to BorewellServiceCard");
            return BorewellServiceCard;
        }

        // FABRICATORS MATCHING
        // Matches: fabricator, fabricators, fabrication, welding, welding-services, etc.
        if (
            normalized.includes("fabricat") ||
            normalized.includes("welding")
        ) {
            console.log("✅ Matched to FabricatorServiceCard");
            return FabricatorServiceCard;
        }

        // TRANSPORTERS MATCHING
        // Matches: transport, transporter, transporters, logistics, cargo, goods-transport, etc.
        if (
            normalized.includes("transport") ||
            normalized.includes("logistic") ||
            normalized.includes("cargo")
        ) {
            console.log("✅ Matched to TransporterServiceCard");
            return TransporterServiceCard;
        }

        // WATER TANK CLEANING MATCHING
        // ✅ FIXED: Added parentheses to fix operator precedence
        // Matches: water-tank-cleaning, tank-cleaning, overhead-tank, underground-tank, etc.
        if (
            (normalized.includes("water") && normalized.includes("tank")) ||
            normalized.includes("tank cleaning") ||
            normalized.includes("overhead tank") ||
            normalized.includes("underground tank")
        ) {
            console.log("✅ Matched to WaterTankCleaningCard");
            return WaterTankCleaningCard;
        }

        // SCRAP DEALERS MATCHING
        // ✅ FIXED: Removed duplicate checks, added recycling variants
        // Matches: scrap, scrap-dealers, scrap-buyers, recycling, e-waste, battery-scrap, etc.
        if (
            normalized.includes("scrap") ||
            normalized.includes("recycl") ||
            normalized.includes("e-waste") ||
            normalized.includes("battery")
        ) {
            console.log("✅ Matched to ScrapDealerCard");
            return ScrapDealerCard;
        }

        // MACHINE WORK MATCHING
        // ✅ FIXED: Removed duplicate checks
        // Matches: machine, machine-work, machine-repair, machinery, machinery-repair, etc.
        if (
            normalized.includes("machine")
        ) {
            console.log("✅ Matched to MachineWorkCard");
            return MachineWorkCard;
        }

        // PACKERS & MOVERS MATCHING
        // Note: Add PackersMoversCard component when available
        if (
            normalized.includes("packer") ||
            normalized.includes("mover") ||
            normalized.includes("relocation") ||
            normalized.includes("shifting")
        ) {
            console.log("⚠️ No PackersMoversCard component available yet");
            // return PackersMoversCard; // Uncomment when component exists
            return null;
        }

        console.warn(`⚠️ No matching card component for: "${subcategory}"`);
        return null;
    };

    /**
     * Helper function to check if subcategory should show nearby cards
     * ✅ UPDATED: Added more comprehensive keywords
     */
    const shouldShowNearbyCards = (): boolean => {
        if (!subcategory) return false;

        const normalized = normalizeSubcategory(subcategory);

        const keywords = [
            "borewell",
            "bore well",
            "drilling",
            "fabricat",
            "welding",
            "transport",
            "logistic",
            "cargo",
            "water tank",
            "tank cleaning",
            "overhead",
            "underground",
            "scrap",
            "recycl",
            "e-waste",
            "machine",
            "machinery",
            "packer",
            "mover",
            "relocation",
            "shifting",
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

        return hasMatch;
    };

    /**
     * Get category icon based on subcategory
     * ✅ UPDATED: Added more comprehensive matching with fixed operator precedence
     */
    const getCategoryIcon = () => {
        const normalized = normalizeSubcategory(subcategory);

        if (normalized.includes("borewell") || normalized.includes("drilling")) return "🚜";
        if (normalized.includes("fabricat") || normalized.includes("welding")) return "🔧";
        if (normalized.includes("transport") || normalized.includes("logistic")) return "🚛";
        if (
            (normalized.includes("water") && normalized.includes("tank")) ||
            normalized.includes("tank cleaning")
        ) return "💧";
        if (normalized.includes("scrap") || normalized.includes("recycl")) return "♻️";
        if (normalized.includes("machine")) return "⚙️";
        if (normalized.includes("packer") || normalized.includes("mover")) return "📦";

        return "🏭";
    };

    /**
     * Render nearby cards which have dummy data built-in
     * This section shows the card components with their internal dummy data
     */
    const renderNearbyCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        return (
            <div className="space-y-8">
                {/* Nearby Card Components - renders built-in dummy data */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        {getCategoryIcon()} Nearby {getDisplayTitle()}
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                {getCategoryIcon()} Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <CardComponent job={service} onViewDetails={handleView} />
                                    <div className="absolute top-3 right-3 z-10">
                                        <ActionDropdown
                                            serviceId={service.id}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50/30 to-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{getCategoryIcon()}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            {getDisplayTitle()}
                        </h1>
                    </div>
                    <Button variant="gradient-blue" size="md" onClick={handleAddPost}>
                        + Add Post
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Content Rendering */}
                {shouldShowNearbyCards() ? (
                    // Render nearby cards with dummy data built-in
                    renderNearbyCardsSection()
                ) : (
                    // Regular display for other subcategories or no subcategory
                    <>
                        {services.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">{getCategoryIcon()}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    No Services Found
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to add a service in this category!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="relative group bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer overflow-hidden"
                                        onClick={() => handleView(service)}
                                    >
                                        {/* Dropdown */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <ActionDropdown
                                                serviceId={service.id}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </div>

                                        {/* Service Badge */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                            <span>{service.jobData?.icon || getCategoryIcon()}</span>
                                            <span>{service.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {service.jobData?.icon || getCategoryIcon()}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                {service.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {service.location}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {service.jobData?.pincode && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">📍</span>
                                                    <span className="text-gray-700">
                                                        Pincode: {service.jobData.pincode}
                                                    </span>
                                                </div>
                                            )}

                                            {service.jobData?.status !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${service.jobData.status
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <span className="mr-1">
                                                            {service.jobData.status ? "✓" : "✗"}
                                                        </span>
                                                        {service.jobData.status ? "Available" : "Busy"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Additional badges for industrial services */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {service.jobData?.verified && (
                                                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-600">
                                                        ✓ Verified
                                                    </span>
                                                )}
                                                {service.jobData?.trending && (
                                                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-600">
                                                        🔥 Trending
                                                    </span>
                                                )}
                                                {service.jobData?.years_in_business && (
                                                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                                        {service.jobData.years_in_business} Years
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default IndustrialServicesList;