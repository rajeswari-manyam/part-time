import React, { useState, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    Navigation,
    PartyPopper,
} from "lucide-react";

/* ================= TYPES ================= */

export interface PlayAreaService {
    place_id: string;
    name: string;
    vicinity: string;
    photos: { photo_reference: string }[];
    geometry: {
        location: { lat: number; lng: number };
    };
    special_tags: string[];
    distance: number;
}

/* ================= PHONE NUMBERS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
    playarea_1: "07942698318",
    playarea_2: "08106885233",
};

/* ================= DUMMY DATA ================= */

export const DUMMY_PLAY_AREAS: PlayAreaService[] = [
    {
        place_id: "playarea_1",
        name: "Come2Play - Kids Play Area & Party Zone",
        vicinity: "Attapur, Hyderabad",
        photos: [{ photo_reference: "1" }],
        geometry: { location: { lat: 17.385, lng: 78.44 } },
        special_tags: ["Trending", "Party Zone", "Kids Friendly"],
        distance: 1.6,
    },
    {
        place_id: "playarea_2",
        name: "BVK's Gaming Zone - Kids Soft Play",
        vicinity: "LB Nagar, Hyderabad",
        photos: [{ photo_reference: "2" }],
        geometry: { location: { lat: 17.352, lng: 78.552 } },
        special_tags: ["Gaming Zone", "Birthday Parties"],
        distance: 3.9,
    },
];

/* ================= IMAGES ================= */

const PLAYAREA_IMAGES_MAP: Record<string, string[]> = {
    playarea_1: [
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800",
        "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800",
    ],
    playarea_2: [
        "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?w=800",
        "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800",
    ],
};

/* ================= DESCRIPTIONS ================= */

const PLAYAREA_DESCRIPTIONS: Record<string, string> = {
    playarea_1:
        "Trending kids play area with party zone, soft play equipment, and safe indoor activities. Ideal for birthdays and family fun.",
    playarea_2:
        "Popular gaming and soft play zone for kids with arcade games, birthday party packages, and family-friendly environment.",
};

/* ================= COMPONENT ================= */

interface Props {
    job?: any;
    onViewDetails: (job: any) => void;
}

const SinglePlayAreaCard: React.FC<Props> = ({ job, onViewDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const photos = PLAYAREA_IMAGES_MAP[job.id] || [];
    const currentPhoto = photos[currentImageIndex];

    const handleCall = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            const phone = PHONE_NUMBERS_MAP[job.id];
            if (phone) window.location.href = `tel:${phone}`;
        },
        [job]
    );

    const handleDirections = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            const { lat, lng } = job.jobData.geometry.location;
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                "_blank"
            );
        },
        [job]
    );

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer mb-4"
        >
            {/* IMAGE */}
            <div className="relative h-48 bg-gray-100">
                {currentPhoto && !imageError ? (
                    <>
                        <img
                            src={currentPhoto}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />

                        {currentImageIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex((p) => p - 1);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}

                        {currentImageIndex < photos.length - 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex((p) => p + 1);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                            >
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-6xl">
                        🎪
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-3.5">
                <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 line-clamp-2">
                    {job.title}
                </h3>

                <div className="flex items-center text-gray-500 mb-1">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-[13px] line-clamp-1">{job.location}</span>
                </div>

                <p className="text-xs font-semibold text-pink-600 mb-2">
                    {job.distance} km away
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {job.jobData.special_tags.map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="bg-pink-100 text-pink-700 text-[10px] font-semibold px-2 py-0.5 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* DESCRIPTION */}
                <p className="text-[13px] text-gray-600 mb-3 line-clamp-3">
                    {PLAYAREA_DESCRIPTIONS[job.id]}
                </p>

                {/* CATEGORY */}
                <div className="inline-flex items-center gap-1 bg-pink-100 text-pink-600 text-[11px] font-semibold px-2 py-1 rounded-xl mb-3">
                    <PartyPopper size={14} />
                    Kids Play Area
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                    <button
                        onClick={handleDirections}
                        className="flex-1 flex items-center justify-center gap-1 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 text-xs font-bold py-2.5 rounded-lg"
                    >
                        <Navigation size={14} /> Directions
                    </button>

                    <button
                        onClick={handleCall}
                        className="flex-1 flex items-center justify-center gap-1 border-2 border-pink-600 bg-pink-50 text-pink-600 text-xs font-bold py-2.5 rounded-lg"
                    >
                        <Phone size={14} /> Call
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ================= WRAPPER ================= */

const NearbyPlayAreaCard: React.FC<Props> = ({ job, onViewDetails }) => {
    if (!job) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {DUMMY_PLAY_AREAS.map((p) => (
                    <SinglePlayAreaCard
                        key={p.place_id}
                        job={{
                            id: p.place_id,
                            title: p.name,
                            location: p.vicinity,
                            distance: p.distance,
                            jobData: {
                                geometry: p.geometry,
                                special_tags: p.special_tags,
                            },
                        }}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>
        );
    }

    return <SinglePlayAreaCard job={job} onViewDetails={onViewDetails} />;
};

export default NearbyPlayAreaCard;
