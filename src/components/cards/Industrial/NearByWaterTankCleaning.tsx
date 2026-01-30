import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  Shield,
  MessageCircle,
  Droplet,
  ThumbsUp,
  TrendingUp,
  Award,
} from "lucide-react";

/* ================= TYPES ================= */

export interface WaterTankCleaningService {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  photos: { photo_reference: string }[];
  geometry: {
    location: { lat: number; lng: number };
  };
  business_status: string;
  special_tags: string[];
  distance: number;
  verified: boolean;
  trending: boolean;
  popular: boolean;
  top_search: boolean;
  suggestions?: string;
  response_time?: string;
}

/* ================= CONSTANTS ================= */

// Phone numbers map for water tank cleaning services
const PHONE_NUMBERS_MAP: { [key: string]: string } = {
  service_1: "08045794871",
  service_2: "09035274957",
  service_3: "09972347994",
  service_4: "09972379866",
  service_5: "09876543210",
};

// Export dummy water tank cleaning data
export const DUMMY_WATER_TANK_SERVICES: WaterTankCleaningService[] = [
  {
    place_id: "service_1",
    name: "Clean Sense Water Tank Cleaning Services",
    vicinity: "Arul Colony AS Rao Nagar, Hyderabad",
    rating: 4.7,
    user_ratings_total: 306,
    photos: [{ photo_reference: "service_photo_1" }],
    geometry: {
      location: { lat: 17.385, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    special_tags: ["Mechanised Water Tank Cleaning Services", "Water Tank Cleaning Services"],
    distance: 10.5,
    verified: true,
    trending: false,
    popular: false,
    top_search: true,
  },
  {
    place_id: "service_2",
    name: "Mr Mahendra Cleaning Services",
    vicinity: "Inner Ring Road Mehdipatnam, Hyderabad",
    rating: 4.9,
    user_ratings_total: 233,
    photos: [{ photo_reference: "service_photo_2" }],
    geometry: {
      location: { lat: 17.385, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    special_tags: ["Water Tank Cleaning Services", "Cleaning Services For Underground Water Tank"],
    distance: 11.8,
    verified: false,
    trending: false,
    popular: true,
    top_search: false,
    response_time: "Responds in 2 Hours",
  },
  {
    place_id: "service_3",
    name: "Hygienic Tank Cleaning Services",
    vicinity: "Chaitanyapuri Main Road Chaitanyapuri, Hyderabad",
    rating: 4.1,
    user_ratings_total: 17,
    photos: [{ photo_reference: "service_photo_3" }],
    geometry: {
      location: { lat: 17.385, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    special_tags: ["Water Tank Cleaning Services"],
    distance: 8.2,
    verified: true,
    trending: true,
    popular: false,
    top_search: false,
    suggestions: "Excellent service - 5 Suggestions",
    response_time: "Responds in 30 Mins",
  },
  {
    place_id: "service_4",
    name: "Vinayaka Water Tank Cleaning Services",
    vicinity: "Kamala Nagar (VV Nagar) Dilsukh Nagar, Hyderabad",
    rating: 4.7,
    user_ratings_total: 35,
    photos: [{ photo_reference: "service_photo_4" }],
    geometry: {
      location: { lat: 17.385, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    special_tags: ["Water Tank Cleaning Services", "Cleaning Services For Underground Water Tank"],
    distance: 15.8,
    verified: false,
    trending: true,
    popular: false,
    top_search: false,
    response_time: "Responds in 25 Mins",
  },
  {
    place_id: "service_5",
    name: "Professional Tank Cleaning Co",
    vicinity: "Banjara Hills, Hyderabad",
    rating: 4.5,
    user_ratings_total: 128,
    photos: [{ photo_reference: "service_photo_5" }],
    geometry: {
      location: { lat: 17.385, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    special_tags: ["Water Tank Cleaning Services", "Residential & Commercial"],
    distance: 6.5,
    verified: true,
    trending: false,
    popular: true,
    top_search: false,
    suggestions: "Great service - 8 Suggestions",
    response_time: "Responds in 1 Hour",
  },
];

// Service images
const SERVICE_IMAGES_MAP: { [key: string]: string[] } = {
  service_1: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800",
  ],
  service_2: [
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800",
  ],
  service_3: [
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800",
  ],
  service_4: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800",
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800",
  ],
  service_5: [
    "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800",
  ],
};

// Service descriptions
const SERVICE_DESCRIPTIONS_MAP: { [key: string]: string } = {
  service_1:
    "Top-rated water tank cleaning service with 4.7★ rating and 306 reviews. JD Verified. Specializes in mechanised water tank cleaning with advanced equipment and experienced technicians.",
  service_2:
    "Popular cleaning service with 4.9★ rating and 233 reviews. Expert in both overhead and underground water tank cleaning. Quick response time within 2 hours.",
  service_3:
    "JD Verified and trending service with 4.1★ rating and 17 reviews. Excellent service with 5 customer suggestions. Fast response within 30 minutes. Professional water tank cleaning.",
  service_4:
    "Trending water tank cleaning service with 4.7★ rating and 35 reviews. Comprehensive cleaning for residential and commercial properties. Quick 25-minute response time.",
  service_5:
    "Professional tank cleaning company with 4.5★ rating and 128 reviews. JD Verified and popular. Great service backed by 8 positive suggestions. Serves residential and commercial clients.",
};

// Services offered
const CLEANING_SERVICES = [
  "Overhead Tank Cleaning",
  "Underground Tank",
  "Residential Service",
  "Commercial Service",
  "Chemical-Free Cleaning",
  "Disinfection Service",
  "Emergency Cleaning",
  "Preventive Maintenance",
];

/* ================= COMPONENT ================= */

interface WaterTankServiceCardProps {
  job?: any;
  onViewDetails: (job: any) => void;
}

const SingleWaterTankCard: React.FC<WaterTankServiceCardProps> = ({
  job,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get all available photos from job data
  const getPhotos = useCallback(() => {
    if (!job) return [];
    const jobId = job.id || "service_1";
    return SERVICE_IMAGES_MAP[jobId] || SERVICE_IMAGES_MAP["service_1"];
  }, [job]);

  const photos = getPhotos();
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[currentImageIndex] : null;

  // Navigate to previous image
  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasPhotos && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    },
    [hasPhotos, currentImageIndex]
  );

  // Navigate to next image
  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasPhotos && currentImageIndex < photos.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      }
    },
    [hasPhotos, currentImageIndex, photos.length]
  );

  // Get service name from job data
  const getName = useCallback((): string => {
    if (!job) return "Water Tank Cleaning Service";
    return job.title || "Water Tank Cleaning Service";
  }, [job]);

  // Get location string from job data
  const getLocation = useCallback((): string => {
    if (!job) return "Location";
    return job.location || job.description || "Location";
  }, [job]);

  // Get distance string from job data
  const getDistance = useCallback((): string => {
    if (!job) return "";
    if (job.distance !== undefined && job.distance !== null) {
      const distanceNum = Number(job.distance);
      if (!isNaN(distanceNum)) {
        return `${distanceNum.toFixed(1)} km`;
      }
    }
    return "";
  }, [job]);

  // Get description
  const getDescription = useCallback((): string => {
    if (!job) return "Professional water tank cleaning services";
    const jobId = job.id || "service_1";
    return (
      SERVICE_DESCRIPTIONS_MAP[jobId] ||
      job.description ||
      "Professional water tank cleaning services"
    );
  }, [job]);

  // Get rating from job data
  const getRating = useCallback((): number | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.rating || null;
  }, [job]);

  // Get user ratings total from job data
  const getUserRatingsTotal = useCallback((): number | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.user_ratings_total || null;
  }, [job]);

  // Get special tags from job data
  const getSpecialTags = useCallback((): string[] => {
    if (!job) return [];
    const jobData = job.jobData as any;
    return jobData?.special_tags || [];
  }, [job]);

  // Get verified status
  const getVerified = useCallback((): boolean => {
    if (!job) return false;
    const jobData = job.jobData as any;
    return jobData?.verified || false;
  }, [job]);

  // Get trending status
  const getTrending = useCallback((): boolean => {
    if (!job) return false;
    const jobData = job.jobData as any;
    return jobData?.trending || false;
  }, [job]);

  // Get popular status
  const getPopular = useCallback((): boolean => {
    if (!job) return false;
    const jobData = job.jobData as any;
    return jobData?.popular || false;
  }, [job]);

  // Get top search status
  const getTopSearch = useCallback((): boolean => {
    if (!job) return false;
    const jobData = job.jobData as any;
    return jobData?.top_search || false;
  }, [job]);

  // Get suggestions
  const getSuggestions = useCallback((): string | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.suggestions || null;
  }, [job]);

  // Get response time
  const getResponseTime = useCallback((): string | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.response_time || null;
  }, [job]);

  // Get phone number for the service
  const getPhoneNumber = useCallback((): string | null => {
    if (!job) return null;
    const jobId = job.id || "";
    return PHONE_NUMBERS_MAP[jobId] || null;
  }, [job]);

  // Handle call button press
  const handleCall = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!job) return;

      const phoneNumber = getPhoneNumber();
      const name = getName();

      if (!phoneNumber) {
        alert(`No contact number available for ${name}.`);
        return;
      }

      const formattedNumber = phoneNumber.replace(/[^0-9+]/g, "");
      const telUrl = `tel:${formattedNumber}`;

      window.location.href = telUrl;
    },
    [job, getPhoneNumber, getName]
  );

  // Handle WhatsApp button press
  const handleWhatsApp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!job) return;

      const phoneNumber = getPhoneNumber();
      const name = getName();

      if (!phoneNumber) {
        alert(`No contact number available for ${name}.`);
        return;
      }

      const formattedNumber = phoneNumber.replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/91${formattedNumber}`;

      window.open(whatsappUrl, "_blank");
    },
    [job, getPhoneNumber, getName]
  );

  // Handle send enquiry button
  const handleSendEnquiry = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!job) return;
      // This would typically open an enquiry form
      alert("Enquiry form would open here");
    },
    [job]
  );

  // Handle image loading error
  const handleImageError = useCallback(() => {
    console.warn(
      "⚠️ Failed to load image for service:",
      job?.id || "unknown"
    );
    setImageError(true);
  }, [job]);

  // Compute derived values
  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const distance = getDistance();
  const description = getDescription();
  const specialTags = getSpecialTags();
  const verified = getVerified();
  const trending = getTrending();
  const popular = getPopular();
  const topSearch = getTopSearch();
  const suggestions = getSuggestions();
  const responseTime = getResponseTime();
  const visibleServices = CLEANING_SERVICES.slice(0, 4);
  const moreServices =
    CLEANING_SERVICES.length > 4 ? CLEANING_SERVICES.length - 4 : 0;
  const hasPhoneNumber = getPhoneNumber() !== null;

  // Early return if job is not provided
  if (!job) {
    return null;
  }

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[0.99] mb-4"
    >
      {/* Image Carousel */}
      <div className="relative h-48 bg-gray-100">
        {currentPhoto && !imageError ? (
          <>
            <img
              src={currentPhoto}
              className="w-full h-full object-cover"
              alt={getName()}
              onError={handleImageError}
            />

            {/* Image Navigation Arrows */}
            {hasPhotos && photos.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                {currentImageIndex < photos.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-6xl">💧</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        {/* Service Name with Status Badges */}
        <div className="flex items-start gap-2 mb-1.5">
          <h3 className="text-[17px] font-bold text-gray-900 leading-snug line-clamp-2 flex-1">
            {getName()}
          </h3>
          <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
            {verified && (
              <div className="flex items-center gap-0.5 bg-blue-100 text-blue-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                <Shield size={10} />
                <span>Verified</span>
              </div>
            )}
            {trending && (
              <div className="flex items-center gap-0.5 bg-orange-100 text-orange-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                <TrendingUp size={10} />
                <span>Trending</span>
              </div>
            )}
            {popular && (
              <div className="flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                <Award size={10} />
                <span>Popular</span>
              </div>
            )}
            {topSearch && (
              <div className="flex items-center gap-0.5 bg-red-100 text-red-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                <span>🔍</span>
                <span>Top Search</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-1.5">
          {rating && (
            <div className="flex items-center gap-1">
              <div className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <span>{rating.toFixed(1)}</span>
                <Star size={10} className="fill-white" />
              </div>
              {userRatingsTotal && (
                <span className="text-xs text-gray-600">
                  {userRatingsTotal} Ratings
                </span>
              )}
            </div>
          )}
        </div>

        {/* Location and Distance */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center text-gray-500 flex-1">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="text-[13px] line-clamp-1">{getLocation()}</span>
          </div>
          {distance && (
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {distance}
            </span>
          )}
        </div>

        {/* Suggestions */}
        {suggestions && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-red-600 text-sm">💬</span>
            <span className="text-[12px] text-gray-700 font-medium">
              "{suggestions}"
            </span>
          </div>
        )}

        {/* Special Tags (Service Types) */}
        {specialTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {specialTags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-[13px] text-gray-600 leading-relaxed mb-2.5 line-clamp-3">
          {description}
        </p>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 text-[11px] font-semibold px-2 py-1 rounded-xl mb-2.5">
          <Droplet size={11} />
          <span>Water Tank Cleaning</span>
        </div>

        {/* Services */}
        <div className="mb-3">
          <p className="text-[10px] font-bold text-gray-500 tracking-wide mb-1.5">
            SERVICES:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visibleServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-1 rounded"
              >
                <CheckCircle size={11} />
                <span>{service}</span>
              </span>
            ))}
            {moreServices > 0 && (
              <span className="inline-flex items-center bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-1 rounded">
                +{moreServices} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - JustDial Style */}
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            disabled={!hasPhoneNumber}
            className={`flex items-center justify-center gap-1 font-bold text-xs px-3 py-2.5 rounded-lg transition-all active:scale-95 ${
              hasPhoneNumber
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Phone size={14} />
            <span>{hasPhoneNumber ? getPhoneNumber() : "Call"}</span>
          </button>

          <button
            onClick={handleWhatsApp}
            disabled={!hasPhoneNumber}
            className={`flex items-center justify-center gap-1 font-bold text-xs px-3 py-2.5 rounded-lg transition-all active:scale-95 ${
              hasPhoneNumber
                ? "bg-[#25D366] hover:bg-[#20BA5A] text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleSendEnquiry}
            className="flex-1 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all active:scale-95"
          >
            <span>Send Enquiry</span>
            {responseTime && (
              <span className="text-[9px] font-normal opacity-90">
                {responseTime}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component - displays grid of dummy data or single card
const WaterTankCleaningCard: React.FC<WaterTankServiceCardProps> = (props) => {
  // If no job is provided, render the grid of dummy services
  if (!props.job) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - JustDial Style */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900 mb-3">
              Find Trusted Water Tank Cleaning Services in Padma Nagar Chintal, Hyderabad
            </h1>
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-600">
                <a href="#" className="hover:underline">Reset all filters</a>
              </div>
              <button className="flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm px-4 py-2 rounded-lg transition">
                <span>⚙</span>
                <span>All Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                <Star size={14} className="text-yellow-500" />
                <span>Top Rated</span>
              </button>
              <button className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                <Shield size={14} />
                <span>Jd Verified</span>
              </button>
              <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                <span>⚡</span>
                <span>Quick Response</span>
              </button>
              <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                <span>💎</span>
                <span>Deals</span>
              </button>
              <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                <Award size={14} className="text-amber-600" />
                <span>Jd Trust</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                Open Now
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                Service Type
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition">
                Property Type
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_WATER_TANK_SERVICES.map((service) => (
              <SingleWaterTankCard
                key={service.place_id}
                job={{
                  id: service.place_id,
                  title: service.name,
                  location: service.vicinity,
                  distance: service.distance,
                  category: "Water Tank Cleaning Service",
                  jobData: {
                    rating: service.rating,
                    user_ratings_total: service.user_ratings_total,
                    special_tags: service.special_tags,
                    verified: service.verified,
                    trending: service.trending,
                    popular: service.popular,
                    top_search: service.top_search,
                    suggestions: service.suggestions,
                    response_time: service.response_time,
                  },
                }}
                onViewDetails={props.onViewDetails}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If job is provided, render individual card
  return (
    <SingleWaterTankCard job={props.job} onViewDetails={props.onViewDetails} />
  );
};

export default WaterTankCleaningCard;