import React, { useState } from "react";
import {
    MapPin,
    Phone,
    Navigation,
    Star,
    Clock,
    ChevronLeft,
    ChevronRight,
    Recycle,
    CheckCircle,
} from "lucide-react";

/* ================= TYPES ================= */

interface ScrapDealer {
    id: string;
    title: string;
    description?: string;
    location?: string;
    distance?: number | string;
    category?: string;
    jobData?: {
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        special_tags?: string[];
        verified?: boolean;
        trending?: boolean;
    };
}

interface NearbyScrapDealerCardProps {
    job?: ScrapDealer;
    onViewDetails: (job: ScrapDealer) => void;
}

/* ================= MOCK DATA ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
    scrap_1: "07487048982",
    scrap_2: "08197398429",
    scrap_3: "07022618864",
    scrap_4: "08511065184",
    scrap_5: "09035504120",
};

const SCRAP_IMAGES_MAP: Record<string, string[]> = {
    scrap_1: [
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
        "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
    ],
    scrap_2: [
        "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
        "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800",
    ],
    scrap_3: [
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    ],
    scrap_4: [
        "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
    ],
    scrap_5: [
        "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800",
    ],
};

const SCRAP_SERVICES = [
    "Battery Scrap",
    "Metal Scrap",
    "E-Waste",
    "Quick Pickup",
    "Paper Scrap",
    "Plastic Scrap",
];

// ✅ COMPLETE DUMMY DATA
export const DUMMY_SCRAP_DEALERS: ScrapDealer[] = [
    {
        id: "scrap_1",
        title: "RK Scrap Dealers",
        location: "Kukatpally, Hyderabad",
        description: "Professional scrap collection & recycling services. We deal in all types of scrap including metal, battery, and e-waste.",
        distance: 5.2,
        category: "Scrap Dealer",
        jobData: {
            rating: 4.5,
            user_ratings_total: 89,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 17.4485, lng: 78.3908 } },
            special_tags: ["Verified", "Quick Pickup"],
            verified: true,
            trending: false,
        },
    },
    {
        id: "scrap_2",
        title: "Sri Sai Scrap Buyers",
        location: "Miyapur, Hyderabad",
        description: "Reliable scrap buyers offering competitive prices for metal scrap, battery scrap, and e-waste collection.",
        distance: 7.8,
        category: "Scrap Dealer",
        jobData: {
            rating: 4.3,
            user_ratings_total: 45,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 17.495, lng: 78.358 } },
            special_tags: ["Best Prices", "Same Day Pickup"],
            verified: false,
            trending: true,
        },
    },
    {
        id: "scrap_3",
        title: "Green Recycling Center",
        location: "ECIL, Hyderabad",
        description: "Eco-friendly recycling center specializing in e-waste and battery scrap. Certified and verified service provider.",
        distance: 12.4,
        category: "Scrap Dealer",
        jobData: {
            rating: 4.7,
            user_ratings_total: 156,
            opening_hours: { open_now: false },
            geometry: { location: { lat: 17.485, lng: 78.487 } },
            special_tags: ["Eco-Friendly", "Certified"],
            verified: true,
            trending: true,
        },
    },
];

/* ================= SINGLE CARD ================= */

const SingleScrapDealerCard: React.FC<{
    job: ScrapDealer;
    onViewDetails: (job: ScrapDealer) => void;
}> = ({ job, onViewDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgError, setImgError] = useState(false);

    const photos = SCRAP_IMAGES_MAP[job.id] || [];
    const currentPhoto = photos[currentImageIndex];

    const rating = job.jobData?.rating;
    const totalRatings = job.jobData?.user_ratings_total;
    const isOpen = job.jobData?.opening_hours?.open_now;

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        const phone = PHONE_NUMBERS_MAP[job.id];
        if (phone) window.location.href = `tel:${phone}`;
        else alert("Phone number not available");
    };

    const handleDirections = (e: React.MouseEvent) => {
        e.stopPropagation();
        const loc = job.jobData?.geometry?.location;
        if (loc) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,
                "_blank"
            );
        }
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer h-full flex flex-col"
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
                {currentPhoto && !imgError ? (
                    <>
                        <img
                            src={currentPhoto}
                            alt={job.title}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                        {photos.length > 1 && (
                            <>
                                {currentImageIndex > 0 && (
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                )}
                                {currentImageIndex < photos.length - 1 && (
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-6xl">
                        ♻️
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                    {job.title}
                </h2>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{job.location}</span>
                </div>

                {job.distance && (
                    <p className="text-xs font-semibold text-green-600">
                        {typeof job.distance === 'number' ? job.distance.toFixed(1) : job.distance} km away
                    </p>
                )}

                <p className="text-sm text-gray-600 line-clamp-3 mb-auto">
                    {job.description || "Professional scrap collection & recycling"}
                </p>

                {/* Rating & Status */}
                <div className="flex items-center gap-3 text-sm pt-2">
                    {rating && (
                        <div className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{rating.toFixed(1)}</span>
                            {totalRatings && (
                                <span className="text-gray-500">({totalRatings})</span>
                            )}
                        </div>
                    )}
                    {isOpen !== undefined && (
                        <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${isOpen
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                        >
                            <Clock size={11} />
                            <span>{isOpen ? "Open Now" : "Closed"}</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {job.jobData?.special_tags && job.jobData.special_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {job.jobData.special_tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Category Badge */}
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-xl w-fit">
                    <Recycle size={12} />
                    <span>Scrap Dealer</span>
                </div>

                {/* Services */}
                <div className="pt-2">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Services
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {SCRAP_SERVICES.slice(0, 4).map((service, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
                            >
                                <CheckCircle size={11} />
                                {service}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4 mt-auto">
                    <button
                        onClick={handleDirections}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 bg-indigo-50 text-indigo-700 border-2 border-indigo-600 rounded-lg hover:bg-indigo-100 font-semibold text-xs"
                    >
                        <Navigation size={14} />
                        Directions
                    </button>
                    <button
                        onClick={handleCall}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 bg-green-50 text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-100 font-semibold text-xs"
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

const NearbyScrapDealerCard: React.FC<NearbyScrapDealerCardProps> = (props) => {
    if (!props.job) {
        // ✅ FIXED: Now renders the dummy data properly
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {DUMMY_SCRAP_DEALERS.map((dealer) => (
                    <SingleScrapDealerCard
                        key={dealer.id}
                        job={dealer}
                        onViewDetails={props.onViewDetails}
                    />
                ))}
            </div>
        );
    }

    return (
        <SingleScrapDealerCard
            job={props.job}
            onViewDetails={props.onViewDetails}
        />
    );
};

export default NearbyScrapDealerCard;