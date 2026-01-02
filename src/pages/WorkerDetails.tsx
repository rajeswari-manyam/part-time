import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Phone, MessageCircle, Briefcase, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Buttons';
import typography, { combineTypography } from '../styles/typography';
import BudgetIcon from "../assets/icons/Budget.png";
import { getWorkerById, Worker } from '../services/api.service';

const WorkerProfile: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [worker, setWorker] = useState<Worker | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchWorker = async () => {
            try {
                setLoading(true);
                const response = await getWorkerById(id);
                if (response.success) {
                    setWorker(response.data);
                } else {
                    setError("Worker not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch worker details");
            } finally {
                setLoading(false);
            }
        };

        fetchWorker();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading worker details...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!worker) return <div className="text-center mt-10">Worker not found</div>;

    // Generate initials from name if profilePic is not available
    const initials = worker.name
        ? worker.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'NA';

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-200"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="ml-4 text-xl font-semibold text-gray-800">Worker Profile</h1>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-xl">
                            {worker.profilePic ? (
                                <img
                                    src={`${worker.profilePic}`}
                                    alt={worker.name}
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <h1 className={combineTypography(typography.heading.h3, "text-gray-800 mb-3")}>
                            {worker.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-6 h-6 ${i < Math.round(worker.serviceCharge / 1000) // example: convert charge to rating for demo
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className={combineTypography(typography.body.large, "ml-2 text-gray-700")}>
                                {/* Use placeholder rating or map from API if available */}
                                {worker.serviceCharge ? (worker.serviceCharge / 1000).toFixed(1) : '4.5'}
                            </span>
                        </div>
                        <p className={combineTypography(typography.body.base, "text-gray-600")}>
                            {/* Replace with real API values if available */}
                            {worker.chargeType} • ₹{worker.serviceCharge}
                        </p>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>About</h2>
                    <p className={combineTypography(typography.body.base, "text-gray-600 leading-relaxed")}>
                        {/* Replace with API about field if exists */}
                        {worker.category} professional
                    </p>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-6")}>
                        Skills & Expertise
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {/* Example: map category as skill */}
                        <span
                            className={combineTypography(
                                typography.body.base,
                                "px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium"
                            )}
                        >
                            {worker.category}
                        </span>
                    </div>
                </div>

                {/* Service Rates */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-6")}>Service Rates</h2>
                    <div className="space-y-3">
                        <div className={combineTypography(typography.body.base, "flex items-center gap-2 text-gray-700")}>
                            <img src={BudgetIcon} alt="Budget" className="w-5 h-5" />
                            <span className="font-medium">Charge Type:</span>
                            <span className="font-semibold">{worker.chargeType}</span>
                        </div>
                        <div className={combineTypography(typography.body.base, "flex items-center gap-2 text-gray-700")}>
                            <img src={BudgetIcon} alt="Budget" className="w-5 h-5" />
                            <span className="font-medium">Service Charge:</span>
                            <span className="font-semibold">₹{worker.serviceCharge.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={() => navigate(`/call/${worker._id}`)}
                        >
                            <Phone className="w-5 h-5" /> Call Worker
                        </Button>

                        <Button
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={() => navigate(`/chat/${worker._id}`)}
                        >
                            <MessageCircle className="w-5 h-5" /> Send Message
                        </Button>
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="success"
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={() => navigate(`/send-enquiry/${worker._id}`)}
                        >
                            <Briefcase className="w-5 h-5" /> Send Job Invitation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerProfile;
