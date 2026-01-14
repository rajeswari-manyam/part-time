import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Mail, Star } from "lucide-react";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import Button from "../components/ui/Buttons";

import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";
import { getWorkerById, Worker, API_BASE_URL } from "../services/api.service";
import typography, { combineTypography } from "../styles/typography";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { accountType } = useAccount();

    const [worker, setWorker] = useState<Worker | null>(null);
    const [loadingWorker, setLoadingWorker] = useState(false);

    const isWorker = isAuthenticated && accountType === "worker";

    // Fetch worker profile if user is a worker
    useEffect(() => {
        if (!isAuthenticated || !isWorker || !user?._id) return;

        const fetchWorkerProfile = async () => {
            try {
                setLoadingWorker(true);
                const response = await getWorkerById(user._id);
                if (response.success) {
                    setWorker(response.data);
                }
            } catch (error) {
                console.error("Error fetching worker profile:", error);
            } finally {
                setLoadingWorker(false);
            }
        };

        fetchWorkerProfile();
    }, [isAuthenticated, isWorker, user?._id]);

    // Worker Profile Summary Card Component
    const WorkerProfileSummary = ({ worker }: { worker: Worker }) => {
        const initials = worker.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

        const profilePicUrl = worker.profilePic
            ? (worker.profilePic.startsWith('http')
                ? worker.profilePic
                : `${API_BASE_URL}${worker.profilePic}`)
            : null;

        const memberSince = new Date(worker.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800")}>
                        Your Worker Profile
                    </h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/worker/${worker._id}`)}
                    >
                        View Full Profile
                    </Button>
                </div>

                <div className="flex items-start gap-4">
                    {/* Profile Picture */}
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-md border-2 border-blue-100">
                        {profilePicUrl ? (
                            <img
                                src={profilePicUrl}
                                alt={worker.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    const parent = target.parentElement;
                                    if (parent) {
                                        target.style.display = 'none';
                                        parent.className = 'w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-md border-2 border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center';
                                        parent.innerHTML = `<span class="text-white text-xl font-bold">${initials}</span>`;
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">{initials}</span>
                            </div>
                        )}
                    </div>

                    {/* Worker Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className={combineTypography(typography.heading.h5, "text-gray-800 truncate")}>
                                {worker.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${worker.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {worker.isActive ? '✓ Active' : 'Inactive'}
                            </span>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {Array.isArray(worker.category) ? (
                                worker.category.slice(0, 2).map((cat, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                    >
                                        {cat}
                                    </span>
                                ))
                            ) : (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {worker.category}
                                </span>
                            )}
                            {Array.isArray(worker.category) && worker.category.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    +{worker.category.length - 2} more
                                </span>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{worker.city}, {worker.state}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span className="truncate">Since {memberSince}</span>
                            </div>
                        </div>

                        {/* Service Charge */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Service Rate:</span>
                                <span className="text-lg font-bold text-green-600">
                                    ₹{worker.serviceCharge.toLocaleString()}/{worker.chargeType}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/worker/${worker._id}/edit`)}
                        className="w-full"
                    >
                        Edit Profile
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => navigate(`/worker/${worker._id}`)}
                        className="w-full"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            {/* Disable clicks before login */}
            <div className={!isAuthenticated ? "pointer-events-none" : ""}>
                {/* Search */}
                <div className="w-full">
                    <SearchContainer />
                </div>

                {/* Main Content */}
                <div className="w-full px-4 md:px-6">
                    {/* Worker Profile Summary or Promo */}
                    {isAuthenticated && isWorker ? (
                        loadingWorker ? (
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading your profile...</span>
                                </div>
                            </div>
                        ) : worker ? (
                            <WorkerProfileSummary worker={worker} />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
                                <div className="mb-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className={combineTypography(typography.heading.h5, "text-gray-800 mb-2")}>
                                        Complete Your Worker Profile
                                    </h3>
                                    <p className="text-gray-600">
                                        Set up your professional profile to start receiving job offers from customers!
                                    </p>
                                </div>
                                <Button
                                    onClick={() => navigate("/worker-profile")}
                                    size="lg"
                                    className="w-full"
                                >
                                    Create Worker Profile
                                </Button>
                            </div>
                        )
                    ) : (
                        <PromoSlides />
                    )}

                    {/* Categories */}
                    <div className="mt-6">
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;