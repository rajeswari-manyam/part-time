// import React, { useEffect, useState } from "react";
// import { Trash2, Edit, Loader2, MapPin } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { getUserJobs, deleteJob } from "../services/api.service";
// import { typography } from "../styles/typography";

// const IMAGE_BASE_URL = "http://192.168.1.13:3000";

// interface Job {
//     _id: string;
//     title?: string;
//     description: string;
//     category: string;
//     subcategory?: string;
//     jobType?: string;
//     servicecharges?: string | number;
//     startDate?: string;
//     endDate?: string;
//     area?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     latitude?: number;
//     longitude?: number;
//     images?: string[];
//     createdAt: string;
// }

// interface ListedJobsProps {
//     userId: string;
// }

// const DetailRow = ({ label, value }: { label: string; value?: string }) => {
//     if (!value) return null;
//     return (
//         <div className="py-2 border-b border-gray-100 last:border-b-0">
//             <p className={`${typography.body.xs} text-gray-500 mb-1`}>{label}</p>
//             <p className={`${typography.body.small} text-gray-900 font-medium`}>{value}</p>
//         </div>
//     );
// };

// const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
//     const navigate = useNavigate();
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [deletingId, setDeletingId] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchJobs = async () => {
//             try {
//                 const res = await getUserJobs(userId);
//                 setJobs(res.jobs || res.data || []);
//             } catch {
//                 setJobs([]);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchJobs();
//     }, [userId]);

//     const handleDelete = async (jobId: string) => {
//         if (!window.confirm("Delete this job?")) return;
//         setDeletingId(jobId);
//         await deleteJob(jobId);
//         setJobs(prev => prev.filter(j => j._id !== jobId));
//         setDeletingId(null);
//     };

//     if (loading) {
//         return (
//             <div className="flex h-screen items-center justify-center">
//                 <Loader2 size={40} className="animate-spin text-blue-600" />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 px-4 py-6">
//             <div className="max-w-7xl mx-auto space-y-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <h1 className={`${typography.heading.h3} text-gray-900`}>
//                         My Listed Jobs
//                         <span className={`${typography.body.base} text-gray-500 ml-2`}>
//                             ({jobs.length})
//                         </span>
//                     </h1>

//                     <button
//                         onClick={() => navigate("/user-profile")}
//                         className={`${typography.body.base} bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors`}
//                     >
//                         + Add Job
//                     </button>
//                 </div>

//                 {/* Job Cards - Horizontal Layout */}
//                 {jobs.map(job => {
//                     const mainImage = job.images?.[0];

//                     return (
//                         <div
//                             key={job._id}
//                             className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
//                         >
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
//                                 {/* LEFT SIDE - Image */}
//                                 <div className="relative h-64 lg:h-auto bg-gray-100">
//                                     {job.images && job.images.length > 0 ? (
//                                         <img
//                                             src={`${IMAGE_BASE_URL}/${mainImage}`}
//                                             alt={job.title || "Job image"}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => {
//                                                 (e.target as HTMLImageElement).src =
//                                                     "https://via.placeholder.com/600x400?text=No+Image";
//                                             }}
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full flex items-center justify-center">
//                                             <span className={`${typography.body.base} text-gray-400`}>
//                                                 No images available
//                                             </span>
//                                         </div>
//                                     )}

//                                     {/* Category Badge on Image */}
//                                     <div className="absolute top-4 left-4">
//                                         <span className={`${typography.misc.badge} inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold`}>
//                                             {job.category}
//                                         </span>
//                                     </div>

//                                     {/* Image Count Badge */}
//                                     {job.images && job.images.length > 1 && (
//                                         <div className="absolute bottom-4 right-4">
//                                             <span className={`${typography.body.xs} inline-block bg-black/70 text-white px-3 py-1.5 rounded-lg`}>
//                                                 +{job.images.length - 1} more
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* RIGHT SIDE - Content */}
//                                 <div className="p-6 lg:p-8 flex flex-col justify-between">
//                                     <div>
//                                         {/* Title & Subcategory */}
//                                         <div className="mb-4">
//                                             <h2 className={`${typography.heading.h4} text-gray-900 mb-2`}>
//                                                 {job.title || job.subcategory || "Untitled Job"}
//                                             </h2>

//                                             {job.subcategory && job.title && (
//                                                 <p className={`${typography.body.base} text-gray-600`}>
//                                                     {job.subcategory}
//                                                 </p>
//                                             )}

//                                             {/* Job Type */}
//                                             {job.jobType && (
//                                                 <span className={`${typography.body.xs} inline-block mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full uppercase tracking-wide font-medium`}>
//                                                     {job.jobType.replace('_', ' ')}
//                                                 </span>
//                                             )}
//                                         </div>

