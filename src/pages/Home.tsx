import React from "react";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import WorkerList from "./WorkerList";

const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { accountType } = useAccount();

    const isWorker = isAuthenticated && accountType === "worker";

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <SearchContainer />

            <div className="w-full px-4 md:px-6">

                {/* ✅ WORKER DASHBOARD */}
                {isWorker && <WorkerList />}

                {/* ✅ CUSTOMER VIEW */}
                {!isWorker && (
                    <div className="my-6">
                        <PromoSlides />
                    </div>
                )}

                <div className="mt-6">
                    <Categories />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
