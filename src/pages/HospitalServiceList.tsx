import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNearbyHospitals, Hospital } from "../services/HospitalService.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ── Nearby card components (existing)
import NearbyHospitalCard from "../components/cards/Hospital&HealthCare/NearByHospitals";
import NearbyClinicsCard from "../components/cards/Hospital&HealthCare/NearByClinicsCard";
import NearbyDentalCard from "../components/cards/Hospital&HealthCare/NearByDentalClinicsCard";
import NearbyPharmaciesCard from "../components/cards/Hospital&HealthCare/NearByPharmacies";
import NearbyEyeCard from "../components/cards/Hospital&HealthCare/NearByEyeHospital";
import NearbyDermatologistsCard from "../components/cards/Hospital&HealthCare/NearByDermotologists";
import NearbyPhysiotherapyCard from "../components/cards/Hospital&HealthCare/NearByPhysiotheraphy";
import NearbyVetClinicCard from "../components/cards/Hospital&HealthCare/NearByVetHospital";
import NearbyAmbulanceCard from "../components/cards/Hospital&HealthCare/NearByAmbulance";
import NearbyBloodBankCard from "../components/cards/Hospital&HealthCare/NearByBloodBlanks";
import NearbyNursingServiceCard from "../components/cards/Hospital&HealthCare/NearByNursing";
import NearbyDiagnosticLabsCard from "../components/cards/Hospital&HealthCare/NearByDiagnosticlabs";

// ============================================================================
// SUBCATEGORY → CARD COMPONENT MAP  (single source of truth)
// ============================================================================
type CardKey =
    | "hospital"
    | "clinic"
    | "dental"
    | "pharmacy"
    | "eye"
    | "derma"
    | "physio"
    | "vet"
    | "ambulance"
    | "blood"
    | "nursing"
    | "lab";

