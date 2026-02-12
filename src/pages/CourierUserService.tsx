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

interface CourierUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const CourierUserService: React.FC<CourierUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader      = false,
    hideEmptyState  = false,
}) => {
    const navigate = useNavigate();
    const [couriers, setCouriers]     = useState<CourierWorker[]>([]);
    const [loading, setLoading]       = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch courier services ──────────────────────────────────────────────
    useEffect(() => {
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
        fetchCouriers();
    }, [userId]);

    // ── Filter by subcategory ───────────────────────────────────────────────
    const filteredCouriers = selectedSubcategory
        ? couriers.filter(c =>
            c.category &&
            selectedSubcategory.toLowerCase().includes(c.category.toLowerCase())
        )
        : couriers;

    // ── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = async (courierId: string) => {
        if (!window.confirm("Delete this courier service?")) return;

        setDeletingId(courierId);
        try {
            const result = await deleteCourierService(courierId);
            if (result.success) {
                setCouriers(prev => prev.filter(c => c._id !== courierId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting courier:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helpers ─────────────────────────────────────────────────────────────
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

    // ── Render single card ───────────────────────────────────────────────────
    const renderCourierCard = (courier: CourierWorker) => {
        const id       = courier._id || "";
        const location = [courier.area, courier.city, courier.state]
            .filter(Boolean).join(", ") || "Location not set";
        const services = courier.services || [];

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative"
                style={{ border: '1px solid #e5e7eb' }}
            >
                {/* Three-dot menu */}
                <div className="absolute top-3 right-3 z-10">
                    <ActionDropdown
                        onEdit={(e) => {
                            e.stopPropagation();
                            navigate(`/add-courier-service-form?id=${id}`);
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
                        {courier.name || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Category + availability */}
                    <div className="flex flex-wrap items-center gap-2">
                        {courier.category && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">📦</span>
                                <span className="truncate">{courier.category}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${
                            courier.availability
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${courier.availability ? 'bg-green-500' : 'bg-red-500'}`} />
                            {courier.availability ? 'Available' : 'Busy'}
                        </span>
                    </div>

                    {/* Bio */}
                    {courier.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">{courier.bio}</p>
                    )}

                    {/* Experience + price */}
                    <div className="flex items-center justify-between py-2">
                        {courier.experience && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-indigo-600 text-base">⭐</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {courier.experience} yrs exp
                                </span>
                            </div>
                        )}
                        {courier.serviceCharge && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {courier.chargeType || 'Charge'}
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{courier.serviceCharge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Services list */}
                    {services.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Services
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-indigo-500">●</span> {s}
                                    </span>
                                ))}
                                {services.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{services.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(courier)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => courier.phone && openCall(courier.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{courier.phone || "No Phone"}</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Loading ──────────────────────────────────────────────────────────────
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

    // ── Empty State ──────────────────────────────────────────────────────────
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
                        onClick={() => navigate('/add-courier-service-form')}
                        className="gap-1.5"
                    >
                        + Add Courier Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────
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