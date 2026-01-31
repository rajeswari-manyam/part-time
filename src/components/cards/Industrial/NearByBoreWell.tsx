import React, { useState, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    Navigation,
    Star,
    Clock,
    CheckCircle,
    Drill,
} from "lucide-react";

/* ================= TYPES ================= */

export interface BorewellService {
    place_id: string;
    name: string;
    vicinity: string;
    rating: number;
    user_ratings_total: number;
    photos: { photo_reference: string }[];
    geometry: { location: { lat: number; lng: number } };
    business_status: string;
    opening_hours: { open_now: boolean };
    special_tags: string[];
    distance: number;
}

/* ================= CONSTANTS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
    service_1: "07411595083",
    service_2: "07411095445",
    service_3: "08460556659",
};

export const DUMMY_BOREWELL_SERVICES: BorewellService[] = [
    {
        place_id: "service_1",
        name: "APS Borewells",
        vicinity: "Kushaiguda ECIL, Hyderabad",
        rating: 5.0,
        user_ratings_total: 1,
        photos: [{ photo_reference: "1" }],
        geometry: { location: { lat: 17.385, lng: 78.4867 } },
        business_status: "OPERATIONAL",
        opening_hours: { open_now: true },
        special_tags: ["Trending", "Verified"],
        distance: 11.7,
    },
    {
        place_id: "service_2",
        name: "Sri Sai Venkateshwara Borewells",
        vicinity: "Mehdipatnam, Hyderabad",
        rating: 4.4,
        user_ratings_total: 61,
        photos: [{ photo_reference: "2" }],
        geometry: { location: { lat: 17.39, lng: 78.48 } },
        business_status: "OPERATIONAL",
        opening_hours: { open_now: true },
        special_tags: ["Quick Response"],
        distance: 10.5,
    },
    {
        place_id: "service_3",
        name: "Hyderabad Borewell Contractors",
        vicinity: "Madhapur, Hyderabad",
        rating: 4.8,
        user_ratings_total: 35,
        photos: [{ photo_reference: "3" }],
        geometry: { location: { lat: 17.448, lng: 78.391 } },
        business_status: "OPERATIONAL",
        opening_hours: { open_now: true },
        special_tags: ["Top Rated", "Professional"],
        distance: 8.3,
    },
];

const IMAGES_MAP: Record<string, string[]> = {
    service_1: [
        "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    ],
    service_2: [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
        "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
    ],
    service_3: [
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
    ],
};

const BOREWELL_SERVICES = [
    "Borewell Drilling",
    "Pump Installation",
    "Water Testing",
    "Maintenance",
    "Cleaning",
    "Pipeline Setup",
];

/* ================= COMPONENT ================= */

interface Props {
    job?: any;
    onViewDetails: (job: any) => void;
}

