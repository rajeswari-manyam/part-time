import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteSportsActivity, SportsWorker } from "../services/Sports.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const getServiceIcon = (subCategory?: string): string => {
    if (!subCategory) return "🏃";
    const n = subCategory.toLowerCase();
    if (n.includes("gym") || n.includes("fitness")) return "💪";
    if (n.includes("yoga")) return "🧘";
    if (n.includes("swimming")) return "🏊";
    if (n.includes("cricket")) return "🏏";
    if (n.includes("football") || n.includes("soccer")) return "⚽";
    if (n.includes("basketball")) return "🏀";
    if (n.includes("tennis")) return "🎾";
    if (n.includes("badminton")) return "🏸";
    if (n.includes("stadium") || n.includes("ground")) return "🏟️";
    if (n.includes("play") || n.includes("indoor")) return "🎮";
    return "🏃";
};

// ============================================================================
// PROPS
// ============================================================================
interface SportsUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideEmptyState?: boolean;
    hideHeader?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const SportsUserService: React.FC<SportsUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideEmptyState = false,
    hideHeader = false,
}) => {
    const navigate = useNavigate();

    // Cast to SportsWorker[] so all existing field access works
    const [sportsServices, setSportsServices] = useState<SportsWorker[]>(data as SportsWorker[]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? sportsServices.filter(s =>
            s.subCategory &&
            s.subCategory.toLowerCase() === selectedSubcategory.toLowerCase()
        )
        : sportsServices;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this sports service?")) return;
        setDeletingId(id);
        try {
            const result = await deleteSportsActivity(id);
            if (result.success) {
                setSportsServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting sports service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const openDirections = (service: SportsWorker) => {
        if (service.latitude && service.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`,
                "_blank"
            );
        } else if (service.area || service.city) {
            const addr = encodeURIComponent(
                [service.area, service.city, service.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (service: SportsWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const servicesList = service.services || [];
        const imageUrls = (service.images || []).filter(Boolean) as string[];
        const icon = getServiceIcon(service.subCategory);

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600/10 to-blue-600/5">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={service.serviceName || "Service"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{icon}</span>
                        </div>
                    )}

                    {/* SubCategory badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                            {service.subCategory || "Sports"}
                        </span>
                    </div>

                    {/* Action Dropdown */}
                    <div className="absolute top-3 right-3">
                        {deletingId === id ? (
                            <div className="bg-white rounded-lg p-2 shadow-lg">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                            </div>
                        ) : (
                            <ActionDropdown
                                onEdit={() => navigate(`/add-sports-service-form?id=${id}`)}
                                onDelete={() => handleDelete(id)}
                            />
                        )}
                    </div>
                </div>

                {/* ── Details ── */}
                <div className="p-4">
                    <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                        {service.serviceName || "Unnamed Service"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Description */}
                    {service.description && (
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                            {service.description}
                        </p>
                    )}

                    {/* Availability + chargeType badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${service.availability
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${service.availability ? "bg-green-500" : "bg-red-500"}`} />
                            {service.availability ? "Available" : "Unavailable"}
                        </span>
                        {service.chargeType && (
                            <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                                Per {service.chargeType}
                            </span>
                        )}
                    </div>

                    {/* Experience + Charge */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                        <div className="flex items-center gap-3">
                            {service.experience && (
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                    🏅 {service.experience} yrs
                                </span>
                            )}
                            {service.rating && (
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    ⭐ {service.rating}
                                </span>
                            )}
                        </div>
                        {service.serviceCharge && service.chargeType && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Charge</p>
                                <p className="text-base font-bold text-blue-600">
                                    ₹{service.serviceCharge}/{service.chargeType}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Services Tags */}
                    {servicesList.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                            <div className="flex flex-wrap gap-1">
                                {servicesList.slice(0, 3).map((s, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-blue-600/5 text-blue-700 px-2 py-0.5 rounded-full`}>
                                        {s}
                                    </span>
                                ))}
                                {servicesList.length > 3 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{servicesList.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Directions + View Details */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(service)}
                            className="flex-1 justify-center border-blue-600 text-blue-600 hover:bg-blue-600/10"
                        >
                            📍 Directions
                        </Button>
                        <button
                            onClick={() => navigate(`/sports-services/details/${id}`)}
                            disabled={deletingId === id}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                        >
                            <span>👁️</span>
                            <span className="truncate">View Details</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏃</span> Sports & Fitness Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏃</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Sports Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your sports and fitness services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-sports-service-form")}
                        className="gap-1.5"
                    >
                        + Add Sports Service
                    </Button>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏃</span> Sports & Fitness Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderCard)}
            </div>
        </div>
    );
};

export default SportsUserService;