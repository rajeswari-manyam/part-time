import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserDigitalServices,
    deleteDigitalService,
    DigitalWorker
} from "../services/DigitalService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface DigitalUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideEmptyState?: boolean;
    hideHeader?: boolean;
}

const DigitalUserService: React.FC<DigitalUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideEmptyState = false,
    hideHeader = false
}) => {
    const navigate = useNavigate();
    const [digitalServices, setDigitalServices] = useState<DigitalWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Digital Services API ──
    useEffect(() => {
        const fetchDigitalServices = async () => {
            if (!userId) {
                setDigitalServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserDigitalServices(userId);
                const userServices = response.success ? (response.data || []) : [];
                setDigitalServices(userServices);
            } catch (error) {
                console.error("Error fetching digital services:", error);
                setDigitalServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDigitalServices();
    }, [userId]);

    // ── Filter by subcategory (CLIENT-SIDE) ──
    const filteredServices = selectedSubcategory
        ? digitalServices.filter(s =>
            s.category &&
            s.category.toLowerCase() === selectedSubcategory.toLowerCase()
        )
        : digitalServices;

    // ── Delete Digital Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this digital service?")) return;

        setDeletingId(serviceId);
        try {
            const service = digitalServices.find(s => s._id === serviceId);
            if (!service) throw new Error("Service not found");

            const result = await deleteDigitalService(
                serviceId,
                service.category || "Tech & Digital Services",
                service.name || ""
            );

            if (result.success) {
                setDigitalServices(prev => prev.filter(s => s._id !== serviceId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting digital service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (service: DigitalWorker) => {
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

    // ── Get icon for service type ──
    const getServiceIcon = (category?: string): string => {
        if (!category) return "💻";
        const normalized = category.toLowerCase();

        if (normalized.includes("website") || normalized.includes("web")) return "🌐";
        if (normalized.includes("mobile") || normalized.includes("app")) return "📱";
        if (normalized.includes("graphic") || normalized.includes("design")) return "🎨";
        if (normalized.includes("marketing") || normalized.includes("seo")) return "📈";
        if (normalized.includes("software") || normalized.includes("development")) return "⚙️";
        if (normalized.includes("cctv") || normalized.includes("security")) return "📹";
        if (normalized.includes("repair")) return "🔧";
        if (normalized.includes("data") || normalized.includes("analytics")) return "📊";

        return "💻";
    };

    // ── Render Digital Service Card ──
    const renderServiceCard = (service: DigitalWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const servicesList = service.services || [];
        const icon = getServiceIcon(service.category);

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
                            navigate(`/add-digital-service-form?id=${id}`);
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
                        {service.name || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Type and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {service.category && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md border border-indigo-200">
                                <span className="shrink-0">{icon}</span>
                                <span className="truncate">{service.category}</span>
                            </span>
                        )}
                        {service.availability && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-200 font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Available
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {service.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {service.bio}
                        </p>
                    )}

                    {/* Rating and Experience */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400 text-base">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {service.rating || "N/A"}
                            </span>
                        </div>
                        {service.experience && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">{service.experience} years</p>
                                <p className="text-xs text-gray-500">experience</p>
                            </div>
                        )}
                    </div>

                    {/* Service Charge */}
                    {service.serviceCharge && (
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service Charge</p>
                            <p className="text-lg font-bold text-indigo-600">
                                ₹{service.serviceCharge}
                            </p>
                        </div>
                    )}

                    {/* Available Services */}
                    {servicesList.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Services Offered
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {servicesList.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-indigo-500">●</span> {s}
                                    </span>
                                ))}
                                {servicesList.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{servicesList.length - 3} more
                                    </span>
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
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/tech-services/details/${id}`)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
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

    // ── Loading State ──
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💻</span> Tech & Digital Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State - CONDITIONALLY RENDERED ──
    if (filteredServices.length === 0) {
        if (hideEmptyState) {
            return null;
        }

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💻</span> Tech & Digital Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Digital Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your tech and digital services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-digital-service-form')}
                        className="gap-1.5"
                    >
                        + Add Digital Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render Services ──
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💻</span> Tech & Digital Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderServiceCard)}
            </div>
        </div>
    );
};

export default DigitalUserService;