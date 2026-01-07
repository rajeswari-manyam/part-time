// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//     ArrowLeft,
//     MapPin,
//     Briefcase,
//     IndianRupee,
//     Star,
//     PlusCircle,
// } from "lucide-react";
// import { getNearbyWorkers, getUserLocation } from "../services/api.service";

// /* ================= TYPES ================= */

// interface ApiWorkerData {
//     _id?: string;
//     name?: string;
//     rating?: number;
//     reviewCount?: number;
//     serviceCharge?: number;
//     chargeType?: string;
//     experience?: number;
//     category?: string;
//     skills?: string[];
//     location?: string;
//     completedJobs?: number;
//     isActive?: boolean;
//     isVerified?: boolean;
//     distance?: number;
// }

// interface Worker {
//     id: string;
//     name: string;
//     initials: string;
//     rating: number;
//     reviews: number;
//     serviceCharge: number;
//     chargeType: string;
//     experience: number;
//     category: string;
//     skills: string[];
//     location: string;
//     jobsCompleted: number;
//     isActive: boolean;
//     isVerified: boolean;
//     distance?: number;
// }

// /* ================= COMPONENT ================= */

// const MatchedWorkers: React.FC = () => {
//     const navigate = useNavigate();
//     const { subcategory, category } = useParams<{ subcategory: string; category?: string }>();

//     const selectedSubcategory = subcategory?.replace(/-/g, " ");
//     const selectedCategory = category?.replace(/-/g, " ") || "Electrician"; // Default or extract from route

//     const [workers, setWorkers] = useState<Worker[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string>("");

//     // User location state
//     const [userLocation, setUserLocation] = useState({
//         latitude: 17.4940, // Default location
//         longitude: 78.4595,
//         range: 5 // km
//     });

//     // Get user's current location on mount
//     useEffect(() => {
//         const fetchUserLocation = async () => {
//             try {
//                 const location = await getUserLocation();
//                 setUserLocation(prev => ({
//                     ...prev,
//                     latitude: location.latitude,
//                     longitude: location.longitude
//                 }));
//             } catch (err) {
//                 console.log("Using default location", err);
//                 // Continue with default location
//             }
//         };

//         fetchUserLocation();
//     }, []);

//     // Fetch workers when subcategory or location changes
//     useEffect(() => {
//         const fetchWorkers = async () => {
//             if (!selectedSubcategory) return;

//             setLoading(true);
//             setError("");

//             try {
//                 // ✅ Pass arguments individually (not as an object)
//                 const response = await getNearbyWorkers(
//                     userLocation.latitude,
//                     userLocation.longitude,
//                     userLocation.range,
//                     selectedCategory,
//                     selectedSubcategory
//                 );

//                 if (response.success) {
//                     const data: ApiWorkerData[] = response.data || [];

//                     const mapped: Worker[] = data.map((item) => ({
//                         id: item._id || "",
//                         name: item.name || "Unknown",
//                         initials:
//                             item.name
//                                 ?.split(" ")
//                                 .map((n) => n[0])
//                                 .join("") || "NA",
//                         rating: item.rating || 4.5,
//                         reviews: item.reviewCount || 0,
//                         serviceCharge: item.serviceCharge || 500,
//                         chargeType: item.chargeType || "hr",
//                         experience: item.experience || 5,
//                         category: item.category || "",
//                         skills: item.skills || [],
//                         location: item.location || "Location not specified",
//                         jobsCompleted: item.completedJobs || 0,
//                         isActive: item.isActive ?? true,
//                         isVerified: item.isVerified ?? false,
//                         distance: item.distance
//                     }));

//                     setWorkers(mapped);
//                 } else {
//                     setError("Failed to load workers");
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch workers", err);
//                 setError("Unable to load workers. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchWorkers();
//     }, [selectedSubcategory, selectedCategory, userLocation.latitude, userLocation.longitude, userLocation.range]);

//     return (
//         <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
//             {/* ================= HEADER ================= */}
//             <div className="bg-white shadow sticky top-0 z-10">
//                 <div className="flex items-center justify-between px-4 py-3 border-b">
//                     <div className="flex items-center">
//                         <button onClick={() => navigate(-1)}>
//                             <ArrowLeft />
//                         </button>
//                         <h1 className="ml-3 font-medium capitalize">
//                             {selectedSubcategory} • {workers.length} workers
//                         </h1>
//                     </div>

//                     {/* ✅ POST JOB BUTTON */}
//                     <button
//                         onClick={() => navigate("/user-profile")}
//                         className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
//                     >
//                         <PlusCircle size={16} />
//                         Post Job
//                     </button>
//                 </div>
//             </div>

//             {/* ================= LIST ================= */}
//             <div className="p-4 space-y-4">
//                 {loading && <p className="text-center text-gray-600 py-8">Loading nearby workers...</p>}

