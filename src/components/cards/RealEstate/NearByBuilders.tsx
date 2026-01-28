import React, { useState, useCallback } from "react";
import {
  MapPin,
  Star,
  Flame,
  Zap,
  Phone,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Hammer,
} from "lucide-react";

export interface JobType {
  id: string;
  title: string;
  location?: string;
  description?: string;
  jobData?: any;
}

interface Props {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

const PHONE_NUMBERS_MAP: Record<string, string> = {
  builder_1: "09980795583",
  builder_2: "04760622445",
  builder_3: "08460232445",
  builder_4: "09988003289",
};

const BUILDER_IMAGES_MAP: Record<string, string[]> = {
  builder_1: [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
  ],
  builder_2: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  ],
  builder_3: [
    "https://images.unsplash.com/photo-1625844775804-9975a9b4748d",
    "https://images.unsplash.com/photo-1590586767908-20d6d1b6db58",
  ],
  builder_4: [
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
  ],
};

const NearbyBuildersCard: React.FC<Props> = ({ job, onViewDetails }) => {
  const images = BUILDER_IMAGES_MAP[job.id] || [];
  const [index, setIndex] = useState(0);

  const rating = job.jobData?.rating;
  const reviews = job.jobData?.user_ratings_total;
  const tags = job.jobData?.special_tags || [];
  const amenities = job.jobData?.amenities || [];
  const phone = PHONE_NUMBERS_MAP[job.id];

  const handleDirections = () => {
    const loc = job.jobData?.geometry?.location;
    if (!loc) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,
      "_blank"
    );
  };

  const handleCall = () => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="relative h-48 bg-gray-200">
        {images.length > 0 ? (
          <img
            src={images[index]}
            className="h-full w-full object-cover"
            alt={job.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Hammer className="w-10 h-10 text-gray-400" />
          </div>
        )}

        {index > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full"
          >
            <ChevronLeft className="text-white w-4 h-4" />
          </button>
        )}

        {index < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full"
          >
            <ChevronRight className="text-white w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-orange-100 text-orange-700"
            >
              {tag === "Trending" && <Flame className="w-3 h-3" />}
              {tag === "Quick Response" && <Zap className="w-3 h-3" />}
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{rating}</span>
            <span className="text-gray-500">({reviews})</span>
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {amenities.slice(0, 4).map((a: string) => (
            <span
              key={a}
              className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDirections();
            }}
            className="flex-1 flex items-center justify-center gap-1 border border-orange-400 text-orange-500 font-semibold py-2 rounded-lg hover:bg-orange-50"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCall();
            }}
            disabled={!phone}
            className={`flex-1 flex items-center justify-center gap-1 border font-semibold py-2 rounded-lg
              ${
                phone
                  ? "border-green-500 text-green-600 hover:bg-green-50"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Phone className="w-4 h-4" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyBuildersCard;
