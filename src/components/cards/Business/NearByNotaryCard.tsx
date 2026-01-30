import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";

/* ================= TYPES ================= */

export interface NotaryService {
  place_id: string;
  name: string;
  vicinity: string;
  distance?: number;
  rating?: number;
  user_ratings_total?: number;
  photos: { photo_reference: string }[];
  geometry: {
    location: { lat: number; lng: number };
  };
  business_status: string;
  specializations: string[];
  phone?: string;
  whatsapp?: string;
  is_trending?: boolean;
  verified?: boolean;
}

/* ================= CONSTANTS ================= */

// Export dummy notary services data
export const DUMMY_NOTARIES: NotaryService[] = [
  {
    place_id: "notary_1",
    name: "Sree Sai Laxmi Consultancy",
    vicinity: "Brig Syed Road Tar Bund, Hyderabad",
    distance: 3.7,
    photos: [{ photo_reference: "notary_photo_1" }],
    geometry: {
      location: { lat: 17.4435, lng: 78.4895 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Document Writers", "Birth Certificate Consultants"],
    phone: "09980132182",
    whatsapp: "09980132182",
    verified: true,
  },
  {
    place_id: "notary_2",
    name: "MS Legal Associates",
    vicinity: "APIIC Road Prashant Nagar Kukatpally, Hyderabad",
    distance: 3.8,
    photos: [{ photo_reference: "notary_photo_2" }],
    geometry: {
      location: { lat: 17.4849, lng: 78.3866 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Notary Services", "Document Writers"],
    phone: "09972352171",
    whatsapp: "09972352171",
  },
  {
    place_id: "notary_3",
    name: "Raja Rajeshwari Associates",
    vicinity: "Brig Syed Road Bowenpally, Hyderabad",
    distance: 3.7,
    rating: 5.0,
    user_ratings_total: 3,
    photos: [{ photo_reference: "notary_photo_3" }],
    geometry: {
      location: { lat: 17.4742, lng: 78.4621 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Public Notary"],
    phone: "09725305527",
    whatsapp: "09725305527",
    is_trending: true,
    verified: true,
  },
  {
    place_id: "notary_4",
    name: "Ak Consultancy and Documention",
    vicinity: "Center Point Tar Bund, Hyderabad",
    distance: 3.5,
    photos: [{ photo_reference: "notary_photo_4" }],
    geometry: {
      location: { lat: 17.4435, lng: 78.4895 },
    },
    business_status: "OPERATIONAL",
    specializations: ["PAN Card", "GST Return", "TDS Return"],
    phone: "09724173460",
    whatsapp: "09724173460",
  },
];

// Notary images
const NOTARY_IMAGES_MAP: { [key: string]: string[] } = {
  notary_1: [
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
  ],
  notary_2: [
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  ],
  notary_3: [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  ],
  notary_4: [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  ],
};

// Notary descriptions
const NOTARY_DESCRIPTIONS_MAP: { [key: string]: string } = {
  notary_1:
    "Professional notary consultancy offering document writing and birth certificate services. Trusted for legal and official documents.",
  notary_2:
    "Experienced legal associates providing comprehensive notary and documentation services. Expert in legal formalities.",
  notary_3:
    "Top-rated public notary with 5.0★ rating. Trending service provider for all notarization needs.",
  notary_4:
    "Complete consultancy for PAN card, GST return, TDS return and other documentation services.",
};

/* ================= COMPONENT ================= */

interface NearbyNotaryCardProps {
  job?: any;
  onViewDetails: (job: any) => void;
}

const SingleNotaryCard: React.FC<NearbyNotaryCardProps> = ({
  job,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const getPhotos = useCallback(() => {
    if (!job) return [];
    const jobId = job.id || "notary_1";
    return NOTARY_IMAGES_MAP[jobId] || NOTARY_IMAGES_MAP["notary_1"];
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
    if (!job) return "Notary Services";
    return job.title || "Notary Services";
  }, [job]);

  const getLocation = useCallback((): string => {
    if (!job) return "Location";
    return job.location || job.description || "Location";
  }, [job]);

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

  const isTrending = useCallback((): boolean => {
    if (!job) return false;
    const jobData = job.jobData as any;
    return jobData?.is_trending || false;
  }, [job]);

  const isVerified = useCallback((): boolean => {
    if (!job) return false;
    const jobData = job.jobData as any;
    return jobData?.verified || false;
  }, [job]);

  const getSpecializations = useCallback((): string[] => {
    if (!job) return [];
    const jobData = job.jobData as any;
    return jobData?.specializations || [];
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

  const handleSendEnquiry = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      alert(`Send enquiry to ${getName()}`);
    },
    [getName]
  );

  const handleImageError = useCallback(() => {
    console.warn("⚠️ Failed to load image for notary:", job?.id || "unknown");
    setImageError(true);
  }, [job]);

  const distance = getDistance();
  const specializations = getSpecializations();
  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const trending = isTrending();
  const verified = isVerified();
  const hasPhoneNumber = getPhoneNumber() !== null;
  const hasWhatsApp = getWhatsAppNumber() !== null;

  if (!job) {
    return null;
  }

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-[0.99] mb-4"
    >
     <div className="flex flex-col">

        {/* Image Section */}
      <div className="relative h-48 bg-gray-100">

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

                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    {currentImageIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-indigo-50">
              <span className="text-6xl">📝</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3.5">

          {/* Header with Name and Badge */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2">

              {getName()}
            </h3>
            {verified && (
              <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle size={12} />
              </div>
            )}
          </div>

          {/* Rating and Trending */}
          {(rating || trending) && (
            <div className="flex items-center gap-2 mb-2">
              {rating && (
           <div className="flex items-center gap-1 mb-2">
  <Star size={13} className="text-yellow-400 fill-yellow-400" />
  <span className="text-[13px] font-semibold">{rating?.toFixed(1)}</span>
  {userRatingsTotal && (
    <span className="text-xs text-gray-500">({userRatingsTotal})</span>
  )}
</div>

              )}
              {userRatingsTotal && (
                <span className="text-xs text-gray-600">
                  {userRatingsTotal} Ratings
                </span>
              )}
              {trending && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                  <TrendingUp size={12} />
                  <span>Trending</span>
                </div>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={16} className="mr-1.5 flex-shrink-0" />
            <span className="text-[13px] line-clamp-1">{getLocation()}</span>

            {distance && (
             <p className="text-xs font-semibold text-purple-700 mb-2">{distance}</p>

                
            )}
          </div>

          {/* Specializations */}
          {specializations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {specializations.map((spec, index) => (
                <span
                  key={index}
                 className="bg-indigo-100 text-indigo-700 text-[11px] font-medium px-2 py-1 rounded"

                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCall}
              disabled={!hasPhoneNumber}
              className={`flex items-center gap-1.5 font-bold text-sm px-5 py-2.5 rounded-lg transition-all active:scale-95 ${
                hasPhoneNumber
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Phone size={16} />
              {hasPhoneNumber && <span>{getPhoneNumber()}</span>}
            </button>

            <button
              onClick={handleWhatsApp}
              disabled={!hasWhatsApp}
              className={`flex items-center gap-1.5 font-bold text-sm px-4 py-2.5 rounded-lg transition-all active:scale-95 ${
                hasWhatsApp
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleSendEnquiry}
              className="flex items-center gap-1.5 bg-blue-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              <FileText size={16} />
              <span>Send Enquiry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component
const NearbyNotaryCard: React.FC<NearbyNotaryCardProps> = (props) => {
  if (!props.job) {
    return (
      <div className="space-y-4">
        {DUMMY_NOTARIES.map((notary) => (
          <SingleNotaryCard
            key={notary.place_id}
            job={{
              id: notary.place_id,
              title: notary.name,
              location: notary.vicinity,
              distance: notary.distance,
              category: "Notary Services",
              jobData: {
                rating: notary.rating,
                user_ratings_total: notary.user_ratings_total,
                specializations: notary.specializations,
                geometry: notary.geometry,
                business_status: notary.business_status,
                phone: notary.phone,
                whatsapp: notary.whatsapp,
                is_trending: notary.is_trending,
                verified: notary.verified,
              },
            }}
            onViewDetails={props.onViewDetails}
          />
        ))}
      </div>
    );
  }

  return <SingleNotaryCard job={props.job} onViewDetails={props.onViewDetails} />;
};

export default NearbyNotaryCard;