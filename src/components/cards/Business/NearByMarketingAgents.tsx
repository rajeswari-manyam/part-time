import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  TrendingUp,
  Briefcase,
  Award,
  Users,
  CheckCircle2,
  Send,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

/* ================= TYPES ================= */

export interface MarketingAgency {
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
  years_in_business: number;
  price_level: number;
  types: string[];
  special_tags: string[];
  distance: number;
  phone?: string;
}

/* ================= CONSTANTS ================= */

// Phone numbers map for marketing agencies
const PHONE_NUMBERS_MAP: { [key: string]: string } = {
  agency_1: "08460413570",
  agency_2: "08401788461",
  agency_3: "09724162304",
  agency_4: "09035046969",
  agency_5: "08465792341",
};

// Dummy marketing agencies data based on JustDial screenshots
export const DUMMY_MARKETING_AGENCIES: MarketingAgency[] = [
  {
    place_id: "agency_1",
    name: "Digital Media Ads",
    vicinity: "Hyderabad",
    rating: 4.5,
    user_ratings_total: 129,
    photos: [{ photo_reference: "agency_photo_1" }],
    geometry: {
      location: { lat: 17.3850, lng: 78.4867 },
    },
    business_status: "OPERATIONAL",
    years_in_business: 8,
    price_level: 3,
    types: ["digital_marketing_services", "internet_website_designers"],
    special_tags: ["Top Search", "Verified", "8 Years in Business"],
    distance: 7.1,
    phone: "08460413570",
  },
  {
    place_id: "agency_2",
    name: "Over The Box Advertising",
    vicinity: "Hyderabad",
    rating: 5.0,
    user_ratings_total: 1,
    photos: [{ photo_reference: "agency_photo_2" }],
    geometry: {
      location: { lat: 17.3900, lng: 78.4900 },
    },
    business_status: "OPERATIONAL",
    years_in_business: 8,
    price_level: 3,
    types: ["advertising_agencies", "internet_website_developers"],
    special_tags: ["Responsive", "Verified", "8 Years in Business"],
    distance: 8.3,
    phone: "08401788461",
  },
  {
    place_id: "agency_3",
    name: "Rks Social Media Private Limited",
    vicinity: "Warangal • Also Serves Hyderabad",
    rating: 5.0,
    user_ratings_total: 12,
    photos: [{ photo_reference: "agency_photo_3" }],
    geometry: {
      location: { lat: 17.9784, lng: 79.6004 },
    },
    business_status: "OPERATIONAL",
    years_in_business: 6,
    price_level: 3,
    types: ["advertising_agencies", "digital_marketing_services"],
    special_tags: ["Trending", "Top Rated", "6 Years in Business"],
    distance: 145.2,
    phone: "09724162304",
  },
  {
    place_id: "agency_4",
    name: "Boombrands Integrated Services",
    vicinity: "Bangalore • Also Serves Hyderabad",
    rating: 5.0,
    user_ratings_total: 6,
    photos: [{ photo_reference: "agency_photo_4" }],
    geometry: {
      location: { lat: 12.9716, lng: 77.5946 },
    },
    business_status: "OPERATIONAL",
    years_in_business: 12,
    price_level: 4,
    types: ["digital_marketing_services", "printing_services"],
    special_tags: ["Trending", "Experienced", "12 Years in Business"],
    distance: 560.5,
    phone: "09035046969",
  },
  {
    place_id: "agency_5",
    name: "Creative Minds Marketing Hub",
    vicinity: "Madhapur, Hyderabad",
    rating: 4.8,
    user_ratings_total: 87,
    photos: [{ photo_reference: "agency_photo_5" }],
    geometry: {
      location: { lat: 17.4484, lng: 78.3908 },
    },
    business_status: "OPERATIONAL",
    years_in_business: 5,
    price_level: 3,
    types: ["marketing_agencies", "social_media_marketing"],
    special_tags: ["Popular", "Quick Response", "5 Years in Business"],
    distance: 12.5,
    phone: "08465792341",
  },
];

// Marketing agency images
const AGENCY_IMAGES_MAP: { [key: string]: string[] } = {
  agency_1: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
  ],
  agency_2: [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
  ],
  agency_3: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800",
  ],
  agency_4: [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
    "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800",
  ],
  agency_5: [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
  ],
};

