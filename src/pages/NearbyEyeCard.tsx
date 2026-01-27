// src/components/NearbyEyeCard.tsx
import React, { useState } from "react";
import { IoLocationSharp, IoStar, IoCallOutline, IoNavigateOutline } from "react-icons/io5";

export interface JobType {
    id: string;
    title: string;
    location?: string;
    description?: string;
    distance?: number;
    jobData?: any;
}

interface NearbyEyeCardProps {
    job: JobType;
    onViewDetails: (job: JobType) => void;
}

const PHONE_NUMBERS_MAP: { [key: string]: string } = {
    eye_1: "09972409886",
    eye_2: "08792483381",
    eye_3: "07383517318",
    eye_4: "07947152974",
};

const EYE_IMAGES_MAP: { [key: string]: string[] } = {
    eye_1: [
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
        "https://images.unsplash.com/photo-1632053002-45dc0e58d4be?w=800",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    ],
    eye_2: [
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
        "https://images.unsplash.com/photo-1632053002-45dc0e58d4be?w=800",
    ],
    eye_3: [
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
        "https://images.unsplash.com/photo-1632053002-45dc0e58d4be?w=800",
    ],
    eye_4: [
        "https://images.unsplash.com/photo-1632053002-45dc0e58d4be?w=800",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    ],
};

const EYE_DESCRIPTIONS_MAP: { [key: string]: string } = {
    eye_1: "Safe Vision Super Speciality Eye Hospital - 4.9★ rating with 213 reviews. Open 24 Hours. 1 Year in Healthcare.",
    eye_2: "Vasan Eye Care Hospital - 4.5★ rating with 2,533 reviews. Open 24 Hours. 16 Years in Healthcare.",
    eye_3: "Chaitanya Eye Hospital - 4.5★ rating with 1,286 reviews. Open 24 Hours. Professional eye care services.",
    eye_4: "Mamtha Eye Hospital - 4.1★ rating with 27 reviews. Open 24 Hours. Quality eye care services.",
};

const EYE_SERVICES = [
    "Vision Correction",
    "Cataract Surgery",
    "LASIK",
    "Glaucoma Treatment",
    "Retina Care",
    "Pediatric Eye Care",
    "Contact Lenses",
    "Eye Checkup",
];

const NearbyEyeCard: React.FC<NearbyEyeCardProps> = ({ job, onViewDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const photos = EYE_IMAGES_MAP[job.id] || [];
    const currentPhoto = photos[currentImageIndex] || "";

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImageIndex < photos.length - 1) setCurrentImageIndex((prev) => prev + 1);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImageIndex > 0) setCurrentImageIndex((prev) => prev - 1);
    };

    const getDistance = () => (job.distance ? `${job.distance.toFixed(1)} km away` : "");
    const getDescription = () => EYE_DESCRIPTIONS_MAP[job.id] || job.description || "Professional eye care services";
    const getPhoneNumber = () => PHONE_NUMBERS_MAP[job.id] || null;

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        const phone = getPhoneNumber();
        if (!phone) return alert("Phone number not available");
        window.open(`tel:${phone}`);
    };

    const handleDirections = (e: React.MouseEvent) => {
        e.stopPropagation();
        const lat = job.jobData?.geometry?.location?.lat;
        const lng = job.jobData?.geometry?.location?.lng;
        if (!lat || !lng) return alert("Location not available");
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[0.98] transition-transform"
            onClick={() => onViewDetails(job)}
        >
            {/* Image Carousel */}
            <div className="relative w-full h-48">
                {currentPhoto ? (
                    <img src={currentPhoto} alt={job.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <IoLocationSharp className="text-gray-400 text-4xl" />
                    </div>
                )}
                {photos.length > 1 && (
                    <>
                        {currentImageIndex > 0 && (
                            <button
                                onClick={handlePrevImage}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                            >
                                ◀
                            </button>
                        )}
                        {currentImageIndex < photos.length - 1 && (
                            <button
                                onClick={handleNextImage}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                            >
                                ▶
                            </button>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {currentImageIndex + 1}/{photos.length}
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                <div className="flex items-center text-gray-500 text-sm gap-1">
                    <IoLocationSharp />
                    <span>{job.location || "Location"}</span>
                </div>
                {getDistance() && <p className="text-green-600 text-sm font-semibold">{getDistance()}</p>}
                <p className="text-gray-600 text-sm line-clamp-3">{getDescription()}</p>

                {/* Services */}
                <div>
                    <span className="text-xs font-semibold text-gray-500">SERVICES:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {EYE_SERVICES.slice(0, 4).map((s) => (
                            <span key={s} className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                                <IoStar size={12} />
                                {s}
                            </span>
                        ))}
                        {EYE_SERVICES.length > 4 && <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">+{EYE_SERVICES.length - 4} more</span>}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleDirections}
                        className="flex-1 flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-600 text-indigo-600 text-xs font-bold py-2 rounded"
                    >
                        <IoNavigateOutline />
                        Directions
                    </button>
                    <button
                        onClick={handleCall}
                        disabled={!getPhoneNumber()}
                        className={`flex-1 flex items-center justify-center gap-1 border py-2 text-xs font-bold rounded ${getPhoneNumber()
                                ? "bg-green-100 border-green-600 text-green-600"
                                : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <IoCallOutline />
                        Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NearbyEyeCard;
