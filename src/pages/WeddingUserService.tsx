import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deleteWeddingService,
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

    // ── Fetch Services API ──
    useEffect(() => {
        const fetchServices = async () => {
            // ⚠️ CRITICAL DEBUG: Log the userId being used
            console.log("═══════════════════════════════════════");
            console.log("🔍 FETCHING WEDDING SERVICES");
            console.log("═══════════════════════════════════════");
            console.log("📋 Props received:");
            console.log("   - userId:", userId);
            console.log("   - selectedSubcategory:", selectedSubcategory);
            console.log("   - hideHeader:", hideHeader);
            console.log("   - hideEmptyState:", hideEmptyState);
            console.log("═══════════════════════════════════════");

            if (!userId) {
                console.error("❌ No userId provided!");
                setServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
                const url = `${API_BASE_URL}/getUserWedding?userId=${userId}`;

                console.log("📡 Making request to:", url);

                const response = await fetch(url, { method: "GET" });

                console.log("📥 Response received:");
                console.log("   - Status:", response.status);
                console.log("   - OK:", response.ok);

                if (response.ok) {
                    const data = await response.json();
                    console.log("📦 Raw API response:", data);
                    console.log("📦 Response type:", typeof data);
                    console.log("📦 Is array:", Array.isArray(data));

                    let servicesData: WeddingWorker[] = [];

                    if (Array.isArray(data)) {
                        servicesData = data;
                        console.log("✅ Direct array response");
                    } else if (data && Array.isArray(data.data)) {
                        servicesData = data.data;
                        console.log("✅ Nested data.data response");
                    } else if (data && data.success && Array.isArray(data.data)) {
                        servicesData = data.data;
                        console.log("✅ Success wrapper response");
                    } else {
                        console.warn("⚠️ Unexpected response structure:", data);
                        // Try to find any array in the response
                        const keys = Object.keys(data || {});
                        console.log("📋 Response keys:", keys);
                        for (const key of keys) {
                            if (Array.isArray(data[key])) {
                                servicesData = data[key];
                                console.log(`✅ Found array at key: ${key}`);
                                break;
                            }
                        }
                    }

                    console.log("═══════════════════════════════════════");
                    console.log("📊 FINAL RESULTS:");
                    console.log("   - Services found:", servicesData.length);
                    if (servicesData.length > 0) {
                        console.log("   - First service:", servicesData[0]);
                        servicesData.forEach((s, i) => {
                            console.log(`   ${i + 1}. ${s.serviceName} (${s.subCategory})`);
                        });
                    } else {
                        console.warn("⚠️ NO SERVICES RETURNED FROM API");
                        console.log("🔍 Debugging tips:");
                        console.log("   1. Check if userId exists in database:", userId);
                        console.log("   2. Verify API endpoint is correct");
                        console.log("   3. Check if user has any wedding services");
                        console.log("   4. Test directly:");
                        console.log(`      GET ${url}`);
                    }
                    console.log("═══════════════════════════════════════");

                    setServices(servicesData);
                } else {
                    console.error("❌ Response not OK:", response.status, response.statusText);
                    const errorText = await response.text();
                    console.error("❌ Error response body:", errorText);
                    setServices([]);
                }
            } catch (error) {
                console.error("❌ Exception during fetch:", error);
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
        console.log("   - Filter (selectedSubcategory):", selectedSubcategory);

        if (!selectedSubcategory) {
            console.log("✅ No filter - returning all", services.length, "services");
            return services;
        }

        const filtered = services.filter(s => {
            if (!s.subCategory) {
                return false;
            }

            const match = s.subCategory.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
                selectedSubcategory.toLowerCase().includes(s.subCategory.toLowerCase());

            return match;
        });

        console.log("✅ Filtered to:", filtered.length, "services");
        return filtered;
    }, [services, selectedSubcategory]);

    // ── Delete Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this wedding service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteWeddingService(serviceId);
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
                                    ₹{service.serviceCharge}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
            </div>
        );
    };

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
                    {/* Debug info for developers */}
                    <details className="mt-4 text-left">
                        <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600">
                            🔧 Debug Info (click to expand)
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-left">
                            <p><strong>UserId:</strong> {userId}</p>
                            <p><strong>API Endpoint:</strong> /getUserWedding</p>
                            <p><strong>Filter:</strong> {selectedSubcategory || 'none'}</p>
                            <p className="mt-2 text-gray-600">
                                Check console for detailed logs
                            </p>
                        </div>
                    </details>
                    {!selectedSubcategory && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate('/add-wedding-service-form')}
                            className="gap-1.5 bg-pink-600 hover:bg-pink-700 mt-4"
                        >
                            + Add Wedding Service
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // ── Render ──
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