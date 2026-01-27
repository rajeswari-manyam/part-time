import React, { useState } from "react";
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

export interface JobType {
  id: string;
  title: string;
  location?: string;
  description?: string;
  distance?: number;
  jobData?: any;
}

/* ================= CONSTANTS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
  ambulance_1: "09035504120",
  ambulance_2: "08511405104",
  ambulance_3: "09054083279",
  ambulance_4: "08971370172",
  ambulance_5: "108",
};

const AMBULANCE_IMAGES_MAP: Record<string, string[]> = {
  ambulance_1: [
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800",
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800",
    "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800",
  ],
  ambulance_2: [
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800",
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800",
  ],
  ambulance_3: [
    "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800",
  ],
  ambulance_4: [
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800",
  ],
  ambulance_5: [
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800",
  ],
};

const SERVICES = [
  "Emergency Transport",
  "ICU Ambulance",
  "Oxygen Support",
  "Cardiac Care",
  "24/7 Availability",
  "Trained Paramedics",
];

/* ================= COMPONENT ================= */

interface Props {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

const NearbyAmbulanceCard: React.FC<Props> = ({ job, onViewDetails }) => {
  const images = AMBULANCE_IMAGES_MAP[job.id] || [];
  const [index, setIndex] = useState(0);

  const phone = PHONE_NUMBERS_MAP[job.id];
  const rating = job.jobData?.rating;
  const reviews = job.jobData?.user_ratings_total;
  const openNow = job.jobData?.opening_hours?.open_now;
  const lat = job.jobData?.geometry?.location?.lat;
  const lng = job.jobData?.geometry?.location?.lng;

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* IMAGE CAROUSEL */}
      <div className="relative h-44">
        {images.length > 0 ? (
          <img
            src={images[index]}
            className="w-full h-full object-cover"
            alt={job.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            🚑
          </div>
        )}

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

        {index < images.length - 1 && (
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

        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            {index + 1}/{images.length}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin size={14} className="mr-1" />
          {job.location}
        </div>

        {job.distance && (
          <p className="text-sm font-semibold text-red-600 mt-1">
            {job.distance.toFixed(1)} km away
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {job.description}
        </p>

        {/* RATING & STATUS */}
        <div className="flex items-center gap-4 mt-3">
          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-yellow-400" />
              <span className="font-semibold">{rating}</span>
              <span className="text-gray-500">({reviews})</span>
            </div>
          )}

          {openNow !== undefined && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                openNow
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Clock size={12} />
              {openNow ? "Available 24/7" : "Unavailable"}
            </span>
          )}
        </div>

        {/* SERVICES */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SERVICES.slice(0, 4).map((s) => (
            <span
              key={s}
              className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
            >
              <CheckCircle size={12} />
              {s}
            </span>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (lat && lng)
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                  "_blank"
                );
            }}
            className="flex-1 flex items-center justify-center gap-1 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold text-sm py-2 rounded"
          >
            <Navigation size={14} />
            Directions
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (phone) window.location.href = `tel:${phone}`;
            }}
            disabled={!phone}
            className={`flex-1 flex items-center justify-center gap-1 border-2 font-semibold text-sm py-2 rounded ${
              phone
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-gray-300 bg-gray-100 text-gray-400"
            }`}
          >
            <Phone size={14} />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyAmbulanceCard;
