import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRealEstates, deleteRealEstateService, RealEstateWorker } from "../services/RealEstate.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ── Helper: parse amenities string or array ───────────────────────────────────
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map(s => s.trim()).filter(Boolean);
    return [];
};

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
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [realEstates, setRealEstates] = useState<RealEstateWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchRealEstates = async () => {
        if (!userId) { setRealEstates([]); setLoading(false); return; }
        setLoading(true);
        try {
            const response = await getUserRealEstates(userId);
            console.log("User real estates response:", response);
            if (response.success && response.data) {
                setRealEstates(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                setRealEstates([]);
            }
        } catch (error) {
            console.error("Error fetching real estates:", error);
            setRealEstates([]);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchRealEstates(); }, [userId]);

    // ── Filter by subcategory — mirrors HotelUserService ─────────────────────
    const filteredRealEstates = selectedSubcategory
        ? realEstates.filter(re =>
            re.propertyType && re.propertyType.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : realEstates;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-real-estate-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        setDeleteLoading(id);
        try {
            const res = await deleteRealEstateService(id);
            if (res.success) {
                setRealEstates(prev => prev.filter(re => re._id !== id));
            } else {
                alert(res.message || "Failed to delete listing. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting real estate:", error);
            alert("Failed to delete listing. Please try again.");
        } finally { setDeleteLoading(null); }
    };

    const handleView = (id: string) => navigate(`/real-estate/details/${id}`);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏠</span> Real Estate Listings
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                </div>
            </div>
        );
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Property Listings Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your property listings to showcase them here.
                    </p>
                    <Button variant="primary" size="md" onClick={() => navigate('/add-real-estate-form')}
                        className="gap-1.5 bg-green-600 hover:bg-green-700">
                        + Add Property
                    </Button>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER — mirrors HotelUserService card structure exactly
    // ============================================================================
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏠</span> Real Estate Listings ({filteredRealEstates.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredRealEstates.map((re) => {
                    const id = re._id || "";
                    const location = [re.area, re.city, re.state].filter(Boolean).join(", ") || "Location not specified";
                    const amenitiesList = ensureArray(re.amenities);
                    const imageUrls = (re.images || []).filter(Boolean) as string[];

                    return (
                        <div key={id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                            {/* ── Image — mirrors HotelUserService image section ── */}
                            <div className="relative h-48 bg-gradient-to-br from-green-600/10 to-green-600/5">
                                {imageUrls.length > 0 ? (
                                    <img src={imageUrls[0]} alt={re.name || "Property"}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">🏠</span>
                                    </div>
                                )}

                                {/* Property Type Badge — top left, mirrors hotel.type badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-green-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {re.propertyType || "Property"}
                                    </span>
                                </div>

                                {/* Action Dropdown — top right, mirrors HotelUserService */}
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
                                {/* Title */}
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {re.propertyType} — {re.listingType}
                                </h3>

                                {/* Owner name */}
                                {re.name && (
                                    <p className="text-sm font-medium text-gray-700 mb-2">{re.name}</p>
                                )}

                                {/* Location — mirrors HotelUserService SVG pin */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                                </div>

                                {/* Description */}
                                {re.description && (
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                                        {re.description}
                                    </p>
                                )}

                                {/* Availability badge + Listing type */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${re.availabilityStatus === 'Available'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${re.availabilityStatus === 'Available' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {re.availabilityStatus || 'Available'}
                                    </span>
                                    {re.listingType && (
                                        <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                            {re.listingType}
                                        </span>
                                    )}
                                </div>

                                {/* Bedrooms + Area + Price — mirrors HotelUserService rating+price row */}
                                <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                                    <div className="flex items-center gap-3">
                                        {re.bedrooms > 0 && (
                                            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">🛏️ {re.bedrooms} BHK</span>
                                        )}
                                        {re.areaSize && (
                                            <span className="text-xs text-gray-500">📏 {re.areaSize} sq ft</span>
                                        )}
                                    </div>
                                    {re.price && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{re.listingType}</p>
                                            <p className="text-base font-bold text-green-600">₹{Number(re.price).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Amenities Tags — mirrors HotelUserService services tags */}
                                {amenitiesList.length > 0 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Amenities:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {amenitiesList.slice(0, 3).map((a, idx) => (
                                                <span key={idx}
                                                    className={`${typography.fontSize.xs} bg-green-600/5 text-green-700 px-2 py-0.5 rounded-full`}>
                                                    {a}
                                                </span>
                                            ))}
                                            {amenitiesList.length > 3 && (
                                                <span className={`${typography.fontSize.xs} text-gray-500`}>
                                                    +{amenitiesList.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* View Details — mirrors HotelUserService */}
                                <Button variant="outline" size="sm" onClick={() => handleView(id)}
                                    className="w-full mt-2 border-green-600 text-green-600 hover:bg-green-600/10">
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

export default RealEstateUserService;