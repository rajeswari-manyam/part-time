import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Shield,
  Award,
  CheckCircle,
  ExternalLink,
  FileText,
} from "lucide-react";

/* ================= TYPES ================= */

export interface CharteredAccountant {
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
  opening_hours?: { open_now: boolean };
  types: string[];
  special_tags: string[];
  phone?: string;
  whatsapp?: string;
  website?: string;
}

/* ================= CONSTANTS ================= */

// Export dummy chartered accountant data
export const DUMMY_ACCOUNTANTS: CharteredAccountant[] = [
  {
    place_id: "ca_1",
    name: "Sai Ram & Co.",
    vicinity: "Shapur Nagar, Hyderabad",
    rating: 4.7,
    user_ratings_total: 143,
    photos: [{ photo_reference: "ca_photo_1" }],
    geometry: {
      location: { lat: 17.385, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    opening_hours: { open_now: true },
    types: ["chartered_accountant", "accounting", "finance"],
    special_tags: ["Trust", "Verified", "Top Rated"],
    phone: "08792486144",
    whatsapp: "08792486144",
  },
  {
    place_id: "ca_2",
    name: "Vibha Consultants Pvt Ltd",
    vicinity: "Medipalli, Rangareddy",
    rating: 3.5,
    user_ratings_total: 12,
    photos: [{ photo_reference: "ca_photo_2" }],
    geometry: {
      location: { lat: 17.386, lng: 78.487 },
    },
    business_status: "OPERATIONAL",
    opening_hours: { open_now: true },
    types: ["chartered_accountant", "accounting", "consulting"],
    special_tags: ["Professional", "Experienced"],
    phone: "08460509541",
    whatsapp: "08460509541",
  },
  {
    place_id: "ca_3",
    name: "SETBHARATBIZ LLP",
    vicinity: "Gunfoundry-abids, Hyderabad",
    rating: 4.9,
    user_ratings_total: 236,
    photos: [{ photo_reference: "ca_photo_3" }],
    geometry: {
      location: { lat: 17.387, lng: 78.488 },
    },
    business_status: "OPERATIONAL",
    opening_hours: { open_now: true },
    types: ["chartered_accountant", "tax_consultant"],
    special_tags: ["Highly Rated", "Expert Team"],
    phone: "07947067434",
    whatsapp: "07947067434",
  },
  {
    place_id: "ca_4",
    name: "M S & Associates",
    vicinity: "Kapra, Hyderabad",
    rating: 4.3,
    user_ratings_total: 6,
    photos: [{ photo_reference: "ca_photo_4" }],
    geometry: {
      location: { lat: 17.388, lng: 78.489 },
    },
    business_status: "OPERATIONAL",
    opening_hours: { open_now: true },
    types: ["chartered_accountant", "financial_planning"],
    special_tags: ["Trusted", "Reliable"],
    phone: "07383233980",
    whatsapp: "07383233980",
  },
];

// Images for chartered accountants
const CA_IMAGES_MAP: { [key: string]: string[] } = {
  ca_1: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
  ],
  ca_2: [
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
  ],
  ca_3: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
  ],
  ca_4: [
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
  ],
};

// Descriptions
const CA_DESCRIPTIONS_MAP: { [key: string]: string } = {
  ca_1:
    "Trusted chartered accountant with 4.7★ rating and 143 reviews. Verified professional services. Expert in taxation, audit, and financial consulting.",
  ca_2:
    "Professional consultancy firm with 3.5★ rating and 12 reviews. Experienced team providing comprehensive accounting solutions.",
  ca_3:
    "Highly rated CA firm with 4.9★ rating and 236 reviews. Expert team specializing in business setup, taxation, and compliance.",
  ca_4:
    "Reliable accounting services with 4.3★ rating and 6 reviews. Trusted partner for financial planning and tax consulting.",
};

// Services offered by chartered accountants
const CA_SERVICES = [
  "Tax Filing & Planning",
  "GST Registration",
  "Company Incorporation",
  "Annual Compliance",
  "Audit Services",
  "Financial Consulting",
  "Accounting & Bookkeeping",
  "Business Advisory",
];

/* ================= COMPONENT ================= */

interface CharteredAccountantCardProps {
  job?: any;
  onViewDetails: (job: any) => void;
}

