import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCreativeArts, deleteCreativeArtService, CreativeArtWorker } from "../services/Creative.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ── Helper ────────────────────────────────────────────────────────────────────
const getCategoryIcon = (subcategory?: string): string => {
    const n = (subcategory || "").toLowerCase();
    if (n.includes("caricature")) return "🎨";
    if (n.includes("painting") || n.includes("painter")) return "🖌️";
    if (n.includes("mural") || n.includes("wall")) return "🖼️";
    if (n.includes("gift") || n.includes("handmade")) return "🎁";
    if (n.includes("craft")) return "✂️";
    return "🎨";
};

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
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [arts, setArts] = useState<CreativeArtWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchArts = async () => {
            if (!userId) { setArts([]); setLoading(false); return; }
            setLoading(true);
            try {
                const response = await getUserCreativeArts(userId);
                if (response.success && response.data) {
                    setArts(Array.isArray(response.data) ? response.data : [response.data]);
                } else { setArts([]); }
            } catch (error) {
                console.error("Error fetching art services:", error);
                setArts([]);
            } finally { setLoading(false); }
        };
        fetchArts();
    }, [userId]);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredArts = selectedSubcategory
        ? arts.filter(a => a.subCategory && selectedSubcategory.toLowerCase().includes(a.subCategory.toLowerCase()))
        : arts;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-art-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        setDeleteLoading(id);
        try {
            const res = await deleteCreativeArtService(id);
            if (res.success) setArts(prev => prev.filter(a => a._id !== id));
            else alert(res.message || "Failed to delete service. Please try again.");
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete service. Please try again.");
        } finally { setDeleteLoading(null); }
    };

    const handleView = (id: string) => navigate(`/art-services/details/${id}`);

    const openDirections = (art: CreativeArtWorker) => {
        if (art.latitude && art.longitude)
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${art.latitude},${art.longitude}`, "_blank");
        else if (art.area || art.city)
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent([art.area, art.city, art.state].filter(Boolean).join(", "))}`, "_blank");
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🎨</span> Creative & Art Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                </div>
            </div>
        );
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Art Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your creative and art services to showcase them here.
                    </p>
                    <Button variant="primary" size="md" onClick={() => navigate('/add-art-service-form')}
                        className="gap-1.5 bg-amber-600 hover:bg-amber-700">
                        + Add Art Service
                    </Button>
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
                    <span>🎨</span> Creative & Art Services ({filteredArts.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredArts.map((art) => {
                    const id = art._id || "";
                    const location = [art.area, art.city, art.state].filter(Boolean).join(", ") || "Location not specified";
                    const imageUrls = (art.images || []).filter(Boolean) as string[];
                    const icon = getCategoryIcon(art.subCategory);

                    return (
                        <div key={id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                            {/* ── Image — mirrors RealEstateUserService image section exactly ── */}
                            <div className="relative h-48 bg-gradient-to-br from-amber-600/10 to-amber-600/5">
                                {imageUrls.length > 0 ? (
                                    <img src={imageUrls[0]} alt={art.name || "Art Service"}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">{icon}</span>
                                    </div>
                                )}

                                {/* SubCategory Badge — top left, mirrors RealEstate propertyType badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-amber-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {art.subCategory || "Art Service"}
                                    </span>
                                </div>

                                {/* ActionDropdown — top right, mirrors RealEstateUserService */}
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

                                {/* Image count — bottom right if multiple */}
                                {imageUrls.length > 1 && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                        1 / {imageUrls.length}
                                    </div>
                                )}
                            </div>

                            {/* ── Details ── */}
                            <div className="p-4">
                                {/* Title */}
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {art.name || "Unnamed Service"}
                                </h3>

                                {/* Location — mirrors RealEstate SVG pin */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                                </div>

                                {/* Description */}
                                {art.description && (
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                                        {art.description}
                                    </p>
                                )}

                                {/* Availability + chargeType badges — mirrors RealEstate availabilityStatus + listingType */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${art.availability !== false
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${art.availability !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {art.availability !== false ? 'Available' : 'Busy'}
                                    </span>
                                    {art.chargeType && (
                                        <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                            {art.chargeType}
                                        </span>
                                    )}
                                </div>

                                {/* Experience + Charge — mirrors RealEstate bedrooms+price row */}
                                <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                                    <div className="flex items-center gap-3">
                                        {art.experience != null && (
                                            <span className="text-sm font-semibold text-gray-700">🏅 {art.experience} yrs</span>
                                        )}
                                        {art.rating && (
                                            <span className="text-sm text-gray-500">⭐ {art.rating}</span>
                                        )}
                                    </div>
                                    {art.serviceCharge != null && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{art.chargeType || 'Charge'}</p>
                                            <p className="text-base font-bold text-amber-600">₹{art.serviceCharge}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Directions + View Details buttons — mirrors RealEstate */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => openDirections(art)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-amber-600 text-amber-600 rounded-lg font-medium text-sm hover:bg-amber-50 transition-colors">
                                        📍 Directions
                                    </button>
                                    <Button variant="outline" size="sm" onClick={() => handleView(id)}
                                        className="justify-center border-amber-600 text-amber-600 hover:bg-amber-600/10">
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

export default ArtUserService;