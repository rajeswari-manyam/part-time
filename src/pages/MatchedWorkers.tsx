import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Filters from "../components/cards/FilterCard";
import WorkerCard from "../components/cards/WorkerCard";
import { MatchedWorkersProps } from "../types/MatchedWorkers";
import { getAllWorkers, getNearbyWorkers } from "../services/api.service";

const MatchedWorkers: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [sortBy, setSortBy] = useState("distance");
    const [filterBy, setFilterBy] = useState("All");

    const [workers, setWorkers] = useState<MatchedWorkersProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter parameters
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [range, setRange] = useState<number>(10);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [minExperience, setMinExperience] = useState<number | null>(null);

    /* ================= FETCH WORKERS ================= */
    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;
                let workersData = [];

                if (latitude && longitude) {
                    console.log("Fetching nearby workers with filters:", {
                        latitude,
                        longitude,
                        range,
                    });
                    response = await getNearbyWorkers({ latitude, longitude, range });
                } else {
                    console.log("Fetching all workers (no filters applied)");
                    response = await getAllWorkers();
                }

                console.log("API Response:", response);

                if (response.success && Array.isArray(response.data)) {
                    workersData = response.data;
                } else if (Array.isArray(response)) {
                    workersData = response;
                } else {
                    console.error("Unexpected response structure:", response);
                    throw new Error("Invalid response format from API");
                }

                console.log("Workers data to map:", workersData);

                // Map backend data to UI format
                let mappedWorkers: MatchedWorkersProps[] = workersData.map(
                    (item: any, index: number) => ({
                        id: item._id || item.id || index,
                        name: item.name || "Unknown Worker",
                        initials: item.name
                            ? item.name
                                .split(" ")
                                .map((n: string) => n[0]?.toUpperCase() || "")
                                .join("")
                            : "NA",
                        rating: item.rating || 4.5,
                        reviews: item.reviews || item.reviewCount || 0,
                        distance: item.distance
                            ? `${item.distance.toFixed(1)} km`
                            : "N/A",
                        price: `₹${item.serviceCharge || item.price || 500}/${item.chargeType || "hr"
                            }`,
                        priceValue: item.serviceCharge || item.price || 500,
                        experience: `${item.experience || item.yearsOfExperience || 5
                            } years experience`,
                        experienceYears: item.experience || item.yearsOfExperience || 5,
                        category: item.category || "General",
                        email: item.email || "",
                        latitude: item.latitude,
                        longitude: item.longitude,
                        isActive: item.isActive !== undefined ? item.isActive : true,
                    })
                );

                // Apply filterBy filters
                if (filterBy === "5+ Experience") {
                    mappedWorkers = mappedWorkers.filter((w) => w.experienceYears >= 5);
                } else if (filterBy === "Top Rated") {
                    mappedWorkers = mappedWorkers.filter((w) => w.rating >= 4.5);
                }

                // Apply client-side filters
                if (maxPrice !== null) {
                    mappedWorkers = mappedWorkers.filter((w) => w.priceValue <= maxPrice);
                }

                if (minExperience !== null) {
                    mappedWorkers = mappedWorkers.filter(
                        (w) => w.experienceYears >= minExperience
                    );
                }

                // Apply sorting
                if (sortBy === "distance" && latitude && longitude) {
                    mappedWorkers.sort((a, b) => {
                        const distA = parseFloat(a.distance) || 999999;
                        const distB = parseFloat(b.distance) || 999999;
                        return distA - distB;
                    });
                } else if (sortBy === "price") {
                    mappedWorkers.sort((a, b) => a.priceValue - b.priceValue);
                } else if (sortBy === "rating") {
                    mappedWorkers.sort((a, b) => b.rating - a.rating);
                }

                setWorkers(mappedWorkers);
            } catch (err: any) {
                console.error("Error fetching workers:", err);
                setError(
                    err.message ||
                    "Failed to load workers. Please check if the server is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, [latitude, longitude, range, maxPrice, minExperience, sortBy, filterBy]);

    /* ================= FILTER HANDLERS ================= */
    const handleApplyFilters = (filters: {
        latitude?: number;
        longitude?: number;
        range?: number;
        maxPrice?: number;
        minExperience?: number;
    }) => {
        setLatitude(filters.latitude || null);
        setLongitude(filters.longitude || null);
        setRange(filters.range || 10);
        setMaxPrice(filters.maxPrice || null);
        setMinExperience(filters.minExperience || null);
    };

    const handleClearFilters = () => {
        setLatitude(null);
        setLongitude(null);
        setRange(10);
        setMaxPrice(null);
        setMinExperience(null);
        setSortBy("distance");
        setFilterBy("All");
    };

    /* ================= OTHER HANDLERS ================= */
    const handleViewProfile = (workerId: number | string) => {
        navigate(`/worker-profile/${workerId}`);
    };

    const handleSearchAgain = () => {
        navigate("/");
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        window.location.reload();
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const showHomeUI = !latitude && !longitude;

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-white flex flex-col max-w-2xl mx-auto">
            {/* ===== HOME PAGE UI ===== */}
            {showHomeUI && (
                <>
                    {/* Sort and Filter Pills */}
                    <div className="px-6 py-4 space-y-4">
                        {/* Sort By Pills */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Sort by</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSortBy("distance")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${sortBy === "distance"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    Distance
                                </button>
                                <button
                                    onClick={() => setSortBy("price")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${sortBy === "price"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    Price
                                </button>
                                <button
                                    onClick={() => setSortBy("rating")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${sortBy === "rating"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    Rating
                                </button>
                            </div>
                        </div>

                        {/* Filter By Pills */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Filter by</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterBy("All")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterBy === "All"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    All Workers
                                </button>
                                <button
                                    onClick={() => setFilterBy("5+ Experience")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterBy === "5+ Experience"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    5+ Experience
                                </button>
                                <button
                                    onClick={() => setFilterBy("Top Rated")}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterBy === "Top Rated"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    Top Rated
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Workers list */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <p className="text-gray-500 mt-2">Loading workers...</p>
                            </div>
                        )}

                        {!loading && !error && workers.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No workers found</p>
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            workers.map((worker) => (
                                <WorkerCard
                                    key={worker.id}
                                    worker={worker}
                                    onViewProfile={handleViewProfile}
                                />
                            ))}
                    </div>
                </>
            )}

            {/* ===== HEADER & Filters (if filters applied) ===== */}
            {!showHomeUI && (
                <>
                    <div className="flex items-center px-4 py-3 border-b">
                        <button
                            onClick={handleGoBack}
                            className="p-2 rounded-full hover:bg-gray-200"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="ml-4 text-lg font-semibold">
                            {latitude && longitude ? "Nearby Workers" : "All Workers"}
                        </h1>
                    </div>

                    <Filters
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        filterBy={filterBy}
                        setFilterBy={setFilterBy}
                        workerCount={workers.length}
                        onNewJobPost={handleSearchAgain}
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                    />

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <p className="text-gray-500 mt-2">Loading workers...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-8">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={handleRetry}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Retry
                                        </button>
                                        <button
                                            onClick={handleGoBack}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            workers.map((worker) => (
                                <WorkerCard
                                    key={worker.id}
                                    worker={worker}
                                    onViewProfile={handleViewProfile}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MatchedWorkers;