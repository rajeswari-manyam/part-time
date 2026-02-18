import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteShoppingRetail, ShoppingStore } from "../services/ShoppingService.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// PROPS
// ============================================================================
interface ShoppingUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideEmptyState?: boolean;
    hideHeader?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const ShoppingUserService: React.FC<ShoppingUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideEmptyState = false,
    hideHeader = false,
}) => {
    const navigate = useNavigate();

    // Cast to ShoppingStore[] so all existing field access works
    const [stores, setStores] = useState<ShoppingStore[]>(data as ShoppingStore[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredStores = selectedSubcategory
        ? stores.filter(s =>
            s.storeType &&
            s.storeType.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : stores;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-shopping-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this store?")) return;
        setDeleteLoading(id);
        try {
            const result = await deleteShoppingRetail(id);
            if (result.success) {
                setStores(prev => prev.filter(s => s._id !== id));
            } else {
                alert(result.message || "Failed to delete store. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting store:", error);
            alert("Failed to delete store. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/shopping/details/${id}`);

    const openDirections = (store: ShoppingStore) => {
        if (store.latitude && store.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${Number(store.latitude)},${Number(store.longitude)}`,
                "_blank"
            );
        } else if (store.area || store.city) {
            const addr = encodeURIComponent(
                [store.area, store.city, store.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => { window.location.href = `tel:${phone}`; };

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (store: ShoppingStore) => {
        const id = store._id || "";
        const location = [store.area, store.city, store.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const imageUrls = (store.images || []).filter(Boolean) as string[];

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
                            alt={store.storeName || "Store"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🛒</span>
                        </div>
                    )}

                    {/* Store Type badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-blue-600 text-white px-3 py-1 rounded-full shadow-md`}>
                            {store.storeType || "Store"}
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
                        {store.storeName || "Unnamed Store"}
                    </h3>

                    {store.storeType && (
                        <p className="text-sm font-medium text-gray-700 mb-2">{store.storeType}</p>
                    )}

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Description */}
                    {store.description && (
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                            {store.description}
                        </p>
                    )}

                    {/* Open Now + Store Type badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium bg-green-50 text-green-700 border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Open Now
                        </span>
                        {store.storeType && (
                            <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
                                {store.storeType}
                            </span>
                        )}
                    </div>

                    {/* Phone */}
                    {store.phone && (
                        <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                📞 {store.phone}
                            </span>
                        </div>
                    )}

                    {/* Directions + Call */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                            onClick={() => openDirections(store)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
                        >
                            <span>📍</span> Directions
                        </button>
                        <button
                            onClick={() => store.phone && openCall(store.phone)}
                            disabled={!store.phone}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${store.phone
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <span>📞</span> Call
                        </button>
                    </div>

                    {/* View Details */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(id)}
                        className="w-full mt-3 border-blue-600 text-blue-600 hover:bg-blue-600/10"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        );
    };

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredStores.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🛒</span> Shopping & Retail (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Shopping Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your shopping and retail services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-shopping-form")}
                        className="gap-1.5"
                    >
                        + Add Shopping Service
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
                    <span>🛒</span> Shopping & Retail ({filteredStores.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredStores.map(renderCard)}
            </div>
        </div>
    );
};

export default ShoppingUserService;