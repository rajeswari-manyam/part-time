import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserStores, deleteShoppingRetail, ShoppingStore } from "../services/ShoppingService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface ShoppingUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideEmptyState?: boolean; // NEW: Control empty state display
    hideHeader?: boolean;
}

const ShoppingUserService: React.FC<ShoppingUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideEmptyState = false, // Default: show empty state
    hideHeader = false
}) => {
    const navigate = useNavigate();
    const [stores, setStores] = useState<ShoppingStore[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Stores API ──
    useEffect(() => {
        const fetchStores = async () => {
            if (!userId) {
                setStores([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserStores(userId);
                setStores(response.success ? response.data || [] : []);
            } catch (error) {
                console.error("Error fetching stores:", error);
                setStores([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, [userId]);

    // ── Filter by subcategory (FIXED LOGIC) ──
    const filteredStores = selectedSubcategory
        ? stores.filter(s =>
            s.storeType &&
            s.storeType.toLowerCase() === selectedSubcategory.toLowerCase()
        )
        : stores;

    // ── Delete Store API ──
    const handleDelete = async (storeId: string) => {
        if (!window.confirm("Delete this store?")) return;

        setDeletingId(storeId);
        try {
            const result = await deleteShoppingRetail(storeId);
            if (result.success) {
                setStores(prev => prev.filter(s => s._id !== storeId));
            } else {
                alert("Failed to delete store. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting store:", error);
            alert("Failed to delete store. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (store: ShoppingStore) => {
        if (store.latitude && store.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`,
                "_blank"
            );
        } else if (store.area || store.city) {
            const addr = encodeURIComponent(
                [store.area, store.city, store.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Store Card ──
    const renderStoreCard = (store: ShoppingStore) => {
        const id = store._id || "";
        const location = [store.area, store.city, store.state]
            .filter(Boolean)
            .join(", ") || "Location not set";

        return (
            <div
                key={id}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                {/* Banner */}
                <div className="relative w-full h-32 sm:h-36 md:h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl">🛒</span>
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/add-shopping-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDelete(id);
                            }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-2.5 sm:p-3 md:p-4 flex flex-col flex-1 gap-1.5 sm:gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate text-sm sm:text-base md:text-lg`}>
                        {store.storeName || "Unnamed Store"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2">
                        {store.storeType && (
                            <span className={`inline-flex items-center gap-0.5 sm:gap-1 ${typography.misc.badge} bg-gray-100 text-gray-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-gray-200 text-[10px] sm:text-xs`}>
                                <span className="shrink-0 text-xs sm:text-sm">🛒</span>
                                <span className="truncate">{store.storeType}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-0.5 sm:gap-1 ${typography.misc.badge} bg-green-50 text-green-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-green-200 text-[10px] sm:text-xs`}>
                            <span className="text-xs sm:text-sm">⏰</span> Open Now
                        </span>
                    </div>

                    {store.description && (
                        <p className={`${typography.card.description} text-gray-600 line-clamp-2 text-xs sm:text-sm`}>
                            {store.description}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-3 mt-auto pt-2 sm:pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(store)}
                            className="w-full sm:flex-1 justify-center gap-1 sm:gap-1.5 border-green-600 text-green-700 hover:bg-green-50 !py-1.5 sm:!py-2 !text-xs sm:!text-sm"
                        >
                            <span className="text-sm sm:text-base">📍</span>
                            <span className="hidden xs:inline">Directions</span>
                            <span className="xs:hidden">Dir</span>
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => store.phone && openCall(store.phone)}
                            className="w-full sm:flex-1 justify-center gap-1 sm:gap-1.5 !py-1.5 sm:!py-2 !text-xs sm:!text-sm"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0 text-sm sm:text-base">📞</span>
                            <span className="truncate">{store.phone || "No Phone"}</span>
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
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl`}>
                        <span className="text-lg sm:text-xl">🛒</span>
                        <span className="flex-1 min-w-0">Shopping & Retail</span>
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State - CONDITIONALLY RENDERED ──
    if (filteredStores.length === 0) {
        // If hideEmptyState is true, don't render anything
        if (hideEmptyState) {
            return null;
        }

        // Otherwise, show the empty state card
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl`}>
                        <span className="text-lg sm:text-xl">🛒</span>
                        <span className="flex-1 min-w-0">Shopping & Retail (0)</span>
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Shopping Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your shopping and retail services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-shopping-form')}
                        className="gap-1.5"
                    >
                        + Add Shopping Service
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render Stores ──
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg md:text-xl`}>
                    <span className="text-lg sm:text-xl">🛒</span>
                    <span className="flex-1 min-w-0">Shopping & Retail ({filteredStores.length})</span>
                </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {filteredStores.map(renderStoreCard)}
            </div>
        </div>
    );
};

export default ShoppingUserService;