import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Star,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

export interface JobType {
  id: string;
  title?: string;
  location?: string;
  description?: string;
  distance?: number;
  jobData?: {
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: {
      open_now?: boolean;
    };
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
  };
}

interface NearbyDermatologistsCardProps {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

/* -------------------------------------------------------------------------- */
/* Static Maps */
/* -------------------------------------------------------------------------- */

const PHONE_NUMBERS_MAP: Record<string, string> = {
  dermatologist_1: "08971562451",
  dermatologist_2: "08128730155",
  dermatologist_3: "07947411728",
  dermatologist_4: "08904598606",
  dermatologist_5: "09866447799",
};

const DERMATOLOGIST_IMAGES_MAP: Record<string, string[]> = {
  dermatologist_1: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
  ],
  dermatologist_2: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
  ],
  dermatologist_3: [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  ],
};

const DERMATOLOGIST_DESCRIPTIONS_MAP: Record<string, string> = {
  dermatologist_1:
    "Excellence in Skin And Hair Innovation. Verified clinic with 4.8★ rating.",
  dermatologist_2:
    "Trending clinic with expert dermatologists in skin, hair & laser treatments.",
  dermatologist_3:
    "Popular clinic with 21+ years of experience in skin & aesthetics.",
};

const DERMATOLOGIST_SERVICES = [
  "Acne Treatment",
  "Hair Loss Treatment",
  "Laser Treatment",
  "Anti-Aging",
  "Chemical Peels",
  "Pigmentation",
];

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

const NearbyDermatologistsCard: React.FC<NearbyDermatologistsCardProps> = ({
  job,
  onViewDetails,
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = useMemo(
    () =>
      DERMATOLOGIST_IMAGES_MAP[job.id] ??
      DERMATOLOGIST_IMAGES_MAP["dermatologist_1"],
    [job.id]
  );

  const rating = job.jobData?.rating;
  const totalRatings = job.jobData?.user_ratings_total;
  const isOpen = job.jobData?.opening_hours?.open_now;
  const phone = PHONE_NUMBERS_MAP[job.id];

  /* ---------------------------------------------------------------------- */

  const openDirections = () => {
    const loc = job.jobData?.geometry?.location;
    if (!loc) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,
      "_blank"
    );
  };

  const callClinic = () => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  /* ---------------------------------------------------------------------- */

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Image Carousel */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative h-48">
        <img
          src={images[currentImage]}
          alt={job.title}
          className="h-full w-full object-cover"
        />

        {images.length > 1 && (
          <>
            {currentImage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage((p) => p - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {currentImage < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage((p) => p + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-900">
          {job.title ?? "Dermatologist Clinic"}
        </h3>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{job.location}</span>
        </div>

        {job.distance !== undefined && (
          <p className="text-sm font-semibold text-emerald-600">
            {job.distance.toFixed(1)} km away
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-3">
          {DERMATOLOGIST_DESCRIPTIONS_MAP[job.id] ?? job.description}
        </p>

        {/* Category */}
        <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full">
          <Sparkles size={12} />
          Dermatologist
        </span>

        {/* Rating & Status */}
        <div className="flex items-center gap-3 pt-1">
          {rating && (
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Star size={14} className="text-yellow-400" />
              {rating.toFixed(1)}
              {totalRatings && (
                <span className="text-gray-500">({totalRatings})</span>
              )}
            </div>
          )}

          {isOpen !== undefined && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Clock size={12} />
              {isOpen ? "Open Now" : "Closed"}
            </span>
          )}
        </div>

        {/* Services */}
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1">SERVICES</p>
          <div className="flex flex-wrap gap-2">
            {DERMATOLOGIST_SERVICES.slice(0, 4).map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded"
              >
                <CheckCircle size={12} />
                {s}
              </span>
            ))}
            {DERMATOLOGIST_SERVICES.length > 4 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{DERMATOLOGIST_SERVICES.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDirections();
            }}
            className="flex-1 flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 font-semibold text-sm py-2 rounded-lg hover:bg-indigo-50"
          >
            <MapPin size={14} />
            Directions
          </button>

          <button
            disabled={!phone}
            onClick={(e) => {
              e.stopPropagation();
              callClinic();
            }}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-2 rounded-lg border ${
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

export default NearbyDermatologistsCard;
