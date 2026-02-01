import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Import plumber card components
import PlumberCard from "../components/cards/Plumbers/NearByPlumbars";
import ElectricianCard from "../components/cards/Plumbers/NearByElectricianCard";
import PainterCard from "../components/cards/Plumbers/NearByPaintersCard";
import CarpenterCard from "../components/cards/Plumbers/NearByCarpenterCard";
import ACServiceCard from "../components/cards/Plumbers/NearByAcService";

import FridgeServiceCard from "../components/cards/Plumbers/NearByFridgeRepair";
import WashingMachineServiceCard from "../components/cards/Plumbers/NearByWashingMachineRepair";
import GasStoveServiceCard from "../components/cards/Plumbers/NearByGasRepairServiceCard";
import ROWaterPurifierServiceCard from "../components/cards/Plumbers/NearByWaterPurifier";
import NearbySolarServiceCard from "../components/cards/Plumbers/NearBySolarService";

export interface PlumberServiceType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    serviceData?: {
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        phone?: string;
        photos?: string[];
        verified?: boolean;
        trending?: boolean;
        response_time?: string;
        is_verified?: boolean;
        is_trending?: boolean;
        is_popular?: boolean;
        is_responsive?: boolean;
        is_top_rated?: boolean;
        is_trust?: boolean;
        is_top_search?: boolean;
        yearsInBusiness?: number;
        startingPrice?: string;
        suggestions?: number;
        suggestion_text?: string;
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

const PlumberServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<PlumberServiceType[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    const handleView = (service: any) => {
        navigate(`/plumber-services/details/${service.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-plumber-service-form/${id}`);
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
        navigate("/add-plumber-service-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Plumber & Home Repair Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    // ✅ Normalize subcategory to handle different route formats
    const normalizeSubcategory = (sub: string | undefined): string => {
        if (!sub) return "";

        // Convert to lowercase for consistent comparison
        const normalized = sub.toLowerCase();

        // Log for debugging
        console.log("📍 Raw subcategory:", sub);
        console.log("📍 Normalized subcategory:", normalized);

        return normalized;
    };

    // ✅ Smart matching function to handle route variations
    const getCardComponentForSubcategory = (
        subcategory: string | undefined
    ): React.ComponentType<any> | null => {
        if (!subcategory) return null;

        const normalized = normalizeSubcategory(subcategory);

        // ✅ PLUMBERS MATCHING
        if (
            normalized.includes("plumber") ||
            normalized === "plumbing" ||
            normalized === "plumbing-services"
        ) {
            console.log("✅ Matched to PlumberCard");
            return PlumberCard;
        }

        // ✅ ELECTRICIANS MATCHING
        if (
            normalized.includes("electrician") ||
            normalized === "electrical" ||
            normalized === "electrical-services"
        ) {
            console.log("✅ Matched to ElectricianCard");
            return ElectricianCard;
        }

        // ✅ PAINTERS MATCHING
        if (
            normalized.includes("painter") ||
            normalized.includes("painting") ||
            normalized === "painting-contractors"
        ) {
            console.log("✅ Matched to PainterCard");
            return PainterCard;
        }

        // ✅ CARPENTERS MATCHING
        if (normalized.includes("carpenter")) {
            console.log("✅ Matched to CarpenterCard");
            return CarpenterCard;
        }

        // ✅ AC REPAIR MATCHING
        if (
            normalized.includes("ac") && normalized.includes("repair") ||
            normalized === "ac-repair" ||
            normalized === "ac-service"
        ) {
            console.log("✅ Matched to ACServiceCard");
            return ACServiceCard;
        }

        // ✅ FRIDGE REPAIR MATCHING
        if (
            normalized.includes("fridge") ||
            normalized.includes("refrigerator") ||
            normalized === "fridge-repair"
        ) {
            console.log("✅ Matched to FridgeServiceCard");
            return FridgeServiceCard;
        }

        // ✅ WASHING MACHINE MATCHING
        if (
            normalized.includes("washing") && normalized.includes("machine") ||
            normalized === "washing-machine-repair"
        ) {
            console.log("✅ Matched to WashingMachineServiceCard");
            return WashingMachineServiceCard;
        }

        // ✅ GAS STOVE MATCHING
        if (
            normalized.includes("gas") && normalized.includes("stove") ||
            normalized === "gas-stove-repair"
        ) {
            console.log("✅ Matched to GasStoveServiceCard");
            return GasStoveServiceCard;
        }

        // ✅ WATER PURIFIER MATCHING
        if (
            normalized.includes("water") && normalized.includes("purifier") ||
            normalized.includes("ro") ||
            normalized === "ro-service" ||
            normalized === "water-purifier-service"
        ) {
            console.log("✅ Matched to ROWaterPurifierServiceCard");
            return ROWaterPurifierServiceCard;
        }

        // ✅ SOLAR PANEL MATCHING
        if (
            normalized.includes("solar") ||
            normalized === "solar-panel-installation" ||
            normalized === "solar-installation"
        ) {
            console.log("✅ Matched to NearbySolarServiceCard");
            return NearbySolarServiceCard;
        }

        console.warn(`⚠️ No matching card component for: "${subcategory}"`);
        return null;
    };

    // Helper function to check if subcategory should show nearby cards
    const shouldShowNearbyCards = (): boolean => {
        if (!subcategory) return false;

        const normalized = normalizeSubcategory(subcategory);

        // Check if any of the keywords match
        const keywords = [
            "plumber",
            "electrician",
            "painter",
            "ac",
            "fridge",
            "refrigerator",
            "washing",
            "machine",
            "gas",
            "stove",
            "water",
            "purifier",
            "ro",
            "solar",
            "carpenter",
            "repair",
            "service",
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

        return hasMatch;
    };

    // Render nearby cards which have dummy data built-in
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
                        🔧 Nearby {getDisplayTitle()}
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                🔧 Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <CardComponent plumber={service} onViewDetails={handleView} />
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
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {getDisplayTitle()}
                    </h1>
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
                                <div className="text-6xl mb-4">🔧</div>
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
                                            <span>🔧</span>
                                            <span>{service.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">🔧</span>
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

                                            {service.distance && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">📍</span>
                                                    <span className="text-blue-600 font-semibold">
                                                        {service.distance} km away
                                                    </span>
                                                </div>
                                            )}

                                            {service.serviceData?.rating && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="font-semibold">
                                                        {service.serviceData.rating}
                                                    </span>
                                                    {service.serviceData.user_ratings_total && (
                                                        <span className="text-gray-500 text-sm">
                                                            ({service.serviceData.user_ratings_total})
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {service.serviceData?.opening_hours?.open_now !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${service.serviceData.opening_hours.open_now
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <span className="mr-1">
                                                            {service.serviceData.opening_hours.open_now ? "✓" : "✗"}
                                                        </span>
                                                        {service.serviceData.opening_hours.open_now ? "Open Now" : "Closed"}
                                                    </span>
                                                </div>
                                            )}
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

export default PlumberServicesList;