//                 {!loading && error && (
//                     <div className="text-center py-8">
//                         <p className="text-red-600">{error}</p>
//                         <button
//                             onClick={() => window.location.reload()}
//                             className="mt-2 text-blue-600 hover:underline"
//                         >
//                             Try again
//                         </button>
//                     </div>
//                 )}

//                 {!loading && !error && workers.length === 0 && (
//                     <div className="text-center py-8">
//                         <p className="text-gray-500">
//                             No workers found for "{selectedSubcategory}" within {userLocation.range}km
//                         </p>
//                         <p className="text-sm text-gray-400 mt-2">
//                             Try increasing your search range or selecting a different service
//                         </p>
//                     </div>
//                 )}

//                 {!loading &&
//                     !error &&
//                     workers.map((worker) => (
//                         <div
//                             key={worker.id}
//                             className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-md transition"
//                             onClick={() =>
//                                 navigate(`/worker-profile/${worker.id}`)
//                             }
//                         >
//                             <div className="flex items-start gap-3">
//                                 <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
//                                     {worker.initials}
//                                 </div>

//                                 <div className="flex-1">
//                                     <div className="flex items-center justify-between">
//                                         <h3 className="font-semibold">{worker.name}</h3>
//                                         {worker.distance !== undefined && (
//                                             <span className="text-xs text-gray-500">
//                                                 {worker.distance.toFixed(1)} km away
//                                             </span>
//                                         )}
//                                     </div>

//                                     <div className="flex items-center gap-1 mt-1">
//                                         {[...Array(5)].map((_, i) => (
//                                             <Star
//                                                 key={i}
//                                                 size={14}
//                                                 className={
//                                                     i < Math.floor(worker.rating)
//                                                         ? "text-yellow-400 fill-yellow-400"
//                                                         : "text-gray-300"
//                                                 }
//                                             />
//                                         ))}
//                                         <span className="text-sm text-gray-600">
//                                             {worker.rating}
//                                         </span>
//                                         {worker.reviews > 0 && (
//                                             <span className="text-xs text-gray-500">
//                                                 ({worker.reviews})
//                                             </span>
//                                         )}
//                                     </div>

//                                     <p className="text-sm text-gray-600 mt-1">
//                                         {worker.experience} years experience
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="mt-3 space-y-1 text-sm text-gray-600">
//                                 <div className="flex items-center gap-2">
//                                     <MapPin size={14} className="flex-shrink-0" />
//                                     <span>{worker.location}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <Briefcase size={14} className="flex-shrink-0" />
//                                     <span>{worker.jobsCompleted} jobs completed</span>
//                                 </div>
//                             </div>

//                             <div className="mt-3 flex justify-between items-center">
//                                 <div className="flex items-center gap-1 font-semibold text-gray-900">
//                                     <IndianRupee size={16} />
//                                     <span>₹{worker.serviceCharge}/{worker.chargeType}</span>
//                                 </div>

//                                 {worker.isActive && (
//                                     <span className="text-green-600 text-sm font-medium">
//                                         Available
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//             </div>
//         </div>
//     );
// };

// export default MatchedWorkers;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    IndianRupee,
    Star,
    PlusCircle,
} from "lucide-react";
import { getNearbyWorkers, getUserLocation } from "../services/api.service";
import CategoriesData from "../data/categories.json";
import SubCategoriesData from "../data/subcategories.json";

interface Category {
    id: number;
    name: string;
    icon: string;
}

interface SubCategory {
    name: string;
    icon: string;
}

interface SubCategoryGroup {
    categoryId: number;
    items: SubCategory[];
}

interface WorkerData {
    _id?: string;
    name?: string;
    rating?: number;
    reviewCount?: number;
    serviceCharge?: number;
    chargeType?: string;
    experience?: number;
    category?: string;
    skills?: string[];
    location?: string;
    completedJobs?: number;
    isActive?: boolean;
    isVerified?: boolean;
    distance?: number;
}

interface Worker {
    id: string;
    name: string;
    initials: string;
    rating: number;
    reviews: number;
    serviceCharge: number;
    chargeType: string;
    experience: number;
    category: string;
    skills: string[];
    location: string;
    jobsCompleted: number;
    isActive: boolean;
    isVerified: boolean;
    distance?: number;
}

/* ================= DATA ================= */
const categories: Category[] = CategoriesData.categories;
const subcategoryGroups: SubCategoryGroup[] = SubCategoriesData.subcategories || [];

/* ================= HELPER FUNCTION ================= */
const findCategoryFromSubcategory = (subcategoryName: string): string => {
    const normalizedSubcat = subcategoryName.toLowerCase().trim();

    for (const group of subcategoryGroups) {
        const found = group.items.find(
            item => item.name.toLowerCase().trim() === normalizedSubcat
        );

        if (found) {
            const category = categories.find(cat => cat.id === group.categoryId);
            return category?.name || "";
        }
    }

    return "";
};

/* ================= COMPONENT ================= */

const MatchedWorkers: React.FC = () => {
    const navigate = useNavigate();
    const { subcategory, category } = useParams<{ subcategory: string; category?: string }>();

    // Keep original URL params (don't replace hyphens yet)
    const selectedSubcategory = subcategory;
    const selectedCategory = category;

    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // User location state - null means location not fetched yet
    const [userLocation, setUserLocation] = useState<{
        latitude: number | null;
        longitude: number | null;
        range: number;
    }>({
        latitude: null,
        longitude: null,
        range: 10
    });

    // Location is not used - we fetch workers by category and subcategory only

    /* ---------------- FETCH WORKERS BY CATEGORY AND SUBCATEGORY ---------------- */
    useEffect(() => {
        if (!selectedSubcategory) return;

        const fetchWorkers = async () => {
            setLoading(true);
            setError("");

            try {
                // Use category from URL or find it from subcategory
                let categoryName = selectedCategory;

                if (!categoryName) {
                    // Try to find category from subcategory
                    categoryName = findCategoryFromSubcategory(selectedSubcategory);
                }

                // If still no category, use a default or the subcategory itself
                if (!categoryName) {
                    categoryName = "Electrician"; // Default fallback
                }

                console.log("Fetching workers with params:", {
                    category: categoryName,
                    subcategory: selectedSubcategory
                });

                // Build URL without encoding spaces in subcategory (API expects "Home Wiring,Industrial Wiring")
                const url = `http://192.168.1.13:3000/getNearbyWorkers?category=${categoryName}&subcategory=${selectedSubcategory}`;

                console.log("Fetching workers with URL:", url);

                const res = await fetch(url, {
                    method: "GET",
                    redirect: "follow"
                });

                const response = await res.json();

                if (response.success) {
                    const data: WorkerData[] = response.data || [];

                    const mapped: Worker[] = data.map((item) => ({
                        id: item._id || "",
                        name: item.name || "Unknown",
                        initials: item.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "NA",
                        rating: item.rating || 4.5,
                        reviews: item.reviewCount || 0,
                        serviceCharge: item.serviceCharge || 500,
                        chargeType: item.chargeType || "hr",
                        experience: item.experience || 5,
                        category: item.category || "",
                        skills: item.skills || [],
                        location: item.location || "Location not specified",
                        jobsCompleted: item.completedJobs || 0,
                        isActive: item.isActive ?? true,
                        isVerified: item.isVerified ?? false,
                        distance: item.distance
                    }));

                    console.log(`Found ${mapped.length} workers`);
                    setWorkers(mapped);
                } else {
                    setError("Failed to load workers");
                }
            } catch (err) {
                console.error("Error fetching workers", err);
                setError("Unable to load workers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, [selectedSubcategory, selectedCategory, userLocation.range]);

    // Handle Post Job button
    const handlePostJob = () => {
        const categoryName = selectedCategory || findCategoryFromSubcategory(selectedSubcategory || "");

        const prefillData = {
            category: categoryName,
            subcategory: selectedSubcategory || ""
        };

        localStorage.setItem('jobPrefillData', JSON.stringify(prefillData));
        navigate("/user-profile");
    };

    return (
        <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
            {/* HEADER */}
            <div className="bg-white shadow sticky top-0 z-10">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)}>
                            <ArrowLeft />
                        </button>
                        <h1 className="ml-3 font-medium capitalize">
                            {selectedSubcategory} • {workers.length} workers
                        </h1>
                    </div>

                    <button
                        onClick={handlePostJob}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        <PlusCircle size={16} />
                        Post Job
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="p-4 space-y-4">
                {loading && (
                    <p className="text-center text-gray-600 py-8">
                        Loading workers...
                    </p>
                )}

                {!loading && error && (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && workers.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            No workers found for "{selectedSubcategory}"
                        </p>
                    </div>
                )}

                {!loading && !error && workers.map((worker) => (
                    <div
                        key={worker.id}
                        className="bg-white rounded-xl p-4 shadow cursor-pointer hover:shadow-md transition"
                        onClick={() => navigate(`/worker-profile/${worker.id}`)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {worker.initials}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{worker.name}</h3>
                                    {worker.distance !== undefined && (
                                        <span className="text-xs text-gray-500">
                                            {worker.distance.toFixed(1)} km away
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i < Math.floor(worker.rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600">{worker.rating}</span>
                                    {worker.reviews > 0 && (
                                        <span className="text-xs text-gray-500">({worker.reviews})</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{worker.experience} years experience</p>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="flex-shrink-0" />
                                <span>{worker.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={14} className="flex-shrink-0" />
                                <span>{worker.jobsCompleted} jobs completed</span>
                            </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                                <IndianRupee size={16} />
                                <span>₹{worker.serviceCharge}/{worker.chargeType}</span>
                            </div>
                            {worker.isActive && (
                                <span className="text-green-600 text-sm font-medium">Available</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchedWorkers;