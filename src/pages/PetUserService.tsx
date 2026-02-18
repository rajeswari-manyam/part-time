import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePetServiceById, PetWorker } from "../services/PetWorker.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const getCategoryIcon = (category?: string): string => {
    if (!category) return "🐾";
    const lower = category.toLowerCase();
    if (lower.includes("vet") || lower.includes("clinic")) return "🏥";
    if (lower.includes("shop")) return "🛒";
    if (lower.includes("groom")) return "✂️";
    if (lower.includes("train")) return "🐕";
    if (lower.includes("board")) return "🏠";
    if (lower.includes("sit")) return "👤";
    if (lower.includes("walk")) return "🚶";
    return "🐾";
};

// ============================================================================
// PROPS
// ============================================================================
interface PetUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const PetUserService: React.FC<PetUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to PetWorker[] so all existing field access works
    const [petServices, setPetServices] = useState<PetWorker[]>(data as PetWorker[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredServices = selectedSubcategory
        ? petServices.filter(s =>
            s.category &&
            s.category.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : petServices;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-pet-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this pet service?")) return;
        setDeleteLoading(id);
        try {
            const res = await deletePetServiceById(id);
            if (res.success) {
                setPetServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert(res.message || "Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting pet service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/pet-services/details/${id}`);

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (service: PetWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const imageUrls = (service.images || []).filter(Boolean) as string[];
        const servicesList = service.services || [];
        const price = (service as any).price || service.serviceCharge;
        const priceType = (service as any).priceType || "Per Service";

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
                            alt={service.name || "Pet Service"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{getCategoryIcon(service.category)}</span>
                        </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                            {service.category || "Pet Service"}
                        </span>
                    </div>

                    {/* Action Dropdown */}
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
                    <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                        {service.name || "Unnamed Service"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Description */}
                    {((service as any).description || service.bio) && (
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                            {(service as any).description || service.bio}
                        </p>
                    )}

                    {/* Availability + Experience badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${service.availability
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${service.availability ? "bg-green-500" : "bg-red-500"}`} />
                            {service.availability ? "Available" : "Unavailable"}
                        </span>

                        {service.experience && (
                            <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                                🐾 {service.experience} yrs exp
                            </span>
                        )}
                    </div>

                    {/* Rating + Price */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400 text-base">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {service.rating || "N/A"}
                            </span>
                        </div>
                        {price && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">{priceType}</p>
                                <p className="text-base font-bold text-blue-600">₹{price}</p>
                            </div>
                        )}
                    </div>

                    {/* Services Tags */}
                    {servicesList.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                            <div className="flex flex-wrap gap-1">
                                {servicesList.slice(0, 3).map((s, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-blue-600/5 text-blue-700 px-2 py-0.5 rounded-full`}>
                                        {s}
                                    </span>
                                ))}
                                {servicesList.length > 3 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{servicesList.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Details */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(id)}
                        className="w-full mt-2 border-blue-600 text-blue-600 hover:bg-blue-600/10"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        );
    };

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🐾</span> Pet Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Pet Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your pet services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-pet-service-form")}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                    >
                        + Add Pet Service
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
                    <span>🐾</span> Pet Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderCard)}
            </div>
        </div>
    );
};

export default PetUserService;