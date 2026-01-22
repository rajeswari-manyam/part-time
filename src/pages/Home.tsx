// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useAccount } from "../context/AccountContext";
// import Button from "../components/ui/Buttons";
// import SearchContainer from "../components/SearchContainer";
// import PromoSlides from "../components/PromoSlides";
// import Categories from "../components/Categories";
// import typography, { combineTypography } from "../styles/typography";
// import { getWorkerWithSkills, WorkerListItem } from "../services/api.service";

// const HomePage: React.FC = () => {
//     const navigate = useNavigate();
//     const { isAuthenticated, user } = useAuth();
//     const { accountType } = useAccount();

//     const isWorker = isAuthenticated && accountType === "worker";
//     const hasWorkerProfile = Boolean(user?.workerId);

//     const [worker, setWorker] = useState<WorkerListItem | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (isWorker && hasWorkerProfile) {
//             fetchLoggedInWorker();
//         }
//     }, [isWorker, hasWorkerProfile]);

//     const fetchLoggedInWorker = async () => {
//         if (!user?.workerId) return;
//         try {
//             setLoading(true);
//             setError(null);

//             const res = await getWorkerWithSkills(user.workerId);

//             if (res.success && res.worker) {
//                 const workerData: WorkerListItem = {
//                     _id: res.worker._id,
//                     name: res.worker.name,
//                     profilePic: res.worker.profilePic || "",
//                     images: res.worker.images || [],
//                     skills: res.worker.skills || [],
//                     categories: res.worker.categories.flat() || [],
//                     subCategories: res.worker.subCategories || [],
//                     serviceCharge: res.worker.serviceCharge,
//                     chargeType: res.worker.chargeType as "hour" | "day" | "fixed",
//                     area: res.worker.area,
//                     city: res.worker.city,
//                     state: res.worker.state,
//                     pincode: res.worker.pincode,
//                     totalSkills: res.totalSkills || 0,
//                 };
//                 setWorker(workerData);
//             } else {
//                 setWorker(null);
//             }
//         } catch (err) {
//             console.error("Error fetching worker:", err);
//             setError("Failed to load worker profile");
//             setWorker(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const WorkerProfileCard = () => {
//         if (loading) return <p>Loading worker profile...</p>;
//         if (!worker) return <p>No worker profile found.</p>;

//         return (
//             <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-lg font-semibold">Your Worker Profile</h2>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => navigate(`/worker-details/${worker._id}`)}
//                     >
//                         View Profile
//                     </Button>
//                 </div>

//                 <div className="text-center py-6">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-white text-2xl font-bold">
//                             {worker.name.charAt(0).toUpperCase()}
//                         </span>
//                     </div>

//                     <h3 className="text-gray-800 mb-2">{worker.name}</h3>

//                     {worker.skills.length > 0 ? (
//                         <p className="text-gray-600 mb-4">
//                             Skills: {worker.skills.join(", ")}
//                         </p>
//                     ) : (
//                         <p className="text-gray-500 mb-4">No skills added yet</p>
//                     )}

//                     <div className="grid grid-cols-2 gap-3">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate("/add-skills")}
//                             className="w-full"
//                         >
//                             + Add Skill
//                         </Button>
//                         <Button
//                             size="sm"
//                             onClick={() => navigate("/worker-list")}
//                             className="w-full"
//                         >
//                             View All Workers
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const CreateProfileCard = () => (
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
//             <div className="mb-4">
//                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <svg
//                         className="w-8 h-8 text-blue-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                     </svg>
//                 </div>
//                 <h3
//                     className={combineTypography(
//                         typography.heading.h5,
//                         "text-gray-800 mb-2"
//                     )}
//                 >
//                     Complete Your Worker Profile
//                 </h3>
//                 <p className="text-gray-600">
//                     Set up your professional profile to start receiving job offers from
//                     customers!
//                 </p>
//             </div>
//             <Button
//                 onClick={() => navigate("/worker-profile")}
//                 size="lg"
//                 className="w-full"
//             >
//                 Create Worker Profile
//             </Button>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
//             <div className={!isAuthenticated ? "pointer-events-none" : ""}>
//                 <SearchContainer />

//                 <div className="w-full px-4 md:px-6">
//                     {isWorker ? (
//                         hasWorkerProfile ? (
//                             <WorkerProfileCard />
//                         ) : (
//                             <CreateProfileCard />
//                         )
//                     ) : (
//                         <PromoSlides />
//                     )}

//                     <div className="mt-6">
//                         <Categories />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomePage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import WorkerList from "./WorkerList";
import { getWorkerWithSkills } from "../services/api.service";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { accountType } = useAccount();

    const [hasWorkerProfile, setHasWorkerProfile] = useState(false);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    const isWorker = isAuthenticated && accountType === "worker";

    useEffect(() => {
        const checkWorkerProfile = async () => {
            if (!isWorker) {
                setIsCheckingProfile(false);
                return;
            }

            try {
                // Check multiple possible localStorage keys for workerId
                const workerId =
                    localStorage.getItem("workerId") ||
                    localStorage.getItem("@worker_id");

                if (workerId) {
                    // Verify the worker profile exists on the backend
                    try {
                        const response = await getWorkerWithSkills(workerId);

                        // Get user ID - check both common property names
                        const userId = (user as any)?._id || (user as any)?.userId;

                        // Verify that the worker belongs to the current user
                        if (response?.worker?.userId === userId) {
                            setHasWorkerProfile(true);
                        } else {
                            // Worker ID doesn't match current user, clear it
                            localStorage.removeItem("workerId");
                            localStorage.removeItem("@worker_id");
                            setHasWorkerProfile(false);
                        }
                    } catch (err) {
                        console.error("Error fetching worker profile:", err);
                        // If worker doesn't exist or API fails, clear the ID and show onboarding
                        localStorage.removeItem("workerId");
                        localStorage.removeItem("@worker_id");
                        setHasWorkerProfile(false);
                    }
                } else {
                    setHasWorkerProfile(false);
                }
            } catch (error) {
                console.error("Error checking worker profile:", error);
                setHasWorkerProfile(false);
            } finally {
                setIsCheckingProfile(false);
            }
        };

        checkWorkerProfile();
    }, [isWorker, user]);

    const handleCreateProfile = () => {
        navigate("/worker-profile");
    };

    // Show loading state while checking profile
    if (isCheckingProfile && isWorker) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className={!isAuthenticated ? "pointer-events-none opacity-60" : ""}>
                <SearchContainer />

                <div className="w-full px-4 md:px-6">
                    {/* Worker Onboarding Prompt - Shows when worker doesn't have profile */}
                    {isWorker && !hasWorkerProfile && (
                        <div className="my-6 bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-blue-100">
                            <div className="mb-4">
                                {/* Icon */}
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                    Complete Your Worker Profile
                                </h2>

                                {/* Description */}
                                <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto mb-6">
                                    Set up your professional profile to start receiving job offers from customers!
                                </p>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={handleCreateProfile}
                                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
                            >
                                <span className="mr-2">Create Worker Profile</span>
                                <svg
                                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>

                            {/* Benefits */}
                            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Quick setup</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Get more jobs</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show WorkerList if worker has profile, PromoSlides for non-workers */}
                    {isWorker && hasWorkerProfile ? (
                        <WorkerList />
                    ) : !isWorker ? (
                        <div className="my-6">
                            <PromoSlides />
                        </div>
                    ) : null}

                    {/* Categories are always shown */}
                    <div className="mt-6">
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;