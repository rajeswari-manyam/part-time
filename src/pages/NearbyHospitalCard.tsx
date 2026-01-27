// src/components/NearbyHospitalCard.tsx
import React, { useState, useCallback } from "react";
import { IoLocationSharp, IoStar, IoTimeOutline, IoCallOutline, IoNavigateOutline, IoMedicalOutline } from "react-icons/io5";

export interface JobType {
  id: string;
  title: string;
  location?: string;
  description?: string;
  distance?: number;
  category?: string;
  jobData?: any;
}

interface NearbyHospitalCardProps {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

// Phone numbers for hospitals
const PHONE_NUMBERS_MAP: Record<string, string> = {
  hospital_1: "07383092459",
  hospital_2: "07947119562",
  hospital_3: "09740116487",
  hospital_4: "08197751282",
};

// Dummy hospital images
const HOSPITAL_IMAGES_MAP: Record<string, string[]> = {
  hospital_1: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800",
  ],
  hospital_2: [
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800",
    "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  ],
  hospital_3: [
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800",
  ],
  hospital_4: [
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800",
  ],
};

// Dummy descriptions
const HOSPITAL_DESCRIPTIONS_MAP: Record<string, string> = {
  hospital_1: "Multi-specialty hospital with 383+ ratings. Open 24 Hrs. Quick Response. Book online.",
  hospital_2: "Highly rated multi-specialty hospital with 2,203+ ratings. Open 24 Hrs. Online appointments.",
  hospital_3: "Homeopathic specialist hospital with 635+ ratings. Open 24 Hrs. Book appointment available.",
  hospital_4: "Responsive multi-specialty hospital with 502+ ratings. Open 24 Hrs. Online enquiry available.",
};

// Services
const HOSPITAL_SERVICES = [
  "Emergency Care",
  "General Surgery",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Diagnostics",
  "ICU",
];

const NearbyHospitalCard: React.FC<NearbyHospitalCardProps> = ({ job, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photos = HOSPITAL_IMAGES_MAP[job.id] || [];
  const currentPhoto = photos[currentImageIndex];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < photos.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const distance = job.distance ? `${job.distance.toFixed(1)} km away` : "";
  const description = HOSPITAL_DESCRIPTIONS_MAP[job.id] || job.description || "Professional healthcare services";
  const phoneNumber = PHONE_NUMBERS_MAP[job.id] || null;

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phoneNumber) return alert("Phone number not available");
    window.open(`tel:${phoneNumber}`);
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lat = job.jobData?.geometry?.location?.lat;
    const lng = job.jobData?.geometry?.location?.lng;
    if (!lat || !lng) return alert("Location not available");
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  };

  const visibleServices = HOSPITAL_SERVICES.slice(0, 4);
  const moreServices = HOSPITAL_SERVICES.length - 4;

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[0.98] transition-transform"
    >
      {/* Image Carousel */}
      <div className="relative w-full h-48">
        {currentPhoto ? (
          <img src={currentPhoto} alt={job.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <IoMedicalOutline className="text-gray-400 text-4xl" />
          </div>
        )}

        {photos.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button onClick={handlePrevImage} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">◀</button>
            )}
            {currentImageIndex < photos.length - 1 && (
              <button onClick={handleNextImage} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">▶</button>
            )}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1}/{photos.length}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>

        <div className="flex items-center text-gray-500 text-sm gap-1">
          <IoLocationSharp />
          <span>{job.location || "Location"}</span>
        </div>

        {distance && <p className="text-green-600 text-sm font-semibold">{distance}</p>}
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

        {/* Category Badge */}
        <div className="flex items-center bg-red-100 px-2 py-1 rounded w-max gap-1">
          <IoMedicalOutline size={12} className="text-red-500" />
          <span className="text-red-500 text-xs font-semibold">{job.category || "Hospital"}</span>
        </div>

        {/* Services */}
        <div>
          <span className="text-xs font-semibold text-gray-500">SERVICES:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {visibleServices.map((s) => (
              <span key={s} className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                <IoStar size={12} /> {s}
              </span>
            ))}
            {moreServices > 0 && <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">+{moreServices} more</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button onClick={handleDirections} className="flex-1 flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-600 text-indigo-600 text-xs font-bold py-2 rounded">
            <IoNavigateOutline /> Directions
          </button>
          <button onClick={handleCall} disabled={!phoneNumber} className={`flex-1 flex items-center justify-center gap-1 border py-2 text-xs font-bold rounded ${phoneNumber ? "bg-green-100 border-green-600 text-green-600" : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"}`}>
            <IoCallOutline /> Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitalCard;
