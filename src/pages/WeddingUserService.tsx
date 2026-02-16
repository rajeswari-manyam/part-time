import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deleteWeddingService,
    getUserWeddingServices,
    WeddingWorker
} from "../services/Wedding.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface WeddingUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const WeddingUserService: React.FC<WeddingUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<WeddingWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch Services ──
    useEffect(() => {
        const fetchServices = async () => {
            console.log("═══════════════════════════════════════");
            console.log("🔍 FETCHING WEDDING SERVICES");
            console.log("═══════════════════════════════════════");
            console.log("📋 Props:");
            console.log("   - userId:", userId);
            console.log("   - selectedSubcategory:", selectedSubcategory);
            console.log("═══════════════════════════════════════");

            if (!userId) {
                console.error("❌ No userId provided!");
                setError("No user ID provided");
                setServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const result = await getUserWeddingServices(userId);

                console.log("📦 getUserWeddingServices result:", result);

                if (result.success && result.data) {
                    console.log("✅ Services loaded:", result.data.length);
                    setServices(result.data);
                    setError(null);
                } else {
                    console.warn("⚠️ No services found");
                    setServices([]);
                    setError(null); // Don't show error for empty results
                }
            } catch (err) {
                console.error("❌ Error fetching services:", err);
                setError("Failed to load services");
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredServices = React.useMemo(() => {
        console.log("🔍 Filtering services:");
        console.log("   - Total services:", services.length);
        console.log("   - Filter:", selectedSubcategory);

        if (!selectedSubcategory) {
            console.log("✅ No filter - returning all services");
            return services;
        }

        const filtered = services.filter(s => {
            if (!s.subCategory) return false;

            const normalizedService = s.subCategory.toLowerCase().trim();
            const normalizedFilter = selectedSubcategory.toLowerCase().trim();

            const match = normalizedService.includes(normalizedFilter) ||
                normalizedFilter.includes(normalizedService);

            return match;
        });

        console.log("✅ Filtered to:", filtered.length, "services");
        return filtered;
    }, [services, selectedSubcategory]);

    // ── Delete Service ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Are you sure you want to delete this wedding service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteWeddingService(serviceId);
            if (result.success) {
                setServices(prev => prev.filter(s => s._id !== serviceId));
                console.log("✅ Service deleted successfully");
            } else {
                alert("Failed to delete service. Please try again.");
                console.error("❌ Delete failed:", result.message);
            }
        } catch (error) {
            console.error("❌ Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Open Directions ──
    const openDirections = (service: WeddingWorker) => {
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
        } else {
            alert("Location information not available");
        }
    };

    // ── Render Service Card ──
    const renderServiceCard = (service: WeddingWorker) => {
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
                            navigate(`/add-wedding-service-form?id=${id}`);
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

                    {/* Category and Pincode Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {service.subCategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">💒</span>
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
                                    {service.chargeType || 'Starting at'}
                                </p>
                                <p className="text-lg font-bold text-pink-600">
                                    ₹{service.serviceCharge.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Images Preview */}
                    {service.images && service.images.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Photos
                            </p>
                            <div className="flex flex-wrap gap-1.5">
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
                            onClick={() => navigate(`/wedding-services/details/${id}`)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white"
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
                        <span>💒</span> Wedding Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
                        <p className="text-sm text-gray-600">Loading services...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Error State ──
    if (error) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💒</span> Wedding Services
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        Error Loading Services
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        {error}
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => window.location.reload()}
                        className="gap-1.5 bg-pink-600 hover:bg-pink-700"
                    >
                        Retry
                    </Button>
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
                        <span>💒</span> Wedding Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💒</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        {selectedSubcategory ? `No ${selectedSubcategory} Services Found` : 'No Wedding Services Yet'}
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        {selectedSubcategory
                            ? `No wedding services match the "${selectedSubcategory}" category.`
                            : 'Start adding your wedding services to showcase them here.'}
                    </p>

                    {/* Debug Panel - Only in development */}
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-6 text-left bg-gray-50 rounded-lg">
                            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 p-3">
                                🔧 Debug Info (Dev Only)
                            </summary>
                            <div className="p-4 bg-white rounded text-xs font-mono text-left space-y-2 border-t border-gray-200">
                                <p><strong>UserId:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{userId}</code></p>
                                <p><strong>API Base:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{process.env.REACT_APP_API_BASE_URL}</code></p>
                                <p><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/getUserWedding</code></p>
                                <p><strong>Filter:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{selectedSubcategory || 'none'}</code></p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                        const url = `${process.env.REACT_APP_API_BASE_URL}/getUserWedding?userId=${userId}`;
                                        console.log("🧪 Testing URL:", url);
                                        try {
                                            const res = await fetch(url);
                                            const data = await res.json();
                                            console.log("🧪 Response:", data);
                                            alert(JSON.stringify(data, null, 2));
                                        } catch (err) {
                                            console.error("🧪 Test failed:", err);
                                            alert("Test failed: " + err);
                                        }
                                    }}
                                    className="mt-2"
                                >
                                    🧪 Test API Call
                                </Button>
                            </div>
                        </details>
                    )}

                    {!selectedSubcategory && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate('/add-wedding-service-form')}
                            className="gap-1.5 bg-pink-600 hover:bg-pink-700 mt-4"
                        >
                            + Add Your First Service
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // ── Render Services Grid ──
    return (
        <div className="w-full">
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💒</span> Wedding Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map((service) => renderServiceCard(service))}
            </div>
        </div>
    );
};

export default WeddingUserService;