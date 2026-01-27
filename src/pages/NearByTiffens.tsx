// src/pages/NearByTiffens.tsx
import React, { useState, useMemo } from "react";
import {
    MapPin,
    Phone,
    Navigation,
    ChevronLeft,
    ChevronRight,
    Star,
    Clock,
    Utensils,
    CheckCircle
} from "lucide-react";
import type { JobType } from "./FoodService";

/* ================= CONSTANTS ================= */

const PHONE_MAP: Record<string, string> = {
    tiffin_1: "09123456789",
    tiffin_2: "09876543210",
    tiffin_3: "09555444333",
};

const TIFFEN_IMAGES: Record<string, string[]> = {
    tiffin_1: [
        "https://images.unsplash.com/photo-1604908815108-fdbd32b5cab5?w=800",
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    ],
    tiffin_2: [
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800",
        "https://images.unsplash.com/photo-1601050690117-f4fca0f5c16d?w=800",
        "https://images.unsplash.com/photo-1623428187425-5d7a024b0d97?w=800",
    ],
    tiffin_3: [
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800",
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800",
    ],
};

const SERVICES = ["Daily Tiffin", "Home Delivery", "Custom Meals"];

const TIFFIN_DESCRIPTIONS_MAP: Record<string, string> = {
    tiffin_1: "Fresh, hygienic meals delivered daily with traditional home-cooked taste.",
    tiffin_2: "Nutritious meals with diet-conscious options for health enthusiasts.",
    tiffin_3: "Authentic regional cuisine delivered hot to your doorstep.",
};

/* ================= DUMMY DATA ================= */

const DUMMY_TIFFINS: JobType[] = [
    {
        id: "tiffin_1",
        title: "HomeMade Tiffin Service",
        location: "Kukatpally, Hyderabad",
        category: "Tiffin Service",
        description: TIFFIN_DESCRIPTIONS_MAP["tiffin_1"],
        distance: 0.5,
        jobData: {
            status: true,
            pincode: "500072",
            icon: "🍱",
            rating: 4.6,
            user_ratings_total: 892,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 17.4946, lng: 78.3996 } }
        }
    },
    {
        id: "tiffin_2",
        title: "Healthy Bites Tiffin",
        location: "Madhapur, Hyderabad",
        category: "Tiffin Service",
        description: TIFFIN_DESCRIPTIONS_MAP["tiffin_2"],
        distance: 1.2,
        jobData: {
            status: true,
            pincode: "500081",
            icon: "🍱",
            rating: 4.7,
            user_ratings_total: 450,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 17.4485, lng: 78.3908 } }
        }
    },
    {
        id: "tiffin_3",
        title: "Spice Route Tiffin",
        location: "HITEC City, Hyderabad",
        category: "Tiffin Service",
        description: TIFFIN_DESCRIPTIONS_MAP["tiffin_3"],
        distance: 2.0,
        jobData: {
            status: true,
            pincode: "500081",
            icon: "🍱",
            rating: 4.5,
            user_ratings_total: 320,
            opening_hours: { open_now: false },
            geometry: { location: { lat: 17.4435, lng: 78.3772 } }
        }
    }
];

/* ================= COMPONENT ================= */

const SingleTiffinCard: React.FC<{ job: JobType; onViewDetails: (job: JobType) => void }> = ({ job, onViewDetails }) => {
    const [index, setIndex] = useState(0);
    const photos = useMemo(() => TIFFEN_IMAGES[job.id] || TIFFEN_IMAGES.tiffin_1, [job.id]);

    const rating = job.jobData?.rating;
    const reviews = job.jobData?.user_ratings_total;
    const isOpen = job.jobData?.opening_hours?.open_now;
    const phone = PHONE_MAP[job.id];
    const lat = job.jobData?.geometry?.location?.lat;
    const lng = job.jobData?.geometry?.location?.lng;

    const distance =
        typeof job.distance === "number"
            ? `${job.distance.toFixed(1)} km away`
            : job.distance;

    const description =
        TIFFIN_DESCRIPTIONS_MAP[job.id] || job.description || "";

    const openMaps = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!lat || !lng) return;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    };

    const callNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!phone) return;
        window.location.href = `tel:${phone}`;
    };

    return (
        <div onClick={() => onViewDetails(job)} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer h-full flex flex-col">
            {/* Image */}
            <div className="relative h-48 shrink-0">
                <img src={photos[index]} className="w-full h-full object-cover" alt={job.title} />
                {index > 0 && <button onClick={e => { e.stopPropagation(); setIndex(index - 1); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"><ChevronLeft size={18} /></button>}
                {index < photos.length - 1 && <button onClick={e => { e.stopPropagation(); setIndex(index + 1); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"><ChevronRight size={18} /></button>}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{index + 1}/{photos.length}</span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                <div className="flex items-center text-sm text-gray-500"><MapPin size={14} className="mr-1" />{job.location}</div>

                {distance && (
                    <p className="text-green-600 text-sm font-semibold">{distance}</p>
                )}

                <p className="text-sm text-gray-600 line-clamp-3 mb-auto">{description}</p>

                {/* Category */}
                <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-1 rounded mt-2">
                    <Utensils size={12} />{job.category || "Tiffin Service"}
                </div>

                {/* Rating + Status */}
                <div className="flex items-center gap-3 text-sm pt-2">
                    {rating && <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /><span className="font-semibold">{rating.toFixed(1)}</span>{reviews && <span className="text-gray-500">({reviews})</span>}</div>}
                    {isOpen !== undefined && <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}><Clock size={12} />{isOpen ? "Open" : "Closed"}</span>}
                </div>

                {/* Services */}
                <div className="pt-2">
                    <p className="text-xs font-bold text-gray-500 mb-1">SERVICES:</p>
                    <div className="flex flex-wrap gap-2">{SERVICES.map(s => <span key={s} className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded"><CheckCircle size={12} />{s}</span>)}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 mt-auto">
                    <button onClick={openMaps} className="flex-1 border-2 border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 flex justify-center gap-2"><Navigation size={16} />Directions</button>
                    <button onClick={callNow} disabled={!phone} className={`flex-1 py-2 rounded-lg font-semibold flex justify-center items-center gap-2 ${phone ? "bg-green-100 text-green-700 border-2 border-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}><Phone size={16} />Call</button>
                </div>
            </div>
        </div>
    );
};

const NearbyTiffinServiceCard: React.FC<{ job?: JobType; onViewDetails: (job: JobType) => void }> = ({ job, onViewDetails }) => {
    if (!job) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{DUMMY_TIFFINS.map(item => <SingleTiffinCard key={item.id} job={item} onViewDetails={onViewDetails} />)}</div>;
    }
    return <SingleTiffinCard job={job} onViewDetails={onViewDetails} />;
};

export default NearbyTiffinServiceCard;