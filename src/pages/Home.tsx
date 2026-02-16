import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";

import SearchContainer from "../components/SearchContainer";
import PromoSlides from "../components/PromoSlides";
import Categories from "../components/Categories";
import WelcomePage from "../components/Auth/WelcomePage";
import AllJobs from "./AllJobs";

const getLocationByIP = async (): Promise<{ lat: number; lng: number; city: string } | null> => {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data?.latitude && data?.longitude) {
            return { lat: data.latitude, lng: data.longitude, city: data.city || data.region || "Unknown" };
        }
    } catch (e) {
        console.warn("ipapi.co failed", e);
    }
    try {
        const res = await fetch("http://ip-api.com/json/");
        const data = await res.json();
        if (data?.status === "success") {
            return { lat: data.lat, lng: data.lon, city: data.city || data.regionName || "Unknown" };
        }
    } catch (e) {
        console.warn("ip-api.com failed", e);
    }
    return null;
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { accountType } = useAccount();

    const [showWelcome, setShowWelcome] = useState(false);

    const [userLocation, setUserLocation] = useState<{
        latitude: number | null;
        longitude: number | null;
        city?: string;
    }>({ latitude: null, longitude: null, city: undefined });

    const [locationDetecting, setLocationDetecting] = useState(true);
    const [locationError, setLocationError] = useState("");

    // ── Top search bar state (passed down to AllJobs) ────────────────
    const [topSearchText, setTopSearchText] = useState("");

    const isWorker = isAuthenticated && accountType === "worker";

    useEffect(() => { detectLocation(); }, []);

    const saveAndSet = (city: string, lat: number, lng: number) => {
        setUserLocation({ latitude: lat, longitude: lng, city });
        localStorage.setItem("userLatitude", lat.toString());
        localStorage.setItem("userLongitude", lng.toString());
        localStorage.setItem("userCity", city);
        setLocationDetecting(false);
        setLocationError("");
    };

    const detectLocation = async () => {
        setLocationDetecting(true);
        setLocationError("");

        const savedLat = localStorage.getItem("userLatitude");
        const savedLng = localStorage.getItem("userLongitude");
        const savedCity = localStorage.getItem("userCity");

        if (savedLat && savedLng && savedCity) {
            setUserLocation({
                latitude: parseFloat(savedLat),
                longitude: parseFloat(savedLng),
                city: savedCity
            });
            setLocationDetecting(false);
            return;
        }

        const isSecureContext =
            window.isSecureContext ||
            window.location.protocol === "https:" ||
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1";

        if (navigator.geolocation && isSecureContext) {
            const gpsResult = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => resolve(null),
                    { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
                );
            });
            if (gpsResult) {
                const city = await reverseGeocodeNominatim(gpsResult.lat, gpsResult.lng);
                saveAndSet(city || "Unknown Location", gpsResult.lat, gpsResult.lng);
                return;
            }
        }

        const ipData = await getLocationByIP();
        if (ipData) {
            saveAndSet(ipData.city, ipData.lat, ipData.lng);
            return;
        }

        // If all methods fail, set error and don't show jobs
        setLocationError("Unable to detect your location. Please enable location services.");
        setLocationDetecting(false);
    };

    const reverseGeocodeNominatim = async (lat: number, lng: number): Promise<string> => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                { headers: { "Accept-Language": "en" } }
            );
            const data = await res.json();
            return data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.state || "";
        } catch { return ""; }
    };

    const handleLocationChange = (city: string, lat: number, lng: number) => {
        saveAndSet(city, lat, lng);
    };

    // ── Receive search text from SearchContainer ─────────────────────
    const handleSearchChange = (text: string) => {
        setTopSearchText(text);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── TOP SEARCH BAR ──────────────────────────────────────── */}
            <SearchContainer
                onLocationChange={handleLocationChange}
                onSearchChange={handleSearchChange}
            />

            {/* ── CONTENT ─────────────────────────────────────────────── */}
            <div className="pt-2">

                {/* Location pill */}
                {!locationDetecting && userLocation.city && userLocation.latitude && userLocation.longitude && (
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                            <span className="text-red-500">📍</span>
                            <span>
                                Showing results for{" "}
                                <span className="font-semibold text-gray-900">{userLocation.city}</span>
                            </span>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {locationDetecting ? (
                    <div className="flex flex-col items-center justify-center mt-20 gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 text-sm">Detecting your location...</p>
                    </div>

                ) : locationError ? (
                    /* Location Error */
                    <div className="max-w-xl mx-auto bg-yellow-50 border border-yellow-300 p-6 rounded-xl shadow mt-10 text-center">
                        <div className="text-5xl mb-4">📍</div>
                        <h2 className="text-xl font-bold text-yellow-800 mb-2">Location Required</h2>
                        <p className="text-yellow-700 text-sm mb-4">{locationError}</p>
                        <button
                            onClick={detectLocation}
                            className="bg-yellow-600 text-white px-6 py-2.5 rounded-lg hover:bg-yellow-700 transition font-medium text-sm"
                        >
                            Try Again
                        </button>
                    </div>

                ) : !userLocation.latitude || !userLocation.longitude ? (
                    /* No Location Available */
                    <div className="max-w-xl mx-auto bg-gray-100 p-6 rounded-xl shadow mt-10 text-center">
                        <div className="text-5xl mb-4">🌍</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Location Not Available</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Please enable location services or select a location manually.
                        </p>
                    </div>

                ) : isWorker ? (
                    /* ── WORKER FLOW: AllJobs filtered by top search bar ── */
                    <AllJobs
                        latitude={userLocation.latitude}
                        longitude={userLocation.longitude}
                        searchText={topSearchText}
                    />

                ) : (
                    /* ── CUSTOMER FLOW ───────────────────────────────────── */
                    <>
                        <PromoSlides />
                        <Categories
                            onCategoryClick={() => {
                                if (!isAuthenticated) {
                                    setShowWelcome(true);
                                    return false;
                                }
                                return true;
                            }}
                        />
                    </>
                )}
            </div>

            <WelcomePage isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
        </div>
    );
};

export default HomePage;