// Marketing agency descriptions
const AGENCY_DESCRIPTIONS_MAP: { [key: string]: string } = {
  agency_1:
    "Top-rated digital marketing agency specializing in comprehensive online solutions. Expert team with 8 years of experience in digital marketing services and website design. Trusted by 129+ satisfied clients.",
  agency_2:
    "Highly responsive advertising agency with perfect 5-star rating. Specializing in creative advertising campaigns and website development. Known for innovative marketing strategies and timely delivery.",
  agency_3:
    "Trending social media marketing specialist serving both Warangal and Hyderabad. Expertise in advertising and digital marketing with 6 years of proven track record. 12 verified reviews from happy clients.",
  agency_4:
    "Experienced integrated marketing services provider with 12 years in business. Based in Bangalore serving Hyderabad market. Comprehensive solutions including digital marketing and printing services.",
  agency_5:
    "Popular marketing hub in Madhapur known for quick response and creative campaigns. Specializing in social media marketing with 87+ client reviews. 5 years of delivering exceptional marketing results.",
};

// Services offered by marketing agencies
const MARKETING_SERVICES = [
  "Digital Marketing",
  "Social Media Marketing",
  "SEO Services",
  "Content Marketing",
  "Website Design",
  "Brand Development",
  "Email Marketing",
  "PPC Advertising",
];

/* ================= COMPONENT ================= */

interface MarketingAgencyCardProps {
  agency?: any;
  onViewDetails: (agency: any) => void;
  onGetBestPrice?: (agency: any) => void;
}

