import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEducations, deleteEducationService, EducationService } from "../services/EducationService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ── Helper: parse subjects / qualifications string or array ───────────────────
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map(s => s.trim()).filter(Boolean);
    return [];
};

// ── Helper: extract services array from any API response shape ────────────────
const extractServices = (response: any): EducationService[] => {
    console.log("📦 EducationUserService raw response:", response);
    console.log("📦 response keys:", response ? Object.keys(response) : "null/undefined");

    if (!response) return [];

    // Shape 1 — bare array
    if (Array.isArray(response)) {
        console.log("✅ Shape: bare array, length:", response.length);
        return response;
    }

    if (typeof response !== "object") return [];

    // Shape 2 — { success, data: [...] }  ← expected from getUserEducations
    if (Array.isArray(response.data)) {
        console.log("✅ Shape: response.data array, length:", response.data.length);
        return response.data;
    }

    // Shape 3 — { success, educations: [...] }
    if (Array.isArray(response.educations)) {
        console.log("✅ Shape: response.educations array, length:", response.educations.length);
        return response.educations;
    }

    // Shape 4 — { success, result: [...] }
    if (Array.isArray(response.result)) {
        console.log("✅ Shape: response.result array, length:", response.result.length);
        return response.result;
    }

    // Shape 5 — { data: { data: [...] } }  (double-wrapped)
    if (response.data && Array.isArray(response.data.data)) {
        console.log("✅ Shape: response.data.data array, length:", response.data.data.length);
        return response.data.data;
    }

    // Shape 6 — { data: { educations: [...] } }
    if (response.data && Array.isArray(response.data.educations)) {
        console.log("✅ Shape: response.data.educations, length:", response.data.educations.length);
        return response.data.educations;
    }

    // Shape 7 — single object in data
    if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
        console.log("✅ Shape: single object in response.data");
        return [response.data];
    }

    console.warn("⚠️ EducationUserService: unrecognised response shape — no services extracted");
    return [];
};

interface EducationUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const EducationUserService: React.FC<EducationUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<EducationService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchServices = async () => {
        if (!userId) {
            console.warn("⚠️ EducationUserService: no userId provided");
            setServices([]);
            setLoading(false);
            return;
        }

        console.log("🔄 EducationUserService: fetching for userId:", userId);
        setLoading(true);

        try {
            const response = await getUserEducations(userId);
            const extracted = extractServices(response);
            console.log(`✅ EducationUserService: setting ${extracted.length} services`);
            setServices(extracted);
        } catch (error) {
            console.error("❌ EducationUserService fetch error:", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, [userId]);

    // ── Filter by subcategory ─────────────────────────────────────────────────
    // Strict filter first; if it wipes everything but we have data, show all
    // (prevents blank screen due to type-name mismatch)
    const strictFiltered = selectedSubcategory
        ? services.filter(s =>
            s.type && s.type.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    const filteredServices =
        selectedSubcategory && strictFiltered.length === 0 && services.length > 0
            ? services
            : strictFiltered;

    console.log(
        `🔍 filter — total: ${services.length}, after filter: ${filteredServices.length}, subcategory: "${selectedSubcategory}"`
    );

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
        } finally { setDeleteLoading(null); }
    };

    const handleView = (id: string) => navigate(`/education/details/${id}`);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🎓</span> Education Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
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
                        onClick={() => navigate('/add-education-form')}
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
                {filteredServices.map((service) => {
                    const id = service._id || "";
                    const location =
                        [service.area, service.city, service.state].filter(Boolean).join(", ") ||
                        "Location not specified";
                    const subjects = ensureArray(service.subjects);
                    const qualifications = ensureArray(service.qualifications);
                    const imageUrls = (service.images || []).filter(Boolean) as string[];

                    return (
                        <div
                            key={id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* ── Image ── */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-600/10 to-indigo-600/5">
                                {imageUrls.length > 0 ? (
                                    <img
                                        src={imageUrls[0]}
                                        alt={service.name || "Education Service"}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">🎓</span>
                                    </div>
                                )}

                                {/* Service Type Badge — top left */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {service.type || "Education"}
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
                                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium bg-blue-50 text-blue-700 border-blue-200">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            {service.experience} yrs experience
                                        </span>
                                    )}
                                    {service.chargeType && (
                                        <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                            {service.chargeType}
                                        </span>
                                    )}
                                </div>

                                {/* Charges */}
                                {service.charges && (
                                    <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {service.chargeType || "Charges"}
                                            </p>
                                            <p className="text-base font-bold text-blue-600">
                                                ₹{Number(service.charges).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

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
                })}
            </div>
        </div>
    );
};

export default EducationUserService;