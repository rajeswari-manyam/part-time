import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAutomotives, deleteAutomotive, AutomotiveService } from "../services/AutomotiveServcie.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
};

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
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [automotives, setAutomotives] = useState<AutomotiveService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    const fetchAutomotives = async () => {
        if (!userId) {
            setAutomotives([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getUserAutomotives(userId);
            console.log("User automotives response:", response);
            setAutomotives(response.success ? response.data || [] : []);
        } catch (error) {
            console.error("Error fetching automotives:", error);
            setAutomotives([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAutomotives();
    }, [userId]);

    // ── Filter by subcategory ────────────────────────────────────────────────
    const filteredAutomotives = selectedSubcategory
        ? automotives.filter(
            (a) =>
                a.businessType &&
                a.businessType.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : automotives;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (automotiveId: string) => {
        navigate(`/add-automotive-form?id=${automotiveId}`);
    };

    const handleDelete = async (automotiveId: string) => {
        if (!window.confirm("Are you sure you want to delete this automotive service?")) return;

        setDeleteLoading(automotiveId);
        try {
            const response = await deleteAutomotive(automotiveId);
            if (response.success) {
                setAutomotives((prev) => prev.filter((a) => a._id !== automotiveId));
                alert("Automotive service deleted successfully!");
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

    const handleView = (automotiveId: string) => {
        navigate(`/automotive-services/details/${automotiveId}`);
    };

    // ── Loading ───────────────────────────────────────────────────────────────
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

    // ── Empty ─────────────────────────────────────────────────────────────────
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
                        onClick={() => navigate("/add-automotive-form")}
                        className="gap-1.5"
                    >
                        + Add Automotive Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🚗</span> Automotive Services ({filteredAutomotives.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredAutomotives.map((automotive) => {
                    const id = automotive._id || "";
                    const servicesList = ensureArray(automotive.services);

                    return (
                        <div
                            key={id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* ── Image Section ── */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50">
                                {automotive.images && automotive.images.length > 0 ? (
                                    <img
                                        src={automotive.images[0]}
                                        alt={automotive.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">🚗</span>
                                    </div>
                                )}

                                {/* Business Type Badge */}
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}
                                    >
                                        {automotive.businessType || "Automotive"}
                                    </span>
                                </div>

                                {/* Action Dropdown */}
                                <div className="absolute top-3 right-3">
                                    {deleteLoading === id ? (
                                        <div className="bg-white rounded-lg p-2 shadow-lg">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
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
                                {/* Name */}
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {automotive.name || "Unnamed Service"}
                                </h3>

                                {/* Location */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg
                                        className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>
                                        {[automotive.area, automotive.city, automotive.state]
                                            .filter(Boolean)
                                            .join(", ") || "Location not specified"}
                                    </p>
                                </div>

                                {/* Experience & Price Row */}
                                <div className="flex items-center justify-between mb-3">
                                    {automotive.experience !== undefined &&
                                        automotive.experience !== null && (
                                            <span
                                                className={`${typography.body.xs} text-gray-600 flex items-center gap-1`}
                                            >
                                                <span>📅</span>
                                                {automotive.experience} yrs experience
                                            </span>
                                        )}
                                    {automotive.priceRange && (
                                        <span className="text-sm font-bold text-green-600">
                                            ₹{automotive.priceRange}
                                        </span>
                                    )}
                                </div>

                                {/* Availability Badge */}
                                {automotive.availability && (
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            {automotive.availability}
                                        </span>
                                    </div>
                                )}

                                {/* Services */}
                                {servicesList.length > 0 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                            Services:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {servicesList.slice(0, 3).map((service, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`${typography.fontSize.xs} bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full`}
                                                >
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

export default AutomotiveUserService;