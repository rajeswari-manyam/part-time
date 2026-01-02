import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Wrench } from "lucide-react";
import { combineTypography } from "../styles/typography";
import typography from "../styles/typography";
import MapSection from "../components/job/MapSection";
import CustomerDetailsCard from "../components/job/CustomerDetailsCard";
import JobInformationCard from "../components/job/JobInformation";
import ActionButtons from "../components/job/ActionButton";
import { getJobById } from "../services/api.service";
import { JobDetailsProps } from "../types/job.types";

const JobDetailsPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<JobDetailsProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) return;
        setLoading(true);

        getJobById(jobId)
            .then((res) => {
                if (res.success) {
                    const data = res.data;

                    // Map API response to your JobDetailsProps structure
                    setJob({
                        title: data.title,
                        customerDetails: {
                            name: "Customer Name", // you can fetch user info by data.userId
                            phone: "+91 98765 43210", // placeholder
                            distance: "2.5 km", // optional: calculate from coordinates
                            rating: 4.8,
                            reviewCount: 124,
                        },
                        jobInformation: {
                            type: data.category,
                            budget: "500", // you can extend API to include budget
                            budgetType: "fixed",
                        },
                        mapUrl: `https://www.google.com/maps?q=${data.latitude},${data.longitude}&output=embed`,
                    });
                } else {
                    setError("Job not found");
                }
            })
            .catch(() => setError("Failed to fetch job"))
            .finally(() => setLoading(false));
    }, [jobId]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!job) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                        <Wrench className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h1
                        className={combineTypography(
                            typography.heading.h3,
                            "bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent"
                        )}
                    >
                        {job.title}
                    </h1>
                </div>

                {/* Dynamic Sections */}
                <MapSection mapUrl={job.mapUrl} onMapClick={() => { }} />
                <CustomerDetailsCard customerDetails={job.customerDetails} />
                <JobInformationCard jobInformation={job.jobInformation} />
                <ActionButtons
                    customerDetails={job.customerDetails}
                    onCall={() => alert("Call clicked")}
                    onMessage={() => alert("Message clicked")}
                    onAcceptJob={() => alert("Job accepted")}
                />
            </div>
        </div>
    );
};

export default JobDetailsPage;
