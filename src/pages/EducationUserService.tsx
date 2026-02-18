import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEducationService, EducationService } from "../services/EducationService.service";
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
    if (typeof input === "string") return input.split(",").map(s => s.trim()).filter(Boolean);
    return [];
};

// ============================================================================
// PROPS
// ============================================================================
interface EducationUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const EducationUserService: React.FC<EducationUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to EducationService[] so all existing field access works
    const [services, setServices] = useState<EducationService[]>(data as EducationService[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const strictFiltered = selectedSubcategory
        ? services.filter(s =>
            s.type && s.type.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // If strict filter wipes everything but we have data, show all
    const filteredServices =
        selectedSubcategory && strictFiltered.length === 0 && services.length > 0
            ? services
            : strictFiltered;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-education-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        setDeleteLoading(id);
        try {
            const res = await deleteEducationService(id);
            if (res.success) {
                setServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert(res.message || "Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting education service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/education/details/${id}`);

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (service: EducationService) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const subjects = ensureArray(service.subjects);
        const qualifications = ensureArray(service.qualifications);
        const imageUrls = (service.images || []).filter(Boolean) as string[];

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600/10 to-indigo-600/5">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={service.name || "Education Service"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🎓</span>
                        </div>
                    )}

                    {/* Service Type Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                            {service.type || "Education"}
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

                    {service.type && (
                        <p className="text-sm font-medium text-gray-700 mb-2">{service.type}</p>
                    )}

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

                    {/* Experience + ChargeType badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {service.experience && (
                            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium bg-blue-50 text-blue-700 border-blue-200">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                {service.experience} yrs experience
                            </span>
                        )}
                        {service.chargeType && (
                            <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                                {service.chargeType}
                            </span>
                        )}
                        {service.charges && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 font-semibold">
                                💰 ₹{Number(service.charges).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Subjects */}
                    {subjects.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Subjects:</p>
                            <div className="flex flex-wrap gap-1">
                                {subjects.slice(0, 3).map((s, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-blue-600/5 text-blue-700 px-2 py-0.5 rounded-full`}>
                                        {s}
                                    </span>
                                ))}
                                {subjects.length > 3 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{subjects.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Qualifications */}
                    {qualifications.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Qualifications:</p>
                            <div className="flex flex-wrap gap-1">
                                {qualifications.slice(0, 2).map((q, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-indigo-600/5 text-indigo-700 px-2 py-0.5 rounded-full`}>
                                        🎓 {q}
                                    </span>
                                ))}
                                {qualifications.length > 2 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{qualifications.length - 2} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Details */}
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
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🎓</span> Education Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Education Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your education and training services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-education-form")}
                        className="gap-1.5"
                    >
                        + Add Education Service
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
                    <span>🎓</span> Education Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderCard)}
            </div>
        </div>
    );
};

export default EducationUserService;