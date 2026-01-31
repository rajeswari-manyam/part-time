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
} from "lucide-react";

/* ================= TYPES ================= */

export interface SportsClubService {
    place_id: string;
    name: string;
    vicinity: string;
    rating: number;
    user_ratings_total: number;
    geometry: {
        location: { lat: number; lng: number };
    };
    opening_hours: { open_now: boolean };
    special_tags: string[];
    distance: number;
}

/* ================= CONSTANTS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
    sports_1: "07947413381",
    sports_2: "07947125533",
    sports_3: "07947114382",
};

export const DUMMY_SPORTS_CLUBS: SportsClubService[] = [
    {
        place_id: "sports_1",
        name: "Skykings Football Academy",
        vicinity: "Bowenpally, Hyderabad",
        rating: 4.6,
        user_ratings_total: 964,
        geometry: { location: { lat: 17.4856, lng: 78.4592 } },
        opening_hours: { open_now: true },
        special_tags: ["Popular", "Football Training", "Verified"],
        distance: 2.2,
    },
    {
        place_id: "sports_2",
        name: "Blue Bird Taekwondo Academy",
        vicinity: "HAL Colony, Hyderabad",
        rating: 4.9,
        user_ratings_total: 198,
        geometry: { location: { lat: 17.4523, lng: 78.4712 } },
        opening_hours: { open_now: true },
        special_tags: ["Trending", "Certified Coaches"],
        distance: 1.8,
    },
    {
        place_id: "sports_3",
        name: "Kiran Badminton Arena",
        vicinity: "IDPL, Hyderabad",
        rating: 4.4,
        user_ratings_total: 134,
        geometry: { location: { lat: 17.4399, lng: 78.4983 } },
        opening_hours: { open_now: false },
        special_tags: ["Top Rated", "Indoor Courts"],
        distance: 1.0,
    },
];

const SPORTS_IMAGES_MAP: Record<string, string[]> = {
    sports_1: [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    ],
    sports_2: [
        "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800",
    ],
    sports_3: [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    ],
};

const SPORTS_DESCRIPTIONS_MAP: Record<string, string> = {
    sports_1:
        "Popular football academy with professional coaching, modern facilities, and structured training programs for all age groups.",
    sports_2:
        "Trending taekwondo academy with certified trainers, disciplined environment, and competition-level training.",
    sports_3:
        "Indoor badminton arena with premium courts, flexible timings, and coaching for beginners to professionals.",
};

const SPORTS_SERVICES = [
    "Professional Coaching",
    "Modern Facilities",
    "Group Training",
    "Personal Training",
    "Indoor Courts",
    "Tournament Support",
];

/* ================= COMPONENT ================= */

interface NearbySportsCardProps {
    job?: any;
    onViewDetails: (job: any) => void;
}

const SingleSportsCard: React.FC<NearbySportsCardProps> = ({
    job,
    onViewDetails,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const getPhotos = useCallback(() => {
        const id = job?.id || "sports_1";
        return SPORTS_IMAGES_MAP[id] || SPORTS_IMAGES_MAP["sports_1"];
    }, [job]);

    const photos = getPhotos();
    const currentPhoto = photos[currentImageIndex];

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((p) => Math.max(0, p - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((p) => Math.min(photos.length - 1, p + 1));
    };

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        const phone = PHONE_NUMBERS_MAP[job.id];
        if (!phone) return alert("Phone number not available");
        window.location.href = `tel:${phone}`;
    };

    const handleDirections = (e: React.MouseEvent) => {
        e.stopPropagation();
        const { lat, lng } = job.jobData.geometry.location;
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
            "_blank"
        );
    };

    if (!job) return null;

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-[0.99] mb-4"
        >
            {/* Image Carousel */}
            <div className="relative h-48 bg-gray-100">
                {!imageError ? (
                    <img
                        src={currentPhoto}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-6xl">
                        ⚽
                    </div>
                )}

                {photos.length > 1 && (
                    <>
                        {currentImageIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}
                        {currentImageIndex < photos.length - 1 && (
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white"
                            >
                                <ChevronRight size={18} />
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5">
                <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 line-clamp-2">
                    {job.title}
                </h3>

                <div className="flex items-center text-gray-500 mb-1 text-[13px]">
                    <MapPin size={14} className="mr-1" />
                    {job.location}
                </div>

                <p className="text-xs font-semibold text-cyan-600 mb-2">
                    {job.distance} km away
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.jobData.special_tags.map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="bg-cyan-100 text-cyan-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-600 mb-2.5 line-clamp-3">
                    {SPORTS_DESCRIPTIONS_MAP[job.id]}
                </p>

                {/* Category */}
                <div className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-[11px] font-semibold px-2 py-1 rounded-xl mb-2">
                    🏏 Sports Club
                </div>

                {/* Rating & Status */}
                <div className="flex items-center gap-2 mb-2.5">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[13px] font-semibold">
                        {job.jobData.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({job.jobData.user_ratings_total})
                    </span>

                    <span
                        className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${job.jobData.opening_hours.open_now
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
                    <p className="text-[10px] font-bold text-gray-500 mb-1">
                        SERVICES:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {SPORTS_SERVICES.slice(0, 4).map((s, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-[11px] px-2 py-1 rounded"
                            >
                                <CheckCircle size={11} />
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={handleDirections}
                        className="flex-1 flex items-center justify-center gap-1 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 text-xs font-bold py-2.5 rounded-lg"
                    >
                        <Navigation size={14} />
                        Directions
                    </button>

                    <button
                        onClick={handleCall}
                        className="flex-1 flex items-center justify-center gap-1 border-2 border-cyan-600 bg-cyan-50 text-cyan-700 text-xs font-bold py-2.5 rounded-lg"
                    >
                        <Phone size={14} />
                        Call
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ================= WRAPPER ================= */

const NearbySportsCard: React.FC<NearbySportsCardProps> = (props) => {
    if (!props.job) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {DUMMY_SPORTS_CLUBS.map((club) => (
                    <SingleSportsCard
                        key={club.place_id}
                        job={{
                            id: club.place_id,
                            title: club.name,
                            location: club.vicinity,
                            distance: club.distance,
                            jobData: club,
                        }}
                        onViewDetails={props.onViewDetails}
                    />
                ))}
            </div>
        );
    }

    return (
        <SingleSportsCard job={props.job} onViewDetails={props.onViewDetails} />
    );
};

export default NearbySportsCard;