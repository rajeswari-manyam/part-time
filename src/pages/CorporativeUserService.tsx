import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserCorporateServices,
    deleteCorporateService,
    GetUserCorporateParams,
} from "../services/Corporate.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

/* ============================================================================
   TYPES
============================================================================ */
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

/* ============================================================================
   HELPERS
============================================================================ */
const getIcon = (subCategory?: string) => {
    const n = (subCategory || "").toLowerCase();
    if (n.includes("background")) return "🔍";
    if (n.includes("courier") || n.includes("document")) return "📦";
    if (n.includes("cleaning") || n.includes("office")) return "🧹";
    if (n.includes("recruitment")) return "👥";
    if (n.includes("it") || n.includes("tech")) return "💻";
    if (n.includes("security")) return "🔒";
    return "🏢";
};

/* ============================================================================
   COMPONENT
============================================================================ */
const CorporateUserService: React.FC<CorporateUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<CorporateService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    /* ── Fetch ─────────────────────────────────────────────────────────────── */
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

    useEffect(() => {
        fetchServices();
    }, [userId]);

    /* ── Filter by subcategory ─────────────────────────────────────────────── */
    const filteredServices = selectedSubcategory
        ? services.filter(
            (s) =>
                s.subCategory &&
                s.subCategory.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    /* ── Handlers ──────────────────────────────────────────────────────────── */
    const handleEdit = (id: string) => {
        navigate(`/add-corporative-service-form?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this corporate service?")) return;

        setDeleteLoading(id);
        try {
            const result = await deleteCorporateService(id);
            if (result.success) {
                setServices((prev) => prev.filter((s) => s._id !== id));
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

    const handleView = (id: string) => {
        navigate(`/corporate-services/details/${id}`);
    };

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

    /* ============================================================================
       CARD
    ============================================================================ */
    const renderServiceCard = (service: CorporateService) => {
        const id = service._id || "";
        const imageUrls = (service.images || []).filter(Boolean);
        const location =
            [service.area, service.city, service.state].filter(Boolean).join(", ") ||
            "Location not set";

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
                            alt={service.serviceName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{getIcon(service.subCategory)}</span>
                        </div>
                    )}

                    {/* Subcategory badge — top left */}
                    <div className="absolute top-3 left-3">
                        <span
                            className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}
                        >
                            {service.subCategory || "Corporate"}
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
                    <h3
                        className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}
                    >
                        {service.serviceName || "Unnamed Service"}
                    </h3>

                    {/* Location */}
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
                        <p
                            className={`${typography.body.small} text-gray-600 line-clamp-2`}
                        >
                            {location}
                        </p>
                    </div>

                    {/* Description */}
                    {service.description && (
                        <p
                            className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}
                        >
                            {service.description}
                        </p>
                    )}

                    {/* Charge + PIN badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {service.serviceCharge ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-600/5 text-blue-600 px-2.5 py-1 rounded-full border border-blue-600/20 font-semibold">
                                💰 ₹{service.serviceCharge}
                                {service.chargeType ? ` / ${service.chargeType}` : ""}
                            </span>
                        ) : null}
                        {service.pincode && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                                📮 {service.pincode}
                            </span>
                        )}
                    </div>

                    {/* Extra images strip (if >1) */}
                    {imageUrls.length > 1 && (
                        <div className="mb-3">
                            <p
                                className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}
                            >
                                Photos:
                            </p>
                            <div className="flex gap-1.5 overflow-x-auto">
                                {imageUrls.slice(1, 4).map((img, idx) => (
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
                                {imageUrls.length > 4 && (
                                    <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs text-gray-500 font-medium">
                                            +{imageUrls.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action buttons — matching HospitalUserService layout */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(service)}
                            className="flex-1 justify-center border-blue-600 text-blue-600 hover:bg-blue-600/10"
                        >
                            📍 Directions
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(id)}
                            className="flex-1 justify-center border-blue-600 text-blue-600 hover:bg-blue-600/10"
                        >
                            👁️ View Details
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    /* ============================================================================
       LOADING
    ============================================================================ */
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2
                        className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                    >
                        <span>🏢</span> Corporate Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            </div>
        );
    }

    /* ============================================================================
       EMPTY STATE
    ============================================================================ */
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2
                        className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                    >
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
                        onClick={() => navigate("/add-corporative-service-form")}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                    >
                        + Add Corporate Service
                    </Button>
                </div>
            </div>
        );
    }

    /* ============================================================================
       RENDER
    ============================================================================ */
    return (
        <div>
            {!hideHeader && (
                <h2
                    className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                >
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