import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";
import { getUserBusinessServices, deleteBusinessService, BusinessWorker } from "../services/BusinessService.service";

const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return input.split(',').map((s: string) => s.trim()).filter(Boolean);
    return [];
};

const getCategoryIcon = (category?: string): string => {
    if (!category) return "💼";
    const c = category.toLowerCase();
    if (c.includes("accountant") || c.includes("ca") || c.includes("tax")) return "💰";
    if (c.includes("lawyer")) return "⚖️";
    if (c.includes("insurance")) return "🛡️";
    if (c.includes("marketing")) return "📢";
    if (c.includes("event")) return "🎉";
    if (c.includes("notary")) return "📝";
    if (c.includes("consultant") || c.includes("registration")) return "📋";
    if (c.includes("printing") || c.includes("xerox")) return "🖨️";
    if (c.includes("placement")) return "👥";
    return "💼";
};

interface BusinessUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const BusinessUserService: React.FC<BusinessUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [services, setServices] = useState<BusinessWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    const fetchServices = async () => {
        if (!userId) {
            setServices([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getUserBusinessServices(userId);
            console.log("User business services response:", response);
            setServices(response.success ? response.data || [] : []);
        } catch (error) {
            console.error("Error fetching business services:", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [userId]);

    const filteredServices = selectedSubcategory
        ? services.filter(s => {
            const category = s.serviceType || s.category || '';
            return category && category.toLowerCase().includes(selectedSubcategory.toLowerCase());
        })
        : services;

    const handleEdit = (serviceId: string) => {
        navigate(`/add-business-service-form?id=${serviceId}`);
    };

    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        setDeleteLoading(serviceId);
        try {
            const response = await deleteBusinessService(serviceId);
            if (response.success) {
                setServices(prev => prev.filter(s => s._id !== serviceId));
                alert("Service deleted successfully!");
            } else {
                alert(response.message || "Failed to delete service");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (serviceId: string) => {
        navigate(`/business-services/details/${serviceId}`);
    };

    // ── Loading State ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💼</span> Business & Professional Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ───────────────────────────────────────────────────────────
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💼</span> Business & Professional Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Business Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your business services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-business-service-form')}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                    >
                        + Add Business Service
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
                    <span>💼</span> Business & Professional Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map((service) => {
                    const id = service._id || "";
                    const serviceName = service.title || service.name || "Unnamed Service";
                    const category = service.serviceType || service.category || "";
                    const servicesArr = ensureArray(service.skills || service.services);

                    return (
                        <div
                            key={id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Business Image */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
                                {service.images && service.images.length > 0 ? (
                                    <img
                                        src={service.images[0]}
                                        alt={serviceName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">{getCategoryIcon(category)}</span>
                                    </div>
                                )}

                                {/* Category Badge — top left */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {category || 'Business'}
                                    </span>
                                </div>

                                {/* Action Dropdown — top right */}
                                <div className="absolute top-3 right-3">
                                    {deleteLoading === id ? (
                                        <div className="bg-white rounded-lg p-2 shadow-lg">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                        </div>
                                    ) : (
                                        <ActionDropdown
                                            onEdit={() => handleEdit(id)}
                                            onDelete={() => handleDelete(id)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="p-4">
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {serviceName}
                                </h3>

                                {/* Location */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>
                                        {[service.area, service.city, service.state]
                                            .filter(Boolean)
                                            .join(', ') || 'Location not specified'}
                                    </p>
                                </div>

                                {/* Experience & Charge */}
                                {(service.experience || service.serviceCharge) && (
                                    <div className="flex items-center justify-between mb-3">
                                        {service.experience && (
                                            <span className={`${typography.body.xs} text-gray-600 flex items-center gap-1`}>
                                                <span>⭐</span>{service.experience} yrs experience
                                            </span>
                                        )}
                                        {service.serviceCharge && (
                                            <span className="text-sm font-bold text-green-600">
                                                ₹{service.serviceCharge}{service.chargeType ? `/${service.chargeType}` : ''}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Services chips */}
                                {servicesArr.length > 0 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                            Services:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {servicesArr.slice(0, 3).map((s, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`${typography.fontSize.xs} bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full`}
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                            {servicesArr.length > 3 && (
                                                <span className={`${typography.fontSize.xs} text-gray-500`}>
                                                    +{servicesArr.length - 3} more
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
                                    className="w-full mt-2 border-blue-600 text-blue-600 hover:bg-blue-50"
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

export default BusinessUserService;