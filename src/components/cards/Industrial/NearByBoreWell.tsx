// BorewellServiceCard modified to match Ambulance card structure & UX
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
    special_tags: string[];
    distance: number;
    opening_hours?: { open_now: boolean };
};

/* ================= CONSTANTS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
    service_1: "07411595083",
    service_2: "07411095445",
    service_3: "08460556659",
    service_4: "08487037047",
    service_5: "09876543210",
};

export const DUMMY_BOREWELL_SERVICES: BorewellService[] = [
    {
        place_id: "service_1",
        name: "Aps Borewells",
        vicinity: "Kushaiguda ECIL, Hyderabad",
        rating: 5.0,
        user_ratings_total: 1,
        photos: [{ photo_reference: "1" }],
        geometry: { location: { lat: 17.385, lng: 78.4867 } },
        business_status: "OPERATIONAL",
        special_tags: ["Trending", "Borewell Drilling"],
        distance: 11.7,
        opening_hours: { open_now: true },
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
        special_tags: ["Verified", "Quick Response"],
        distance: 10.5,
        opening_hours: { open_now: true },
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
};

const SERVICES = [
    "Borewell Drilling",
    "Pump Installation",
    "Cleaning",
    "Maintenance",
    "Water Testing",
];

/* ================= COMPONENT ================= */

interface Props {
    job?: any;
    onViewDetails: (job: any) => void;
}

const SingleBorewellCard: React.FC<Props> = ({ job, onViewDetails }) => {
    const [index, setIndex] = useState(0);
    const [imgError, setImgError] = useState(false);

    const getPhotos = useCallback(() => {
        if (!job) return [];
        return IMAGES_MAP[job.id] || IMAGES_MAP.service_1;
    }, [job]);

    const photos = getPhotos();
    const currentPhoto = photos[index];

    const getPhone = useCallback(() => PHONE_NUMBERS_MAP[job?.id], [job]);

    const handleCall = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            const phone = getPhone();
            if (!phone) return alert("Phone not available");
            window.location.href = `tel:${phone}`;
        },
        [getPhone]
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

    const openingStatus = job.jobData.opening_hours?.open_now
        ? "Available Today"
        : "Currently Closed";

    if (!job) return null;

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
                {currentPhoto && !imgError ? (
                    <>
                        <img
                            src={currentPhoto}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                        {photos.length > 1 && (
                            <>
                                {index > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIndex(index - 1);
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-5xl">🚜</div>
                )}
            </div>

            {/* Content */}
            <div className="p-3.5">
                <h3 className="text-[17px] font-bold mb-1 line-clamp-2">{job.title}</h3>

                <div className="flex items-center text-gray-500 mb-1">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-[13px] line-clamp-1">{job.location}</span>
                </div>

                <p className="text-xs font-semibold text-cyan-600 mb-2">
                    {job.distance.toFixed(1)} km away
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

                {/* Rating + Status */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{job.jobData.rating}</span>
                        <span className="text-xs text-gray-500">
                            ({job.jobData.user_ratings_total})
                        </span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-semibold px-1.5 py-0.5 rounded">
                        <Clock size={11} />
                        <span>{openingStatus}</span>
                    </div>
                </div>

                {/* Category */}
                <div className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 text-[11px] font-semibold px-2 py-1 rounded-xl mb-2">
                    <Drill size={12} />
                    <span>Borewell Service</span>
                </div>

                {/* Services */}
                <div className="mb-3">
                    <p className="text-[10px] font-bold text-gray-500 mb-1">SERVICES:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {SERVICES.slice(0, 4).map((s, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-[11px] px-2 py-1 rounded"
                            >
                                <CheckCircle size={11} /> {s}
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
                        <Navigation size={14} /> Directions
                    </button>
                    <button
                        onClick={handleCall}
                        className="flex-1 flex items-center justify-center gap-1 border-2 border-cyan-600 bg-cyan-50 text-cyan-700 text-xs font-bold py-2.5 rounded-lg"
                    >
                        <Phone size={14} /> Call
                    </button>
                </div>
            </div>
        </div>
    );
};

const BorewellServiceCard: React.FC<Props> = (props) => {
    if (!props.job) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {DUMMY_BOREWELL_SERVICES.map((s) => (
                    <SingleBorewellCard
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
    return <SingleBorewellCard job={props.job} onViewDetails={props.onViewDetails} />;
};

export default BorewellServiceCard;