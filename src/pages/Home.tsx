// src/pages/HomePage.tsx
import React, { useState } from "react";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import NearByJobs from "./NearByJobs";
import LocationSelector from "../components/LocationSelector";

import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";

const HomePage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { accountType } = useAccount();

    const isWorker = isAuthenticated && accountType === "worker";

    /* ---------------- LOCATION STATE ---------------- */
    const [selectedLocation, setSelectedLocation] = useState<{
        city: string;
        latitude: number;
        longitude: number;
    } | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">

            {/* 🚫 Disable ALL clicks before login */}
            <div className={!isAuthenticated ? "pointer-events-none" : ""}>

                {/* 🔍 Search */}
                <div className="w-full">
                    <SearchContainer />
                </div>

                {/* 🎯 Promo Slides */}
                <div className="w-full px-4 md:px-6">
                    <PromoSlides />
                </div>

                {/* 📍 Location Selector */}
                {isAuthenticated && isWorker && (
                    <div className="w-full px-4 md:px-6 mt-6">
                        <LocationSelector
                            onSaveLocation={(city, lat, lng) =>
                                setSelectedLocation({
                                    city,
                                    latitude: lat,
                                    longitude: lng,
                                })
                            }
                        />
                    </div>
                )}

                {/* 🧭 Main Content */}
                <div className="w-full px-4 md:px-6 mt-6">

                    {/* 🔓 Not Logged In */}
                    {!isAuthenticated && <Categories />}

                    {/* 👷 Worker */}
                    {isAuthenticated && isWorker && (
                        <NearByJobs
                            selectedLocation={selectedLocation}
                        />
                    )}

                    {/* 👤 Customer */}
                    {isAuthenticated && !isWorker && <Categories />}

                </div>
            </div>
        </div>
    );
};

export default HomePage;
