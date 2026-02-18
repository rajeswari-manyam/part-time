import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodServiceAPI from "../services/FoodService.service";
import type { FoodService } from "../services/FoodService.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const getIcon = (type?: string): string => {
    const t = (type || "").toLowerCase();
    if (t.includes("restaurant")) return "🍽️";
    if (t.includes("cafe")) return "☕";
    if (t.includes("bakery")) return "🍰";
    if (t.includes("street")) return "🌮";
    if (t.includes("juice")) return "🥤";
    if (t.includes("sweet")) return "🍬";
    if (t.includes("ice")) return "🍦";
    if (t.includes("fast")) return "🍔";
    if (t.includes("cloud") || t.includes("kitchen")) return "🍱";
    if (t.includes("catering")) return "🎂";
    if (t.includes("tiffin") || t.includes("mess")) return "🥡";
    return "🍽️";
};

// ============================================================================
// PROPS
// ============================================================================
interface FoodUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const FoodUserService: React.FC<FoodUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to FoodService[] so all existing field access works
    const [services, setServices] = useState<FoodService[]>(data as FoodService[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.type &&
            s.type.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-food-service-form/${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this food service?")) return;
        setDeleteLoading(id);
        try {
            const res = await FoodServiceAPI.deleteFoodService(id);
            if (res.success) {
                setServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert(res.error || "Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting food service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/food-services/details/${id}`);

    const openDirections = (service: FoodService) => {
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
    // CARD — mirrors RealEstateUserService card structure
    // ============================================================================
    const renderCard = (service: FoodService) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const imageUrls = ((service as any).images || []).filter(Boolean) as string[];
        const icon = service.icon || getIcon(service.type);

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={service.name || "Food Service"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{icon}</span>
                        </div>
                    )}

                    {/* Type badge — top left */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-orange-500 text-white px-3 py-1 rounded-full shadow-md`}>
                            {service.type || "Food Service"}
                        </span>
                    </div>

                    {/* Action Dropdown — top right */}
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

                    {/* Image count badge */}
                    {imageUrls.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">
                            1 / {imageUrls.length}
                        </div>
                    )}
                </div>

                {/* ── Details ── */}
                <div className="p-4">
                    <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                        {service.name || "Unnamed Service"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Status + Rating badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${service.status
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${service.status ? "bg-green-500" : "bg-red-500"}`} />
                            {service.status ? "Open" : "Closed"}
                        </span>

                        {service.rating && (
                            <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full border border-yellow-200 font-medium">
                                ⭐ {service.rating.toFixed(1)}
                                {service.user_ratings_total ? ` (${service.user_ratings_total})` : ""}
                            </span>
                        )}

                        {service.pincode && (
                            <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                                📮 {service.pincode}
                            </span>
                        )}
                    </div>

                    {/* Directions + View Details */}
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => openDirections(service)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-orange-500 text-orange-500 rounded-lg font-medium text-sm hover:bg-orange-50 transition-colors"
                        >
                            📍 Directions
                        </button>
                        <button
                            onClick={() => handleView(id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
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
                        <span>🍽️</span> Food Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Food Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your food services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-food-service-form")}
                        className="gap-1.5 bg-orange-500 hover:bg-orange-600"
                    >
                        + Add Food Service
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
                    <span>🍽️</span> Food Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderCard)}
            </div>
        </div>
    );
};

export default FoodUserService;