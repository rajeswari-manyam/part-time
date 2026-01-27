import React, { useState, useCallback } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Star,
  Clock,
  Stethoscope,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ================= TYPES ================= */

export interface JobType {
  id: string;
  title?: string;
  location?: string;
  description?: string;
  distance?: number;
  category?: string;
  jobData?: any;
}

interface Props {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

/* ================= PHONE MAP ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
  clinic_1: "08401254439",
  clinic_2: "09035044269",
  clinic_3: "09490130798",
  clinic_4: "08460431457",
};

/* ================= IMAGES ================= */

const CLINIC_IMAGES_MAP: Record<string, string[]> = {
  clinic_1: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800",
  ],
  clinic_2: [
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
  ],
  clinic_3: [
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800",
    "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800",
  ],
  clinic_4: [
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  ],
};

/* ================= DESCRIPTIONS ================= */

const CLINIC_DESCRIPTIONS_MAP: Record<string, string> = {
  clinic_1:
    "Chest specialist clinic with 242+ ratings. 19 Years in Healthcare. Quick response available.",
  clinic_2:
    "Homeopathy super speciality clinic. Open 24 Hours. 23 Years in Healthcare.",
  clinic_3:
    "Best breast & endocrine specialist. Highly rated with 5.0 stars.",
  clinic_4:
    "Multi-speciality clinic providing professional medical services.",
};

/* ================= SERVICES ================= */

const CLINIC_SERVICES = [
  "General Consultation",
  "Specialist Care",
  "Diagnostics",
  "Treatment Plans",
  "Lab Tests",
  "Health Checkup",
];

/* ================= COMPONENT ================= */

const NearbyClinicsCard: React.FC<Props> = ({ job, onViewDetails }) => {
  const [index, setIndex] = useState(0);

  const images = CLINIC_IMAGES_MAP[job.id] ?? [];
  const image = images[index];

  const rating = job.jobData?.rating;
  const reviews = job.jobData?.user_ratings_total;
  const openNow = job.jobData?.opening_hours?.open_now;
  const phone = PHONE_NUMBERS_MAP[job.id];

  const description =
    CLINIC_DESCRIPTIONS_MAP[job.id] ?? job.description;

  const handleDirections = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const lat = job.jobData?.geometry?.location?.lat;
      const lng = job.jobData?.geometry?.location?.lng;
      if (!lat || !lng) return;

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
      className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      {/* IMAGE CAROUSEL */}
      <div className="relative h-44 bg-gray-100">
        {image ? (
          <img src={image} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <Stethoscope size={42} className="text-gray-400" />
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

            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {index + 1}/{images.length}
            </span>
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

        {job.distance !== undefined && (
          <p className="text-sm font-semibold text-emerald-600 mt-1">
            {job.distance.toFixed(1)} km away
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {description}
        </p>

        {/* CATEGORY */}
        <div className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
          <Stethoscope size={12} />
          {job.category ?? "Clinic"}
        </div>

        {/* RATING & STATUS */}
        <div className="flex items-center gap-3 mt-3">
          {rating && (
            <div className="flex items-center text-sm font-semibold">
              <Star size={14} className="text-yellow-400 mr-1" />
              {rating.toFixed(1)}
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
              {openNow ? "Open Now" : "Closed"}
            </div>
          )}
        </div>

        {/* SERVICES */}
        <div className="mt-4">
          <p className="text-[11px] font-bold text-gray-500 mb-2">SERVICES</p>
          <div className="flex flex-wrap gap-2">
            {CLINIC_SERVICES.slice(0, 4).map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs"
              >
                <CheckCircle size={12} /> {s}
              </span>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDirections}
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

export default NearbyClinicsCard;
