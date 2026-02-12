import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBusinessServices, deleteBusinessService, BusinessWorker } from "../services/BusinessService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface BusinessUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const BusinessUserService: React.FC<BusinessUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<BusinessWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Business Services API ──
    useEffect(() => {
        const fetchServices = async () => {
            if (!userId) {
                setServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserBusinessServices(userId);
                setServices(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching business services:", error);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredServices = selectedSubcategory
        ? services.filter(s => {
            const category = s.serviceType || s.category || '';
            return category && selectedSubcategory.toLowerCase().includes(category.toLowerCase());
        })
        : services;

    // ── Delete Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this business service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteBusinessService(serviceId);
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

    // ── Helper functions ──
    const openDirections = (service: BusinessWorker) => {
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

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Get category icon ──
    const getCategoryIcon = (category?: string): string => {
        if (!category) return "💼";
        const cat = category.toLowerCase();

        if (cat.includes("accountant") || cat.includes("tax")) return "💰";
        if (cat.includes("lawyer")) return "⚖️";
        if (cat.includes("insurance")) return "🛡️";
        if (cat.includes("marketing")) return "📢";
        if (cat.includes("event")) return "🎉";
        if (cat.includes("notary")) return "📝";
        if (cat.includes("consultant")) return "📋";
        if (cat.includes("printing")) return "🖨️";
        if (cat.includes("placement")) return "👥";

        return "💼";
    };

    // ── Render Service Card ──
    const renderServiceCard = (service: BusinessWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean)
            .join(", ") || "Location not set";

        // Handle both 'skills' (comma-separated string) and 'services' (array)
        const servicesArray = typeof service.skills === 'string'
            ? service.skills.split(',').map(s => s.trim()).filter(Boolean)
            : (service.services || []);

        // Handle both 'title' and 'name' fields
        const serviceName = service.title || service.name || "Unnamed Service";

        // Handle both 'description' and 'bio' fields
        const serviceBio = service.description || service.bio;

        // Handle both 'serviceType' and 'category' fields
        const serviceCategory = service.serviceType || service.category;

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
                            navigate(`/add-business-service-form?id=${id}`);
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
                        {serviceName}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Category and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {serviceCategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">{getCategoryIcon(serviceCategory)}</span>
                                <span className="truncate">{serviceCategory}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${service.availability
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${service.availability ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {service.availability ? 'Available' : 'Busy'}
                        </span>
                    </div>

                    {/* Bio */}
                    {serviceBio && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {serviceBio}
                        </p>
                    )}

                    {/* Experience and Price */}
                    <div className="flex items-center justify-between py-2">
                        {service.experience && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-blue-600 text-base">⭐</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {service.experience} yrs exp
                                </span>
                            </div>
                        )}
                        {service.serviceCharge && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {service.chargeType || 'Charge'}
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{service.serviceCharge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Available Services */}
                    {servicesArray.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Available Services
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {servicesArray.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-blue-500">●</span> {s}
                                    </span>
                                ))}
                                {servicesArray.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{servicesArray.length - 3} more
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
                            variant="success"
                            size="sm"
                            onClick={() => service.phone && openCall(service.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{service.phone || "No Phone"}</span>
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
                        <span>💼</span> Business Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💼</span> Business Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Business Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your business services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-business-service-form')}
                        className="gap-1.5"
                    >
                        + Add Business Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render ──
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💼</span> Business Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderServiceCard)}
            </div>
        </div>
    );
};

export default BusinessUserService;