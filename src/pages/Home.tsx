import React from "react";
import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import NearByJobs from "./NearByJobs";

import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";

interface HomePageProps {
    onOtpSuccess?: () => void;
}

const HomePage: React.FC<HomePageProps> = () => {
    const { isAuthenticated } = useAuth();
    const { accountType } = useAccount();

    const isWorker = isAuthenticated && accountType === "worker";

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">

            {/* 🚫 Disable ALL clicks before login */}
            <div className={!isAuthenticated ? "pointer-events-none" : ""}>

                {/* Search */}
                <div className="w-full">
                    <SearchContainer />
                </div>

                {/* Promo Slides */}
                <div className="w-full px-4 md:px-6">
                    <PromoSlides />
                </div>

                {/* Below Promo Slides */}
                <div className="w-full px-4 md:px-6 mt-6">
                    {!isAuthenticated && <Categories />}

                    {isAuthenticated && isWorker && (
                        <NearByJobs initialTab="matched" />
                    )}

                    {isAuthenticated && !isWorker && <Categories />}
                </div>

            </div>
        </div>
    );
};

export default HomePage;
