import React from "react";
import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";

interface HomePageProps {
    onOtpSuccess?: () => void; // optional callback for OTP success
}

const HomePage: React.FC<HomePageProps> = ({ onOtpSuccess }) => {
   

    // Example: You can call onOtpSuccess() after OTP verification
    const handleOtpSuccess = () => {
        if (onOtpSuccess) {
            onOtpSuccess();
        }
        // navigate("/services") can also go here if needed
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            {/* Search Section - Sticky header */}
            <div className="sticky top-0 z-50">
                <SearchContainer />
            </div>

            {/* Promo Slides Section - Full Width */}
            <div className="w-full px-4 md:px-6">
                <PromoSlides />
            </div>

            {/* Categories Section */}
            <Categories />
        </div>
    );
};

export default HomePage;