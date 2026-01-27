import React, { useState, useCallback } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Star,
  Clock,
  Droplet,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface JobType {
  id: string;
  title?: string;
  location?: string;
  description?: string;
  distance?: number;
  jobData?: any;
}

interface Props {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

/* ---------------- PHONE NUMBERS ---------------- */

const PHONE_NUMBERS_MAP: Record<string, string> = {
  bloodbank_1: "07947120745",
  bloodbank_2: "07947113294",
  bloodbank_3: "07947151074",
  bloodbank_4: "07947429981",
  bloodbank_5: "08008919191",
};

/* ---------------- IMAGES ---------------- */

const BLOODBANK_IMAGES_MAP: Record<string, string[]> = {
  bloodbank_1: [
    "https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=800",
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800",
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800",
  ],
};

/* ---------------- DESCRIPTIONS ---------------- */

const BLOODBANK_DESCRIPTIONS_MAP: Record<string, string> = {
  bloodbank_1:
    "Top Search blood bank with 4.5★ rating. Available 24 hours. Reliable blood storage and emergency supply.",
};

/* ---------------- SERVICES ---------------- */

const BLOODBANK_SERVICES = [
  "Blood Donation",
  "Blood Storage",
  "Emergency Supply",
  "24/7 Service",
  "All Blood Groups",
  "Blood Testing",
];

const NearbyBloodBankCard: React.FC<Props> = ({ job, onViewDetails }) => {
  const [index, setIndex] = useState(0);

  const images = BLOODBANK_IMAGES_MAP[job.id] ?? [];
  const image = images[index];

  const rating = job.jobData?.rating;
  const reviews = job.jobData?.user_ratings_total;
  const openNow = job.jobData?.opening_hours?.open_now;

  const phone = PHONE_NUMBERS_MAP[job.id];

  const handleDirections = () => {
    const lat = job.jobData?.geometry?.location?.lat;
    const lng = job.jobData?.geometry?.location?.lng;
    if (!lat || !lng) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative h-44">
        {image ? (
          <img src={image} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-200">
            <Droplet className="text-gray-400" size={42} />
          </div>
        )}

        {images.length > 1 && (
          <>
            {index > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(index - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
              >
                <ChevronLeft className="text-white" size={18} />
              </button>
            )}
            {index < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(index + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
              >
                <ChevronRight className="text-white" size={18} />
              </button>
            )}
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin size={14} className="mr-1" />
          {job.location}
        </div>

        {job.distance && (
          <p className="text-sm font-semibold text-emerald-600 mt-1">
            {job.distance.toFixed(1)} km away
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {BLOODBANK_DESCRIPTIONS_MAP[job.id] ?? job.description}
        </p>

        {/* BADGE */}
        <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
          <Droplet size={12} /> Blood Bank
        </div>

        {/* RATING */}
        <div className="flex items-center gap-3 mt-3">
          {rating && (
            <div className="flex items-center text-sm font-semibold">
              <Star size={14} className="text-yellow-400 mr-1" />
              {rating}{" "}
              {reviews && (
                <span className="text-gray-500 ml-1">({reviews})</span>
              )}
            </div>
          )}

          {openNow !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                openNow
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Clock size={12} />
              {openNow ? "Open 24 Hours" : "Closed"}
            </div>
          )}
        </div>

        {/* SERVICES */}
        <div className="mt-4">
          <p className="text-[11px] font-bold text-gray-500 mb-2">SERVICES</p>
          <div className="flex flex-wrap gap-2">
            {BLOODBANK_SERVICES.slice(0, 4).map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded text-xs"
              >
                <CheckCircle size={12} /> {s}
              </span>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDirections();
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded border border-indigo-500 bg-indigo-50 text-indigo-600 text-sm font-bold"
          >
            <Navigation size={14} /> Directions
          </button>

          <a
            href={phone ? `tel:${phone}` : undefined}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded border text-sm font-bold ${
              phone
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Phone size={14} /> Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default NearbyBloodBankCard;
