import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEducations, deleteEducationService, EducationService } from "../services/EducationService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

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
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<EducationService[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Education Services API ──
    const fetchServices = async () => {
        if (!userId) {
            setServices([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getUserEducations(userId);
            console.log("Education services response:", response);

            // Debug: Log the structure of the first service
            if (response.success && response.data && response.data.length > 0) {
                console.log("First education service structure:", response.data[0]);
                console.log("Subjects type:", typeof response.data[0].subjects, response.data[0].subjects);
                console.log("Qualifications type:", typeof response.data[0].qualifications, response.data[0].qualifications);
            }

            setServices(response.success ? response.data || [] : []);
        } catch (error) {
            console.error("Error fetching education services:", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredServices = selectedSubcategory
        ? services.filter(s =>
            s.type &&
            s.type.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : services;

    // ── Delete Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this education service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteEducationService(serviceId);
            if (result.success) {
                setServices(prev => prev.filter(s => s._id !== serviceId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting education service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (service: EducationService) => {
        if (service.latitude && service.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`,
                "_blank"
            );
        } else if (service.area || service.city) {
            const addr = encodeURIComponent(
                [service.area, service.city, service.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Helper to convert subjects/qualifications to array ──
    const toArray = (value: any): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            return value.split(',').map(item => item.trim()).filter(Boolean);
        }
        return [];
    };

    // ── Render Service Card ──
    const renderServiceCard = (service: EducationService) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean)
            .join(", ") || "Location not set";

        // Convert to arrays safely
        const subjects = toArray(service.subjects);
        const qualifications = toArray(service.qualifications);

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative"
                style={{ border: '1px solid #e5e7eb' }}
            >
                {/* Three Dots Menu */}
                <div className="absolute top-3 right-3 z-10">
                    {deletingId === id ? (
                        <div className="bg-white rounded-lg p-2 shadow-lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <ActionDropdown
                            onEdit={(e) => {
                                e?.stopPropagation();
                                navigate(`/add-education-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e?.stopPropagation();
                                handleDelete(id);
                            }}
                        />
                    )}
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 truncate pr-8">
                        {service.name || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Type and Experience Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {service.type && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🎓</span>
                                <span className="truncate">{service.type}</span>
                            </span>
                        )}
                        {service.experience && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-200 font-medium">
                                <span className="shrink-0">📚</span> {service.experience} years exp
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                        </p>
                    )}

                    {/* Charges */}
                    {service.charges && (
                        <div className="flex items-center justify-between py-2 border-t border-b border-gray-100">
                            <div className="text-left">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Charges</p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{service.charges}
                                    {service.chargeType && (
                                        <span className="text-xs font-normal text-gray-500 ml-1">
                                            / {service.chargeType}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Subjects */}
                    {subjects.length > 0 && (
                        <div className="pt-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Subjects Taught
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {subjects.slice(0, 3).map((subject, idx) => (
                                    <span
                                        key={`${id}-subject-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200"
                                    >
                                        <span className="text-blue-500">●</span> {subject}
                                    </span>
                                ))}
                                {subjects.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{subjects.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Qualifications */}
                    {qualifications.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Qualifications
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {qualifications.slice(0, 2).map((qual, idx) => (
                                    <span
                                        key={`${id}-qual-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-md border border-green-200"
                                    >
                                        🎓 {qual}
                                    </span>
                                ))}
                                {qualifications.length > 2 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{qualifications.length - 2} more
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
                            onClick={() => openDirections(service)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => service.phone && openCall(service.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id || !service.phone}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{service.phone || "No Phone"}</span>
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
                        <span>🎓</span> Education Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Education Services Yet
                    </h3>
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

    // ── Render ──
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🎓</span> Education Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderServiceCard)}
            </div>
        </div>
    );
};

export default EducationUserService;