//                                         {/* Service Charges */}
//                                         {job.servicecharges && (
//                                             <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
//                                                 <p className={`${typography.body.xs} text-green-700 mb-1`}>
//                                                     Service Charges
//                                                 </p>
//                                                 <p className={`${typography.heading.h3} text-green-600`}>
//                                                     ₹{job.servicecharges}
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* Description */}
//                                         <div className="mb-4">
//                                             <h3 className={`${typography.body.small} font-semibold text-gray-900 mb-2`}>
//                                                 Description
//                                             </h3>
//                                             <p className={`${typography.body.base} text-gray-700 leading-relaxed line-clamp-3`}>
//                                                 {job.description}
//                                             </p>
//                                         </div>

//                                         {/* Location */}
//                                         {(job.area || job.city || job.state || job.pincode) && (
//                                             <div className="mb-4 flex items-start gap-2 bg-gray-50 rounded-lg p-3">
//                                                 <MapPin size={18} className="text-blue-600 mt-1 flex-shrink-0" />
//                                                 <div>
//                                                     <h3 className={`${typography.body.xs} text-gray-600 mb-1`}>
//                                                         Location
//                                                     </h3>
//                                                     <p className={`${typography.body.small} text-gray-900 font-medium`}>
//                                                         {[job.area, job.city, job.state, job.pincode]
//                                                             .filter(Boolean)
//                                                             .join(", ")}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* Additional Details */}
//                                         <div className="mb-4 space-y-1">
//                                             <DetailRow
//                                                 label="Start Date"
//                                                 value={
//                                                     job.startDate
//                                                         ? new Date(job.startDate).toLocaleDateString()
//                                                         : undefined
//                                                 }
//                                             />
//                                             <DetailRow
//                                                 label="End Date"
//                                                 value={
//                                                     job.endDate
//                                                         ? new Date(job.endDate).toLocaleDateString()
//                                                         : undefined
//                                                 }
//                                             />
//                                             <DetailRow
//                                                 label="Posted On"
//                                                 value={new Date(job.createdAt).toLocaleDateString()}
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Action Buttons */}
//                                     <div className="flex gap-3 pt-4 border-t border-gray-200">
//                                         <button
//                                             onClick={() => navigate(`/update-job/${job._id}`)}
//                                             className={`${typography.body.base} flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md`}
//                                         >
//                                             <Edit size={18} /> Edit
//                                         </button>

//                                         <button
//                                             onClick={() => handleDelete(job._id)}
//                                             disabled={deletingId === job._id}
//                                             className={`${typography.body.base} flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50`}
//                                         >
//                                             {deletingId === job._id ? (
//                                                 <Loader2 size={18} className="animate-spin" />
//                                             ) : (
//                                                 <Trash2 size={18} />
//                                             )}
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}

//                 {/* Empty State */}
//                 {jobs.length === 0 && (
//                     <div className="text-center text-gray-500 mt-20">
//                         <p className={`${typography.heading.h5} mb-2`}>No jobs listed yet</p>
//                         <p className={typography.body.base}>
//                             Click "Add Job" to create your first job
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ListedJobs;







import React, { useEffect, useState, useRef } from "react";
import { Trash2, Edit, Loader2, MapPin, IndianRupee, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserJobs, deleteJob } from "../services/api.service";
import { typography } from "../styles/typography";

const IMAGE_BASE_URL = "http://13.204.29.0:3001";

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
        <div className="py-1.5 border-b border-gray-100 last:border-b-0">
            <p className={`${typography.body.xs} text-gray-500 mb-0.5`}>{label}</p>
            <p className={`${typography.body.small} text-gray-900 font-medium`}>{value}</p>
        </div>
    );
};

