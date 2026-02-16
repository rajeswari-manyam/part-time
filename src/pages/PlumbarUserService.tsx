import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserJobs, deleteJob } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// JOB INTERFACE
// ============================================================================
export interface PlumberJob {
    _id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    jobType: string;
    servicecharges: string;
    startDate: string;
    endDate: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================
interface PlumberUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const PlumberUserService: React.FC<PlumberUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<PlumberJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Fetch Jobs API ──
    useEffect(() => {
        const fetchJobs = async () => {
            if (!userId) {
                setJobs([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getUserJobs(userId);

                // Filter only plumbing category jobs
                const plumberJobs = (response.jobs || []).filter((job: any) =>
                    job.category && job.category.toLowerCase() === 'plumbing'
                );

                setJobs(plumberJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [userId]);

    // ── Filter by subcategory ──
    const filteredJobs = selectedSubcategory
        ? jobs.filter(job =>
            job.subcategory &&
            selectedSubcategory.toLowerCase().includes(job.subcategory.toLowerCase())
        )
        : jobs;

    // ── Delete Job API ──
    const handleDelete = async (jobId: string) => {
        if (!window.confirm("Delete this service?")) return;

        setDeletingId(jobId);
        try {
            const result = await deleteJob(jobId);
            if (result.success) {
                setJobs(prev => prev.filter(j => j._id !== jobId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Helper functions ──
    const openDirections = (job: PlumberJob) => {
        if (job.latitude && job.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`,
                "_blank"
            );
        } else if (job.area || job.city) {
            const addr = encodeURIComponent(
                [job.area, job.city, job.state].filter(Boolean).join(", ")
            );
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
        }
    };

    // ── Render Job Card ──
    const renderJobCard = (job: PlumberJob) => {
        const id = job._id || "";
        const location = [job.area, job.city, job.state]
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
                            navigate(`/add-plumber-service-form?id=${id}`);
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
                        {job.title || "Unnamed Service"}
                    </h2>

                    {/* Location */}
                    <p className="text-sm text-gray-500 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">📍</span>
                        <span className="line-clamp-1">{location}</span>
                    </p>

                    {/* Subcategory and Job Type Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        {job.subcategory && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                <span className="shrink-0">🔧</span>
                                <span className="truncate">{job.subcategory}</span>
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium bg-blue-50 text-blue-700 border-blue-200">
                            {job.jobType?.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Description */}
                    {job.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {job.description}
                        </p>
                    )}

                    {/* Dates and Price */}
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                            </p>
                        </div>
                        {job.servicecharges && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Charges
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{job.servicecharges}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(job)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/plumber-services/details/${id}`)}
                            className="w-full sm:flex-1 justify-center gap-1.5"
                            disabled={deletingId === id}
                        >
                            <span className="shrink-0">👁️</span>
                            <span>View Details</span>
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
                        <span>🔧</span> Plumber Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (filteredJobs.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🔧</span> Plumber Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🔧</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Plumber Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your plumber services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-plumber-service-form')}
                        className="gap-1.5"
                    >
                        + Add Plumber Service
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
                    <span>🔧</span> Plumber Services ({filteredJobs.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredJobs.map(renderJobCard)}
            </div>
        </div>
    );
};

export default PlumberUserService;