const SingleAccountantCard: React.FC<CharteredAccountantCardProps> = ({
  job,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const getPhotos = useCallback(() => {
    if (!job) return [];
    const jobId = job.id || "ca_1";
    return CA_IMAGES_MAP[jobId] || CA_IMAGES_MAP["ca_1"];
  }, [job]);

  const photos = getPhotos();
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[currentImageIndex] : null;

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasPhotos && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    },
    [hasPhotos, currentImageIndex]
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasPhotos && currentImageIndex < photos.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      }
    },
    [hasPhotos, currentImageIndex, photos.length]
  );

  const getName = useCallback((): string => {
    if (!job) return "Chartered Accountant";
    return job.title || "Chartered Accountant";
  }, [job]);

  const getLocation = useCallback((): string => {
    if (!job) return "Location";
    return job.location || job.description || "Location";
  }, [job]);

  const getDescription = useCallback((): string => {
    if (!job) return "Professional accounting services";
    const jobId = job.id || "ca_1";
    return (
      CA_DESCRIPTIONS_MAP[jobId] ||
      job.description ||
      "Professional accounting services"
    );
  }, [job]);

  const getRating = useCallback((): number | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.rating || null;
  }, [job]);

  const getUserRatingsTotal = useCallback((): number | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.user_ratings_total || null;
  }, [job]);

  const getSpecialTags = useCallback((): string[] => {
    if (!job) return [];
    const jobData = job.jobData as any;
    return jobData?.special_tags || [];
  }, [job]);

  const getPhoneNumber = useCallback((): string | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.phone || null;
  }, [job]);

  const getWhatsAppNumber = useCallback((): string | null => {
    if (!job) return null;
    const jobData = job.jobData as any;
    return jobData?.whatsapp || null;
  }, [job]);

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

  const handleWhatsApp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!job) return;

      const whatsappNumber = getWhatsAppNumber();
      const name = getName();

      if (!whatsappNumber) {
        alert(`No WhatsApp number available for ${name}.`);
        return;
      }

      const formattedNumber = whatsappNumber.replace(/[^0-9+]/g, "");
      const whatsappUrl = `https://wa.me/${formattedNumber}`;
      window.open(whatsappUrl, "_blank");
    },
    [job, getWhatsAppNumber, getName]
  );

  const handleImageError = useCallback(() => {
    console.warn("⚠️ Failed to load image for CA:", job?.id || "unknown");
    setImageError(true);
  }, [job]);

  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const description = getDescription();
  const specialTags = getSpecialTags();
  const visibleServices = CA_SERVICES.slice(0, 4);
  const moreServices = CA_SERVICES.length > 4 ? CA_SERVICES.length - 4 : 0;
  const hasPhoneNumber = getPhoneNumber() !== null;
  const hasWhatsApp = getWhatsAppNumber() !== null;

  if (!job) {
    return null;
  }

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[0.98] border border-gray-100"
    >
      {/* Image Carousel */}
      <div className="relative h-52 bg-gradient-to-br from-blue-50 to-indigo-50">
        {currentPhoto && !imageError ? (
          <>
            <img
              src={currentPhoto}
              className="w-full h-full object-cover"
              alt={getName()}
              onError={handleImageError}
            />

            {hasPhotos && photos.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full text-gray-800 shadow-lg transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}

                {currentImageIndex < photos.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full text-gray-800 shadow-lg transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}

                <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-7xl">🏢</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header Section */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
            {getName()}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={15} className="mr-1.5 flex-shrink-0 text-blue-600" />
            <span className="text-sm line-clamp-1">{getLocation()}</span>
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-green-100 px-2.5 py-1 rounded-lg">
                <Star size={14} className="text-green-600 fill-green-600" />
                <span className="text-sm font-bold text-green-700">
                  {rating.toFixed(1)} ★
                </span>
              </div>
              {userRatingsTotal && (
                <span className="text-xs text-gray-500 font-medium">
                  {userRatingsTotal} Ratings
                </span>
              )}
            </div>
          )}
        </div>

        {/* Special Tags */}
        {specialTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {specialTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200"
              >
                {tag === "Trust" && <Shield size={11} />}
                {tag === "Verified" && <CheckCircle size={11} />}
                {tag === "Top Rated" && <Award size={11} />}
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 border border-indigo-200">
          <FileText size={13} />
          <span>Chartered Accountant</span>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-gray-500 tracking-wider mb-2">
            SERVICES:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visibleServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg"
              >
                <CheckCircle size={11} className="text-green-600" />
                <span>{service}</span>
              </span>
            ))}
            {moreServices > 0 && (
              <span className="inline-flex items-center bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                +{moreServices} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            disabled={!hasPhoneNumber}
            className={`flex-1 flex items-center justify-center gap-1.5 font-bold text-sm py-3 rounded-xl transition-all active:scale-95 ${
              hasPhoneNumber
                ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Phone size={16} />
            <span>Call</span>
          </button>

          <button
            onClick={handleWhatsApp}
            disabled={!hasWhatsApp}
            className={`flex-1 flex items-center justify-center gap-1.5 font-bold text-sm py-3 rounded-xl transition-all active:scale-95 ${
              hasWhatsApp
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component
const CharteredAccountantCard: React.FC<CharteredAccountantCardProps> = (
  props
) => {
  if (!props.job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Similar Businesses
            </h1>
            <p className="text-gray-600">
              Find the best chartered accountants near you
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DUMMY_ACCOUNTANTS.map((accountant) => (
              <SingleAccountantCard
                key={accountant.place_id}
                job={{
                  id: accountant.place_id,
                  title: accountant.name,
                  location: accountant.vicinity,
                  category: "Chartered Accountant",
                  jobData: {
                    rating: accountant.rating,
                    user_ratings_total: accountant.user_ratings_total,
                    opening_hours: accountant.opening_hours,
                    geometry: accountant.geometry,
                    business_status: accountant.business_status,
                    types: accountant.types,
                    special_tags: accountant.special_tags,
                    phone: accountant.phone,
                    whatsapp: accountant.whatsapp,
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

  return (
    <SingleAccountantCard job={props.job} onViewDetails={props.onViewDetails} />
  );
};

export default CharteredAccountantCard;