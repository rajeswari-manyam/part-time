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
}

const HotelUserService: React.FC<HotelUserServiceProps> = ({ 
    userId, 
    selectedSubcategory 
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
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                {/* Banner */}
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl">🏨</span>
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
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
                </div>

                {/* Body */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {hotel.name || "Unnamed Service"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {hotel.type && (
                            <span className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-gray-100 text-gray-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200`}>
                                <span className="shrink-0">🏨</span>
                                <span className="truncate">{hotel.type}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-green-50 text-green-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-green-200`}>
                            <span>⏰</span> Open 24 Hrs
                        </span>
                    </div>

                    {hotel.description && (
                        <p className={`${typography.card.description} text-gray-600 line-clamp-2`}>
                            {hotel.description}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className={`${typography.body.xs} font-semibold text-gray-700`}>
                            {hotel.ratings || "N/A"}
                        </span>
                        {hotel.priceRange && (
                            <span className={`ml-auto ${typography.body.xs} font-semibold text-green-700`}>
                                ₹ {hotel.priceRange}
                            </span>
                        )}
                    </div>

                    {amenities.length > 0 && (
                        <div>
                            <p className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}>
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {amenities.slice(0, 3).map((a, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-gray-100 text-gray-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200`}
                                    >
                                        <span>✓</span> {a}
                                    </span>
                                ))}
                                {amenities.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{amenities.length - 3} more
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
                            onClick={() => openDirections(hotel)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-green-600 text-green-700 hover:bg-green-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => hotel.phone && openCall(hotel.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5"
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
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏨</span> Hotel & Travel Services
                </h2>
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State - NOW SHOWS INSTEAD OF RETURNING NULL ──
    if (filteredHotels.length === 0) {
        return (
            <div>
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏨</span> Hotel & Travel Services (0)
                </h2>
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
            <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                <span>🏨</span> Hotel & Travel Services ({filteredHotels.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredHotels.map(renderHotelCard)}
            </div>
        </div>
    );
};

export default HotelUserService;