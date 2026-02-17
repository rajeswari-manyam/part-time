import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserAgricultureServices,
    deleteAgricultureById,
    AgricultureService
} from "../services/Agriculture.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ── Same helper as HospitalUserService ──────────────────────────────────────
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
    return [];
};

const getCategoryIcon = (subCategory: string | undefined): string => {
    if (!subCategory) return "🌾";
    const n = subCategory.toLowerCase();
    if (n.includes("tractor")) return "🚜";
    if (n.includes("water") || n.includes("pump")) return "💧";
    if (n.includes("fertilizer")) return "🌱";
    if (n.includes("seed")) return "🌾";
    if (n.includes("tool") || n.includes("equipment")) return "🔧";
    if (n.includes("veterinary") || n.includes("vet") || n.includes("animal")) return "🐄";
    return "🌾";
};

interface AgricultureUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const AgricultureUserService: React.FC<AgricultureUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<AgricultureService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch Services ───────────────────────────────────────────────────────
    const fetchServices = async () => {
        if (!userId) {
            setServices([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getUserAgricultureServices(userId);
            // Support both direct array and { success, data } shapes
            if (Array.isArray(response)) {
                setServices(response);
            } else if (response && (response as any).success) {
                setServices((response as any).data || []);
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error("Error fetching agriculture services:", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [userId]);

    // ── Filter by subcategory ────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.subCategory &&
            s.subCategory.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // ── Delete Service ───────────────────────────────────────────────────────
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Are you sure you want to delete this agriculture service?")) return;

        setDeleteLoading(serviceId);
        try {
            await deleteAgricultureById(serviceId);
            setServices(prev => prev.filter(s => s._id !== serviceId));
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleEdit = (serviceId: string) => {
        navigate(`/add-agriculture-service-form?id=${serviceId}`);
    };

    const handleView = (serviceId: string) => {
        navigate(`/agriculture-services/details/${serviceId}`);
    };

    const openDirections = (service: AgricultureService) => {
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

    // ── Loading State ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🌾</span> Agriculture Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A5F9E]" />
                </div>
            </div>
        );
    }

    // ── Empty State ──────────────────────────────────────────────────────────
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🌾</span> Agriculture Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🌾</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Agriculture Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your agriculture services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-agriculture-service-form')}
                        className="gap-1.5 bg-[#1A5F9E] hover:bg-[#154a7e]"
                    >
                        + Add Agriculture Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🌾</span> Agriculture Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map((service) => {
                    const id = service._id || "";
                    const location = [service.area, service.city, service.state]
                        .filter(Boolean)
                        .join(", ") || "Location not specified";

                    return (
                        <div
                            key={id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* ── Image Block (same structure as HospitalUserService) ── */}
                            <div className="relative h-48 bg-gradient-to-br from-[#1A5F9E]/10 to-[#1A5F9E]/5">
                                {service.images && service.images.length > 0 ? (
                                    <img
                                        src={service.images[0]}
                                        alt={service.serviceName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">{getCategoryIcon(service.subCategory)}</span>
                                    </div>
                                )}

                                {/* SubCategory Badge — mirrors HospitalUserService's type badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-[#1A5F9E] text-white px-3 py-1 rounded-full shadow-md`}>
                                        {service.subCategory || 'Agriculture'}
                                    </span>
                                </div>

                                {/* Action Dropdown — spinner on image while deleting */}
                                <div className="absolute top-3 right-3">
                                    {deleteLoading === id ? (
                                        <div className="bg-white rounded-lg p-2 shadow-lg">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                                        </div>
                                    ) : (
                                        <ActionDropdown
                                            onEdit={() => handleEdit(id)}
                                            onDelete={() => handleDelete(id)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* ── Card Body ── */}
                            <div className="p-4">
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {service.serviceName || 'Unnamed Service'}
                                </h3>

                                {/* Location */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>
                                        {location}
                                    </p>
                                </div>

                                {/* Description */}
                                {service.description && (
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                                        {service.description}
                                    </p>
                                )}

                                {/* Pricing */}
                                {service.serviceCharge && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-0.5 font-medium uppercase tracking-wide`}>
                                            {service.chargeType || 'Charge'}
                                        </p>
                                        <p className="text-lg font-bold text-[#1A5F9E]">
                                            ₹{service.serviceCharge}
                                        </p>
                                    </div>
                                )}

                                {/* Images Preview Strip (additional images beyond the header) */}
                                {service.images && service.images.length > 1 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                            Photos:
                                        </p>
                                        <div className="flex gap-2 overflow-x-auto">
                                            {service.images.slice(1, 4).map((img, idx) => (
                                                <img
                                                    key={`${id}-img-${idx}`}
                                                    src={img}
                                                    alt={`Service ${idx + 2}`}
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                            ))}
                                            {service.images.length > 4 && (
                                                <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs text-gray-600 font-medium">
                                                        +{service.images.length - 4}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDirections(service)}
                                        className="flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <span>📍</span> Directions
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleView(id)}
                                        className="flex-1 justify-center gap-1.5 border-[#1A5F9E] text-[#1A5F9E] hover:bg-[#1A5F9E]/10"
                                        disabled={deleteLoading === id}
                                    >
                                        <span>👁️</span> View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgricultureUserService;