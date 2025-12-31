import React, { useEffect, useState } from "react";
import { Trash2, Edit, MapPin, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, deleteJob, API_BASE_URL } from "../services/api.service";

interface Job {
    _id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

const ListedJobs: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchJob = async () => {
        if (!jobId) return setError("Invalid Job ID");

        try {
            setLoading(true);
            const response = await getJobById(jobId);
            if (response.success && response.data) {
                setJob({ ...response.data }); // clone to prevent shared reference
            } else {
                setError(response.message || "Job not found");
            }
        } catch (err: any) {
            setError(err.message || "Failed to load job");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const handleDelete = async () => {
        if (!job) return;
        if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;

        try {
            setDeleting(true);
            const res = await deleteJob(job._id);
            if (res.success) {
                alert("Job deleted successfully!");
                navigate("/jobs"); // go back to jobs list
            } else {
                alert(res.message || "Failed to delete job");
            }
        } finally {
            setDeleting(false);
        }
    };

    const imageUrl = (path?: string) => path ? `${API_BASE_URL}/${path.replace(/\\/g, '/')}` : '';

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    const openMap = () => {
        if (!job) return;
        window.open(`https://www.google.com/maps?q=${job.latitude},${job.longitude}`, "_blank");
    };

    const getCategoryName = (categoryId: string) => {
        const map: Record<string, string> = { "1": "Plumbing", "2": "Electrical", "3": "Carpentry", "4": "Painting", "5": "Cleaning" };
        return map[categoryId] || "Unknown";
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" size={48} /></div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
    if (!job) return <div className="p-6 text-center">No job found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate("/jobs")} className="mb-4 text-blue-600 hover:text-blue-700">← Back to Jobs</button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {job.images && job.images.length > 0 ? (
                        <img src={imageUrl(job.images[0])} alt={job.title} className="w-full h-64 object-cover" />
                    ) : (
                        <div className="h-64 bg-gray-200 flex items-center justify-center">No Image Available</div>
                    )}

                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                            {getCategoryName(job.category)}
                        </span>

                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Description</h3>
                            <p className="text-gray-600">{job.description}</p>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Location</h3>
                            <p><strong>Lat:</strong> {job.latitude.toFixed(6)}</p>
                            <p><strong>Lng:</strong> {job.longitude.toFixed(6)}</p>
                            <button onClick={openMap} className="mt-3 text-blue-600 flex items-center gap-2"><MapPin size={16} /> View on Map</button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                            <p><strong>Created:</strong> {formatDate(job.createdAt)}</p>
                            <p><strong>Updated:</strong> {formatDate(job.updatedAt)}</p>
                            <p><strong>Job ID:</strong> {job._id}</p>
                        </div>

                        {/* Edit & Delete Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => navigate(`/update-job/${job._id}`)}
                                className="flex-1 border-2 border-blue-500 text-blue-500 py-3 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                            >
                                <Edit size={18} /> Edit Job
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? "Deleting..." : <><Trash2 size={18} /> Delete Job</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListedJobs;
