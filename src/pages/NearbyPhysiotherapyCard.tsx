// NearbyPhysiotherapyCard.tsx
import React, { useState, useCallback } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaStar, FaClock, FaChevronLeft, FaChevronRight, FaCheckCircle, FaDumbbell } from "react-icons/fa";

export interface JobType {
  id: string;
  title?: string;
  location?: string;
  description?: string;
  distance?: number;
  jobData?: any;
}

interface NearbyPhysiotherapyCardProps {
  job: JobType;
  onViewDetails: (job: JobType) => void;
}

const PHONE_NUMBERS_MAP: { [key: string]: string } = {
  physio_1: "09972907947",
  physio_2: "08401340248",
  physio_3: "08511383949",
  physio_4: "08401079081",
  physio_5: "08106543210",
};

const PHYSIOTHERAPY_IMAGES_MAP: { [key: string]: string[] } = {
  physio_1: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
    "https://images.unsplash.com/photo-1512069545448-7e0e0e6c8d8a?w=800",
  ],
  physio_2: [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    "https://images.unsplash.com/photo-1512069545448-7e0e0e6c8d8a?w=800",
  ],
  physio_3: [
    "https://images.unsplash.com/photo-1512069545448-7e0e0e6c8d8a?w=800",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
  ],
  physio_4: [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
    "https://images.unsplash.com/photo-1512069545448-7e0e0e6c8d8a?w=800",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
  ],
  physio_5: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
    "https://images.unsplash.com/photo-1512069545448-7e0e0e6c8d8a?w=800",
  ],
};

const PHYSIOTHERAPY_DESCRIPTIONS_MAP: { [key: string]: string } = {
  physio_1: "Verified and Trending physiotherapy clinic with 5.0★ rating and 121 reviews. 7 Years in Healthcare. Great customer service. Open from 7:00 am to 6:45 am.",
  physio_2: "Responsive physiotherapy & rehabilitation clinic with 4.7★ rating and 30 reviews. 7 Years in Healthcare. Open from 9:00 am to 9:00 pm.",
  physio_3: "Trust and Verified physiotherapy clinic with 4.9★ rating and 123 reviews. 13 Years in Healthcare. Open 24 Hours. Specialists in sports injuries, neurological physiotherapy.",
  physio_4: "Top Search physiotherapy and rehabilitation centre with 4.9★ rating and 113 reviews. 16 Years in Healthcare. Trusted and Verified. Open 24 Hours.",
  physio_5: "Available Now physiotherapy center with 4.6★ rating and 87 reviews. 10 Years in Healthcare. Quick Response. Open from 8:00 am to 8:00 pm.",
};

const PHYSIOTHERAPY_SERVICES = [
  "Sports Injury Rehab",
  "Neurological Therapy",
  "Post-Surgery Recovery",
  "Pain Management",
  "Manual Therapy",
  "Exercise Therapy",
  "Electrotherapy",
  "Spine Rehabilitation",
];

const NearbyPhysiotherapyCard: React.FC<NearbyPhysiotherapyCardProps> = ({ job, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photos = PHYSIOTHERAPY_IMAGES_MAP[job.id] || PHYSIOTHERAPY_IMAGES_MAP["physio_1"];
  const currentPhoto = photos[currentImageIndex];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < photos.length - 1) setCurrentImageIndex(currentImageIndex + 1);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
  };

  const getName = () => job.title || "Physiotherapy Center";
  const getLocation = () => job.location || job.description || "Location";
  const getDistance = () => (job.distance ? `${job.distance.toFixed(1)} km away` : "");
  const getDescription = () => PHYSIOTHERAPY_DESCRIPTIONS_MAP[job.id] || job.description || "";
  const getRating = () => job.jobData?.rating || null;
  const getUserRatingsTotal = () => job.jobData?.user_ratings_total || null;
  const getOpeningStatus = () => job.jobData?.timings || job.jobData?.opening_hours?.open_now ? "Open Now" : "Closed";
  const getSpecialTags = () => job.jobData?.special_tags || [];
  const getPhoneNumber = () => PHONE_NUMBERS_MAP[job.id] || null;

  const handleCall = () => {
    const phone = getPhoneNumber();
    if (phone) window.open(`tel:${phone}`, "_self");
    else alert("Phone number not available");
  };

  const handleDirections = () => {
    const lat = job.jobData?.geometry?.location?.lat;
    const lng = job.jobData?.geometry?.location?.lng;
    if (lat && lng) window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    else alert("Location not available");
  };

  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const openingStatus = getOpeningStatus();
  const distance = getDistance();
  const description = getDescription();
  const specialTags = getSpecialTags();
  const visibleServices = PHYSIOTHERAPY_SERVICES.slice(0, 4);
  const moreServices = PHYSIOTHERAPY_SERVICES.length - visibleServices.length;
  const hasPhoneNumber = !!getPhoneNumber();

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-[0.98] cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="relative w-full h-48">
        <img src={currentPhoto} alt={getName()} className="w-full h-full object-cover" />
        {currentImageIndex > 0 && (
          <button onClick={handlePrevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
            <FaChevronLeft />
          </button>
        )}
        {currentImageIndex < photos.length - 1 && (
          <button onClick={handleNextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
            <FaChevronRight />
          </button>
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {currentImageIndex + 1}/{photos.length}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold text-gray-900">{getName()}</h2>
        <div className="flex items-center text-gray-500 text-sm">
          <FaMapMarkerAlt className="mr-1" /> {getLocation()}
        </div>
        {distance && <div className="text-purple-600 font-semibold text-sm">{distance}</div>}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {specialTags.map((tag, idx) => (
            <span key={idx} className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

        <div className="inline-flex items-center bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">
          <FaDumbbell className="mr-1" /> Physiotherapy Center
        </div>

        {/* Rating & Status */}
        <div className="flex items-center gap-3">
          {rating && (
            <div className="flex items-center text-sm text-gray-700 gap-1">
              <FaStar className="text-yellow-400" /> {rating.toFixed(1)} {userRatingsTotal && <span className="text-gray-500 text-xs">({userRatingsTotal})</span>}
            </div>
          )}
          {openingStatus && (
            <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${openingStatus.includes("Open") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <FaClock className="mr-1" /> {openingStatus}
            </div>
          )}
        </div>

        {/* Services */}
        <div>
          <div className="text-gray-500 text-xs font-bold mb-1">SERVICES:</div>
          <div className="flex flex-wrap gap-1">
            {visibleServices.map((service, idx) => (
              <div key={idx} className="flex items-center text-purple-700 text-xs bg-purple-100 px-2 py-0.5 rounded gap-1">
                <FaCheckCircle /> {service}
              </div>
            ))}
            {moreServices > 0 && <div className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">+{moreServices} more</div>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button onClick={handleDirections} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
            <FaMapMarkerAlt /> Directions
          </button>
          <button onClick={handleCall} disabled={!hasPhoneNumber} className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 border rounded font-semibold ${hasPhoneNumber ? "border-purple-600 text-purple-600 hover:bg-purple-50" : "border-gray-300 text-gray-400 cursor-not-allowed"}`}>
            <FaPhoneAlt /> Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyPhysiotherapyCard;
