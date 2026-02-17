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
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchServices = async () => {
        if (!userId) { setServices([]); setLoading(false); return; }
        setLoading(true);
        try {
            const result = await getUserWeddingServices(userId);
            console.log("User wedding services response:", result);
            if (result.success && result.data) {
                setServices(Array.isArray(result.data) ? result.data : [result.data]);
            } else {
                setServices([]);
            }
        } catch (err) {
            console.error("Error fetching wedding services:", err);
            setError("Failed to load services");
            setServices([]);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchServices(); }, [userId]);

    // ── Filter by subcategory ──────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.subCategory && s.subCategory.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-wedding-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this wedding service?")) return;
        setDeleteLoading(id);
        try {
            const res = await deleteWeddingService(id);
            if (res.success) {
                setServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert(res.message || "Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting wedding service:", error);
            alert("Failed to delete service. Please try again.");
        } finally { setDeleteLoading(null); }
    };

    const handleView = (id: string) => navigate(`/wedding-services/details/${id}`);

    const openDirections = (service: WeddingWorker) => {
        if (service.latitude && service.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`, "_blank");
        } else if (service.area || service.city) {
            const addr = encodeURIComponent([service.area, service.city, service.state].filter(Boolean).join(", "));
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        } else {
            alert("Location information not available");
        }
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💒</span> Wedding Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>Error Loading Services</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>{error}</p>
                    <Button variant="primary" size="md" onClick={() => window.location.reload()}
                        className="gap-1.5 bg-pink-600 hover:bg-pink-700">Retry</Button>
                </div>
            </div>
        );
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
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
                    {!selectedSubcategory && (
                        <Button variant="primary" size="md" onClick={() => navigate('/add-wedding-service-form')}
                            className="gap-1.5 bg-pink-600 hover:bg-pink-700">
                            + Add Your First Service
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER — mirrors RealEstateUserService card structure exactly
    // ============================================================================
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💒</span> Wedding Services ({filteredServices.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map((service) => {
                    const id = service._id || "";
                    const location = [service.area, service.city, service.state].filter(Boolean).join(", ") || "Location not specified";
                    const imageUrls = (service.images || []).filter(Boolean) as string[];

                    return (
                        <div key={id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                            {/* ── Image — mirrors RealEstateUserService image section ── */}
                            <div className="relative h-48 bg-gradient-to-br from-pink-600/10 to-pink-600/5">
                                {imageUrls.length > 0 ? (
                                    <img src={imageUrls[0]} alt={service.serviceName || "Service"}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">💒</span>
                                    </div>
                                )}

                                {/* SubCategory Badge — top left */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-pink-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {service.subCategory || "Wedding"}
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
                                    {service.serviceName || "Unnamed Service"}
                                </h3>

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

                                {/* Pincode badge */}
                                {service.pincode && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                            📮 {service.pincode}
                                        </span>
                                    </div>
                                )}

                                {/* Charge type + Price — mirrors listing type + price row */}
                                <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                                    <div className="flex-1" />
                                    {service.serviceCharge && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {service.chargeType || 'Starting at'}
                                            </p>
                                            <p className="text-base font-bold text-pink-600">
                                                ₹{Number(service.serviceCharge).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* View Details — mirrors RealEstateUserService */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openDirections(service)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-pink-600 text-pink-600 rounded-lg font-medium text-sm hover:bg-pink-50 transition-colors">
                                        📍 Directions
                                    </button>
                                    <Button variant="outline" size="sm" onClick={() => handleView(id)}
                                        className="flex-1 border-pink-600 text-pink-600 hover:bg-pink-600/10">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeddingUserService;