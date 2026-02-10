import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserHotels, deleteHotel, Hotel } from "../services/HotelService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface HotelUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const HotelUserService: React.FC<HotelUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Hotels API ──
    useEffect(() => {
        const fetchHotels = async () => {
            if (!userId) {
                setHotels([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserHotels(userId);
                setHotels(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching hotels:", error);
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredHotels = selectedSubcategory
        ? hotels.filter(h =>
            h.type &&
            selectedSubcategory.toLowerCase().includes(h.type.toLowerCase())
        )
        : hotels;

    // ── Delete Hotel API ──
    const handleDelete = async (hotelId: string) => {
        if (!window.confirm("Delete this hotel service?")) return;

        setDeletingId(hotelId);
        try {
            const result = await deleteHotel(hotelId);
            if (result.success) {
                setHotels(prev => prev.filter(h => h._id !== hotelId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting hotel:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
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

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Hotel Card ──
    const renderHotelCard = (hotel: Hotel) => {
        const id = hotel._id || "";
        const location = [hotel.area, hotel.city, hotel.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const amenities = hotel.service
            ? hotel.service.split(",").map(s => s.trim()).filter(Boolean)
            : [];

        return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative"
                style={{ border: '1px solid #e5e7eb' }}
            >
                {/* Three Dots Menu */}
                <div className="absolute top-3 right-3 z-10">
                    <ActionDropdown
                        onEdit={(e) => {
                            e.stopPropagation();
                            navigate(`/add-hotel-service-form?id=${id}`);
                        }}
                        onDelete={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                        }}
                    />
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 truncate pr-8">
                        {hotel.name || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Type and Open 24 Hrs Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {hotel.type && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🏨</span>
                                <span className="truncate">{hotel.type}</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-200 font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Open 24 Hrs
                        </span>
                    </div>

                    {/* Description */}
                    {hotel.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {hotel.description}
                        </p>
                    )}

                    {/* Rating and Price */}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400 text-base">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {hotel.ratings || "N/A"}
                            </span>
                        </div>
                        {hotel.priceRange && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Starting at</p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{hotel.priceRange}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Available Services */}
                    {amenities.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Available Services
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {amenities.slice(0, 3).map((a, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-green-500">●</span> {a}
                                    </span>
                                ))}
                                {amenities.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{amenities.length - 3} more
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
                            onClick={() => openDirections(hotel)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => hotel.phone && openCall(hotel.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{hotel.phone || "No Phone"}</span>
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
                        <span>🏨</span> Hotel & Travel Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Hotel Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your hotel and travel services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-hotel-service-form')}
                        className="gap-1.5"
                    >
                        + Add Hotel Service
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
                    <span>🏨</span> Hotel & Travel Services ({filteredHotels.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredHotels.map(renderHotelCard)}
            </div>
        </div>
    );
};

export default HotelUserService;