import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// CORRECTED IMPORT PATH - should be CreativeArtService.service, not Corporate.service
import {
    getUserCreativeArts,
    deleteCreativeArtService,
    CreativeArtWorker
} from "../services/Creative.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface ArtUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const ArtUserService: React.FC<ArtUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [arts, setArts] = useState<CreativeArtWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Arts API ──
    useEffect(() => {
        const fetchArts = async () => {
            if (!userId) {
                setArts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserCreativeArts(userId);
                setArts(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching art services:", error);
                setArts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArts();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredArts = selectedSubcategory
        ? arts.filter(a =>
            a.subCategory &&
            selectedSubcategory.toLowerCase().includes(a.subCategory.toLowerCase())
        )
        : arts;

    // ── Delete Art API ──
    const handleDelete = async (artId: string) => {
        if (!window.confirm("Delete this art service?")) return;

        setDeletingId(artId);
        try {
            const result = await deleteCreativeArtService(artId);
            if (result.success) {
                setArts(prev => prev.filter(a => a._id !== artId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting art service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (art: CreativeArtWorker) => {
        if (art.latitude && art.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${art.latitude},${art.longitude}`,
                "_blank"
            );
        } else if (art.area || art.city) {
            const addr = encodeURIComponent(
                [art.area, art.city, art.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Art Card ──
    const renderArtCard = (art: CreativeArtWorker) => {
        const id = art._id || "";
        const location = [art.area, art.city, art.state]
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
                            navigate(`/add-art-service-form?id=${id}`);
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
                        {art.name || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Type Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {art.subCategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🎨</span>
                                <span className="truncate">{art.subCategory}</span>
                            </span>
                        )}
                        {art.experience && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md border border-amber-200 font-medium">
                                <span className="shrink-0">📅</span> {art.experience}+ years
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {art.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {art.description}
                        </p>
                    )}

                    {/* Rating and Price */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400 text-base">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {art.rating || "New"}
                            </span>
                        </div>
                        {art.serviceCharge && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {art.chargeType || 'Starting at'}
                                </p>
                                <p className="text-lg font-bold text-amber-600">
                                    ₹{art.serviceCharge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Images Preview */}
                    {art.images && art.images.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Portfolio
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {art.images.slice(0, 3).map((img: string, idx: number) => (
                                    <img
                                        key={`${id}-${idx}`}
                                        src={img}
                                        alt={`Art ${idx + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                    />
                                ))}
                                {art.images.length > 3 && (
                                    <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        <span className="text-xs text-gray-600 font-medium">
                                            +{art.images.length - 3}
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
                            onClick={() => openDirections(art)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => art.phone && openCall(art.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{art.phone || "No Phone"}</span>
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
                        <span>🎨</span> Creative & Art Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (filteredArts.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🎨</span> Creative & Art Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Art Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your creative and art services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-art-service-form')}
                        className="gap-1.5 bg-amber-600 hover:bg-amber-700"
                    >
                        + Add Art Service
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
                    <span>🎨</span> Creative & Art Services ({filteredArts.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredArts.map(renderArtCard)}
            </div>
        </div>
    );
};

export default ArtUserService;