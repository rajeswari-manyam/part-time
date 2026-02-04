import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getUserSportsActivities,
    deleteSportsActivity,
    SportsWorker
} from "../services/Sports.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface SportsUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideEmptyState?: boolean; // NEW: Control empty state display
}

const SportsUserService: React.FC<SportsUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideEmptyState = false // Default: show empty state
}) => {
    const navigate = useNavigate();
    const [sportsServices, setSportsServices] = useState<SportsWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Sports Services API ──
    useEffect(() => {
        const fetchSportsServices = async () => {
            if (!userId) {
                setSportsServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserSportsActivities({
                    userId,
                });

                const userServices = response.success
                    ? (response.data || [])
                    : [];
                setSportsServices(userServices);
            } catch (error) {
                console.error("Error fetching sports services:", error);
                setSportsServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSportsServices();
    }, [userId]);

    // ── Filter by subcategory (CLIENT-SIDE) ──
    const filteredServices = selectedSubcategory
        ? sportsServices.filter(s =>
            s.subCategory &&
            s.subCategory.toLowerCase() === selectedSubcategory.toLowerCase()
        )
        : sportsServices;

    // ── Delete Sports Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this sports service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deleteSportsActivity(serviceId);
            if (result.success) {
                setSportsServices(prev => prev.filter(s => s._id !== serviceId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting sports service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (service: SportsWorker) => {
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

    // ── Get icon for service type ──
    const getServiceIcon = (subCategory?: string): string => {
        if (!subCategory) return "🏃";
        const normalized = subCategory.toLowerCase();

        if (normalized.includes("gym") || normalized.includes("fitness")) return "💪";
        if (normalized.includes("yoga")) return "🧘";
        if (normalized.includes("swimming")) return "🏊";
        if (normalized.includes("cricket")) return "🏏";
        if (normalized.includes("football") || normalized.includes("soccer")) return "⚽";
        if (normalized.includes("basketball")) return "🏀";
        if (normalized.includes("tennis")) return "🎾";
        if (normalized.includes("badminton")) return "🏸";
        if (normalized.includes("stadium") || normalized.includes("ground")) return "🏟️";
        if (normalized.includes("play") || normalized.includes("indoor")) return "🎮";

        return "🏃";
    };

    // ── Render Sports Service Card ──
    const renderServiceCard = (service: SportsWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const servicesList = service.services || [];
        const icon = getServiceIcon(service.subCategory);

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                {/* Banner */}
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl">{icon}</span>
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/add-sports-service-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDelete(id);
                            }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {service.serviceName || "Unnamed Service"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {service.subCategory && (
                            <span className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-blue-100 text-blue-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-200`}>
                                <span className="shrink-0">{icon}</span>
                                <span className="truncate">{service.subCategory}</span>
                            </span>
                        )}
                        {service.availability && (
                            <span className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-green-50 text-green-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-green-200`}>
                                <span>✓</span> Available
                            </span>
                        )}
                    </div>

                    {service.description && (
                        <p className={`${typography.card.description} text-gray-600 line-clamp-2`}>
                            {service.description}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className={`${typography.body.xs} font-semibold text-gray-700`}>
                            {service.rating || "N/A"}
                        </span>
                        {service.experience && (
                            <span className={`ml-auto ${typography.body.xs} text-gray-600`}>
                                {service.experience} years exp.
                            </span>
                        )}
                    </div>

                    {service.serviceCharge && service.chargeType && (
                        <div className="flex items-center justify-between">
                            <span className={`${typography.body.xs} text-gray-600`}>
                                Service Charge:
                            </span>
                            <span className={`${typography.body.xs} font-semibold text-green-700`}>
                                ₹{service.serviceCharge}/{service.chargeType}
                            </span>
                        </div>
                    )}

                    {servicesList.length > 0 && (
                        <div>
                            <p className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}>
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {servicesList.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-purple-50 text-purple-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-purple-200`}
                                    >
                                        <span>✓</span> {s}
                                    </span>
                                ))}
                                {servicesList.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{servicesList.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(service)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-green-600 text-green-700 hover:bg-green-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/sports-services/details/${id}`)}
                            className="w-full sm:flex-1 justify-center gap-1.5"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">👁️</span>
                            <span className="truncate">View Details</span>
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
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏃</span> Sports & Fitness Services
                </h2>
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State - CONDITIONALLY RENDERED ──
    if (filteredServices.length === 0) {
        // If hideEmptyState is true, don't render anything
        if (hideEmptyState) {
            return null;
        }

        // Otherwise, show the empty state card
        return (
            <div>
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏃</span> Sports & Fitness Services (0)
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏃</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Sports Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your sports and fitness services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-sports-service-form')}
                        className="gap-1.5"
                    >
                        + Add Sports Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render Services ──
    return (
        <div>
            <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                <span>🏃</span> Sports & Fitness Services ({filteredServices.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderServiceCard)}
            </div>
        </div>
    );
};

export default SportsUserService;