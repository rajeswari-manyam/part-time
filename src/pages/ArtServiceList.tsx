import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Import existing craft card components
import CraftBusinessCard from "../components/cards/Art Service/NearByCraft";
import CaricatureArtistListing from "../components/cards/Art Service/NearByCaricature";
import PainterListing from "../components/cards/Art Service/NearByPrinter";
import WallMuralListing from "../components/cards/Art Service/NearByWallMural";
import NearByHandMadeGifts from "../components/cards/Art Service/NearByHandMadeGifts";

export interface CraftServiceType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    craftData?: {
        status: boolean;
        pincode: string;
        icon: string;
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        phone?: string;
        photos?: string[];
        price_range?: string;
        services?: string[];
        special_tags?: string[];
        years_in_business?: number;
        specialties?: string[];
        verified?: boolean;
        trending?: boolean;
        popular?: boolean;
    };
}

const ActionDropdown: React.FC<{
    serviceId: string;
    onEdit: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ serviceId, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-white/80 bg-white/60 backdrop-blur-sm rounded-full transition shadow-sm"
                aria-label="More options"
            >
                <MoreVertical size={18} className="text-gray-700" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-20">
                        <button
                            onClick={(e) => {
                                onEdit(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition"
                        >
                            ✏️ Edit
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={(e) => {
                                onDelete(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const CraftServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<CraftServiceType[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    const handleView = (craft: any) => {
        navigate(`/craft-services/details/${craft.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-craft-service-form/${id}`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            setServices((prev) => prev.filter((s) => s.id !== id));
            alert("Service deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete service");
        }
    };

    const handleAddPost = () => {
        navigate("/add-craft-service-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Craft Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    // ✅ Normalize subcategory to handle different route formats
    const normalizeSubcategory = (sub: string | undefined): string => {
        if (!sub) return "";

        // Convert to lowercase for consistent comparison
        const normalized = sub.toLowerCase();

        // Log for debugging
        console.log("📍 Raw subcategory:", sub);
        console.log("📍 Normalized subcategory:", normalized);

        return normalized;
    };

    // ✅ Smart matching function to handle route variations
    const getCardComponentForSubcategory = (
        subcategory: string | undefined
    ): React.ComponentType<any> | null => {
        if (!subcategory) return null;

        const normalized = normalizeSubcategory(subcategory);
// ✅ CRAFT TRAINING MATCHING
if (
  normalized.includes("craft") && normalized.includes("training") || // "craft training"
  normalized.includes("craft-training")
) {
  console.log("✅ Matched to CraftBusinessCard (Training)");
  return CraftBusinessCard;
}


        // ✅ CARICATURE ARTISTS MATCHING
        if (
            normalized.includes("caricature") ||
            normalized.includes("digital-caricature") ||
            normalized.includes("sketch-artist")
        ) {
            console.log("✅ Matched to CaricatureArtistListing");
            return CaricatureArtistListing;
        }

        // ✅ PAINTING ARTISTS MATCHING
        if (
            normalized.includes("painting") && normalized.includes("artist") ||
            normalized.includes("painting-artist") ||
            normalized.includes("sketch-painting") ||
            normalized.includes("3d-painting") ||
            normalized.includes("canvas-painting") ||
            normalized.includes("portrait-artist")
        ) {
            console.log("✅ Matched to PainterListing");
            return PainterListing;
        }

        // ✅ WALL MURALS MATCHING
        if (
            normalized.includes("wall") && normalized.includes("mural") ||
            normalized.includes("wall-mural") ||
            normalized.includes("wall-art") ||
            normalized.includes("mural-painting")
        ) {
            console.log("✅ Matched to WallMuralListing");
            return WallMuralListing;
        }

        // ✅ HANDMADE GIFTS MATCHING
        if (
            normalized.includes("handmade") && normalized.includes("gift") ||
            normalized.includes("handmade-gift") ||
            normalized.includes("gift-designer") ||
            normalized.includes("craft-gift") ||
            normalized.includes("custom-gift")
        ) {
            console.log("✅ Matched to NearByHandMadeGifts");
            return NearByHandMadeGifts;
        }

        console.warn(`⚠️ No matching card component for: "${subcategory}"`);
        return null;
    };

    // Helper function to check if subcategory should show nearby cards
    const shouldShowNearbyCards = (): boolean => {
        if (!subcategory) return false;

        const normalized = normalizeSubcategory(subcategory);

        // Check if any of the keywords match
        const keywords = [
            "craft",
            "cutting",
            "caricature",
            "painting",
            "artist",
            "wall",
            "mural",
            "handmade",
            "gift",
            "sketch",
            "3d",
            "canvas",
            "portrait",
            "art",
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

        return hasMatch;
    };

    // Get appropriate icon based on subcategory
    const getCategoryIcon = (): string => {
        const normalized = normalizeSubcategory(subcategory);

        if (normalized.includes("caricature")) return "🎨";
        if (normalized.includes("painting")) return "🖌️";
        if (normalized.includes("mural")) return "🖼️";
        if (normalized.includes("gift")) return "🎁";
        if (normalized.includes("craft") || normalized.includes("cutting")) return "✂️";

        return "🎨";
    };

    // Render nearby cards which have dummy data built-in
    const renderNearbyCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        return (
            <div className="space-y-8">
                {/* Nearby Card Components - renders built-in dummy data */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        {getCategoryIcon()} Nearby {getDisplayTitle()}
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                {getCategoryIcon()} Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <CardComponent job={service} onViewDetails={handleView} />
                                    <div className="absolute top-3 right-3 z-10">
                                        <ActionDropdown
                                            serviceId={service.id}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading craft services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{getCategoryIcon()}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            {getDisplayTitle()}
                        </h1>
                    </div>
                    <Button variant="gradient-blue" size="md" onClick={handleAddPost}>
                        + Add Post
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Content Rendering */}
                {shouldShowNearbyCards() ? (
                    // Render nearby cards with dummy data built-in
                    renderNearbyCardsSection()
                ) : (
                    // Regular display for other subcategories or no subcategory
                    <>
                        {services.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">{getCategoryIcon()}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    No Services Found
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to add a craft service in this category!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="relative group bg-white rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-lg transition cursor-pointer overflow-hidden"
                                        onClick={() => handleView(service)}
                                    >
                                        {/* Dropdown */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <ActionDropdown
                                                serviceId={service.id}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </div>

                                        {/* Service Badge */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                            <span>{service.craftData?.icon || getCategoryIcon()}</span>
                                            <span>{service.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {service.craftData?.icon || getCategoryIcon()}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                {service.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {service.location}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {service.craftData?.pincode && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">📍</span>
                                                    <span className="text-gray-700">
                                                        Pincode: {service.craftData.pincode}
                                                    </span>
                                                </div>
                                            )}

                                            {service.craftData?.rating && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-amber-500">⭐</span>
                                                    <span className="font-semibold text-gray-700">
                                                        {service.craftData.rating.toFixed(1)}
                                                    </span>
                                                    {service.craftData.user_ratings_total && (
                                                        <span className="text-gray-500">
                                                            ({service.craftData.user_ratings_total} reviews)
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {service.craftData?.status !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${service.craftData.status
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <span className="mr-1">
                                                            {service.craftData.status ? "✓" : "✗"}
                                                        </span>
                                                        {service.craftData.status ? "Available" : "Busy"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Tags */}
                                            {(service.craftData?.verified || service.craftData?.trending || service.craftData?.popular) && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {service.craftData.verified && (
                                                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                    {service.craftData.trending && (
                                                        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                                                            🔥 Trending
                                                        </span>
                                                    )}
                                                    {service.craftData.popular && (
                                                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                                                            ⭐ Popular
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CraftServicesList;