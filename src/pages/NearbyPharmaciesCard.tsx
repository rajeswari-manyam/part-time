// src/components/NearbyPharmaciesCard.tsx

import React, { useState, useCallback } from "react";
import { IoLocationSharp, IoStar, IoCallOutline, IoNavigateOutline, IoPricetag } from "react-icons/io5";
import { JobType } from "../types/navigation"; // Ensure JobType matches your TS types

interface NearbyPharmaciesCardProps {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

const PHONE_NUMBERS_MAP: { [key: string]: string } = {
  pharmacy_1: "07947138128",
  pharmacy_2: "08466073309",
  pharmacy_3: "07947124747",
  pharmacy_4: "07947149109",
  pharmacy_5: "07947144343",
};

const PHARMACY_IMAGES_MAP: { [key: string]: string[] } = {
  pharmacy_1: [
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800",
  ],
  pharmacy_2: [
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
  ],
  pharmacy_3: [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800",
  ],
  pharmacy_4: [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
  ],
  pharmacy_5: [
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800",
    "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
  ],
};

const PHARMACY_DESCRIPTIONS_MAP: { [key: string]: string } = {
  pharmacy_1: "Health Care Medical Shop with 3.8★ rating and 106 reviews. Easy Replacement and Fast Check Out. Open from 8:00 am - 10:00 pm.",
  pharmacy_2: "Apollo Pharmacy with 3.8★ rating and 67 reviews. 6 Offers available. Open 24 Hours. Located 1 km away.",
  pharmacy_3: "Sri Ganesh Medical & General Store with 3.9★ rating and 23 reviews. Delivery Available. Open 9:00 am - 9:00 pm.",
  pharmacy_4: "Arogya Plus Pharmacy specializing in Generic Medicines with 4.2★ rating and 9 reviews. Open 8:00 am - 11:00 pm.",
  pharmacy_5: "Aditya Pharmacy with 4.0★ rating and 9 reviews. Open 7:00 am - 11:00 pm daily.",
};

const PHARMACY_SERVICES = [
  "Prescription Medicines",
  "OTC Medicines",
  "Generic Medicines",
  "Health Supplements",
  "Medical Equipment",
  "Personal Care",
  "Baby Care",
  "Home Delivery",
];

const NearbyPharmaciesCard: React.FC<NearbyPharmaciesCardProps> = ({ job, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const photos = PHARMACY_IMAGES_MAP[job.id] || PHARMACY_IMAGES_MAP["pharmacy_1"];
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[currentImageIndex] : null;

  const specialTags = (job.jobData as any)?.special_tags || [];
  const rating = (job.jobData as any)?.rating || 0;
  const userRatingsTotal = (job.jobData as any)?.user_ratings_total || 0;
  const offersAvailable = (job.jobData as any)?.has_offers || false;
  const offersCount = (job.jobData as any)?.offers_count || 0;
  const visibleServices = PHARMACY_SERVICES.slice(0, 4);
  const moreServices = PHARMACY_SERVICES.length > 4 ? PHARMACY_SERVICES.length - 4 : 0;
  const phoneNumber = PHONE_NUMBERS_MAP[job.id] || null;

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentImageIndex < photos.length - 1) setCurrentImageIndex((prev) => prev + 1);
    },
    [currentImageIndex, photos.length]
  );

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentImageIndex > 0) setCurrentImageIndex((prev) => prev - 1);
    },
    [currentImageIndex]
  );

  const handleCall = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!phoneNumber) {
        alert(`Phone number not available for ${job.title}`);
        return;
      }
      window.open(`tel:${phoneNumber}`, "_self");
    },
    [phoneNumber, job.title]
  );

  const handleDirections = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const lat = (job.jobData as any)?.geometry?.location?.lat;
      const lng = (job.jobData as any)?.geometry?.location?.lng;
      if (!lat || !lng) {
        alert("Location not available");
        return;
      }
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    },
    [job]
  );

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-[0.98] transition-transform cursor-pointer relative"
    >
      {/* Offers Badge */}
      {offersAvailable && offersCount > 0 && (
        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 z-10">
          <IoPricetag size={12} />
          <span>{offersCount} Offers</span>
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative w-full h-48 bg-gray-200">
        {currentPhoto ? (
          <img src={currentPhoto} alt={job.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <IoNavigateOutline size={48} />
          </div>
        )}
        {photos.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 rounded-full"
              >
                ◀
              </button>
            )}
            {currentImageIndex < photos.length - 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-1 rounded-full"
              >
                ▶
              </button>
            )}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1}/{photos.length}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900">{job.title || "Pharmacy"}</h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm gap-1 my-1">
          <IoLocationSharp />
          <span>{job.location || job.description || "Location"}</span>
        </div>

        {/* Special Tags */}
        {specialTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {specialTags.map((tag, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
          {PHARMACY_DESCRIPTIONS_MAP[job.id] || "Professional pharmacy services."}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          {rating > 0 && (
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <IoStar />
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
              {userRatingsTotal > 0 && <span className="text-gray-500 text-xs">({userRatingsTotal})</span>}
            </div>
          )}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-2">
          {visibleServices.map((service, idx) => (
            <span key={idx} className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <IoStar size={12} />
              {service}
            </span>
          ))}
          {moreServices > 0 && (
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">+{moreServices} more</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-600 text-indigo-600 text-xs font-bold py-2 rounded"
          >
            <IoNavigateOutline />
            Directions
          </button>

          <button
            onClick={handleCall}
            disabled={!phoneNumber}
            className={`flex-1 flex items-center justify-center gap-1 border py-2 text-xs font-bold rounded ${
              phoneNumber ? "bg-green-100 border-green-600 text-green-600" : "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            <IoCallOutline />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyPharmaciesCard;
