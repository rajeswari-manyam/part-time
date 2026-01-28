import React, { useState, useMemo } from "react";
import {
  Star,
  MapPin,
  Phone,
  Navigation,
  Flame,
  BadgeCheck,
  Zap,
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

const PHONE_NUMBERS_MAP: Record<string, string> = {
  property_1: "08511204803",
  property_2: "09054749813",
  property_3: "08197570624",
  property_4: "07947415598",
};

const PROPERTY_IMAGES_MAP: Record<string, string[]> = {
  property_1: [
    "https://picsum.photos/800/600?random=501",
    "https://picsum.photos/800/600?random=502",
  ],
  property_2: [
    "https://picsum.photos/800/600?random=601",
    "https://picsum.photos/800/600?random=602",
  ],
  property_3: [
    "https://picsum.photos/800/600?random=701",
    "https://picsum.photos/800/600?random=702",
  ],
  property_4: [
    "https://picsum.photos/800/600?random=801",
    "https://picsum.photos/800/600?random=802",
  ],
};

const PROPERTY_DESCRIPTIONS_MAP: Record<string, string> = {
  property_1:
    "Jd Verified real estate agent with 12 years of experience in residential & commercial properties.",
  property_2:
    "Top rated agent specializing in residential properties and consultation services.",
  property_3:
    "Top search agent with quick response. Handles rentals and documentation.",
  property_4:
    "Verified agent with legal and registration services.",
};

const NearbyPropertyCard: React.FC<Props> = ({ job, onViewDetails }) => {
  const [index, setIndex] = useState(0);

  const photos = useMemo(
    () => PROPERTY_IMAGES_MAP[job.id] || [],
    [job.id]
  );

  const jobData = job.jobData || {};
  const phone = PHONE_NUMBERS_MAP[job.id];

  const lat = jobData?.geometry?.location?.lat;
  const lng = jobData?.geometry?.location?.lng;

  const openDirections = () => {
    if (!lat || !lng) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="relative h-44">
        {photos.length > 0 ? (
          <img
            src={photos[index]}
            className="h-full w-full object-cover"
            alt={job.title}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {photos.length > 1 && (
          <>
            {index > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((p) => p - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
              >
                ‹
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((p) => p + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
              >
                ›
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {job.title || "Real Estate Agent"}
        </h3>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{job.location}</span>
        </div>

        {jobData.distance_text && (
          <p className="text-sm font-semibold text-amber-600">
            {jobData.distance_text}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {(jobData.special_tags || []).map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1"
            >
              {tag === "Top Search" && <Flame size={12} />}
              {tag === "Verified" && <BadgeCheck size={12} />}
              {tag === "Quick Response" && <Zap size={12} />}
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {PROPERTY_DESCRIPTIONS_MAP[job.id] || job.description}
        </p>

        {/* Rating */}
        {jobData.rating && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{jobData.rating}</span>
            <span className="text-gray-500">
              ({jobData.user_ratings_total})
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDirections();
            }}
            className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold border border-amber-500 text-amber-600 rounded-lg py-2 hover:bg-amber-50"
          >
            <Navigation size={16} />
            Directions
          </button>

          <a
            href={phone ? `tel:${phone}` : undefined}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 flex items-center justify-center gap-1 text-sm font-semibold rounded-lg py-2 border
              ${
                phone
                  ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Phone size={16} />
            Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default NearbyPropertyCard;
