import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserCourierServices,
    deleteCourierService,
    CourierWorker,
} from "../services/CourierService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map(s => s.trim()).filter(Boolean);
    return [];
};

const getIcon = (category?: string) => {
    const n = (category || "").toLowerCase();
    if (n.includes("packer") || n.includes("mover")) return "🚛";
    if (n.includes("parcel") || n.includes("logistics")) return "📦";
    if (n.includes("cargo")) return "🏭";
    if (n.includes("delivery")) return "🛵";
    return "📦";
};

// ============================================================================
// PROPS
// ============================================================================
interface CourierUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const CourierUserService: React.FC<CourierUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [couriers, setCouriers] = useState<CourierWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchCouriers = async () => {
        if (!userId) {
            setCouriers([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await getUserCourierServices(userId);
            setCouriers(response.success ? response.data || [] : []);
        } catch (error) {
            console.error("Error fetching courier services:", error);
            setCouriers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouriers();
    }, [userId]);

    // ── Filter ───────────────────────────────────────────────────────────────
    const filteredCouriers = selectedSubcategory
        ? couriers.filter(c =>
            c.category &&
            c.category.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : couriers;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => {
        navigate(`/add-courier-service-form?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this courier service?")) return;

        setDeleteLoading(id);
        try {
            const result = await deleteCourierService(id);
            if (result.success) {
                setCouriers(prev => prev.filter(c => c._id !== id));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting courier:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => {
        navigate(`/courier-services/details/${id}`);
    };

    const openDirections = (courier: CourierWorker) => {
        if (courier.latitude && courier.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${courier.latitude},${courier.longitude}`,
                "_blank"
            );
        } else if (courier.area || courier.city) {
            const addr = encodeURIComponent(
                [courier.area, courier.city, courier.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ============================================================================
    // CARD — Hospital visual structure, courier-specific fields
    // ============================================================================
    const renderCourierCard = (courier: CourierWorker) => {
        const id = courier._id || "";
        const imageUrls = (courier.images || []).filter(Boolean) as string[];
        const location = [courier.area, courier.city, courier.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const services = ensureArray(courier.services);

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-600/10 to-indigo-600/5">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={courier.name || "Courier Service"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{getIcon(courier.category)}</span>
                        </div>
                    )}

                    {/* Category badge — top left */}
                    <div className="absolute top-3 left-3">
                        <span
                            className={`${typography.misc.badge} bg-indigo-600 text-white px-3 py-1 rounded-full shadow-md`}
                        >
                            {courier.category || "Courier"}
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
                </div>

                {/* ── Details ── */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                        {courier.name || "Unnamed Service"}
                    </h3>

                    {/* Location — SVG pin matching Hospital */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg
                            className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>
                            {location}
                        </p>
                    </div>

                    {/* Bio */}
                    {courier.bio && (
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                            {courier.bio}
                        </p>
                    )}

                    {/* Availability + Experience badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${courier.availability
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${courier.availability ? "bg-green-500" : "bg-red-500"}`} />
                            {courier.availability ? "Available" : "Busy"}
                        </span>

                        {courier.experience && (
                            <span className="inline-flex items-center gap-1 text-xs bg-indigo-600/5 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-600/20 font-medium">
                                ⭐ {courier.experience} yrs exp
                            </span>
                        )}

                        {courier.serviceCharge && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 font-semibold">
                                💰 ₹{courier.serviceCharge}
                                {courier.chargeType ? ` / ${courier.chargeType}` : ""}
                            </span>
                        )}
                    </div>

                    {/* Services — matching Hospital's departments/services strip */}
                    {services.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={idx}
                                        className={`${typography.fontSize.xs} bg-indigo-600/5 text-indigo-600 px-2 py-0.5 rounded-full`}
                                    >
                                        {s}
                                    </span>
                                ))}
                                {services.length > 3 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{services.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Directions + Call — matching Hospital's button pair */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(courier)}
                            className="flex-1 justify-center border-indigo-600 text-indigo-600 hover:bg-indigo-600/10"
                        >
                            📍 Directions
                        </Button>
                        <button
                            onClick={() => courier.phone && openCall(courier.phone)}
                            disabled={!courier.phone}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${courier.phone
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <span>📞</span>
                            <span className="truncate">{courier.phone ? "Call" : "No Phone"}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // LOADING
    // ============================================================================
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>📦</span> Courier Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                </div>
            </div>
        );
    }

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredCouriers.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>📦</span> Courier Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Courier Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your courier services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-courier-service-form")}
                        className="gap-1.5 bg-indigo-600 hover:bg-indigo-700"
                    >
                        + Add Courier Service
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
                    <span>📦</span> Courier Services ({filteredCouriers.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredCouriers.map(renderCourierCard)}
            </div>
        </div>
    );
};

export default CourierUserService;