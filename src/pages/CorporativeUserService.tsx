import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserCorporateServices,
    deleteCorporateService,
    GetUserCorporateParams
} from "../services/Corporate.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface CorporateService {
    _id: string;
    userId: string;
    serviceName: string;
    description: string;
    subCategory: string;
    serviceCharge: number;
    chargeType: string;
    latitude: number;
    longitude: number;
    area: string;
    city: string;
    state: string;
    pincode: string;
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
}

interface CorporateUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const CorporateUserService: React.FC<CorporateUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<CorporateService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Services API ───────────────────────────────────────────────────
    useEffect(() => {
        const fetchServices = async () => {
            if (!userId) {
                setServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const params: GetUserCorporateParams = { userId };
                const response = await getUserCorporateServices(params);
                
                // Handle response structure
                if (response.success && response.data) {
                    setServices(Array.isArray(response.data) ? response.data : []);
                } else {
                    setServices([]);
                }
            } catch (error) {
                console.error("Error fetching corporate services:", error);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [userId]);

    // ── Filter by subcategory ────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.subCategory &&
            selectedSubcategory.toLowerCase().includes(s.subCategory.toLowerCase())
        )
        : services;

    // ── Delete Service API ───────────────────────────────────────────────────
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this corporate service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteCorporateService(serviceId);
            if (result.success) {
                setServices(prev => prev.filter(s => s._id !== serviceId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ─────────────────────────────────────────────────────
    const openDirections = (service: CorporateService) => {
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

    // ── Render Service Card ──────────────────────────────────────────────────
    const renderServiceCard = (service: CorporateService) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean)
            .join(", ") || "Location not set";

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative"
                style={{ border: '1px solid #e5e7eb' }}
            >
                {/* Three Dots Menu */}
                <div className="absolute top-3 right-3 z-10">
                    <ActionDropdown
                        onEdit={(e) => {
                            e.stopPropagation();
                            navigate(`/add-corporative-service-form?id=${id}`);
                        }}
                        onDelete={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                        }}
                    />
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 truncate pr-8">
                        {service.serviceName || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Category Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {service.subCategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-200">
                                <span className="shrink-0">🏢</span>
                                <span className="truncate">{service.subCategory}</span>
                            </span>
                        )}
                        {service.pincode && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">📮</span>
                                <span>{service.pincode}</span>
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex-1"></div>
                        {service.serviceCharge && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {service.chargeType || 'Charge'}
                                </p>
                                <p className="text-lg font-bold text-blue-600">
                                    ₹{service.serviceCharge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Images Preview */}
                    {service.images && service.images.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex gap-2 overflow-x-auto">
                                {service.images.slice(0, 3).map((img, idx) => (
                                    <img
                                        key={`${id}-${idx}`}
                                        src={img}
                                        alt={`Service ${idx + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                    />
                                ))}
                                {service.images.length > 3 && (
                                    <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        <span className="text-xs text-gray-600 font-medium">
                                            +{service.images.length - 3}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(service)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => navigate(`/corporate-services/details/${id}`)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">👁️</span>
                            <span className="truncate">View Details</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Loading State ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏢</span> Corporate Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                        <span>🏢</span> Corporate Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Corporate Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your corporate services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-corporative-service-form')}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                    >
                        + Add Corporate Service
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
                    <span>🏢</span> Corporate Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderServiceCard)}
            </div>
        </div>
    );
};

export default CorporateUserService;