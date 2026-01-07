import React, { useEffect, useState } from "react";
import { Trash2, Edit, Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserJobs, deleteJob } from "../services/api.service";
import { typography } from "../styles/typography";

const IMAGE_BASE_URL = "http://192.168.1.13:3000";

interface Job {
    _id: string;
    title?: string;
    description: string;
    category: string;
    subcategory?: string;
    jobType?: string;
    servicecharges?: string | number;
    startDate?: string;
    endDate?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    createdAt: string;
}

interface ListedJobsProps {
    userId: string;
}

const DetailRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
        <div className="py-3 border-b border-gray-100 last:border-b-0">
            <p className={`${typography.body.small} text-gray-600 mb-1`}>{label}</p>
            <p className={`${typography.body.base} text-gray-900`}>{value}</p>
        </div>
    );
};

const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await getUserJobs(userId);
                setJobs(res.jobs || res.data || []);
            } catch {
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [userId]);

    const handleDelete = async (jobId: string) => {
        if (!window.confirm("Delete this job?")) return;
        setDeletingId(jobId);
        await deleteJob(jobId);
        setJobs(prev => prev.filter(j => j._id !== jobId));
        setDeletingId(null);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className={`${typography.heading.h3} text-gray-900`}>
                        My Listed Jobs
                        <span className={`${typography.body.base} text-gray-500 ml-2`}>
                            ({jobs.length})
                        </span>
                    </h1>

                    <button
                        onClick={() => navigate("/user-profile")}
                        className={`${typography.body.base} bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors`}
                    >
                        + Add Job
                    </button>
                </div>

                {/* Job Cards */}
                {jobs.map(job => {
                    const mainImage = job.images?.[0];

                    return (
                        <div
                            key={job._id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Image Section */}
                            {job.images && job.images.length > 0 ? (
                                <div className="relative w-full h-64 bg-gray-100">
                                    <img
                                        src={`${IMAGE_BASE_URL}/${mainImage}`}
                                        alt={job.title || "Job image"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://via.placeholder.com/400x300?text=No+Image";
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                    <span className={`${typography.body.base} text-gray-400`}>
                                        No images available
                                    </span>
                                </div>
                            )}

                            {/* Content Section */}
                            <div className="p-6">
                                {/* Category Badge */}
                                <div className="mb-3">
                                    <span className={`${typography.misc.badge} inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full`}>
                                        {job.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className={`${typography.card.title} text-gray-900 mb-2`}>
                                    {job.title || job.subcategory || "Untitled Job"}
                                </h2>

                                {/* Subcategory */}
                                {job.subcategory && (
                                    <p className={`${typography.body.base} text-gray-600 mb-4`}>
                                        {job.subcategory}
                                    </p>
                                )}

                                {/* Job Type */}
                                {job.jobType && (
                                    <p className={`${typography.body.small} text-gray-700 mb-4 uppercase tracking-wide font-medium`}>
                                        {job.jobType}
                                    </p>
                                )}

                                {/* Service Charges */}
                                {job.servicecharges && (
                                    <div className="mb-4">
                                        <p className={`${typography.heading.h4} text-green-600`}>
                                            ₹{job.servicecharges}
                                        </p>
                                        <p className={`${typography.body.xs} text-gray-500`}>
                                            Service Charges
                                        </p>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-4">
                                    <h3 className={`${typography.form.label} text-gray-900 mb-2`}>
                                        Description
                                    </h3>
                                    <p className={`${typography.body.base} text-gray-700 leading-relaxed`}>
                                        {job.description}
                                    </p>
                                </div>

                                {/* Location */}
                                {(job.area || job.city || job.state || job.pincode) && (
                                    <div className="mb-4 flex items-start gap-2">
                                        <MapPin size={20} className="text-gray-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className={`${typography.form.label} text-gray-900 mb-1`}>
                                                Location
                                            </h3>
                                            <p className={`${typography.body.base} text-gray-700`}>
                                                {[job.area, job.city, job.state, job.pincode]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Details */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <DetailRow
                                        label="Start Date"
                                        value={
                                            job.startDate
                                                ? new Date(job.startDate).toLocaleDateString()
                                                : undefined
                                        }
                                    />
                                    <DetailRow
                                        label="End Date"
                                        value={
                                            job.endDate
                                                ? new Date(job.endDate).toLocaleDateString()
                                                : undefined
                                        }
                                    />
                                    <DetailRow
                                        label="Posted On"
                                        value={new Date(job.createdAt).toLocaleDateString()}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => navigate(`/update-job/${job._id}`)}
                                        className={`${typography.body.base} flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors`}
                                    >
                                        <Edit size={18} /> Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        disabled={deletingId === job._id}
                                        className={`${typography.body.base} flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-400 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50`}
                                    >
                                        {deletingId === job._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {jobs.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <p className={`${typography.heading.h5} mb-2`}>No jobs listed yet</p>
                        <p className={typography.body.base}>
                            Click "Add Job" to create your first job
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListedJobs;