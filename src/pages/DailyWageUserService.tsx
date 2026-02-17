import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLabours, deleteLabour, LabourWorker } from "../services/DailyWage.service";
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

const getIcon = (subCategory?: string) => {
    const n = (subCategory || "").toLowerCase();
    if (n.includes("clean")) return "🧹";
    if (n.includes("construct") || n.includes("mason")) return "🏗️";
    if (n.includes("watch") || n.includes("guard")) return "💂";
    if (n.includes("garden")) return "🌿";
    if (n.includes("event")) return "🎪";
    if (n.includes("loading") || n.includes("unload")) return "📦";
    return "👷";
};

// ============================================================================
// PROPS
// ============================================================================
interface DailyWageUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const DailyWageUserService: React.FC<DailyWageUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState<LabourWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchWorkers = async () => {
        if (!userId) { setWorkers([]); setLoading(false); return; }
        setLoading(true);
        try {
            const response = await getUserLabours(userId);
            setWorkers(response.success ? response.data || [] : []);
        } catch (error) {
            console.error("Error fetching workers:", error);
            setWorkers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorkers(); }, [userId]);

    // ── Filter ───────────────────────────────────────────────────────────────
    const filteredWorkers = selectedSubcategory
        ? workers.filter(w =>
            w.subCategory &&
            w.subCategory.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : workers;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => {
        navigate(`/add-daily-wage-service-form?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this worker listing?")) return;
        setDeleteLoading(id);
        try {
            const result = await deleteLabour(id);
            if (result.success) {
                setWorkers(prev => prev.filter(w => w._id !== id));
            } else {
                alert("Failed to delete listing. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting worker:", error);
            alert("Failed to delete listing. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => {
        navigate(`/daily-wages/details/${id}`);
    };

    const openDirections = (worker: LabourWorker) => {
        if (worker.latitude && worker.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${worker.latitude},${worker.longitude}`,
                "_blank"
            );
        } else if (worker.area || worker.city) {
            const addr = encodeURIComponent(
                [worker.area, worker.city, worker.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    const openCall = (phone: string) => { window.location.href = `tel:${phone}`; };

    // ============================================================================
    // CARD — Hospital visual structure, daily-wage-specific fields
    // ============================================================================
    const renderWorkerCard = (worker: LabourWorker) => {
        const id = worker._id || "";
        const imageUrls = (worker.images || []).filter(Boolean) as string[];
        const location = [worker.area, worker.city, worker.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const skills = ensureArray(worker.services);

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={worker.name || "Worker"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">{getIcon(worker.subCategory)}</span>
                        </div>
                    )}

                    {/* SubCategory badge — top left */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-orange-500 text-white px-3 py-1 rounded-full shadow-md`}>
                            {worker.subCategory || "Daily Wage"}
                        </span>
                    </div>

                    {/* Action Dropdown — top right */}
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
                        {worker.name || worker.subCategory || "Unnamed Worker"}
                    </h3>

                    {/* Location — SVG pin matching Hospital */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg
                            className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                            fill="currentColor" viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>
                            {location}
                        </p>
                    </div>

                    {/* Description */}
                    {worker.description && (
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                            {worker.description}
                        </p>
                    )}

                    {/* Availability + Experience + Wage badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${worker.availability
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${worker.availability ? "bg-green-500" : "bg-red-500"}`} />
                            {worker.availability ? "Available" : "Busy"}
                        </span>

                        {worker.experience && (
                            <span className="inline-flex items-center gap-1 text-xs bg-orange-500/5 text-orange-600 px-2.5 py-1 rounded-full border border-orange-500/20 font-medium">
                                ⭐ {worker.experience} yrs exp
                            </span>
                        )}

                        {worker.dailyWage && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 font-semibold">
                                💰 ₹{worker.dailyWage}
                                {worker.chargeType ? ` / ${worker.chargeType}` : ""}
                            </span>
                        )}
                    </div>

                    {/* Skills — matching Hospital's departments/services strip */}
                    {skills.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                Skills:
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {skills.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={idx}
                                        className={`${typography.fontSize.xs} bg-orange-500/5 text-orange-600 px-2 py-0.5 rounded-full`}
                                    >
                                        {s}
                                    </span>
                                ))}
                                {skills.length > 3 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{skills.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Directions + Call — matching Hospital button pair */}
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(worker)}
                            className="flex-1 justify-center border-orange-500 text-orange-500 hover:bg-orange-500/10"
                        >
                            📍 Directions
                        </Button>
                        <button
                            onClick={() => worker.phone && openCall(worker.phone)}
                            disabled={!worker.phone}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${worker.phone
                                ? "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <span>📞</span>
                            <span className="truncate">{worker.phone ? "Call" : "No Phone"}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // LOADING
    // ============================================================================
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>👷</span> Daily Wage Workers
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                </div>
            </div>
        );
    }

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredWorkers.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>👷</span> Daily Wage Workers (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">👷</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Worker Listings Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your worker listings to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-daily-wage-service-form")}
                        className="gap-1.5 bg-orange-500 hover:bg-orange-600"
                    >
                        + Add Worker Listing
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
                    <span>👷</span> Daily Wage Workers ({filteredWorkers.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredWorkers.map(renderWorkerCard)}
            </div>
        </div>
    );
};

export default DailyWageUserService;