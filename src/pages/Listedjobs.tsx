import React, { useEffect, useState } from "react";
import { Trash2, Edit, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserJobs, deleteJob, API_BASE_URL } from "../services/api.service";

interface Job {
    _id: string;
    userId: {
        _id: string;
        phone: string;
        name: string;
    } | string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

interface ListedJobsProps {
    userId: string;
}

const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setError("Invalid User ID");
            setLoading(false);
            return;
        }

        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await getUserJobs(userId);

                // Handle the response structure from your API
                if (res.success && Array.isArray(res.jobs)) {
                    setJobs(res.jobs);
                } else if (res.success && Array.isArray(res.data)) {
                    setJobs(res.data);
                } else {
                    setError(res.message || "No jobs found for this user");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [userId]);

    const handleDelete = async (jobId: string) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        setDeletingId(jobId);
        try {
            await deleteJob(jobId);
            setJobs((prev) => prev.filter((job) => job._id !== jobId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete job");
        } finally {
            setDeletingId(null);
        }
    };

    const imageUrl = (path?: string) =>
        path ? `${API_BASE_URL}/${path.replace(/\\/g, "/")}` : "";

    if (loading) {
        return (
            <div className="flex justify-center min-h-screen items-center">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-center text-red-600">{error}</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">No jobs found</p>
                    <button
                        onClick={() => navigate("/free-listing")}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Post a Job
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Listed Jobs ({jobs.length})</h1>
                    <button
                        onClick={() => navigate("/free-listing")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Add New Job
                    </button>
                </div>

                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {job.images?.length ? (
                            <img
                                src={imageUrl(job.images[0])}
                                className="w-full h-64 object-cover"
                                alt={job.title}
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
                                }}
                            />
                        ) : (
                            <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                                No Image Available
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold">{job.title}</h2>
                                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                    {job.category}
                                </span>
                            </div>

                            <p className="mt-3 text-gray-600 line-clamp-3">{job.description}</p>

                            <button
                                onClick={() =>
                                    window.open(
                                        `https://www.google.com/maps?q=${job.latitude},${job.longitude}`,
                                        "_blank"
                                    )
                                }
                                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                            >
                                <MapPin size={16} /> View Location on Map
                            </button>

                            <div className="mt-4 text-sm text-gray-500">
                                Posted on: {new Date(job.createdAt).toLocaleDateString()}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => navigate(`/update-job/${job._id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 border border-blue-500 text-blue-600 py-2 rounded hover:bg-blue-50"
                                >
                                    <Edit size={16} /> Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(job._id)}
                                    disabled={deletingId === job._id}
                                    className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-600 py-2 rounded hover:bg-red-50 disabled:opacity-50"
                                >
                                    {deletingId === job._id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListedJobs;