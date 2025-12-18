import React from "react";
import { Wrench } from "lucide-react";
import { combineTypography } from "../styles/typography";
import typography from "../styles/typography";
import MapSection from "../components/job/MapSection";
import CustomerDetailsCard from "../components/job/CustomerDetailsCard";
import JobInformationCard from "../components/job/JobInformation";
import ActionButtons from "../components/job/ActionButton";
import { JobDetailsProps } from "../types/job.types";

const JobDetails: React.FC<Partial<JobDetailsProps>> = ({
    title = "Plumbing Emergency Repair",
    customerDetails = {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        distance: "2.5 km",
        rating: 4.8,
        reviewCount: 124,
    },
    jobInformation = {
        type: "Plumbing",
        budget: "500",
        budgetType: "fixed",
    },
    mapUrl,
    onMapClick,
    onCall,
    onMessage,
    onAcceptJob,
}) => {
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
                        {title}
                    </h1>
                </div>

                <MapSection onMapClick={onMapClick} mapUrl={mapUrl} />
                <CustomerDetailsCard customerDetails={customerDetails} />
                <JobInformationCard jobInformation={jobInformation} />
                <ActionButtons
                    customerDetails={customerDetails}
                    onCall={onCall}
                    onMessage={onMessage}
                    onAcceptJob={onAcceptJob}
                />
            </div>
        </div>
    );
};

export default JobDetails;