const SingleBorewellCard: React.FC<Props> = ({ job, onViewDetails }) => {
    const [index, setIndex] = useState(0);
    const [imgError, setImgError] = useState(false);

    // ✅ Safe accessors - check both jobData and root level
    const getId = () => job?.id || job?.place_id || "service_1";
    const getName = () => job?.title || job?.name || "Borewell Service";
    const getLocation = () => job?.location || job?.vicinity || "Location";
    const getDistance = () => {
        const dist = job?.distance || 0;
        return typeof dist === 'number' ? dist : parseFloat(dist) || 0;
    };
    const getRating = () => job?.jobData?.rating || job?.rating || 0;
    const getReviews = () => job?.jobData?.user_ratings_total || job?.user_ratings_total || 0;
    const getTags = () => job?.jobData?.special_tags || job?.special_tags || [];
    const getOpeningHours = () => job?.jobData?.opening_hours || job?.opening_hours;
    const getGeometry = () => job?.jobData?.geometry || job?.geometry;

    const getPhotos = useCallback(() => {
        const id = getId();
        return IMAGES_MAP[id] || IMAGES_MAP["service_1"];
    }, [job]);

    const photos = getPhotos();
    const currentPhoto = photos[index];

    const getPhone = () => {
        const id = getId();
        return PHONE_NUMBERS_MAP[id] || null;
    };

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        const phone = getPhone();
        if (!phone) {
            alert("Phone number not available");
            return;
        }
        window.location.href = `tel:${phone}`;
    };

    const handleDirections = (e: React.MouseEvent) => {
        e.stopPropagation();
        const geometry = getGeometry();
        const loc = geometry?.location;
        if (!loc?.lat || !loc?.lng) {
            alert("Location not available");
            return;
        }
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,
            "_blank"
        );
    };

    if (!job) {
        console.warn("⚠️ BorewellCard: No job data");
        return null;
    }

    const rating = getRating();
    const reviews = getReviews();
    const isOpen = getOpeningHours()?.open_now;
    const tags = getTags();
    const phone = getPhone();

    console.log("🚜 BorewellCard:", {
        id: getId(),
        name: getName(),
        rating,
        reviews,
        tags,
        hasPhone: !!phone,
    });

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
                {currentPhoto && !imgError ? (
                    <>
                        <img
                            src={currentPhoto}
                            className="w-full h-full object-cover"
                            alt={getName()}
                            onError={() => {
                                console.warn("⚠️ Image failed:", currentPhoto);
                                setImgError(true);
                            }}
                        />
                        {photos.length > 1 && (
                            <>
                                {index > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIndex(index - 1);
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                )}
                                {index < photos.length - 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIndex(index + 1);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                )}

                                {/* Counter */}
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1} / {photos.length}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-6xl mb-2">🚜</span>
                        <span className="text-sm text-gray-500">Borewell Service</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5">
                <h3 className="font-bold text-[17px] text-gray-900 mb-1 line-clamp-2">
                    {getName()}
                </h3>

                <div className="flex items-center text-gray-500 mb-1">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="text-[13px] line-clamp-1">{getLocation()}</span>
                </div>

                {getDistance() > 0 && (
                    <p className="text-xs font-semibold text-cyan-600 mb-2">
                        {getDistance().toFixed(1)} km away
                    </p>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {tags.map((tag: string, i: number) => (
                            <span
                                key={i}
                                className="bg-cyan-100 text-cyan-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Rating + Status */}
                <div className="flex items-center gap-2 mb-2">
                    {rating > 0 && (
                        <div className="flex items-center gap-1">
                            <Star size={13} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                            {reviews > 0 && (
                                <span className="text-xs text-gray-500">({reviews})</span>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-semibold px-1.5 py-0.5 rounded">
                        <Clock size={11} />
                        {isOpen ? "Available Today" : "Closed"}
                    </div>
                </div>

                {/* Category Badge */}
                <div className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-[11px] font-semibold px-2 py-1 rounded-xl mb-2">
                    <Drill size={12} /> Borewell Service
                </div>

                {/* Services */}
                <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-500 tracking-wide mb-1">
                        SERVICES:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {BOREWELL_SERVICES.slice(0, 4).map((s, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-[11px] px-2 py-1 rounded"
                            >
                                <CheckCircle size={11} /> {s}
                            </span>
                        ))}
                        {BOREWELL_SERVICES.length > 4 && (
                            <span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded">
                                +{BOREWELL_SERVICES.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleDirections}
                        className="flex-1 flex items-center justify-center gap-1 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 text-xs font-bold py-2.5 rounded-lg hover:bg-indigo-100 transition active:scale-95"
                    >
                        <Navigation size={14} /> Directions
                    </button>
                    <button
                        onClick={handleCall}
                        disabled={!phone}
                        className={`flex-1 flex items-center justify-center gap-1 border-2 text-xs font-bold py-2.5 rounded-lg transition active:scale-95 ${phone
                            ? "border-cyan-600 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                            : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <Phone size={14} /> {phone ? "Call" : "No Phone"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ================= WRAPPER ================= */

const BorewellServiceCard: React.FC<Props> = (props) => {
    console.log("🚜 BorewellServiceCard wrapper:", {
        hasJob: !!props.job,
        job: props.job,
    });

    if (!props.job) {
        console.log("📋 Rendering dummy borewell grid");
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-4xl">🚜</div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Borewell Drilling Services in Hyderabad
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Professional borewell drilling, installation & maintenance
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <span className="bg-white text-cyan-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-cyan-200">
                            ✓ Verified Services
                        </span>
                        <span className="bg-white text-cyan-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-cyan-200">
                            🔥 Quick Response
                        </span>
                        <span className="bg-white text-cyan-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-cyan-200">
                            ⭐ Top Rated
                        </span>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DUMMY_BOREWELL_SERVICES.map((service) => {
                        // ✅ CRITICAL: Create properly structured job data
                        const jobData = {
                            // Root level - what component checks first
                            id: service.place_id,
                            place_id: service.place_id,
                            title: service.name,
                            name: service.name,
                            location: service.vicinity,
                            vicinity: service.vicinity,
                            distance: service.distance,
                            rating: service.rating,
                            user_ratings_total: service.user_ratings_total,
                            special_tags: service.special_tags,
                            opening_hours: service.opening_hours,
                            geometry: service.geometry,

                            // ALSO in jobData for nested access
                            jobData: {
                                rating: service.rating,
                                user_ratings_total: service.user_ratings_total,
                                special_tags: service.special_tags,
                                opening_hours: service.opening_hours,
                                geometry: service.geometry,
                            },
                        };

                        console.log("🚜 Creating card:", service.place_id, jobData);

                        return (
                            <SingleBorewellCard
                                key={service.place_id}
                                job={jobData}
                                onViewDetails={props.onViewDetails}
                            />
                        );
                    })}
                </div>

                {/* Info Footer */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-gray-800 mb-2">
                        💡 Why Professional Borewell Services?
                    </p>
                    <ul className="space-y-1 text-xs text-gray-700">
                        <li>✓ Advanced water detection technology</li>
                        <li>✓ Guaranteed water availability or money back</li>
                        <li>✓ Complete pipeline and pump installation</li>
                        <li>✓ All permits and documentation handled</li>
                    </ul>
                </div>
            </div>
        );
    }

    console.log("🚜 Rendering single card");
    return <SingleBorewellCard job={props.job} onViewDetails={props.onViewDetails} />;
};

export default BorewellServiceCard;