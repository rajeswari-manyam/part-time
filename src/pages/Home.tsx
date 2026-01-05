import React from "react";
import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import NearByJobs from "./NearByJobs";
import { useAccount } from "../context/AccountContext"; // Use this instead

interface HomePageProps {
    onOtpSuccess?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOtpSuccess }) => {
    const { accountType } = useAccount(); // Use accountType

    const handleOtpSuccess = () => {
        if (onOtpSuccess) onOtpSuccess();
    };

    const isWorker = accountType === "worker"; // Use accountType

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            {/* Sticky Search */}
            <div className="sticky top-0 z-50">
                <SearchContainer />
            </div>

            {/* Promo Slides */}
            <div className="w-full px-4 md:px-6">
                <PromoSlides />
            </div>

            {/* Conditional Section */}
            <div className="w-full px-4 md:px-6 mt-6">
                {isWorker ? (
                    <NearByJobs
                        initialTab="matched"
                    />
                ) : (
                    <Categories />
                )}
            </div>
        </div>
    );
};

export default HomePage;