const SingleMarketingAgencyCard: React.FC<MarketingAgencyCardProps> = ({
  agency,
  onViewDetails,
  onGetBestPrice,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get all available photos from agency data
  const getPhotos = useCallback(() => {
    if (!agency) return [];
    const agencyId = agency.id || "agency_1";
    return AGENCY_IMAGES_MAP[agencyId] || AGENCY_IMAGES_MAP["agency_1"];
  }, [agency]);

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

  // Get agency name
  const getName = useCallback((): string => {
    if (!agency) return "Marketing Agency";
    return agency.title || "Marketing Agency";
  }, [agency]);

  // Get location string
  const getLocation = useCallback((): string => {
    if (!agency) return "Location";
    return agency.location || agency.description || "Location";
  }, [agency]);

  // Get distance string
  const getDistance = useCallback((): string => {
    if (!agency) return "";
    if (agency.distance !== undefined && agency.distance !== null) {
      const distanceNum = Number(agency.distance);
      if (!isNaN(distanceNum)) {
        return `${distanceNum.toFixed(1)} km`;
      }
    }
    return "";
  }, [agency]);

  // Get description
  const getDescription = useCallback((): string => {
    if (!agency) return "Professional marketing services";
    const agencyId = agency.id || "agency_1";
    return (
      AGENCY_DESCRIPTIONS_MAP[agencyId] ||
      agency.description ||
      "Professional marketing services"
    );
  }, [agency]);

  // Get rating
  const getRating = useCallback((): number | null => {
    if (!agency) return null;
    const agencyData = agency.agencyData as any;
    return agencyData?.rating || null;
  }, [agency]);

  // Get user ratings total
  const getUserRatingsTotal = useCallback((): number | null => {
    if (!agency) return null;
    const agencyData = agency.agencyData as any;
    return agencyData?.user_ratings_total || null;
  }, [agency]);

  // Get years in business
  const getYearsInBusiness = useCallback((): number | null => {
    if (!agency) return null;
    const agencyData = agency.agencyData as any;
    return agencyData?.years_in_business || null;
  }, [agency]);

  // Get special tags
  const getSpecialTags = useCallback((): string[] => {
    if (!agency) return [];
    const agencyData = agency.agencyData as any;
    return agencyData?.special_tags || [];
  }, [agency]);

  // Get phone number
  const getPhoneNumber = useCallback((): string | null => {
    if (!agency) return null;
    const agencyId = agency.id || "";
    const agencyData = agency.agencyData as any;
    return agencyData?.phone || PHONE_NUMBERS_MAP[agencyId] || null;
  }, [agency]);

  // Handle call button press
  const handleCall = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!agency) return;

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
    [agency, getPhoneNumber, getName]
  );

  // Handle WhatsApp button press
  const handleWhatsApp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!agency) return;

      const phoneNumber = getPhoneNumber();
      const name = getName();

      if (!phoneNumber) {
        alert(`No WhatsApp number available for ${name}.`);
        return;
      }

      const formattedNumber = phoneNumber.replace(/[^0-9+]/g, "");
      const message = encodeURIComponent(
        `Hi, I'm interested in your marketing services. Can you provide more information?`
      );
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    },
    [agency, getPhoneNumber, getName]
  );

  // Handle get best price
  const handleGetBestPrice = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onGetBestPrice) {
        onGetBestPrice(agency);
      }
    },
    [agency, onGetBestPrice]
  );

  // Handle image loading error
  const handleImageError = useCallback(() => {
    console.warn("⚠️ Failed to load image for agency:", agency?.id || "unknown");
    setImageError(true);
  }, [agency]);

  // Compute derived values
  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const yearsInBusiness = getYearsInBusiness();
  const distance = getDistance();
  const description = getDescription();
  const specialTags = getSpecialTags();
  const visibleServices = MARKETING_SERVICES.slice(0, 4);
  const moreServices =
    MARKETING_SERVICES.length > 4 ? MARKETING_SERVICES.length - 4 : 0;
  const hasPhoneNumber = getPhoneNumber() !== null;

  // Early return if agency is not provided
  if (!agency) {
    return null;
  }

  return (
    <div
      onClick={() => onViewDetails(agency)}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 hover:-translate-y-1"
    >
      {/* Image Carousel with Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-br from-purple-50 to-pink-100 overflow-hidden">
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
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-200">
            <div className="text-center">
              <Target size={64} className="text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Marketing Agency</p>
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
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Agency Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
          {getName()}
        </h3>

        {/* Location and Distance Row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start text-gray-600 flex-1">
            <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5 text-purple-500" />
            <span className="text-sm line-clamp-2">{getLocation()}</span>
          </div>
          {distance && (
            <span className="text-sm font-bold text-purple-600 ml-2 whitespace-nowrap">
              {distance}
            </span>
          )}
        </div>

        {/* Years in Business Badge */}
        {yearsInBusiness && (
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-lg mb-3 border border-purple-200">
            <Briefcase size={12} />
            <span>{yearsInBusiness} Years in Business</span>
          </div>
        )}

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
            .filter((tag) => !tag.toLowerCase().includes("verified") && !tag.toLowerCase().includes("trending") && !tag.toLowerCase().includes("business"))
            .slice(0, 2)
            .map((tag, index) => (
              <span
                key={index}
                className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200"
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
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-xl mb-4 shadow-md">
          <Sparkles size={14} />
          <span>Marketing Agency</span>
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
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
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
            onClick={handleGetBestPrice}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 font-bold text-xs py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={15} />
            <span>Get Price</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component - displays grid of dummy data or single card
const MarketingAgenciesCard: React.FC<MarketingAgencyCardProps> = (props) => {
  // If no agency is provided, render the grid of dummy agencies
  if (!props.agency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl shadow-lg">
              <Target size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Marketing Agencies in Padma Nagar Chintal
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                <Users size={14} />
                <span>3614+ verified listings available</span>
              </p>
            </div>
          </div>
          
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-md">
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
          {DUMMY_MARKETING_AGENCIES.map((agency) => (
            <SingleMarketingAgencyCard
              key={agency.place_id}
              agency={{
                id: agency.place_id,
                title: agency.name,
                location: agency.vicinity,
                distance: agency.distance,
                category: "Marketing Agency",
                agencyData: {
                  rating: agency.rating,
                  user_ratings_total: agency.user_ratings_total,
                  years_in_business: agency.years_in_business,
                  geometry: agency.geometry,
                  business_status: agency.business_status,
                  price_level: agency.price_level,
                  types: agency.types,
                  special_tags: agency.special_tags,
                  phone: agency.phone,
                },
              }}
              onViewDetails={props.onViewDetails}
              onGetBestPrice={props.onGetBestPrice}
            />
          ))}
        </div>
      </div>
    );
  }

  // If agency is provided, render individual card
  return (
    <SingleMarketingAgencyCard
      agency={props.agency}
      onViewDetails={props.onViewDetails}
      onGetBestPrice={props.onGetBestPrice}
    />
  );
};

export default MarketingAgenciesCard;