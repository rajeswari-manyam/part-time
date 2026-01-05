import React, { useEffect, useState } from "react";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserJobs, deleteJob } from "../services/api.service";
const IMAGE_BASE_URL = "http://192.168.1.22:3000"; // ✅ ADD THIS
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

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between gap-4">
            <span className="text-gray-500 min-w-[120px]">{label}</span>
            <span className="font-medium text-right flex-1">{value}</span>
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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        My Listed Jobs{" "}
                        <span className="text-sm text-gray-500">
                            ({jobs.length})
                        </span>
                    </h1>

                    <button
                        onClick={() => navigate("/free-listing")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700"
                    >
                        + Add Job
                    </button>
                </div>

                {/* Job Cards */}
                {jobs.map(job => (
                    <div
                        key={job._id}
                        className="bg-white rounded-3xl border-2 border-blue-500 p-6 space-y-5"
                    >
                        {/* Title */}
                        <h2 className="text-xl font-semibold">
                            {job.title || job.subcategory}
                        </h2>

                        {/* Images */}
                        {job.images && job.images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {job.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className="relative w-full h-32 rounded-xl overflow-hidden border bg-gray-100"
                                    >
                                        <img
                                            src={`${IMAGE_BASE_URL}${img}`}
                                            alt={`job-${i}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    "https://via.placeholder.com/300x200?text=No+Image";
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Info */}
                        <div className="space-y-3 text-gray-800">
                            <InfoRow label="Category" value={job.category} />
                            <InfoRow label="Subcategory" value={job.subcategory} />
                            <InfoRow label="Job Type" value={job.jobType} />

                            <InfoRow
                                label="Service Charges"
                                value={
                                    job.servicecharges
                                        ? `₹${job.servicecharges}`
                                        : undefined
                                }
                            />

                            <InfoRow
                                label="Start Date"
                                value={
                                    job.startDate
                                        ? new Date(job.startDate).toLocaleDateString()
                                        : undefined
                                }
                            />

                            <InfoRow
                                label="End Date"
                                value={
                                    job.endDate
                                        ? new Date(job.endDate).toLocaleDateString()
                                        : undefined
                                }
                            />

                            <InfoRow
                                label="Location"
                                value={[
                                    job.area,
                                    job.city,
                                    job.state,
                                    job.pincode,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            />

                            <InfoRow label="Description" value={job.description} />

                            <InfoRow
                                label="Posted On"
                                value={new Date(job.createdAt).toLocaleDateString()}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                onClick={() => navigate(`/update-job/${job._id}`)}
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
                            >
                                <Edit size={14} /> Edit
                            </button>

                            <button
                                onClick={() => handleDelete(job._id)}
                                disabled={deletingId === job._id}
                                className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 rounded-lg text-sm hover:bg-red-50"
                            >
                                {deletingId === job._id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Trash2 size={14} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty */}
                {jobs.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <p className="text-lg font-medium">No jobs listed yet</p>
                        <p className="text-sm">
                            Click “Add Job” to create your first job
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListedJobs;
