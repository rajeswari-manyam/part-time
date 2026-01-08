import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Star, ArrowLeft } from "lucide-react";
import { getJobById, getUserById } from "../services/api.service";
import { JobDetailsProps } from "../types/job.types";

const JobDetailsPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobDetailsProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): string => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1) + " km";
    };

    useEffect(() => {
        if (!jobId) return;
        const fetchJobDetails = async () => {
            try {
                setLoading(true);

                const jobResponse = await getJobById(jobId!);
                if (!jobResponse.success) {
                    setError("Job not found");
                    return;
                }

                const jobData = jobResponse.data;

                let customerName = "Customer";
                let customerPhone = "";
                let customerLat: number | null = null;
                let customerLng: number | null = null;

                // ✅ FETCH USER USING job.userId
                try {
                    const userResponse = await getUserById(jobData.userId);
                    if (userResponse.success) {
                        customerName = userResponse.data.name;
                        customerPhone = userResponse.data.phone;

                        customerLat = Number(userResponse.data.latitude);
                        customerLng = Number(userResponse.data.longitude);
                    }
                } catch (err) {
                    console.error("User fetch failed");
                }

                // ✅ DISTANCE CALCULATION
                let distance = "N/A";
                if (navigator.geolocation && customerLat && customerLng) {
                    try {
                        const position = await new Promise<GeolocationPosition>(
                            (resolve, reject) =>
                                navigator.geolocation.getCurrentPosition(resolve, reject)
                        );

                        distance = calculateDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            customerLat,
                            customerLng
                        );
                    } catch { }
                }

                setJob({
                    title: jobData.subcategory
                        ? `${jobData.subcategory} - ${jobData.category}`
                        : jobData.category,

                    customerDetails: {
                        name: customerName,
                        phone: customerPhone,
                        distance,
                        rating: 4.7,
                        reviewCount: 23
                    },

                    jobInformation: {
                        type: jobData.jobType,
                        budget: jobData.servicecharges,
                        budgetType: "fixed",
                        description: jobData.description || "No description provided",
                        startDate: new Date(jobData.startDate).toLocaleDateString(),
                        endDate: new Date(jobData.endDate).toLocaleDateString(),
                        area: jobData.area,
                        city: jobData.city,
                        state: jobData.state,
                        pincode: jobData.pincode,
                        location: `${jobData.area}, ${jobData.city}, ${jobData.state} - ${jobData.pincode}`,
                        category: jobData.category,
                        subcategory: jobData.subcategory,
                        latitude: jobData.latitude,
                        longitude: jobData.longitude,
                        images: jobData.images || [],
                        createdAt: jobData.createdAt,
                        updatedAt: jobData.updatedAt
                    },

                    mapUrl: `https://www.google.com/maps?q=${jobData.latitude},${jobData.longitude}&output=embed`
                });
            } catch {
                setError("Failed to load job");
            } finally {
                setLoading(false);
            }
        };


        fetchJobDetails();
    }, [jobId]);

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
            </div>
        );
    }

    /* ---------------- ERROR ---------------- */
    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error || "Job not available"}</p>
                </div>
            </div>
        );
    }

    /* ---------------- MAIN UI (LEFT SIDE SCREENSHOT) ---------------- */
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto space-y-4">

                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <iframe
                        src={job.mapUrl}
                        className="w-full h-48"
                        style={{ border: 0 }}
                        loading="lazy"
                        title="Job Location Map"
                    />
                </div>

                {/* Customer Details */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Customer Details
                    </h2>
                    <div className="space-y-2">
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-24">Name:</span>
                            <span className="text-gray-900">{job.customerDetails.name}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-24">Phone:</span>
                            <span className="text-gray-900">{job.customerDetails.phone}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-24">Distance:</span>
                            <span className="text-gray-900">{job.customerDetails.distance}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-medium text-gray-700 w-24">Rating:</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-gray-900">
                                    {job.customerDetails.rating} ({job.customerDetails.reviewCount} reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-blue-500">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Job Information
                    </h2>
                    <div className="space-y-2">
                        <div>
                            <span className="font-medium text-gray-700">Category:</span>{" "}
                            <span className="text-gray-900">{job.jobInformation.category}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Subcategory:</span>{" "}
                            <span className="text-gray-900">{job.jobInformation.subcategory}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Location:</span>{" "}
                            <span className="text-gray-900">{job.jobInformation.location}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Type:</span>{" "}
                            <span className="text-gray-900">{job.jobInformation.type}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Budget:</span>{" "}
                            <span className="text-gray-900">{job.jobInformation.budget}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Duration:</span>{" "}
                            <span className="text-gray-900">2-3 hours estimated</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Description:</span>{" "}
                            <span className="text-gray-900">{job.jobInformation.description}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => window.location.href = `sms:+91${job.customerDetails.phone}`}
                        >

                            <Phone className="w-5 h-5" />
                            Call Customer
                        </button>
                        <button
                            onClick={() =>
                                (window.location.href = `sms:${job.customerDetails.phone.replace(/\s/g, "")}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Send Message
                        </button>
                    </div>
                    <button
                        onClick={() => alert("Job accepted")}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors"
                    >
                        Accept This Job
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;