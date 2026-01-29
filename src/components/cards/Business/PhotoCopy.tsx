import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  TrendingUp,
  Printer,
  Award,
  Users,
  CheckCircle2,
  Send,
  FileText,
  Zap,
  ShieldCheck,
} from "lucide-react";

/* ================= TYPES ================= */

export interface PhotocopyingCentre {
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
  price_level: number;
  types: string[];
  special_tags: string[];
  distance: number;
  phone?: string;
}

/* ================= CONSTANTS ================= */

// Phone numbers map for photocopying centres
const PHONE_NUMBERS_MAP: { [key: string]: string } = {
  centre_1: "07048219471",
  centre_2: "07947415592",
  centre_3: "07947119086",
  centre_4: "07942690717",
  centre_5: "08465123456",
};

// Dummy photocopying centres data based on JustDial screenshots
export const DUMMY_PHOTOCOPYING_CENTRES: PhotocopyingCentre[] = [
  {
    place_id: "centre_1",
    name: "Sris Digital",
    vicinity: "Old Alwal Road Suchitra Cross Road, Hyderabad",
    rating: 4.2,
    user_ratings_total: 45,
    photos: [{ photo_reference: "centre_photo_1" }],
    geometry: {
      location: { lat: 17.5447, lng: 78.5169 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["photocopying_centres", "printing_services"],
    special_tags: ["Trust", "Verified", "Responsive", "Book Service"],
    distance: 2.2,
    phone: "07048219471",
  },
  {
    place_id: "centre_2",
    name: "Bright Solutions",
    vicinity: "Qutbullapur Road Suchitra Cross Road, Hyderabad",
    rating: 4.3,
    user_ratings_total: 52,
    photos: [{ photo_reference: "centre_photo_2" }],
    geometry: {
      location: { lat: 17.5450, lng: 78.5175 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["computer_repair_services", "laptop_repair_services"],
    special_tags: ["Verified", "Trending", "Quick Service"],
    distance: 1.8,
    phone: "07947415592",
  },
  {
    place_id: "centre_3",
    name: "Universal Net Zone",
    vicinity: "Quthbullapur to Suchitra Road Kutbullapur, Hyderabad",
    rating: 4.2,
    user_ratings_total: 29,
    photos: [{ photo_reference: "centre_photo_3" }],
    geometry: {
      location: { lat: 17.5430, lng: 78.5150 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["colour_photocopying_centres", "cyber_cafes"],
    special_tags: ["Trending", "Affordable", "Fast Service"],
    distance: 2.0,
    phone: "07947119086",
  },
  {
    place_id: "centre_4",
    name: "Idpl Internet & Xerox Center",
    vicinity: "Near Unique High School IDPL Colony, Hyderabad",
    rating: 4.0,
    user_ratings_total: 22,
    photos: [{ photo_reference: "centre_photo_4" }],
    geometry: {
      location: { lat: 17.5460, lng: 78.5180 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["cyber_cafes", "photocopying_centres"],
    special_tags: ["Reliable", "Local Favorite", "Good Service"],
    distance: 0.89,
    phone: "07942690717",
  },
  {
    place_id: "centre_5",
    name: "Digital Print Hub",
    vicinity: "Padma Nagar Chintal, Hyderabad",
    rating: 4.5,
    user_ratings_total: 38,
    photos: [{ photo_reference: "centre_photo_5" }],
    geometry: {
      location: { lat: 17.5440, lng: 78.5165 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["photocopying_centres", "printing_services"],
    special_tags: ["Top Rated", "Verified", "Quality Service"],
    distance: 1.5,
    phone: "08465123456",
  },
];

// Photocopying centre images
const CENTRE_IMAGES_MAP: { [key: string]: string[] } = {
  centre_1: [
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
    "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=800",
    "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=800",
  ],
  centre_2: [
    "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=800",
    "https://images.unsplash.com/photo-1590935217281-8f102120d683?w=800",
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
  ],
  centre_3: [
    "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=800",
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
    "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=800",
  ],
  centre_4: [
    "https://images.unsplash.com/photo-1590935217281-8f102120d683?w=800",
    "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=800",
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
  ],
  centre_5: [
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800",
    "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=800",
    "https://images.unsplash.com/photo-1590935217281-8f102120d683?w=800",
  ],
};

// Photocopying centre descriptions
const CENTRE_DESCRIPTIONS_MAP: { [key: string]: string } = {
  centre_1:
    "Professional digital printing and photocopying services with 45 satisfied customers. Verified and trusted provider offering booking services. Quick turnaround time and high-quality prints.",
  centre_2:
    "Trending photocopying centre with 4.3-star rating. Specializing in computer and laptop repair services. Verified provider with 52 customer reviews. Fast and reliable service.",
  centre_3:
    "Popular net zone and photocopying centre with cyber cafe facilities. Offering colour photocopying services with 29 ratings. Trending choice for affordable and fast printing solutions.",
  centre_4:
    "Local favorite internet and xerox center with reliable services. Located near IDPL Colony with 22 customer reviews. Providing cyber cafe and photocopying services at competitive rates.",
  centre_5:
    "Top-rated digital print hub with 4.5-star rating and 38 reviews. Comprehensive printing and photocopying services. Verified quality service provider in Padma Nagar area.",
};

// Services offered by photocopying centres
const PHOTOCOPYING_SERVICES = [
  "Xerox/Photocopying",
  "Colour Printing",
  "Document Scanning",
  "Lamination",
  "Binding Services",
  "Photo Printing",
  "Digital Printing",
  "Document Typing",
];

/* ================= COMPONENT ================= */

interface PhotocopyingCentreCardProps {
  centre?: any;
  onViewDetails: (centre: any) => void;
  onSendEnquiry?: (centre: any) => void;
}

const SinglePhotocopyingCentreCard: React.FC<PhotocopyingCentreCardProps> = ({
  centre,
  onViewDetails,
  onSendEnquiry,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get all available photos from centre data
  const getPhotos = useCallback(() => {
    if (!centre) return [];
    const centreId = centre.id || "centre_1";
    return CENTRE_IMAGES_MAP[centreId] || CENTRE_IMAGES_MAP["centre_1"];
  }, [centre]);

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

  // Get centre name
  const getName = useCallback((): string => {
    if (!centre) return "Photocopying Centre";
    return centre.title || "Photocopying Centre";
  }, [centre]);

  // Get location string
  const getLocation = useCallback((): string => {
    if (!centre) return "Location";
    return centre.location || centre.description || "Location";
  }, [centre]);

  // Get distance string
  const getDistance = useCallback((): string => {
    if (!centre) return "";
    if (centre.distance !== undefined && centre.distance !== null) {
      const distanceNum = Number(centre.distance);
      if (!isNaN(distanceNum)) {
        if (distanceNum < 1) {
          return `${(distanceNum * 1000).toFixed(0)} mts`;
        }
        return `${distanceNum.toFixed(1)} km`;
      }
    }
    return "";
  }, [centre]);

  // Get description
  const getDescription = useCallback((): string => {
    if (!centre) return "Professional photocopying services";
    const centreId = centre.id || "centre_1";
    return (
      CENTRE_DESCRIPTIONS_MAP[centreId] ||
      centre.description ||
      "Professional photocopying services"
    );
  }, [centre]);

  // Get rating
  const getRating = useCallback((): number | null => {
    if (!centre) return null;
    const centreData = centre.centreData as any;
    return centreData?.rating || null;
  }, [centre]);

  // Get user ratings total
  const getUserRatingsTotal = useCallback((): number | null => {
    if (!centre) return null;
    const centreData = centre.centreData as any;
    return centreData?.user_ratings_total || null;
  }, [centre]);

  // Get special tags
  const getSpecialTags = useCallback((): string[] => {
    if (!centre) return [];
    const centreData = centre.centreData as any;
    return centreData?.special_tags || [];
  }, [centre]);

  // Get phone number
  const getPhoneNumber = useCallback((): string | null => {
    if (!centre) return null;
    const centreId = centre.id || "";
    const centreData = centre.centreData as any;
    return centreData?.phone || PHONE_NUMBERS_MAP[centreId] || null;
  }, [centre]);

  // Handle call button press
  const handleCall = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!centre) return;

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
    [centre, getPhoneNumber, getName]
  );

  // Handle WhatsApp button press
  const handleWhatsApp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!centre) return;

      const phoneNumber = getPhoneNumber();
      const name = getName();

      if (!phoneNumber) {
        alert(`No WhatsApp number available for ${name}.`);
        return;
      }

      const formattedNumber = phoneNumber.replace(/[^0-9+]/g, "");
      const message = encodeURIComponent(
        `Hi, I'm interested in your photocopying services. Can you provide more information?`
      );
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    },
    [centre, getPhoneNumber, getName]
  );

  // Handle send enquiry
  const handleSendEnquiry = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSendEnquiry) {
        onSendEnquiry(centre);
      }
    },
    [centre, onSendEnquiry]
  );

  // Handle image loading error
  const handleImageError = useCallback(() => {
    console.warn("⚠️ Failed to load image for centre:", centre?.id || "unknown");
    setImageError(true);
  }, [centre]);

  // Compute derived values
  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const distance = getDistance();
  const description = getDescription();
  const specialTags = getSpecialTags();
  const visibleServices = PHOTOCOPYING_SERVICES.slice(0, 4);
  const moreServices =
    PHOTOCOPYING_SERVICES.length > 4 ? PHOTOCOPYING_SERVICES.length - 4 : 0;
  const hasPhoneNumber = getPhoneNumber() !== null;

  // Early return if centre is not provided
  if (!centre) {
    return null;
  }

  return (
    <div
      onClick={() => onViewDetails(centre)}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-cyan-200 hover:-translate-y-1"
    >
      {/* Image Carousel with Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-br from-cyan-50 to-blue-100 overflow-hidden">
        {currentPhoto && !imageError ? (
          <>
            <img
              src={currentPhoto}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={getName()}
              onError={handleImageError}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Image Navigation Arrows */}
            {hasPhotos && photos.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full text-gray-800 transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                )}

                {currentImageIndex < photos.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full text-gray-800 transition-all shadow-lg hover:scale-110"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-cyan-100 to-blue-200">
            <div className="text-center">
              <Printer size={64} className="text-cyan-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Photocopying Centre</p>
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {specialTags.some(tag => tag.toLowerCase().includes("verified")) && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 size={14} />
            <span>Verified</span>
          </div>
        )}

        {/* Trending Badge */}
        {specialTags.some(tag => tag.toLowerCase().includes("trending")) && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <TrendingUp size={14} />
            <span>Trending</span>
          </div>
        )}

        {/* Trust Badge */}
        {specialTags.some(tag => tag.toLowerCase().includes("trust")) && (
          <div className="absolute top-12 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <ShieldCheck size={14} />
            <span>Trust</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Centre Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-cyan-600 transition-colors">
          {getName()}
        </h3>

        {/* Location and Distance Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start text-gray-600 flex-1">
            <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5 text-cyan-500" />
            <span className="text-sm line-clamp-2">{getLocation()}</span>
          </div>
          {distance && (
            <span className="text-sm font-bold text-cyan-600 ml-2 whitespace-nowrap">
              {distance}
            </span>
          )}
        </div>

        {/* Rating and Tags Row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {rating && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-gray-900">
                {rating.toFixed(1)}
              </span>
              {userRatingsTotal && (
                <span className="text-xs text-gray-600">
                  ({userRatingsTotal})
                </span>
              )}
            </div>
          )}

          {specialTags
            .filter((tag) => !tag.toLowerCase().includes("verified") && !tag.toLowerCase().includes("trending") && !tag.toLowerCase().includes("trust"))
            .slice(0, 2)
            .map((tag, index) => (
              <span
                key={index}
                className="bg-cyan-50 text-cyan-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-cyan-200"
              >
                {tag}
              </span>
            ))}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl mb-4 shadow-md">
          <FileText size={14} />
          <span>Photocopying Centre</span>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 tracking-wider mb-2.5 flex items-center gap-1">
            <Zap size={12} />
            SERVICES OFFERED:
          </p>
          <div className="flex flex-wrap gap-2">
            {visibleServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-cyan-200 hover:border-cyan-300 transition-colors"
              >
                <CheckCircle2 size={12} />
                <span>{service}</span>
              </span>
            ))}
            {moreServices > 0 && (
              <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200">
                +{moreServices} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleCall}
            disabled={!hasPhoneNumber}
            className={`flex items-center justify-center gap-1.5 font-bold text-xs py-3 rounded-xl transition-all ${
              hasPhoneNumber
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            <Phone size={15} />
            <span>Call</span>
          </button>

          <button
            onClick={handleWhatsApp}
            disabled={!hasPhoneNumber}
            className={`flex items-center justify-center gap-1.5 font-bold text-xs py-3 rounded-xl transition-all ${
              hasPhoneNumber
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-md hover:shadow-lg active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleSendEnquiry}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 font-bold text-xs py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={15} />
            <span>Enquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component - displays grid of dummy data or single card
const PhotocopyingCentresCard: React.FC<PhotocopyingCentreCardProps> = (props) => {
  // If no centre is provided, render the grid of dummy centres
  if (!props.centre) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <Printer size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Popular Photocopying Centres in Padma Nagar Chintal
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                <Users size={14} />
                <span>32+ verified listings available</span>
              </p>
            </div>
          </div>
          
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-xl hover:bg-cyan-700 transition-colors shadow-md">
              ⭐ Top Rated
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
              ⚡ Quick Response
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
              ✓ Jd Verified
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
              🏆 Jd Trust
            </button>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_PHOTOCOPYING_CENTRES.map((centre) => (
            <SinglePhotocopyingCentreCard
              key={centre.place_id}
              centre={{
                id: centre.place_id,
                title: centre.name,
                location: centre.vicinity,
                distance: centre.distance,
                category: "Photocopying Centre",
                centreData: {
                  rating: centre.rating,
                  user_ratings_total: centre.user_ratings_total,
                  geometry: centre.geometry,
                  business_status: centre.business_status,
                  price_level: centre.price_level,
                  types: centre.types,
                  special_tags: centre.special_tags,
                  phone: centre.phone,
                },
              }}
              onViewDetails={props.onViewDetails}
              onSendEnquiry={props.onSendEnquiry}
            />
          ))}
        </div>
      </div>
    );
  }

  // If centre is provided, render individual card
  return (
    <SinglePhotocopyingCentreCard
      centre={props.centre}
      onViewDetails={props.onViewDetails}
      onSendEnquiry={props.onSendEnquiry}
    />
  );
};

export default PhotocopyingCentresCard;