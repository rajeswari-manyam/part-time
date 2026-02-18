import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteIndustrialService, IndustrialWorker } from "../services/IndustrialService.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const getCategoryIcon = (category: string = ""): string => {
    const cat = category.toLowerCase();
    if (cat.includes("borewell")) return "🚜";
    if (cat.includes("fabricator")) return "🔧";
    if (cat.includes("transport")) return "🚛";
    if (cat.includes("water") || cat.includes("tank")) return "💧";
    if (cat.includes("scrap")) return "♻️";
    if (cat.includes("machine")) return "⚙️";
    if (cat.includes("mover") || cat.includes("packer")) return "📦";
    return "🏭";
};

// ============================================================================
// PROPS
// ============================================================================
interface IndustrialUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const IndustrialUserService: React.FC<IndustrialUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to IndustrialWorker[] so all existing field access works
    const [services, setServices] = useState<IndustrialWorker[]>(data as IndustrialWorker[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.category &&
            s.category.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-industrial-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        setDeleteLoading(id);
        try {
            const result = await deleteIndustrialService(id);
            if (result.success) {
                setServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/industrial-services/details/${id}`);

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (service: IndustrialWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const imageUrls = (service.images || []).filter(Boolean) as string[];

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
                            alt={service.serviceName || "Industrial Service"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{getCategoryIcon(service.category)}</span>
                        </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md flex items-center gap-1.5`}>
                            <span>{getCategoryIcon(service.category)}</span>
                            {service.category || "Industrial"}
                        </span>
                    </div>

                    {/* Action Dropdown */}
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

                {/* ── Details ── */}
                <div className="p-4">
                    <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                        {service.serviceName || "Unnamed Service"}
                    </h3>

                    {service.subCategory && (
                        <p className="text-sm font-medium text-gray-700 mb-2">{service.subCategory}</p>
                    )}

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
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${service.availability !== false
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${service.availability !== false ? "bg-green-500" : "bg-red-500"}`} />
                            {service.availability !== false ? "Available" : "Unavailable"}
                        </span>

                        {service.chargeType && (
                            <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                                {service.chargeType}
                            </span>
                        )}
                    </div>

                    {/* Service Charge + Rating */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service Charge</p>
                            <p className="text-base font-bold text-blue-600">
                                ₹{service.serviceCharge?.toLocaleString() || "N/A"}
                            </p>
                        </div>
                        {service.rating && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Rating</p>
                                <p className="text-sm font-semibold text-yellow-500">⭐ {service.rating.toFixed(1)}</p>
                            </div>
                        )}
                    </div>

                    {/* View Details */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(id)}
                        className="w-full mt-2 border-blue-600 text-blue-600 hover:bg-blue-600/10"
                    >
                        View Details
                    </Button>
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
                        <span>🏭</span> Industrial Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏭</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Industrial Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your industrial services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-industrial-service-form")}
                        className="gap-1.5"
                    >
                        + Add Industrial Service
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
                    <span>🏭</span> Industrial Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderCard)}
            </div>
        </div>
    );
};

export default IndustrialUserService;