import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteHotel, Hotel } from "../services/HotelService.service";
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
interface HotelUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const HotelUserService: React.FC<HotelUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to Hotel[] so all existing field access works
    const [hotels, setHotels] = useState<Hotel[]>(data as Hotel[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredHotels = selectedSubcategory
        ? hotels.filter(h =>
            h.type &&
            h.type.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : hotels;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-hotel-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        setDeleteLoading(id);
        try {
            const response = await deleteHotel(id);
            if (response.success) {
                setHotels(prev => prev.filter(h => h._id !== id));
            } else {
                alert(response.message || "Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting hotel:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/hotel-services/details/${id}`);

    const openDirections = (hotel: Hotel) => {
        if (hotel.latitude && hotel.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}`,
                "_blank"
            );
        } else if (hotel.area || hotel.city) {
            const addr = encodeURIComponent(
                [hotel.area, hotel.city, hotel.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (hotel: Hotel) => {
        const id = hotel._id || "";
        const location = [hotel.area, hotel.city, hotel.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const servicesList = ensureArray(hotel.service);
        const imageUrls = (hotel.images || []).filter(Boolean) as string[];

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
                            alt={hotel.name || "Hotel"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🏨</span>
                        </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                            {hotel.type || "Hotel"}
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
                        {hotel.name || "Unnamed Service"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Description */}
                    {hotel.description && (
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                            {hotel.description}
                        </p>
                    )}

                    {/* Rating + Price */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {hotel.ratings || "N/A"}
                            </span>
                        </div>
                        {hotel.priceRange && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Starting at</p>
                                <p className="text-base font-bold text-green-600">₹{hotel.priceRange}</p>
                            </div>
                        )}
                    </div>

                    {/* Services Tags */}
                    {servicesList.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                            <div className="flex flex-wrap gap-1">
                                {servicesList.slice(0, 3).map((s, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-blue-600/5 text-blue-600 px-2 py-0.5 rounded-full`}>
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

                    {/* Directions + View Details */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(hotel)}
                            className="flex-1 justify-center border-blue-600 text-blue-600 hover:bg-blue-600/10"
                        >
                            📍 Directions
                        </Button>
                        <button
                            onClick={() => handleView(id)}
                            disabled={deleteLoading === id}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                        >
                            <span>👁️</span>
                            <span className="truncate">View Details</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredHotels.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏨</span> Hotel & Travel Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏨</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Hotel Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your hotel and travel services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-hotel-service-form")}
                        className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                    >
                        + Add Hotel Service
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
                    <span>🏨</span> Hotel & Travel Services ({filteredHotels.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredHotels.map(renderCard)}
            </div>
        </div>
    );
};

export default HotelUserService;