import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Phone,
  Navigation,
  Clock,
  CheckCircle,
  Stethoscope,
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

/* -------------------------------------------------------------------------- */
/*                               MOCKED DATA                                  */
/* -------------------------------------------------------------------------- */

const PHONE_NUMBERS_MAP: Record<string, string> = {
  dental_1: "07041831601",
  dental_2: "08460255807",
  dental_3: "08401307410",
  dental_4: "07997896777",
};

const DENTAL_IMAGES_MAP: Record<string, string[]> = {
  dental_1: [
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800",
  ],
  dental_2: [
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800",
    "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800",
  ],
};

const DENTAL_DESCRIPTIONS_MAP: Record<string, string> = {
  dental_1:
    "Verified dental clinic with 5.0★ rating. 18 years in healthcare with comprehensive dental services.",
  dental_2:
    "Sky Dental – 5.0★ rated trending clinic. Multiple specialists with modern equipment.",
};

const DENTAL_SERVICES = [
  "General Checkup",
  "Teeth Cleaning",
  "Root Canal",
  "Dental Implants",
  "Teeth Whitening",
  "Braces",
];

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

const NearbyDentalCard: React.FC<Props> = ({ job, onViewDetails }) => {
  const [index, setIndex] = useState(0);

  const photos = DENTAL_IMAGES_MAP[job.id] || [];
  const phone = PHONE_NUMBERS_MAP[job.id];
  const rating = job.jobData?.rating;
  const reviews = job.jobData?.user_ratings_total;
  const isOpen = job.jobData?.opening_hours?.open_now;

  const next = useCallback(() => {
    if (index < photos.length - 1) setIndex((p) => p + 1);
  }, [index, photos.length]);

  const prev = useCallback(() => {
    if (index > 0) setIndex((p) => p - 1);
  }, [index]);

  const openMaps = () => {
    const { lat, lng } = job.jobData?.geometry?.location || {};
    if (!lat || !lng) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  const callClinic = () => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* IMAGE CAROUSEL */}
      <div className="relative h-48 bg-gray-100">
        {photos.length > 0 ? (
          <img
            src={photos[index]}
            alt={job.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Stethoscope size={40} />
          </div>
        )}

        {index > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
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
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {photos.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {index + 1}/{photos.length}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-900">
          {job.title || "Dental Clinic"}
        </h3>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-1" />
          {job.location || "Vijayawada"}
        </div>

        {job.distance && (
          <p className="text-sm font-semibold text-emerald-600">
            {job.distance.toFixed(1)} km away
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-3">
          {DENTAL_DESCRIPTIONS_MAP[job.id] ||
            job.description ||
            "Professional dental services"}
        </p>

        {/* BADGES */}
        <div className="flex items-center gap-3">
          {rating && (
            <div className="flex items-center text-sm font-semibold">
              <Star size={14} className="text-yellow-400 mr-1" />
              {rating.toFixed(1)}
              {reviews && (
                <span className="ml-1 text-gray-500">({reviews})</span>
              )}
            </div>
          )}

          {isOpen !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                isOpen
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Clock size={12} />
              {isOpen ? "Open Now" : "Closed"}
            </div>
          )}
        </div>

        {/* SERVICES */}
        <div>
          <p className="text-[11px] font-bold text-gray-500 mb-1">
            SERVICES:
          </p>
          <div className="flex flex-wrap gap-2">
            {DENTAL_SERVICES.slice(0, 4).map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded"
              >
                <CheckCircle size={12} />
                {s}
              </span>
            ))}
            {DENTAL_SERVICES.length > 4 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                +{DENTAL_SERVICES.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openMaps();
            }}
            className="flex-1 flex items-center justify-center gap-1 border-2 border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50"
          >
            <Navigation size={14} />
            Directions
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              callClinic();
            }}
            disabled={!phone}
            className={`flex-1 flex items-center justify-center gap-1 border-2 py-2 rounded-lg font-semibold text-sm ${
              phone
                ? "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
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

export default NearbyDentalCard;
