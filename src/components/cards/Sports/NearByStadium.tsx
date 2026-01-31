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
    Trophy,
} from "lucide-react";

/* ================= TYPES ================= */

export interface StadiumService {
    place_id: string;
    name: string;
    vicinity: string;
    rating: number;
    user_ratings_total: number;
    photos: { photo_reference: string }[];
    geometry: { location: { lat: number; lng: number } };
    business_status: string;
    opening_hours: { open_now: boolean };
    price_level: number;
    special_tags: string[];
    distance: number;
}

/* ================= CONSTANTS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
    stadium_1: "07702400939",
    stadium_2: "04023212818",
    stadium_3: "09550038883",
};

export const DUMMY_STADIUMS: StadiumService[] = [
    {
        place_id: "stadium_1",
        name: "PJR Indoor Stadium",
        vicinity: "Hyderabad",
        rating: 4.2,
        user_ratings_total: 8823,
        photos: [{ photo_reference: "stadium_photo_1" }],
        geometry: { location: { lat: 17.435, lng: 78.445 } },
        business_status: "OPERATIONAL",
        opening_hours: { open_now: true },
        price_level: 2,
        special_tags: ["Trending", "Indoor Stadium"],
        distance: 14.4,
    },
    {
        place_id: "stadium_2",
        name: "Lal Bahadur Stadium",
        vicinity: "Hyderabad",
        rating: 4.2,
        user_ratings_total: 7449,
        photos: [{ photo_reference: "stadium_photo_2" }],
        geometry: { location: { lat: 17.4123, lng: 78.4678 } },
        business_status: "OPERATIONAL",
        opening_hours: { open_now: true },
        price_level: 2,
        special_tags: ["Jd Trust", "Sports Ground"],
        distance: 9.9,
    },
    {
        place_id: "stadium_3",
        name: "Gachibowli Stadium",
        vicinity: "Hyderabad",
        rating: 4.4,
        user_ratings_total: 6934,
        photos: [{ photo_reference: "stadium_photo_3" }],
        geometry: { location: { lat: 17.4273, lng: 78.3617 } },
        business_status: "OPERATIONAL",
        opening_hours: { open_now: true },
        price_level: 3,
        special_tags: ["Top Rated", "Events"],
        distance: 12.7,
    },
];

const STADIUM_IMAGES_MAP: Record<string, string[]> = {
    stadium_1: [
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    ],
    stadium_2: [
        "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
        "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=800",
    ],
    stadium_3: [
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800",
    ],
};

const STADIUM_DESCRIPTIONS_MAP: Record<string, string> = {
    stadium_1:
        "Popular indoor stadium with modern facilities, professional courts, and event hosting. Ideal for tournaments and training.",
    stadium_2:
        "Well-known sports ground suitable for large events, practice sessions, and athletic meets.",
    stadium_3:
        "Top-rated international stadium hosting major sports events, training facilities, and athletic tracks.",
};

const STADIUM_SERVICES = [
    "Indoor Stadium",
    "Sports Ground",
    "Training Facilities",
    "Event Hosting",
    "Gym Facilities",
    "Athletic Track",
];

/* ================= COMPONENT ================= */

interface NearbyStadiumCardProps {
    job?: any;
    onViewDetails: (job: any) => void;
}

const SingleStadiumCard: React.FC<NearbyStadiumCardProps> = ({
    job,
    onViewDetails,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const getPhotos = useCallback(() => {
        const id = job?.id || "stadium_1";
        return STADIUM_IMAGES_MAP[id] || STADIUM_IMAGES_MAP["stadium_1"];
    }, [job]);

    const getName = useCallback(
        () => job?.title || "Stadium",
        [job]
    );

    const getLocation = useCallback(
        () => job?.location || "Location",
        [job]
    );

    const getDistance = useCallback(() => {
        if (job?.distance != null) {
            return `${Number(job.distance).toFixed(1)} km away`;
        }
        return "";
    }, [job]);

    const getDescription = useCallback(() => {
        const id = job?.id || "stadium_1";
        return (
            STADIUM_DESCRIPTIONS_MAP[id] ||
            "Sports stadium with professional facilities"
        );
    }, [job]);

    const getSpecialTags = useCallback(
        () => job?.jobData?.special_tags || [],
        [job]
    );

    const getPhone = useCallback(
        () => PHONE_NUMBERS_MAP[job?.id] || null,
        [job]
    );

    const photos = getPhotos();
    const currentPhoto = photos[currentImageIndex];
    const visibleServices = STADIUM_SERVICES.slice(0, 4);
    const moreServices = STADIUM_SERVICES.length - visibleServices.length;

    if (!job) return null;

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer mb-4"
        >
            {/* Image Carousel */}
            <div className="relative h-48 bg-gray-100">
                {currentPhoto && !imageError ? (
                    <>
                        <img
                            src={currentPhoto}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                            alt={getName()}
                        />

                        {photos.length > 1 && (
                            <>
                                {currentImageIndex > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex((i) => i - 1);
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                )}

                                {currentImageIndex < photos.length - 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex((i) => i + 1);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                )}

                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {currentImageIndex + 1} / {photos.length}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-6xl">
                        🏟️
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5">
                <h3 className="text-[17px] font-bold mb-1.5 line-clamp-2">
                    {getName()}
                </h3>

                <div className="flex items-center text-gray-500 mb-1">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-[13px] line-clamp-1">{getLocation()}</span>
                </div>

                {getDistance() && (
                    <p className="text-xs font-semibold text-indigo-600 mb-2">
                        {getDistance()}
                    </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {getSpecialTags().map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-600 mb-2.5 line-clamp-3">
                    {getDescription()}
                </p>

                {/* Category */}
                <div className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[11px] font-semibold px-2 py-1 rounded-xl mb-2">
                    <Trophy size={14} /> Stadium & Sports Ground
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2.5">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">
                        {job.jobData.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({job.jobData.user_ratings_total})
                    </span>

                    <span
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded ${job.jobData.opening_hours.open_now
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        <Clock size={11} />
                        {job.jobData.opening_hours.open_now ? "Open Now" : "Closed"}
                    </span>
                </div>

                {/* Services */}
                <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-500 mb-1.5">
                        FACILITIES:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {visibleServices.map((s, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-[11px] px-2 py-1 rounded"
                            >
                                <CheckCircle size={11} /> {s}
                            </span>
                        ))}
                        {moreServices > 0 && (
                            <span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded">
                                +{moreServices} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const { lat, lng } = job.jobData.geometry.location;
                            window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                                "_blank"
                            );
                        }}
                        className="flex-1 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 rounded-lg"
                    >
                        <Navigation size={14} /> Directions
                    </button>

                    <button
                        disabled={!getPhone()}
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${getPhone()}`;
                        }}
                        className={`flex-1 border-2 font-bold text-xs py-2.5 rounded-lg ${getPhone()
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-gray-300 bg-gray-100 text-gray-400"
                            }`}
                    >
                        <Phone size={14} /> Call
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ================= WRAPPER ================= */

const NearbyStadiumCard: React.FC<NearbyStadiumCardProps> = (props) => {
    if (!props.job) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {DUMMY_STADIUMS.map((s) => (
                    <SingleStadiumCard
                        key={s.place_id}
                        job={{
                            id: s.place_id,
                            title: s.name,
                            location: s.vicinity,
                            distance: s.distance,
                            jobData: s,
                        }}
                        onViewDetails={props.onViewDetails}
                    />
                ))}
            </div>
        );
    }

    return (
        <SingleStadiumCard
            job={props.job}
            onViewDetails={props.onViewDetails}
        />
    );
};

export default NearbyStadiumCard;
