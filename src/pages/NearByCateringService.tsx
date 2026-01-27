// src/pages/NearByCateringService.tsx
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
    catering_1: "09123456789",
    catering_2: "09876543210",
    catering_3: "09777888999",
};

const CATERING_IMAGES: Record<string, string[]> = {
    catering_1: [
        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800",
        "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800",
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
    ],
    catering_2: [
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
        "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    ],
    catering_3: [
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800",
    ],
};

const SERVICES = ["Wedding Catering", "Corporate Events", "Custom Menus"];

const CATERING_DESCRIPTIONS_MAP: Record<string, string> = {
    catering_1: "Wedding & Event Catering specialist. North & South Indian Specialties with custom menu options.",
    catering_2: "Corporate & Private Event Catering with multi-cuisine offerings. Premium service guaranteed.",
    catering_3: "Budget-friendly catering for all occasions. Traditional and modern fusion menus available.",
};

/* ================= DUMMY DATA ================= */

const DUMMY_CATERINGS: JobType[] = [
    {
        id: "catering_1",
        title: "Delicious Catering Co.",
        location: "Banjara Hills, Hyderabad",
        category: "Catering Service",
        description: CATERING_DESCRIPTIONS_MAP["catering_1"],
        distance: 1.5,
        jobData: {
            status: true,
            pincode: "500034",
            icon: "🍽️",
            rating: 4.7,
            user_ratings_total: 134,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 17.4196, lng: 78.4123 } }
        }
    },
    {
        id: "catering_2",
        title: "Royal Event Caterers",
        location: "Gachibowli, Hyderabad",
        category: "Catering Service",
        description: CATERING_DESCRIPTIONS_MAP["catering_2"],
        distance: 3.2,
        jobData: {
            status: true,
            pincode: "500032",
            icon: "🍽️",
            rating: 4.5,
            user_ratings_total: 98,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 17.4476, lng: 78.3910 } }
        }
    },
    {
        id: "catering_3",
        title: "Grand Feast Caterers",
        location: "Kondapur, Hyderabad",
        category: "Catering Service",
        description: CATERING_DESCRIPTIONS_MAP["catering_3"],
        distance: 4.8,
        jobData: {
            status: true,
            pincode: "500084",
            icon: "🍽️",
            rating: 4.8,
            user_ratings_total: 215,
            opening_hours: { open_now: false },
            geometry: { location: { lat: 17.4647, lng: 78.3636 } }
        }
    }
];

/* ================= COMPONENT ================= */

const SingleCateringCard: React.FC<{ job: JobType; onViewDetails: (job: JobType) => void }> = ({ job, onViewDetails }) => {
    const [index, setIndex] = useState(0);
    const photos = useMemo(() => CATERING_IMAGES[job.id] || CATERING_IMAGES.catering_1, [job.id]);

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
        CATERING_DESCRIPTIONS_MAP[job.id] || job.description || "";

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
                    <Utensils size={12} />{job.category || "Catering Service"}
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

const NearbyCateringService: React.FC<{ job?: JobType; onViewDetails: (job: JobType) => void }> = ({ job, onViewDetails }) => {
    if (!job) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{DUMMY_CATERINGS.map(item => <SingleCateringCard key={item.id} job={item} onViewDetails={onViewDetails} />)}</div>;
    }
    return <SingleCateringCard job={job} onViewDetails={onViewDetails} />;
};

export default NearbyCateringService;