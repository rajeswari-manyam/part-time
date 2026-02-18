// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Briefcase } from "lucide-react";

// import PlumberUserService from "./PlumberUserService";
// import HomeUserService from "./HomePersonalUserService";
// import { CUSTOMER_JOB_CATEGORIES } from "../config/serviceFlows";

// interface ListedJobsProps {
//     userId: string;
// }

// const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
//     const navigate = useNavigate();

//     // ── Called by child service cards when "View Details" is clicked ──────────
//     const handleViewDetails = (jobId: string) => {
//         navigate(`/job-applicants/${jobId}`);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6">
//             <div className="max-w-7xl mx-auto space-y-6">

//                 {/* Header */}
//                 <div>
//                     <div className="flex items-center gap-2 mb-2">
//                         <Briefcase className="w-6 h-6 text-blue-600" />
//                         <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
//                     </div>
//                     <p className="text-gray-600">
//                         Discover available service jobs in your area. Apply now to start earning.
//                     </p>
//                 </div>

//                 {/* Category info banner */}
//                 <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
//                     <p className="text-sm text-blue-900">
//                         💼 Showing {Object.keys(CUSTOMER_JOB_CATEGORIES).length} job categories:
//                         <span className="font-semibold"> Automotive, Plumbing, Home & Personal Services</span>
//                     </p>
//                 </div>

//                 {/* Service Sections */}
//                 <div className="space-y-6">

//                     {/* Plumber Jobs */}
//                     <PlumberUserService
//                         userId={userId}
//                         hideHeader={false}
//                         hideEmptyState={true}
//                         onViewDetails={handleViewDetails}
//                     />

//                     {/* Home & Personal Service Jobs */}
//                     <HomeUserService
//                         userId={userId}
//                         hideHeader={false}
//                         hideEmptyState={true}
//                         onViewDetails={handleViewDetails}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ListedJobs;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase, Plus, MapPin, Calendar, IndianRupee,
    Clock, ChevronRight, Loader2, Users
} from "lucide-react";

import PlumberUserService from "./PlumberUserService";
import HomeUserService from "./HomePersonalUserService";
import { CUSTOMER_JOB_CATEGORIES } from "../config/serviceFlows";
import { getUserJobs, getConfirmedWorkersCount, API_BASE_URL } from "../services/api.service";

interface ListedJobsProps {
    userId: string;
}

// ── Resolve image URLs ────────────────────────────────────────────────────────
const resolveImageUrl = (path?: string): string | null => {
    if (!path || typeof path !== "string") return null;
    const cleaned = path.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    const base = (API_BASE_URL || "").replace(/\/$/, "");
    return `${base}${cleaned.startsWith("/") ? cleaned : "/" + cleaned}`;
};

// ── My Job Card ───────────────────────────────────────────────────────────────
const MyJobCard: React.FC<{ job: any; onViewApplicants: (id: string) => void }> = ({
    job,
    onViewApplicants,
}) => {
    const [applicantCount, setApplicantCount] = useState<number | null>(null);

    useEffect(() => {
        if (job._id) {
            getConfirmedWorkersCount(job._id)
                .then(setApplicantCount)
                .catch(() => setApplicantCount(0));
        }
    }, [job._id]);

    const imgUrl = resolveImageUrl(job.images?.[0]);
    const startDate = new Date(job.startDate);
    const endDate = new Date(job.endDate);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const locationStr = [job.area, job.city, job.state].filter(Boolean).join(", ") || "—";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {/* Image / Placeholder */}
            <div className="relative h-36 bg-gradient-to-br from-blue-50 to-blue-100 flex-shrink-0">
                {imgUrl ? (
                    <img src={imgUrl} alt={job.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Briefcase size={36} className="text-blue-300" />
                    </div>
                )}
                {/* Job type badge */}
                <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                        ${job.jobType === "FULL_TIME" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                        <Clock size={9} />
                        {job.jobType === "FULL_TIME" ? "Full Time" : "Part Time"}
                    </span>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 left-2">
                    <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        <Calendar size={9} />
                        {duration} day{duration !== 1 ? "s" : ""}
                    </span>
                </div>
                {/* Applicants badge */}
                <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 bg-white/90 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        <Users size={9} className="text-orange-500" />
                        {applicantCount ?? "—"} applied
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-3 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1 mb-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-200 font-medium">
                        {job.category}
                    </span>
                    {job.subcategory && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200 font-medium">
                            {job.subcategory}
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                    {job.title || job.category}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    <MapPin size={10} className="flex-shrink-0" />
                    <span className="line-clamp-1">{locationStr}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <Calendar size={10} className="flex-shrink-0" />
                    <span>
                        {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" – "}
                        {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                </div>

                <div className="flex-1" />

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-0.5 text-green-600 font-extrabold text-base">
                        <IndianRupee size={12} className="mt-0.5" />
                        {parseFloat(job.servicecharges || "0").toLocaleString("en-IN")}
                    </div>
                    <button
                        onClick={() => onViewApplicants(job._id)}
                        className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition active:scale-95"
                    >
                        Applicants <ChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
    const navigate = useNavigate();
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [loadingMyJobs, setLoadingMyJobs] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoadingMyJobs(true);
        getUserJobs(userId)
            .then((res) => {
                // API may return { jobs: [...] } or { data: [...] } or directly an array
                const jobs = res.jobs || res.data || (Array.isArray(res) ? res : []);
                setMyJobs(jobs);
            })
            .catch(() => setMyJobs([]))
            .finally(() => setLoadingMyJobs(false));
    }, [userId]);

    const handleViewDetails = (jobId: string) => {
        navigate(`/job-applicants/${jobId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Find Jobs</h1>
                        </div>
                        <p className="text-sm text-gray-500">
                            Discover available service jobs in your area.
                        </p>
                    </div>

                    {/* ── Post Job Button ── */}
                    <button
                        onClick={() => navigate("/post-job")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95
                            text-white font-bold text-sm px-4 py-2.5 rounded-2xl shadow-md shadow-blue-200 transition-all"
                    >
                        <Plus size={16} />
                        Post Job
                    </button>
                </div>

                {/* ── My Posted Jobs ── */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-lg font-bold text-gray-800">My Posted Jobs</h2>
                        {!loadingMyJobs && (
                            <span className="text-xs bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                                {myJobs.length}
                            </span>
                        )}
                    </div>

                    {loadingMyJobs ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : myJobs.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                            <Briefcase size={36} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium mb-1">No jobs posted yet</p>
                            <p className="text-xs text-gray-400 mb-4">Post your first job to find workers near you</p>
                            <button
                                onClick={() => navigate("/post-job")}
                                className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl"
                            >
                                <Plus size={14} /> Post a Job
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myJobs.map((job) => (
                                <MyJobCard
                                    key={job._id}
                                    job={job}
                                    onViewApplicants={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-gray-200" />

                {/* ── Category info ── */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <p className="text-sm text-blue-900">
                        💼 Showing {Object.keys(CUSTOMER_JOB_CATEGORIES).length} job categories:
                        <span className="font-semibold"> Automotive, Plumbing, Home & Personal Services</span>
                    </p>
                </div>

                {/* ── Service Sections ── */}
                <div className="space-y-6">
                    <PlumberUserService
                        userId={userId}
                        hideHeader={false}
                        hideEmptyState={true}
                        onViewDetails={handleViewDetails}
                    />
                    <HomeUserService
                        userId={userId}
                        hideHeader={false}
                        hideEmptyState={true}
                        onViewDetails={handleViewDetails}
                    />
                </div>
            </div>
        </div>
    );
};

export default ListedJobs;