import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Import existing daily wage worker card components
import NearbyWorkersCard from "../components/cards/DailyWages/NearByLoadingWorkers";
import NearbyCleaningScreen from "../components/cards/DailyWages/NearByCleaning";
import NearbyConstructionScreen from "../components/cards/DailyWages/NearByConstructionScreen";
import WashmanScreen from "../components/cards/DailyWages/NearByWashman";

export interface DailyWageWorkerType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    workerData?: {
        status: boolean;
        pincode: string;
        icon: string;
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        phone?: string;
        photos?: string[];
        wage_range?: string;
        services?: string[];
        special_tags?: string[];
        years_of_experience?: number;
        worker_count?: number;
        verified?: boolean;
        welfare_association?: boolean;
    };
}

const ActionDropdown: React.FC<{
    workerId: string;
    onEdit: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ workerId, onEdit, onDelete }) => {
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
                                onEdit(workerId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition"
                        >
                            ✏️ Edit
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={(e) => {
                                onDelete(workerId, e);
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

const DailyWagesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [workers, setWorkers] = useState<DailyWageWorkerType[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    const handleView = (worker: any) => {
        navigate(`/daily-wages/details/${worker.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-daily-wage-form/${id}`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this worker listing?")) return;

        try {
            setWorkers((prev) => prev.filter((w) => w.id !== id));
            alert("Worker listing deleted successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to delete worker listing");
        }
    };

    const handleAddPost = () => {
        navigate("/add-daily-wage-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Daily Wage Workers";
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

        // ✅ LOADING/UNLOADING WORKERS MATCHING
        if (
            normalized.includes("loading") ||
            normalized.includes("unloading") ||
            normalized.includes("loading-unloading") ||
            normalized.includes("material-handling")
        ) {
            console.log("✅ Matched to NearbyWorkersCard");
            return NearbyWorkersCard;
        }

        // ✅ CLEANING WORKERS/HELPERS MATCHING
        if (
            normalized.includes("cleaning") ||
            normalized.includes("house-cleaning") ||
            normalized.includes("housekeeping") ||
            normalized.includes("cleaning-helper")
        ) {
            console.log("✅ Matched to NearbyCleaningScreen");
            return NearbyCleaningScreen;
        }

        // ✅ CONSTRUCTION LABOR MATCHING
        if (
            normalized.includes("construction") ||
            normalized.includes("construction-labor") ||
            normalized.includes("construction-worker") ||
            normalized.includes("building-labor")
        ) {
            console.log("✅ Matched to NearbyConstructionScreen");
            return NearbyConstructionScreen;
        }

        // ✅ GARDEN WORKERS MATCHING
        if (
            normalized.includes("garden") ||
            normalized.includes("gardener") ||
            normalized.includes("landscaping")
        ) {
            console.log("✅ Matched to NearbyWorkersCard (Garden)");
            return NearbyWorkersCard;
        }

        // ✅ EVENT HELPERS MATCHING
        if (
            normalized.includes("event") && normalized.includes("helper") ||
            normalized.includes("event-worker") ||
            normalized.includes("event-staff")
        ) {
            console.log("✅ Matched to NearbyWorkersCard (Event)");
            return NearbyWorkersCard;
        }

        // ✅ WATCHMEN MATCHING
        if (
            normalized.includes("watchmen") ||
            normalized.includes("watchman") ||
            normalized.includes("security-guard") ||
            normalized.includes("guard") ||
            normalized.includes("security")
        ) {
            console.log("✅ Matched to WashmanScreen");
            return WashmanScreen;
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
            "loading",
            "unloading",
            "cleaning",
            "construction",
            "labor",
            "labour",
            "worker",
            "helper",
            "garden",
            "event",
            "watchmen",
            "watchman",
            "security",
            "guard",
            "housekeeping",
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

        return hasMatch;
    };

    // Get appropriate icon based on subcategory
    const getCategoryIcon = (): string => {
        const normalized = normalizeSubcategory(subcategory);

        if (normalized.includes("loading") || normalized.includes("unloading")) return "📦";
        if (normalized.includes("cleaning")) return "🧹";
        if (normalized.includes("construction")) return "👷";
        if (normalized.includes("garden")) return "🌱";
        if (normalized.includes("event")) return "🎪";
        if (normalized.includes("watchmen") || normalized.includes("watchman") || normalized.includes("security") || normalized.includes("guard")) return "🛡️";

        return "👷";
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

                {/* Real API Workers Section */}
                {workers.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                {getCategoryIcon()} Your Listed Workers ({workers.length})
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workers.map((worker) => (
                                <div key={worker.id} className="relative">
                                    <CardComponent job={worker} onViewDetails={handleView} />
                                    <div className="absolute top-3 right-3 z-10">
                                        <ActionDropdown
                                            workerId={worker.id}
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading workers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 to-white">
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
                        {workers.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">{getCategoryIcon()}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    No Workers Found
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to add a worker listing in this category!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {workers.map((worker) => (
                                    <div
                                        key={worker.id}
                                        className="relative group bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition cursor-pointer overflow-hidden"
                                        onClick={() => handleView(worker)}
                                    >
                                        {/* Dropdown */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <ActionDropdown
                                                workerId={worker.id}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </div>

                                        {/* Worker Badge */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                            <span>{worker.workerData?.icon || getCategoryIcon()}</span>
                                            <span>{worker.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {worker.workerData?.icon || getCategoryIcon()}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                {worker.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {worker.location}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {worker.description}
                                            </p>

                                            {worker.workerData?.pincode && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">📍</span>
                                                    <span className="text-gray-700">
                                                        Pincode: {worker.workerData.pincode}
                                                    </span>
                                                </div>
                                            )}

                                            {worker.workerData?.worker_count && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">👥</span>
                                                    <span className="text-gray-700">
                                                        {worker.workerData.worker_count} Workers Available
                                                    </span>
                                                </div>
                                            )}

                                            {worker.workerData?.wage_range && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">💰</span>
                                                    <span className="text-gray-700 font-semibold">
                                                        {worker.workerData.wage_range}
                                                    </span>
                                                </div>
                                            )}

                                            {worker.workerData?.rating && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="font-semibold text-gray-700">
                                                        {worker.workerData.rating.toFixed(1)}
                                                    </span>
                                                    {worker.workerData.user_ratings_total && (
                                                        <span className="text-gray-500">
                                                            ({worker.workerData.user_ratings_total} reviews)
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {worker.workerData?.status !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                            worker.workerData.status
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        <span className="mr-1">
                                                            {worker.workerData.status ? "✓" : "✗"}
                                                        </span>
                                                        {worker.workerData.status ? "Available" : "Busy"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Tags */}
                                            {(worker.workerData?.verified || worker.workerData?.welfare_association) && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {worker.workerData.verified && (
                                                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                                            ✓ Verified
                                                        </span>
                                                    )}
                                                    {worker.workerData.welfare_association && (
                                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                                            🏛️ Welfare Association
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

export default DailyWagesList;