import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRealEstates, deleteRealEstateService, RealEstateWorker } from "../services/RealEstate.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface RealEstateUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const RealEstateUserService: React.FC<RealEstateUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [realEstates, setRealEstates] = useState<RealEstateWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Real Estates API ──
    useEffect(() => {
        const fetchRealEstates = async () => {
            if (!userId) {
                setRealEstates([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserRealEstates(userId);

                // Handle both single object and array responses
                if (response.success && response.data) {
                    const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                    setRealEstates(dataArray);
                } else {
                    setRealEstates([]);
                }
            } catch (error) {
                console.error("Error fetching real estates:", error);
                setRealEstates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRealEstates();
    }, [userId]);

    // ── Filter by subcategory (property type) ──
    const filteredRealEstates = selectedSubcategory
        ? realEstates.filter(re =>
            re.propertyType &&
            selectedSubcategory.toLowerCase().includes(re.propertyType.toLowerCase())
        )
        : realEstates;

    // ── Delete Real Estate API ──
    const handleDelete = async (realEstateId: string) => {
        if (!window.confirm("Delete this property listing?")) return;

        setDeletingId(realEstateId);
        try {
            const result = await deleteRealEstateService(realEstateId);
            if (result.success) {
                setRealEstates(prev => prev.filter(re => re._id !== realEstateId));
            } else {
                alert("Failed to delete listing. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting real estate:", error);
            alert("Failed to delete listing. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (realEstate: RealEstateWorker) => {
        if (realEstate.latitude && realEstate.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${realEstate.latitude},${realEstate.longitude}`,
                "_blank"
            );
        } else if (realEstate.area || realEstate.city) {
            const addr = encodeURIComponent(
                [realEstate.address, realEstate.area, realEstate.city, realEstate.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Real Estate Card ──
    const renderRealEstateCard = (realEstate: RealEstateWorker) => {
        const id = realEstate._id || "";
        const location = [realEstate.area, realEstate.city, realEstate.state]
            .filter(Boolean)
            .join(", ") || "Location not set";
        const amenitiesList: string[] = (realEstate.amenities && typeof realEstate.amenities === 'string')
            ? realEstate.amenities.split(',').map(a => a.trim()).filter(Boolean)
            : (Array.isArray(realEstate.amenities) ? realEstate.amenities : []);

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
                            navigate(`/add-real-estate-form?id=${id}`);
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
                        {realEstate.propertyType} - {realEstate.listingType}
                    </h2>

                    {/* Owner Name */}
                    <p className="text-sm font-medium text-gray-700">
                        {realEstate.name}
                    </p>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Property Type and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {realEstate.propertyType && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🏠</span>
                                <span className="truncate">{realEstate.propertyType}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${realEstate.availabilityStatus === 'Available'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${realEstate.availabilityStatus === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {realEstate.availabilityStatus}
                        </span>
                    </div>

                    {/* Description */}
                    {realEstate.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {realEstate.description}
                        </p>
                    )}

                    {/* Property Details */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            {realEstate.bedrooms > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 text-sm">🛏️</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {realEstate.bedrooms} BHK
                                    </span>
                                </div>
                            )}
                            {realEstate.areaSize && (
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500 text-sm">📏</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {realEstate.areaSize} sq ft
                                    </span>
                                </div>
                            )}
                        </div>
                        {realEstate.price && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {realEstate.listingType}
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{realEstate.price.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Amenities */}
                    {amenitiesList.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Amenities
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {amenitiesList.slice(0, 3).map((amenity, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-green-500">●</span> {amenity}
                                    </span>
                                ))}
                                {amenitiesList.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{amenitiesList.length - 3} more
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
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                openDirections(realEstate);
                            }}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                realEstate.phone && openCall(realEstate.phone);
                            }}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{realEstate.phone || "No Phone"}</span>
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
                        <span>🏠</span> Real Estate Listings
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (filteredRealEstates.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏠</span> Real Estate Listings (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Property Listings Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your property listings to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-real-estate-form')}
                        className="gap-1.5"
                    >
                        + Add Property
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
                    <span>🏠</span> Real Estate Listings ({filteredRealEstates.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredRealEstates.map(renderRealEstateCard)}
            </div>
        </div>
    );
};

export default RealEstateUserService;