const CARD_MAP: Record<CardKey, React.ComponentType<any>> = {
    hospital: NearbyHospitalCard,
    clinic: NearbyClinicsCard,
    dental: NearbyDentalCard,
    pharmacy: NearbyPharmaciesCard,
    eye: NearbyEyeCard,
    derma: NearbyDermatologistsCard,
    physio: NearbyPhysiotherapyCard,
    vet: NearbyVetClinicCard,
    ambulance: NearbyAmbulanceCard,
    blood: NearbyBloodBankCard,
    nursing: NearbyNursingServiceCard,
    lab: NearbyDiagnosticLabsCard,
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Resolve a subcategory URL slug (or a hospitalType string) → CardKey.
 * Order matters: more-specific checks come first.
 */
const resolveCardKey = (text: string | undefined): CardKey | null => {
    if (!text) return null;
    const n = text.toLowerCase();

    if (n.includes("dental")) return "dental";
    if (n.includes("eye")) return "eye";
    if (n.includes("derma")) return "derma";
    if (n.includes("physio")) return "physio";
    if (n.includes("vet") || n.includes("pet")) return "vet";
    if (n.includes("ambulance")) return "ambulance";
    if (n.includes("blood")) return "blood";
    if (n.includes("nursing")) return "nursing";
    if (n.includes("lab") || n.includes("diagnostic")) return "lab";
    if (n.includes("pharmac") || (n.includes("medical") && n.includes("shop"))) return "pharmacy";
    if (n.includes("clinic")) return "clinic";
    if (n.includes("hospital")) return "hospital";

    return null;
};

/** Capitalise a kebab-case slug → Title Case */
const titleFromSlug = (slug: string | undefined): string => {
    if (!slug) return "All Hospital Services";
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

/** Derive the hospitalType filter value from the URL subcategory */
const getTypeFromSubcategory = (subcategory: string | undefined): string | undefined => {
    if (!subcategory) return undefined;
    return titleFromSlug(subcategory);
};

const normalizeType = (type: string): string => type.toLowerCase().trim().replace(/\s+/g, " ");

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HospitalServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    // ── state ──────────────────────────────────────────────────────────────────
    const [nearbyServices, setNearbyServices] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    // ── fetch nearby hospitals with automatic geolocation ─────────────────────
    const fetchNearbyHospitals = useCallback(async () => {
        setLoading(true);
        setError("");
        setLocationError("");

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation not supported"));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000, // cache 5 min
                });
            });

            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            const distance = 10; // 10 km radius

            console.log("Fetching nearby hospitals:", { latitude, longitude, distance });
            const response = await getNearbyHospitals(latitude, longitude, distance);
            console.log("Nearby hospitals API response:", response);

            if (response.success) {
                const allServices = response.data || [];

                if (subcategory) {
                    const targetType = getTypeFromSubcategory(subcategory);
                    if (targetType) {
                        const normalizedTarget = normalizeType(targetType);
                        const filtered = allServices.filter(
                            (s) => s.hospitalType && normalizeType(s.hospitalType) === normalizedTarget
                        );
                        console.log(`Filtered hospitals for "${targetType}":`, filtered);
                        setNearbyServices(filtered);
                    } else {
                        setNearbyServices(allServices);
                    }
                } else {
                    setNearbyServices(allServices);
                }
            } else {
                console.warn("API returned success=false:", response);
                setNearbyServices([]);
            }
        } catch (err: any) {
            console.error("fetchNearbyHospitals error:", err);
            setLocationError(
                err.message === "User denied Geolocation"
                    ? "Location access denied. Please enable location services to see nearby services."
                    : err.message || "Failed to get location. Please enable location services."
            );
            setNearbyServices([]);
        } finally {
            setLoading(false);
        }
    }, [subcategory]);

    useEffect(() => {
        console.log("HospitalServicesList mounted. Subcategory:", subcategory);
        fetchNearbyHospitals();
    }, [fetchNearbyHospitals]);

    // ── navigation ─────────────────────────────────────────────────────────────
    const handleView = (id: string) => {
        console.log("Viewing hospital details:", id);
        navigate(`/hospital-services/details/${id}`);
    };

    const handleAddPost = () => {
        console.log("Adding new hospital post. Subcategory:", subcategory);
        navigate(
            subcategory
                ? `/add-hospital-service-form?subcategory=${subcategory}`
                : "/add-hospital-service-form"
        );
    };

    // ── display helpers ────────────────────────────────────────────────────────
    const getDisplayTitle = () => titleFromSlug(subcategory);

    /** Pick the right card component from CARD_MAP */
    const getCardComponent = (): React.ComponentType<any> | null => {
        // 1. Try from URL subcategory
        if (subcategory) {
            const key = resolveCardKey(subcategory);
            console.log("Card key from subcategory:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        // 2. Fall back to first fetched item's hospitalType
        if (nearbyServices.length > 0 && nearbyServices[0].hospitalType) {
            const key = resolveCardKey(nearbyServices[0].hospitalType);
            console.log("Card key from first service type:", key);
            if (key && CARD_MAP[key]) return CARD_MAP[key];
        }
        // 3. Default
        console.log("Using default hospital card");
        return CARD_MAP.hospital;
    };

    const CardComponent = getCardComponent();

    // ============================================================================
    // LOADING
    // ============================================================================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
                    <p className={`${typography.body.small} text-gray-600`}>
                        Loading services...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* ─── HEADER ── title  +  "+ Add Post" ─────────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {getDisplayTitle()}
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

                {/* ─── ERROR ────────────────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-lg">
                        <p className={`${typography.body.small} text-red-700 font-medium`}>
                            {error}
                        </p>
                    </div>
                )}

                {/* ─── LOCATION ERROR ───────────────────────────────────────── */}
                {locationError && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p
                                    className={`${typography.body.small} text-yellow-800 font-semibold mb-1`}
                                >
                                    Location Access Required
                                </p>
                                <p className={`${typography.body.xs} text-yellow-700`}>
                                    {locationError}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── NEARBY SECTION ──────────────────────────────────────── */}
                {CardComponent && (
                    <div>
                        <h2
                            className={`${typography.heading.h4} text-gray-800 mb-3 sm:mb-4 flex items-center gap-2`}
                        >
                            <span className="shrink-0">🏥</span>
                            <span className="truncate">Nearby {getDisplayTitle()}</span>
                            {nearbyServices.length > 0 && (
                                <span
                                    className={`${typography.misc.badge} bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full ml-2`}
                                >
                                    {nearbyServices.length}
                                </span>
                            )}
                        </h2>

                        {/* CardComponent handles its own dummy / real data */}
                        <CardComponent
                            onViewDetails={(hospital: any) => {
                                const id = hospital.id || hospital._id;
                                console.log("Card view details clicked:", id);
                                handleView(id);
                            }}
                            nearbyData={nearbyServices.length > 0 ? nearbyServices : undefined}
                            userLocation={userLocation}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalServicesList;