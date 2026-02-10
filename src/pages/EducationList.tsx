import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components with dummy data
import NearbySchoolCard from "../components/cards/Education/NearBySchoolCard";
import NearbyCollegeCard from "../components/cards/Education/NearByCollegeCard";
import NearbyCoachingCard from "../components/cards/Education/NearByCoaching";
import NearbyComputerTrainingCard from "../components/cards/Education/NearByComputer";
import NearbyMusicClassesCard from "../components/cards/Education/NearByMusicCard";
import NearbySkillCard from "../components/cards/Education/NearBySkillCard";
import NearbySpokenEnglishCard from "../components/cards/Education/NearBySpokenCard";
import NearbyTuitionCard from "../components/cards/Education/NearByTutionCard";

// ── Import API service
import { getNearbyEducationCenters, EducationService, EducationResponse } from "../services/EducationService.service";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP
// ============================================================================
type CardKey =
    | "school" | "college" | "coaching" | "computer"
    | "music" | "skill" | "spoken" | "tuition";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    school: NearbySchoolCard,
    college: NearbyCollegeCard,
    coaching: NearbyCoachingCard,
    computer: NearbyComputerTrainingCard,
    music: NearbyMusicClassesCard,
    skill: NearbySkillCard,
    spoken: NearbySpokenEnglishCard,
    tuition: NearbyTuitionCard,
};

// ============================================================================
// HELPERS
// ============================================================================
const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return "";
    const normalized = sub.toLowerCase();
    console.log("📍 Raw subcategory:", sub);
    console.log("📍 Normalized subcategory:", normalized);
    return normalized;
};

const getCardComponentForSubcategory = (
    subcategory: string | undefined
): React.ComponentType<any> | null => {
    if (!subcategory) return null;

    const normalized = normalizeSubcategory(subcategory);

    // School matching
    if (normalized.includes("school")) {
        console.log("✅ Matched to NearbySchoolCard");
        return CARD_MAP.school;
    }

    // College matching
    if (normalized.includes("college")) {
        console.log("✅ Matched to NearbyCollegeCard");
        return CARD_MAP.college;
    }

    // Coaching matching
    if (normalized.includes("coaching")) {
        console.log("✅ Matched to NearbyCoachingCard");
        return CARD_MAP.coaching;
    }

    // Computer training matching
    if (normalized.includes("computer") && normalized.includes("training")) {
        console.log("✅ Matched to NearbyComputerTrainingCard");
        return CARD_MAP.computer;
    }

    // Music & Dance classes matching
    if (
        (normalized.includes("music") || normalized.includes("dance")) &&
        normalized.includes("class")
    ) {
        console.log("✅ Matched to NearbyMusicClassesCard");
        return CARD_MAP.music;
    }

    // Spoken English matching
    if (normalized.includes("spoken") && normalized.includes("english")) {
        console.log("✅ Matched to NearbySpokenEnglishCard");
        return CARD_MAP.spoken;
    }

    // Skill development matching
    if (normalized.includes("skill")) {
        console.log("✅ Matched to NearbySkillCard");
        return CARD_MAP.skill;
    }

    // Tuition matching
    if (normalized.includes("tuition")) {
        console.log("✅ Matched to NearbyTuitionCard");
        return CARD_MAP.tuition;
    }

    console.warn(`⚠️ No matching card component for: "${subcategory}"`);
    return CARD_MAP.school; // Default to school card
};

const shouldShowNearbyCards = (subcategory: string | undefined): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);

    const keywords = [
        "school", "college", "coaching", "computer", "training",
        "music", "dance", "class", "spoken", "english", "skill", "tuition"
    ];

    const hasMatch = keywords.some((keyword) => normalized.includes(keyword));

    console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);

    return hasMatch;
};

const getDisplayTitle = (subcategory: string | undefined) => {
    if (!subcategory) return "All Education Services";
    return subcategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EducationList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── State management ─────────────────────────────────────────────
    const [nearbyData, setNearbyData] = useState<EducationService[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [distance, setDistance] = useState<number>(10); // Default 10km radius

    // ── Get user location ────────────────────────────────────────────
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(location);
                    console.log("📍 User location obtained:", location);
                },
                (err) => {
                    console.error("❌ Error getting user location:", err);
                    setError("Unable to get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            console.error("❌ Geolocation not supported");
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    // ── Fetch nearby education centers ──────────────────────────────────────────
    useEffect(() => {
        const fetchNearbyEducation = async () => {
            if (!userLocation) return;

            try {
                setLoading(true);
                setError(null);

                console.log("🔍 Fetching nearby education centers...", {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    distance,
                });

                const response: EducationResponse = await getNearbyEducationCenters(
                    userLocation.latitude,
                    userLocation.longitude,
                    distance
                );

                if (response.success && response.data) {
                    console.log("✅ Nearby education centers fetched:", response.data);
                    setNearbyData(response.data);
                } else {
                    console.warn("⚠️ No nearby education centers found");
                    setNearbyData([]);
                }
            } catch (err) {
                console.error("❌ Error fetching nearby education centers:", err);
                setError("Failed to fetch nearby services. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (userLocation && shouldShowNearbyCards(subcategory)) {
            fetchNearbyEducation();
        } else {
            setLoading(false);
        }
    }, [userLocation, distance, subcategory]);

    // ── navigation handlers ─────────────────────────────────────────
    const handleView = (service: any) => {
        const id = service.id || service._id;
        console.log("Viewing education service details:", id);
        navigate(`/education/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-education-form?subcategory=${subcategory}`
                : "/add-education-form"
        );
    };

    // ── Render Cards Section ─────────────────────────────────────────
    const renderCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        // Show loading state
        if (loading) {
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Loading nearby services...
                    </h3>
                    <p className="text-gray-600">
                        Getting your location and finding services near you
                    </p>
                </div>
            );
        }

        // Show error state
        if (error) {
            return (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {error}
                    </h3>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Header with distance filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}>
                        <span className="shrink-0">🎓</span>
                        <span className="truncate">Available {getDisplayTitle(subcategory)}</span>
                    </h2>

                    {/* Distance Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Within:</label>
                        <select
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                            <option value={50}>50 km</option>
                            <option value={100}>100 km</option>
                        </select>
                    </div>
                </div>

                {/* Nearby Cards with Real Data */}
                <div className="mb-6">
                    {nearbyData.length > 0 ? (
                        <CardComponent
                            onViewDetails={handleView}
                            nearbyData={nearbyData}
                            userLocation={userLocation}
                        />
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <div className="text-5xl mb-3">📍</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                No services found nearby
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try increasing the search distance or check back later
                            </p>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleAddPost}
                            >
                                Add a Service
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle(subcategory)}
                    </h1>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddPost}
                        className="w-full sm:w-auto justify-center"
                    >
                        + Add Post
                    </Button>
                </div>

                {/* ─── CONTENT RENDERING ─────────────────────────────── */}
                {shouldShowNearbyCards(subcategory) ? (
                    // Render nearby cards with real API data
                    renderCardsSection()
                ) : (
                    // Default view when no subcategory matches
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎓</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Services Found
                        </h3>
                        <p className="text-gray-600">
                            Select a category or add a new service!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationList;