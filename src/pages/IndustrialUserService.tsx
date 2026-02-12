import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIndustrialServices, deleteIndustrialService, IndustrialWorker } from "../services/IndustrialService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface IndustrialUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const IndustrialUserService: React.FC<IndustrialUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<IndustrialWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Industrial Services API ──
    useEffect(() => {
        const fetchServices = async () => {
            if (!userId) {
                setServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const params: any = { userId };
                if (selectedSubcategory) params.category = selectedSubcategory;

                const response = await getUserIndustrialServices(params);

                if (response.success && response.data) {
                    const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                    setServices(dataArray);
                } else {
                    setServices([]);
                }
            } catch (error) {
                console.error("Error fetching industrial services:", error);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [userId, selectedSubcategory]);

    // ── Filter by subcategory ──
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.category &&
            selectedSubcategory.toLowerCase().includes(s.category.toLowerCase())
        )
        : services;

    // ── Delete Industrial Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this industrial service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteIndustrialService(serviceId);
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
    const openDirections = (service: IndustrialWorker) => {
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

    const getCategoryIcon = (category: string = '') => {
        const cat = category.toLowerCase();
        if (cat.includes('borewell')) return '🚜';
        if (cat.includes('fabricator')) return '🔧';
        if (cat.includes('transport')) return '🚛';
        if (cat.includes('water') || cat.includes('tank')) return '💧';
        if (cat.includes('scrap')) return '♻️';
        if (cat.includes('machine')) return '⚙️';
        if (cat.includes('mover') || cat.includes('packer')) return '📦';
        return '🏭';
    };

    // ── Render Industrial Service Card ──
    const renderServiceCard = (service: IndustrialWorker) => {
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
                            navigate(`/add-industrial-service-form?id=${id}`);
                        }}
                        onDelete={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                        }}
                    />
                </div>

                {/* Image or Placeholder */}
                {service.images && service.images.length > 0 ? (
                    <div className="relative w-full h-48">
                        <img
                            src={service.images[0]}
                            alt={service.serviceName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <span>{getCategoryIcon(service.category)}</span>
                            <span>{service.category}</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-5xl mb-2">{getCategoryIcon(service.category)}</span>
                        <span className="text-sm">No Image</span>
                    </div>
                )}

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

                    {/* Category, Subcategory, and Availability Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {service.category && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-200">
                                <span className="shrink-0">{getCategoryIcon(service.category)}</span>
                                <span className="truncate">{service.category}</span>
                            </span>
                        )}
                        {service.subCategory && (
                            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                {service.subCategory}
                            </span>
                        )}
                        {service.availability && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-200 font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Available
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                        </p>
                    )}

                    {/* Service Charge and Charge Type */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div className="text-left">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service Charge</p>
                            <p className="text-lg font-bold text-green-600">
                                ₹{service.serviceCharge || "N/A"}
                            </p>
                        </div>
                        {service.chargeType && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">{service.chargeType}</p>
                            </div>
                        )}
                    </div>

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
                        <span>🏭</span> Industrial Services
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
                        <span>🏭</span> Industrial Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏭</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Industrial Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your industrial services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-industrial-service-form')}
                        className="gap-1.5"
                    >
                        + Add Industrial Service
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
                    <span>🏭</span> Industrial Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderServiceCard)}
            </div>
        </div>
    );
};

export default IndustrialUserService;