import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBeautyWorkers, deleteById, BeautyWorker } from "../services/Beauty.Service.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ── Helper: ensure value is a string array ────────────────────────────────────
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input.map(String);
    if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
    return [];
};

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
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<BeautyWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchServices = async () => {
        if (!userId) { setServices([]); setLoading(false); return; }
        setLoading(true);
        try {
            const response = await getUserBeautyWorkers(userId);
            // Handle both {success, data} and direct array responses
            if (response && response.success) {
                setServices(response.data || []);
            } else if (Array.isArray(response)) {
                setServices(response);
            } else {
                setServices([]);
            }
        } catch (err) {
            console.error("Error fetching beauty services:", err);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, [userId]);

    // ── Fix 18: correct filter direction (service matches subcategory, not reversed) ──
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.category &&
            s.category.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-beauty-service-form?id=${id}`);

    const handleView = (id: string) => navigate(`/beauty-services/details/${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this beauty service?")) return;
        setDeleteLoading(id);
        try {
            const result = await deleteById(id);
            // Fix 16: handle both {success} and plain ok responses
            const ok = result?.success ?? (result !== null && result !== undefined);
            if (ok) {
                setServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert(result?.message || "Failed to delete service. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting beauty service:", err);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const openDirections = (beauty: BeautyWorker) => {
        if (beauty.latitude && beauty.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${beauty.latitude},${beauty.longitude}`, "_blank");
        } else if (beauty.area || beauty.city) {
            const addr = encodeURIComponent([beauty.area, beauty.city, beauty.state].filter(Boolean).join(", "));
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => { window.location.href = `tel:${phone}`; };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💅</span> Beauty & Wellness Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
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
                        <span>💅</span> Beauty & Wellness Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💅</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Beauty Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your beauty and wellness services to showcase them here.
                    </p>
                    <Button variant="primary" size="md" onClick={() => navigate('/add-beauty-service-form')} className="gap-1.5">
                        + Add Beauty Service
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
                    <span>💅</span> Beauty & Wellness Services ({filteredServices.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(beauty => {
                    const id = beauty._id || "";
                    const location = [beauty.area, beauty.city, beauty.state]
                        .filter(Boolean).join(", ") || "Location not specified";
                    // Fix 14: images already full URLs from backend — no manual prefix
                    const firstImage = beauty.images && beauty.images.length > 0 ? beauty.images[0] : null;
                    const servicesList = ensureArray(beauty.services);
                    const hasPhone = Boolean(beauty.phone);

                    return (
                        <div
                            key={id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Fix 19: consistent h-48 matching Hospital ──────── */}
                            <div className="relative h-48 bg-gradient-to-br from-rose-50 to-pink-100">
                                {firstImage ? (
                                    <img
                                        src={firstImage}
                                        alt={beauty.name}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">💅</span>
                                    </div>
                                )}

                                {/* Category badge — top left */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className={`${typography.misc.badge} bg-rose-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {beauty.category || 'Beauty'}
                                    </span>
                                </div>

                                {/* Fix 15: delete spinner overlays image only — matching Hospital */}
                                <div className="absolute top-3 right-3 z-10">
                                    {deleteLoading === id ? (
                                        <div className="bg-white rounded-lg p-2 shadow-lg">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600" />
                                        </div>
                                    ) : (
                                        <ActionDropdown
                                            onEdit={() => handleEdit(id)}
                                            onDelete={() => handleDelete(id)}
                                        />
                                    )}
                                </div>

                                {/* Availability badge — bottom left */}
                                <div className="absolute bottom-3 left-3 z-10">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${beauty.availability
                                        ? "bg-green-100/90 text-green-800 border-green-300"
                                        : "bg-gray-100/90 text-gray-700 border-gray-300"}`}>
                                        {beauty.availability ? "✓ Available" : "⏸ Unavailable"}
                                    </span>
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-4">
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-1 truncate`}>
                                    {beauty.name || 'Unnamed Service'}
                                </h3>

                                {/* Location */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                                </div>

                                {/* Rating + experience + charge */}
                                <div className="flex items-center gap-2 flex-wrap mb-3">
                                    {beauty.rating && (
                                        <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                                            <span className="text-yellow-500">⭐</span> {beauty.rating}
                                        </span>
                                    )}
                                    {beauty.experience && (
                                        <span className={`${typography.body.xs} text-gray-500`}>
                                            • {beauty.experience} yr{beauty.experience !== 1 ? 's' : ''} exp
                                        </span>
                                    )}
                                    {beauty.serviceCharge && (
                                        <span className={`ml-auto ${typography.body.xs} font-bold text-rose-700`}>
                                            ₹{beauty.serviceCharge}+
                                        </span>
                                    )}
                                </div>

                                {/* Services */}
                                {servicesList.length > 0 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1.5 font-medium`}>Services:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {servicesList.slice(0, 3).map((svc, idx) => (
                                                <span key={idx} className={`${typography.fontSize.xs} bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200`}>
                                                    {svc}
                                                </span>
                                            ))}
                                            {servicesList.length > 3 && (
                                                <span className={`${typography.fontSize.xs} text-gray-500 px-1`}>
                                                    +{servicesList.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Bio */}
                                {beauty.bio && (
                                    <p className={`${typography.body.xs} text-gray-500 italic line-clamp-2 mb-3`}>
                                        "{beauty.bio}"
                                    </p>
                                )}

                                {/* Action buttons — grid like Hospital, mobile-friendly */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => openDirections(beauty)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-rose-600 text-rose-600 rounded-lg font-medium text-sm hover:bg-rose-50 active:bg-rose-100 transition-colors"
                                    >
                                        <span>📍</span>
                                        <span>Directions</span>
                                    </button>

                                    {/* Fix 17: Call disabled when no phone — matching Hospital */}
                                    <button
                                        onClick={() => hasPhone && openCall(beauty.phone!)}
                                        disabled={!hasPhone}
                                        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${hasPhone
                                            ? "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                    >
                                        <span>📞</span>
                                        <span>Call</span>
                                    </button>
                                </div>

                                {/* Fix 21: View Details button — same as Hospital */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleView(id)}
                                    className="w-full mt-2"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BeautyUserService;