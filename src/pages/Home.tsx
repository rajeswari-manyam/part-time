


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import WorkerList from "./WorkerList";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { accountType } = useAccount();

    const [hasWorkerProfile, setHasWorkerProfile] = useState(false);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    const isWorker = isAuthenticated && accountType === "worker";

    useEffect(() => {
        if (!isWorker) {
            setIsCheckingProfile(false);
            return;
        }

        // ✅ Worker profile exists if workerId is stored
        const workerId =
            localStorage.getItem("workerId") ||
            localStorage.getItem("@worker_id");

        setHasWorkerProfile(!!workerId);
        setIsCheckingProfile(false);
    }, [isWorker]);

    const handleCreateProfile = () => {
        navigate("/worker-profile");
    };

    /* ---------------- Loading ---------------- */
    if (isCheckingProfile && isWorker) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-gray-500">Loading your profile...</span>
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className={!isAuthenticated ? "pointer-events-none opacity-60" : ""}>
                <SearchContainer />

                <div className="w-full px-4 md:px-6">

                    {/* ---------- Worker Onboarding ---------- */}
                    {isWorker && !hasWorkerProfile && (
                        <div className="my-6 bg-white rounded-2xl shadow-lg p-8 text-center border">
                            <h2 className="text-2xl font-bold mb-3">
                                Complete Your Worker Profile
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Create your profile to start receiving jobs.
                            </p>

                            <button
                                onClick={handleCreateProfile}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
                            >
                                Create Worker Profile
                            </button>
                        </div>
                    )}

                    {/* ---------- Worker Skills (HOME SCREEN) ---------- */}
                    {isWorker && hasWorkerProfile && <WorkerList />}

                    {/* ---------- Customer Promo ---------- */}
                    {!isWorker && (
                        <div className="my-6">
                            <PromoSlides />
                        </div>
                    )}

                    {/* ---------- Categories ---------- */}
                    <div className="mt-6">
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
