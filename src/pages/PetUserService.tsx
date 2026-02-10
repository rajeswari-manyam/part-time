import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPetServices, deletePetServiceById, PetWorker } from "../services/PetWorker.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface PetUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const PetUserService: React.FC<PetUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [petServices, setPetServices] = useState<PetWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Pet Services API ──
    useEffect(() => {
        const fetchPetServices = async () => {
            if (!userId) {
                setPetServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserPetServices(userId);
                setPetServices(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching pet services:", error);
                setPetServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPetServices();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredServices = selectedSubcategory
        ? petServices.filter(s =>
            s.category &&
            selectedSubcategory.toLowerCase().includes(s.category.toLowerCase())
        )
        : petServices;

    // ── Delete Pet Service API ──
    const handleDelete = async (serviceId: string) => {
        if (!window.confirm("Delete this pet service?")) return;

        setDeletingId(serviceId);
        try {
            const result = await deletePetServiceById(serviceId);
            if (result.success) {
                setPetServices(prev => prev.filter(s => s._id !== serviceId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting pet service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (service: PetWorker) => {
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

    // ── Get category icon ──
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

    // ── Render Pet Service Card ──
    const renderPetServiceCard = (service: PetWorker) => {
        const id = service._id || "";
        const location = [service.area, service.city, service.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const servicesList = service.services || [];

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative"
                style={{ border: '1px solid #e5e7eb' }}
            >
                {/* Three Dots Menu */}
                <div className="absolute top-3 right-3 z-10">
                    <ActionDropdown
                        onEdit={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            // Navigate to PetForm edit mode with the service id
                            navigate(`/add-pet-service-form?id=${id}`);
                        }}
                        onDelete={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDelete(id);
                        }}
                    />
                </div>

                {/* Service Image (if available) */}
                {service.images && service.images.length > 0 && (
                    <div className="relative h-40 overflow-hidden">
                        <img
                            src={service.images[0]}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        {service.images.length > 1 && (
                            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                +{service.images.length - 1} more
                            </span>
                        )}
                    </div>
                )}

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

                    {/* Category and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {service.category && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">{getCategoryIcon(service.category)}</span>
                                <span className="truncate">{service.category}</span>
                            </span>
                        )}
                        {service.availability !== undefined && (
                            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${
                                service.availability
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                    service.availability ? 'bg-green-500' : 'bg-red-500'
                                }`}></span>
                                {service.availability ? 'Available' : 'Unavailable'}
                            </span>
                        )}
                    </div>

                    {/* Bio */}
                    {service.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {service.bio}
                        </p>
                    )}

                    {/* Rating and Service Charge */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400 text-base">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {service.rating || "N/A"}
                            </span>
                        </div>
                        {service.serviceCharge && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Starting at</p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{service.serviceCharge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Services Offered */}
                    {servicesList.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Services Offered
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {servicesList.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-green-500">●</span> {s}
                                    </span>
                                ))}
                                {servicesList.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
                                        +{servicesList.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {service.experience && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                <span className="font-semibold">Experience:</span> {service.experience} years
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <button
                            onClick={() => openDirections(service)}
                            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <span>📍</span> Directions
                        </button>
                        <button
                            onClick={() => service.phone && openCall(service.phone)}
                            disabled={deletingId === id || !service.phone}
                            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{service.phone || "No Phone"}</span>
                        </button>
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
                        <span>🐾</span> Pet Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-500">Loading pet services...</p>
                    </div>
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
                        <span>🐾</span> Pet Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🐾</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Pet Services Yet
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Start adding your pet services to showcase them here.
                    </p>
                    {/* ✅ Navigate to pet-services/add route */}
                    <button
                        onClick={() => navigate('/add-pet-service-form')}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                    >
                        + Add Pet Service
                    </button>
                </div>
            </div>
        );
    }

    // ── Render ──
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🐾</span> Pet Services ({filteredServices.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(renderPetServiceCard)}
            </div>
        </div>
    );
};

export default PetUserService;