const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await getUserJobs(userId);
                setJobs(res.jobs || res.data || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async (jobId: string) => {
        if (!window.confirm("Delete this job?")) return;
        setDeletingId(jobId);
        setOpenDropdownId(null);
        try {
            await deleteJob(jobId);
            setJobs(prev => prev.filter(j => j._id !== jobId));
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Failed to delete job. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const toggleDropdown = (jobId: string) => {
        setOpenDropdownId(openDropdownId === jobId ? null : jobId);
    };

    const getImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return "https://via.placeholder.com/600x400?text=No+Image";
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        
        return `${IMAGE_BASE_URL}/${cleanPath}`;
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
            <div className="max-w-6xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className={`${typography.heading.h4} text-gray-900`}>
                        My Listed Jobs
                        <span className={`${typography.body.small} text-gray-500 ml-2`}>
                            ({jobs.length})
                        </span>
                    </h1>

                    <button
                        onClick={() => navigate("/user-profile")}
                        className={`${typography.body.small} bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors`}
                    >
                        + Add Job
                    </button>
                </div>

                {/* Job Cards - Horizontal Layout */}
                {jobs.map(job => {
                    const mainImage = job.images?.[0];
                    const imageUrl = getImageUrl(mainImage);
                    const locationText = [job.area, job.city, job.state, job.pincode].filter(Boolean).join(", ");

                    return (
                        <div
                            key={job._id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative"
                        >
                            {/* Dropdown Menu Button - Top Right Corner */}
                            <div className="absolute top-4 right-4 z-10" ref={openDropdownId === job._id ? dropdownRef : null}>
                                <button
                                    onClick={() => toggleDropdown(job._id)}
                                    className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg border border-gray-200 transition-all hover:shadow-xl"
                                >
                                    <MoreVertical size={20} className="text-gray-700" />
                                </button>

                                {/* Dropdown Menu */}
                                {openDropdownId === job._id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                                        <button
                                            onClick={() => {
                                                navigate(`/update-job/${job._id}`);
                                                setOpenDropdownId(null);
                                            }}
                                            className={`${typography.body.small} w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors`}
                                        >
                                            <Edit size={16} />
                                            Edit Job
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            disabled={deletingId === job._id}
                                            className={`${typography.body.small} w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors disabled:opacity-50`}
                                        >
                                            {deletingId === job._id ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={16} />
                                                    Delete Job
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
                                {/* LEFT SIDE - Image */}
                                <div className="relative h-48 lg:h-auto bg-gray-100">
                                    {job.images && job.images.length > 0 ? (
                                        <img
                                            src={imageUrl}
                                            alt={job.title || job.subcategory || "Job image"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error("Image failed to load:", imageUrl);
                                                (e.target as HTMLImageElement).src =
                                                    "https://via.placeholder.com/600x400?text=No+Image";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className={`${typography.body.small} text-gray-400`}>
                                                No images available
                                            </span>
                                        </div>
                                    )}

                                    {/* Category Badge on Image */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`${typography.body.xs} inline-block bg-blue-600 text-white px-3 py-1.5 rounded-md shadow-lg font-semibold`}>
                                            {job.category}
                                        </span>
                                    </div>

                                    {/* Image Count Badge */}
                                    {job.images && job.images.length > 1 && (
                                        <div className="absolute bottom-3 right-3">
                                            <span className={`${typography.body.xs} inline-block bg-black/70 text-white px-2.5 py-1 rounded-md`}>
                                                +{job.images.length - 1}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT SIDE - Content */}
                                <div className="p-5 flex flex-col justify-between">
                                    <div>
                                        {/* Title */}
                                        <div className="mb-3 pr-10">
                                            <h2 className={`${typography.heading.h5} text-gray-900 mb-2`}>
                                                {job.title || job.subcategory || "Untitled Job"}
                                            </h2>

                                            {/* Inline Badges Row */}
                                            <div className="flex flex-wrap gap-2 items-center">
                                                {/* Subcategory */}
                                                {job.subcategory && (
                                                    <span className={`${typography.body.xs} inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium`}>
                                                        {job.subcategory}
                                                    </span>
                                                )}

                                                {/* Job Type */}
                                                {job.jobType && (
                                                    <span className={`${typography.body.xs} inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full uppercase tracking-wide font-medium`}>
                                                        {job.jobType.replace('_', ' ')}
                                                    </span>
                                                )}

                                                {/* Service Charges */}
                                                {job.servicecharges && (
                                                    <span className={`${typography.body.xs} inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold`}>
                                                        <IndianRupee size={12} />
                                                        {job.servicecharges}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-3">
                                            <p className={`${typography.body.small} text-gray-700 leading-relaxed line-clamp-2`}>
                                                {job.description}
                                            </p>
                                        </div>

                                        {/* Date Details */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {job.startDate && (
                                                <div className="inline-flex items-center gap-1.5 bg-gray-50 rounded px-3 py-1.5">
                                                    <p className={`${typography.body.xs} text-gray-500`}>Start:</p>
                                                    <p className={`${typography.body.xs} text-gray-900 font-medium`}>
                                                        {new Date(job.startDate).toLocaleDateString('en-IN', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                            {job.endDate && (
                                                <div className="inline-flex items-center gap-1.5 bg-gray-50 rounded px-3 py-1.5">
                                                    <p className={`${typography.body.xs} text-gray-500`}>End:</p>
                                                    <p className={`${typography.body.xs} text-gray-900 font-medium`}>
                                                        {new Date(job.endDate).toLocaleDateString('en-IN', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="inline-flex items-center gap-1.5 bg-gray-50 rounded px-3 py-1.5">
                                                <p className={`${typography.body.xs} text-gray-500`}>Posted:</p>
                                                <p className={`${typography.body.xs} text-gray-900 font-medium`}>
                                                    {new Date(job.createdAt).toLocaleDateString('en-IN', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location - Below Dates */}
                                        {locationText && (
                                            <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md">
                                                <MapPin size={14} className="flex-shrink-0" />
                                                <p className={`${typography.body.xs} font-medium`}>
                                                    {locationText}
                                                </p>
                                            </div>
                                        )}
                                    </div>
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