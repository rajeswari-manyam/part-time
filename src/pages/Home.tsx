import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";
import { getWorkerWithSkills } from "../services/api.service";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import WorkerList from "./WorkerList";
import WelcomePage from "../components/Auth/WelcomePage";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { accountType } = useAccount();

    const [showWelcome, setShowWelcome] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [workerProfileExists, setWorkerProfileExists] = useState(false);

    const isWorker = isAuthenticated && accountType === "worker";

    const workerId =
        localStorage.getItem("workerId") ||
        localStorage.getItem("@worker_id");

    /* 🔍 CHECK IF WORKER PROFILE EXISTS */
    useEffect(() => {
        const checkProfile = async () => {
            if (!isWorker || !workerId) {
                setWorkerProfileExists(false);
                setCheckingProfile(false);
                return;
            }

            try {
                await getWorkerWithSkills(workerId);
                setWorkerProfileExists(true);
            } catch {
                setWorkerProfileExists(false);
            } finally {
                setCheckingProfile(false);
            }
        };

        checkProfile();
    }, [isWorker, workerId]);

    const handleCategoryClick = () => {
        if (!isAuthenticated) {
            setShowWelcome(true);
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <SearchContainer />

            <div className="w-full px-4 md:px-6">
                {checkingProfile ? (
                    <div className="py-10 text-center text-gray-500">
                        Loading...
                    </div>
                ) : isWorker && !workerProfileExists ? (
                    /* 🚀 BRAND NEW WORKER */
                    <div className="my-12 max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center border">
                        <div className="text-5xl mb-4">👷‍♂️</div>
                        <h2 className="text-2xl font-bold mb-3">
                            Create Your Worker Profile
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Set up your profile to start receiving job requests
                            from nearby customers.
                        </p>
                        <button
                            onClick={() => navigate("/worker-profile")}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
                        >
                            Create Profile
                        </button>
                    </div>
                ) : isWorker ? (
                    /* 👷 EXISTING WORKER */
                    <>
                        <WorkerList />
                        <div className="mt-8 mb-6">
                            <Categories onCategoryClick={handleCategoryClick} />
                        </div>
                    </>
                ) : (
                    /* 👤 NORMAL USER */
                    <>
                        <div className="my-6">
                            <PromoSlides />
                        </div>
                        <div className="mt-6">
                            <Categories onCategoryClick={handleCategoryClick} />
                        </div>
                    </>
                )}
            </div>

            <WelcomePage
                isOpen={showWelcome}
                onClose={() => setShowWelcome(false)}
            />
        </div>
    );
};

export default HomePage;
