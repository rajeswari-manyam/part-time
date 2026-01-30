import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Import existing business service card components
import CharteredAccountantCard from "../components/cards/Business/NearByCharteredAccountant";
import EventOrganizersScreen from "../components/cards/Business/NearByEvents";
import InsuranceAgentsCard from "../components/cards/Business/NearByInsuranceAgents";
import NearbyLawyerCard from "../components/cards/Business/NearByLawyers";
import MarketingAgenciesCard from "../components/cards/Business/NearByMarketingAgents";
import NearbyNotaryCard from "../components/cards/Business/NearByNotaryCard";
import RegistrationConsultantsCard from "../components/cards/Business/NearByConsultantCard";


import NearbyPrintingCard from "../components/cards/Business/NearByPrinitingCard";
import PlacementServicesScreen from "../components/cards/Business/NearByPlacement";
export interface BusinessServiceType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    serviceData?: {
        status: boolean;
        pincode: string;
        icon: string;
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        phone?: string;
        whatsapp?: string;
        photos?: string[];
        special_tags?: string[];
        specializations?: string[];
        years_in_business?: number;
        price_range?: string;
        services?: string[];
        quote?: string;
        suggestions?: number;
        is_trending?: boolean;
        verified?: boolean;
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

const BusinessServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<BusinessServiceType[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    const handleView = (service: any) => {
        navigate(`/business-services/details/${service.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-business-service-form/${id}`);
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
        navigate("/add-business-service-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Business & Professional Services";
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

        // ✅ CHARTERED ACCOUNTANT / CA / TAX CONSULTANTS MATCHING
        if (
            normalized.includes("chartered") && normalized.includes("accountant") ||
            normalized === "ca" ||
            normalized.includes("ca-") ||
            normalized.includes("tax") && normalized.includes("consultant")
        ) {
            console.log("✅ Matched to CharteredAccountantCard");
            return CharteredAccountantCard;
        }

        // ✅ EVENT PLANNERS / ORGANIZERS MATCHING
        if (
            normalized.includes("event") && (
                normalized.includes("planner") ||
                normalized.includes("organizer")
            )
        ) {
            console.log("✅ Matched to EventOrganizersScreen");
            return EventOrganizersScreen;
        }

        // ✅ INSURANCE AGENTS MATCHING
        if (normalized.includes("insurance") && normalized.includes("agent")) {
            console.log("✅ Matched to InsuranceAgentsCard");
            return InsuranceAgentsCard;
        }

        // ✅ LAWYERS MATCHING
        if (normalized.includes("lawyer")) {
            console.log("✅ Matched to NearbyLawyerCard");
            return NearbyLawyerCard;
        }

        // ✅ MARKETING AGENCIES MATCHING
        if (normalized.includes("marketing") && normalized.includes("agenc")) {
            console.log("✅ Matched to MarketingAgenciesCard");
            return MarketingAgenciesCard;
        }

        // ✅ NOTARY MATCHING
        if (normalized.includes("notary")) {
            console.log("✅ Matched to NearbyNotaryCard");
            return NearbyNotaryCard;
        }

        // ✅ REGISTRATION CONSULTANTS MATCHING
        if (
            normalized.includes("registration") && normalized.includes("consultant")
        ) {
            console.log("✅ Matched to RegistrationConsultantsCard");
            return RegistrationConsultantsCard;
        }


        if (normalized.includes("placement")) {
            console.log("✅ Matched to PlacementServicesScreen");
            return PlacementServicesScreen;
        }
        if (normalized.includes("printing")) {
            console.log("✅ Matched to NearbyPrintingCard");
            return NearbyPrintingCard;
        }
        if (normalized.includes("consultant")) {
            console.log("✅ Matched to RegistrationConsultantsCard");
            return RegistrationConsultantsCard;
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
            return NearbyPrintingCard;
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
            "chartered",
            "accountant",
            "ca",
            "tax",
            "event",
            "insurance",
            "lawyer",
            "marketing",
            "notary",
            "registration",
            "photography",
            "videography",
            "printing",
            "xerox",
            "publishing",
            "placement"
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

        return hasMatch;
    };

    // Get appropriate icon for service type
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
        if (normalized.includes("photo") || normalized.includes("video")) return "📸";
        if (normalized.includes("printing")) return "🖨️";
        if (normalized.includes("placement")) return "placement";

        return "💼";
    };

    // Render nearby cards which have dummy data built-in
    const renderNearbyCardsSection = () => {
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            {getServiceIcon(subcategory)} Nearby {getDisplayTitle()}
                        </h2>
                        <EventOrganizersScreen onViewDetails={handleView} />
                    </div>

                    {/* Real API Services Section */}
                    {services.length > 0 && (
                        <>
                            <div className="my-8 flex items-center gap-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                    💼 Your Listed Services ({services.length})
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
        }

        return (
            <div className="space-y-8">
                {/* Nearby Card Components - renders built-in dummy data */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        {getServiceIcon(subcategory)} Nearby {getDisplayTitle()}
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                💼 Your Listed Services ({services.length})
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
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{getServiceIcon(subcategory)}</span>
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
                                <div className="text-6xl mb-4">{getServiceIcon(subcategory)}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    No Services Found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Be the first to add a service in this category!
                                </p>
                                <Button variant="gradient-blue" size="md" onClick={handleAddPost}>
                                    + Add Your Service
                                </Button>
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
                                            <span>{service.serviceData?.icon || getServiceIcon(subcategory)}</span>
                                            <span>{service.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {service.serviceData?.icon || getServiceIcon(subcategory)}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                {service.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                📍 {service.location}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {/* Rating */}
                                            {service.serviceData?.rating && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="font-semibold">
                                                        {service.serviceData.rating.toFixed(1)}
                                                    </span>
                                                    {service.serviceData.user_ratings_total && (
                                                        <span className="text-gray-500">
                                                            ({service.serviceData.user_ratings_total} reviews)
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Special Tags */}
                                            {service.serviceData?.special_tags && service.serviceData.special_tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {service.serviceData.special_tags.slice(0, 2).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Years in Business */}
                                            {service.serviceData?.years_in_business && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span>💼</span>
                                                    <span>{service.serviceData.years_in_business} Years in Business</span>
                                                </div>
                                            )}

                                            {/* Status */}
                                            {service.serviceData?.status !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${service.serviceData.status
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <span className="mr-1">
                                                            {service.serviceData.status ? "✓" : "✗"}
                                                        </span>
                                                        {service.serviceData.status ? "Available" : "Unavailable"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Contact Info */}
                                            {service.serviceData?.phone && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                                    <span>📞</span>
                                                    <span className="font-medium">{service.serviceData.phone}</span>
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

export default BusinessServicesList;