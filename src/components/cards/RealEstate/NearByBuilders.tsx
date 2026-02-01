import React, { useState } from "react";
import { MapPin, Phone, Navigation, Star, Clock, ChevronLeft, ChevronRight, Hammer } from "lucide-react";

/* ================= TYPES ================= */

export interface Builder {
  id: string;
  title: string;
  description?: string;
  location?: string;
  distance?: number | string;
  jobData?: {
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: { open_now: boolean };
    geometry?: { location: { lat: number; lng: number } };
    special_tags?: string[];
    amenities?: string[];
  };
}

/* ================= CONSTANTS ================= */

const PHONE_NUMBERS_MAP: Record<string, string> = {
  builder_1: "09980795583",
  builder_2: "04760622445",
  builder_3: "08460232445",
  builder_4: "09988003289",
};

const BUILDER_IMAGES_MAP: Record<string, string[]> = {
  builder_1: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"],
  builder_2: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
  builder_3: ["https://images.unsplash.com/photo-1625844775804-9975a9b4748d?w=800"],
  builder_4: ["https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800"],
};

const BUILDER_DESCRIPTIONS_MAP: Record<string, string> = {
  builder_1: "Premier builder with 25+ years of excellence in luxury apartments and commercial spaces.",
  builder_2: "Award-winning builder specializing in high-rise residential projects.",
  builder_3: "Trusted name in affordable housing with quality construction.",
  builder_4: "Premium builder with modern architecture and world-class amenities.",
};

const DUMMY_BUILDERS: Builder[] = [
  {
    id: "builder_1",
    title: "Prestige Group Constructions",
    location: "Financial District, Hyderabad",
    distance: 2.5,
    jobData: { rating: 4.8, user_ratings_total: 567, opening_hours: { open_now: true }, amenities: ["Luxury Apartments", "Gated Communities"] },
  },
  {
    id: "builder_2",
    title: "My Home Constructions",
    location: "Kokapet, Hyderabad",
    distance: 4.2,
    jobData: { rating: 4.7, user_ratings_total: 423, opening_hours: { open_now: true }, amenities: ["High-Rise Towers", "Smart Homes"] },
  },
  {
    id: "builder_3",
    title: "Aparna Constructions",
    location: "Nallagandla, Hyderabad",
    distance: 5.8,
    jobData: { rating: 4.6, user_ratings_total: 312, opening_hours: { open_now: true }, amenities: ["Villas", "Plots"] },
  },
  {
    id: "builder_4",
    title: "Lodha Builders",
    location: "Kondapur, Hyderabad",
    distance: 3.1,
    jobData: { rating: 4.9, user_ratings_total: 689, opening_hours: { open_now: true }, amenities: ["Luxury Villas", "Penthouses"] },
  },
];

/* ================= COMPONENT ================= */

const SingleBuilderCard: React.FC<{ job: Builder; onViewDetails: (job: Builder) => void }> = ({ job, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const photos = BUILDER_IMAGES_MAP[job.id] || [];
  const currentPhoto = photos[currentImageIndex];

  const handleNextImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % photos.length); };
  const handlePrevImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length); };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = PHONE_NUMBERS_MAP[job.id];
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lat = job.jobData?.geometry?.location.lat;
    const lng = job.jobData?.geometry?.location.lng;
    if (lat && lng) window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const rating = job.jobData?.rating?.toFixed(1);
  const totalRatings = job.jobData?.user_ratings_total;
  const isOpen = job.jobData?.opening_hours?.open_now;
  const amenities = job.jobData?.amenities || [];

  return (
    <div onClick={() => onViewDetails(job)} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 shrink-0">
        {currentPhoto ? (
          <>
            <img src={currentPhoto} alt={job.title} className="w-full h-full object-cover" />
            {photos.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><ChevronLeft size={20} /></button>
                <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><ChevronRight size={20} /></button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl"><Hammer /></div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{job.title}</h2>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={16} />
          <span className="line-clamp-1">{job.location}</span>
        </div>
        {job.distance && <p className="text-xs font-semibold text-green-600">{job.distance} km away</p>}
        <p className="text-sm text-gray-600 line-clamp-3 mb-auto">{BUILDER_DESCRIPTIONS_MAP[job.id] || job.description}</p>

        <div className="flex items-center gap-3 text-sm pt-2">
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating}</span>
              {totalRatings && <span className="text-gray-500">({totalRatings})</span>}
            </div>
          )}
          {isOpen !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <Clock size={12} />
              <span className="text-xs font-semibold">{isOpen ? "Open" : "Closed"}</span>
            </div>
          )}
        </div>

        {amenities.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Specialties:</p>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs">✓ {item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-4 mt-auto">
          <button onClick={handleDirections} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 border-2 border-indigo-600 rounded-lg hover:bg-indigo-100 font-semibold">
            <Navigation size={16} /> Directions
          </button>
          <button onClick={handleCall} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-100 font-semibold">
            <Phone size={16} /> Call
          </button>
        </div>
      </div>
    </div>
  );
};

const NearbyBuildersCard: React.FC<{ job?: Builder; onViewDetails: (job: Builder) => void }> = ({ job, onViewDetails }) => {
  if (!job) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_BUILDERS.map((builder) => (
          <SingleBuilderCard key={builder.id} job={builder} onViewDetails={onViewDetails} />
        ))}
      </div>
    );
  }

  return <SingleBuilderCard job={job} onViewDetails={onViewDetails} />;
};

export default NearbyBuildersCard;
