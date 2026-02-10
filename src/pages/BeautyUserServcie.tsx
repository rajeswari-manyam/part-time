import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBeautyWorkers, deleteById, BeautyWorker } from "../services/Beauty.Service.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface BeautyUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const BeautyUserService: React.FC<BeautyUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [beautyServices, setBeautyServices] = useState<BeautyWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Beauty Services API ──
    useEffect(() => {
        const fetchBeautyServices = async () => {
            if (!userId) {
                setBeautyServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserBeautyWorkers(userId);
                setBeautyServices(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching beauty services:", error);
                setBeautyServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBeautyServices();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredBeauty = selectedSubcategory
        ? beautyServices.filter(b =>
            b.category &&
            selectedSubcategory.toLowerCase().includes(b.category.toLowerCase())
        )
        : beautyServices;

    // ── Delete Beauty Service API ──
    const handleDelete = async (beautyId: string) => {
        if (!window.confirm("Delete this beauty service?")) return;

        setDeletingId(beautyId);
        try {
            const result = await deleteById(beautyId);
            if (result.success) {
                setBeautyServices(prev => prev.filter(b => b._id !== beautyId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting beauty service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (beauty: BeautyWorker) => {
        if (beauty.latitude && beauty.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${beauty.latitude},${beauty.longitude}`,
                "_blank"
            );
        } else if (beauty.area || beauty.city) {
            const addr = encodeURIComponent(
                [beauty.area, beauty.city, beauty.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Beauty Card ──
    const renderBeautyCard = (beauty: BeautyWorker) => {
        const id = beauty._id || "";
        const location = [beauty.area, beauty.city, beauty.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const services = Array.isArray(beauty.services) ? beauty.services : [];
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
        const imageUrl = beauty.images && beauty.images.length > 0
            ? `${API_BASE_URL}/${beauty.images[0]}`
            : null;

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                {/* Banner */}
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={beauty.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl sm:text-6xl">💅</span>
                    )}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/add-beauty-service-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDelete(id);
                            }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {beauty.name || "Unnamed Service"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {beauty.category && (
                            <span className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-rose-100 text-rose-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-rose-200`}>
                                <span className="shrink-0">💅</span>
                                <span className="truncate">{beauty.category}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1 ${typography.misc.badge} ${beauty.availability
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            } px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border`}>
                            <span>{beauty.availability ? "✓" : "⏸"}</span>{" "}
                            {beauty.availability ? "Available" : "Unavailable"}
                        </span>
                    </div>

                    {beauty.bio && (
                        <p className={`${typography.card.description} text-gray-600 line-clamp-2 italic`}>
                            "{beauty.bio}"
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {beauty.rating && (
                            <>
                                <span className="text-yellow-500">★</span>
                                <span className={`${typography.body.xs} font-semibold text-gray-700`}>
                                    {beauty.rating.toFixed(1)}
                                </span>
                            </>
                        )}
                        {beauty.experience && (
                            <span className={`${typography.body.xs} text-gray-500`}>
                                • {beauty.experience} {beauty.experience === 1 ? "year" : "years"} exp
                            </span>
                        )}
                        {beauty.serviceCharge && (
                            <span className={`ml-auto ${typography.body.xs} font-semibold text-rose-700`}>
                                ₹ {beauty.serviceCharge}+
                            </span>
                        )}
                    </div>

                    {services.length > 0 && (
                        <div>
                            <p className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}>
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-rose-50 text-rose-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-rose-200`}
                                    >
                                        <span>✓</span> {s}
                                    </span>
                                ))}
                                {services.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{services.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(beauty)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-rose-600 text-rose-700 hover:bg-rose-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => beauty.phone && openCall(beauty.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-rose-500 hover:bg-rose-600"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{beauty.phone || "No Phone"}</span>
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
                        <span>💅</span> Beauty & Wellness Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (filteredBeauty.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💅</span> Beauty & Wellness Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💅</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Beauty Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your beauty and wellness services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-beauty-service-form')}
                        className="gap-1.5"
                    >
                        + Add Beauty Service
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
                    <span>💅</span> Beauty & Wellness Services ({filteredBeauty.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredBeauty.map(renderBeautyCard)}
            </div>
        </div>
    );
};

export default BeautyUserService;