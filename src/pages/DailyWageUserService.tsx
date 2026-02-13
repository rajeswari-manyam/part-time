import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserLabours, deleteLabour, LabourWorker } from "../services/DailyWage.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface DailyWageUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const DailyWageUserService: React.FC<DailyWageUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState<LabourWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Workers API ────────────────────────────────────────────────────
    useEffect(() => {
        const fetchWorkers = async () => {
            if (!userId) {
                setWorkers([]);
                setLoading(false);
                return;
            }

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

        fetchWorkers();
    }, [userId]);

    // ── Filter by subcategory ────────────────────────────────────────────────
    const filteredWorkers = selectedSubcategory
        ? workers.filter(w =>
            w.subCategory &&
            selectedSubcategory.toLowerCase().includes(w.subCategory.toLowerCase())
        )
        : workers;

    // ── Delete Worker API ────────────────────────────────────────────────────
    const handleDelete = async (workerId: string) => {
        if (!window.confirm("Delete this worker listing?")) return;

        setDeletingId(workerId);
        try {
            const result = await deleteLabour(workerId);
            if (result.success) {
                setWorkers(prev => prev.filter(w => w._id !== workerId));
            } else {
                alert("Failed to delete listing. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting worker:", error);
            alert("Failed to delete listing. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ─────────────────────────────────────────────────────
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

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ── Render Worker Card ───────────────────────────────────────────────────
    const renderWorkerCard = (worker: LabourWorker) => {
        const id = worker._id || "";
        const location = [worker.area, worker.city, worker.state]
            .filter(Boolean)
            .join(", ") || "Location not set";

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
                            navigate(`/add-daily-wage-form?id=${id}`);
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
                        {worker.name || worker.subCategory || "Daily Wage Worker"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Category and Availability Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {worker.subCategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">👷</span>
                                <span className="truncate">{worker.subCategory}</span>
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${
                            worker.availability
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${worker.availability ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {worker.availability ? 'Available' : 'Busy'}
                        </span>
                    </div>

                    {/* Description */}
                    {worker.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {worker.description}
                        </p>
                    )}

                    {/* Experience and Daily Wage */}
                    <div className="flex items-center justify-between py-2">
                        {worker.experience && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-blue-600 text-base">⭐</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {worker.experience} yrs exp
                                </span>
                            </div>
                        )}
                        {worker.dailyWage && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    {worker.chargeType || 'Per Day'}
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{worker.dailyWage}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Services */}
                    {worker.services && worker.services.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {worker.services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-blue-500">●</span> {s}
                                    </span>
                                ))}
                                {worker.services.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{worker.services.length - 3} more
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
                            onClick={() => openDirections(worker)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => worker.phone && openCall(worker.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            disabled={deletingId === id || !worker.phone}
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{worker.phone || "No Phone"}</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Loading State ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>👷</span> Daily Wage Workers
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──────────────────────────────────────────────────────────
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
                        onClick={() => navigate('/add-daily-wage-service-form')}
                        className="gap-1.5"
                    >
                        + Add Worker Listing
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────
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