import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserAutomotives, deleteAutomotive, AutomotiveService } from "../services/AutomotiveServcie.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface AutomotiveUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const AutomotiveUserService: React.FC<AutomotiveUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [automotives, setAutomotives] = useState<AutomotiveService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Automotives API ──
    useEffect(() => {
        const fetchAutomotives = async () => {
            if (!userId) {
                setAutomotives([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserAutomotives(userId);
                setAutomotives(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching automotives:", error);
                setAutomotives([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAutomotives();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredAutomotives = selectedSubcategory
        ? automotives.filter(a =>
            a.businessType &&
            selectedSubcategory.toLowerCase().includes(a.businessType.toLowerCase())
        )
        : automotives;

    // ── Delete Automotive API ──
    const handleDelete = async (automotiveId: string) => {
        if (!window.confirm("Delete this automotive service?")) return;

        setDeletingId(automotiveId);
        try {
            const result = await deleteAutomotive(automotiveId);
            if (result.success) {
                setAutomotives(prev => prev.filter(a => a._id !== automotiveId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting automotive:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (automotive: AutomotiveService) => {
        if (automotive.latitude && automotive.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${automotive.latitude},${automotive.longitude}`,
                "_blank"
            );
        } else if (automotive.area || automotive.city) {
            const addr = encodeURIComponent(
                [automotive.area, automotive.city, automotive.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Automotive Card ──
    const renderAutomotiveCard = (automotive: AutomotiveService) => {
        const id = automotive._id || "";
        const location = [automotive.area, automotive.city, automotive.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const services = automotive.services || [];

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
                            navigate(`/add-automotive-form?id=${id}`);
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
                        {automotive.name || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Business Type and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {automotive.businessType && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🚗</span>
                                <span className="truncate">{automotive.businessType}</span>
                            </span>
                        )}
                        {automotive.availability && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-200 font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span> {automotive.availability}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {automotive.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {automotive.description}
                        </p>
                    )}

                    {/* Experience and Price */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-blue-500 text-base">📅</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {automotive.experience ? `${automotive.experience} years` : "N/A"}
                            </span>
                        </div>
                        {automotive.priceRange && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Starting at</p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{automotive.priceRange}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Available Services */}
                    {services.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Available Services
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-blue-500">●</span> {s}
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(automotive)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => automotive.phone && openCall(automotive.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{automotive.phone || "No Phone"}</span>
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
                        <span>🚗</span> Automotive Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (filteredAutomotives.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🚗</span> Automotive Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🚗</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Automotive Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your automotive services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-automotive-form')}
                        className="gap-1.5"
                    >
                        + Add Automotive Service
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
                    <span>🚗</span> Automotive Services ({filteredAutomotives.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredAutomotives.map(renderAutomotiveCard)}
            </div>
        </div>
    );
};

export default AutomotiveUserService;