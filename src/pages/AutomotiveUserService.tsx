import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAutomotive, AutomotiveService } from "../services/AutomotiveServcie.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
};

// ============================================================================
// PROPS
// ============================================================================
interface AutomotiveUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const AutomotiveUserService: React.FC<AutomotiveUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to AutomotiveService[] so all existing field access works
    const [automotives, setAutomotives] = useState<AutomotiveService[]>(data as AutomotiveService[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredAutomotives = selectedSubcategory
        ? automotives.filter(
            (a) =>
                a.businessType &&
                a.businessType.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : automotives;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => {
        navigate(`/add-automotive-form?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this automotive service?")) return;
        setDeleteLoading(id);
        try {
            const response = await deleteAutomotive(id);
            if (response.success) {
                setAutomotives((prev) => prev.filter((a) => a._id !== id));
            } else {
                alert(response.message || "Failed to delete service");
            }
        } catch (error) {
            console.error("Error deleting automotive:", error);
            alert("Failed to delete service");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => {
        navigate(`/automotive-services/details/${id}`);
    };

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (automotive: AutomotiveService) => {
        const id = automotive._id || "";
        const servicesList = ensureArray(automotive.services);
        const imageUrls = (automotive.images || []).filter(Boolean) as string[];
        const location = [automotive.area, automotive.city, automotive.state]
            .filter(Boolean).join(", ") || "Location not specified";

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={automotive.name || "Automotive"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🚗</span>
                        </div>
                    )}

                    {/* Business Type Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                            {automotive.businessType || "Automotive"}
                        </span>
                    </div>

                    {/* Action Dropdown */}
                    <div className="absolute top-3 right-3">
                        {deleteLoading === id ? (
                            <div className="bg-white rounded-lg p-2 shadow-lg">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
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
                        {automotive.name || "Unnamed Service"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Experience & Price */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {automotive.availability && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {automotive.availability}
                            </span>
                        )}

                        {automotive.experience != null && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-medium">
                                📅 {automotive.experience} yrs exp
                            </span>
                        )}

                        {automotive.priceRange && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 font-semibold">
                                💰 ₹{automotive.priceRange}
                            </span>
                        )}
                    </div>

                    {/* Services list */}
                    {servicesList.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                            <div className="flex flex-wrap gap-1">
                                {servicesList.slice(0, 3).map((service, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full`}>
                                        {service}
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

                    {/* View Details Button */}
                    <button
                        onClick={() => handleView(id)}
                        disabled={deleteLoading === id}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 mt-2"
                    >
                        <span>👁️</span>
                        <span>View Details</span>
                    </button>
                </div>
            </div>
        );
    };

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Automotive Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your automotive services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-automotive-form")}
                        className="gap-1.5"
                    >
                        + Add Automotive Service
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
                    <span>🚗</span> Automotive Services ({filteredAutomotives.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredAutomotives.map(renderCard)}
            </div>
        </div>
    );
};

export default AutomotiveUserService;