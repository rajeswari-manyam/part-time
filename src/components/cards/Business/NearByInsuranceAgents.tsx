import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  TrendingUp,
  Shield,
  Award,
  Users,
  CheckCircle2,
  Send,
} from "lucide-react";

/* ================= TYPES ================= */

export interface InsuranceAgent {
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

// Phone numbers map for insurance agents
const PHONE_NUMBERS_MAP: { [key: string]: string } = {
  agent_1: "09035885310",
  agent_2: "08128982227",
  agent_3: "09606291804",
  agent_4: "08147954240",
  agent_5: "08919972879",
};

// Dummy insurance agents data based on the JustDial screenshots
export const DUMMY_INSURANCE_AGENTS: InsuranceAgent[] = [
  {
    place_id: "agent_1",
    name: "Health & Motor Insurance Services",
    vicinity: "Malkajgiri Malkajgiri, Hyderabad",
    rating: 5.0,
    user_ratings_total: 1,
    photos: [{ photo_reference: "agent_photo_1" }],
    geometry: {
      location: { lat: 17.4474, lng: 78.5271 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["insurance_agents", "two_wheeler_insurance"],
    special_tags: ["Top Rated", "Quick Response", "Verified"],
    distance: 10.0,
    phone: "09035885310",
  },
  {
    place_id: "agent_2",
    name: "Virat Health Insurance",
    vicinity: "MAMIDIPALLY VILLAGE BALAPUR MANDAL RANGA REDDY Shamshabad, Rangareddy",
    rating: 4.5,
    user_ratings_total: 2,
    photos: [{ photo_reference: "agent_photo_2" }],
    geometry: {
      location: { lat: 17.2543, lng: 78.4263 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["life_insurance_agents", "health_insurance_agents"],
    special_tags: ["Trending", "LIC Verified", "Responsive"],
    distance: 26.3,
    phone: "08128982227",
  },
  {
    place_id: "agent_3",
    name: "Ramakrishna LIC ADVISOR",
    vicinity: "100 Feet Road Madhapur, Hyderabad",
    rating: 5.0,
    user_ratings_total: 1,
    photos: [{ photo_reference: "agent_photo_3" }],
    geometry: {
      location: { lat: 17.4484, lng: 78.3908 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["insurance_agents"],
    special_tags: ["Top Rated", "Verified", "Trust"],
    distance: 8.4,
    phone: "09606291804",
  },
  {
    place_id: "agent_4",
    name: "Kumar's Insurance Advisors Teamn",
    vicinity: "Kamala Nagar As Rao Nagar, Hyderabad",
    rating: 4.3,
    user_ratings_total: 44,
    photos: [{ photo_reference: "agent_photo_4" }],
    geometry: {
      location: { lat: 17.4865, lng: 78.5458 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["life_insurance_agents", "insurance_agents"],
    special_tags: ["Popular", "Experienced Team", "Multiple Policies"],
    distance: 11.7,
    phone: "08147954240",
  },
  {
    place_id: "agent_5",
    name: "Srinivas Reddy Insurance",
    vicinity: "New Lalitha Nagar Colony Jillelaguda, Hyderabad",
    rating: 5.0,
    user_ratings_total: 2,
    photos: [{ photo_reference: "agent_photo_5" }],
    geometry: {
      location: { lat: 17.3616, lng: 78.4804 },
    },
    business_status: "OPERATIONAL",
    price_level: 2,
    types: ["insurance_agents", "car_insurance_agents"],
    special_tags: ["Trusted Advisor", "Comprehensive Coverage", "Best Rates"],
    distance: 19.3,
    phone: "08919972879",
  },
];

// Insurance agent images (office/professional photos)
const AGENT_IMAGES_MAP: { [key: string]: string[] } = {
  agent_1: [
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
  ],
  agent_2: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
  ],
  agent_3: [
    "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
  ],
  agent_4: [
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
  ],
  agent_5: [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  ],
};

// Insurance agent descriptions
const AGENT_DESCRIPTIONS_MAP: { [key: string]: string } = {
  agent_1:
    "Specialized in Health & Motor Insurance with comprehensive coverage options. Top-rated service with quick response time and verified credentials. Expert guidance for all your insurance needs.",
  agent_2:
    "Trending health insurance specialist with LIC verification. Offering life and health insurance policies with competitive rates. Responsive service and trusted by community.",
  agent_3:
    "Top-rated LIC advisor with perfect 5-star rating. Located in Madhapur, providing personalized insurance solutions for individuals and families. Verified and trusted professional.",
  agent_4:
    "Popular insurance advisory team with 44+ satisfied clients. Experienced in life insurance and multiple policy options. Known for excellent customer service and comprehensive coverage.",
  agent_5:
    "Trusted insurance advisor specializing in comprehensive coverage and competitive rates. Expert in car insurance and general insurance policies. Dedicated to finding the best solutions.",
};

// Services offered by insurance agents
const INSURANCE_SERVICES = [
  "Life Insurance",
  "Health Insurance",
  "Motor Insurance",
  "Home Insurance",
  "Term Plans",
  "Investment Plans",
  "Retirement Plans",
  "Child Plans",
];

/* ================= COMPONENT ================= */

interface InsuranceAgentCardProps {
  agent?: any;
  onViewDetails: (agent: any) => void;
  onSendEnquiry?: (agent: any) => void;
}

const SingleInsuranceAgentCard: React.FC<InsuranceAgentCardProps> = ({
  agent,
  onViewDetails,
  onSendEnquiry,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get all available photos from agent data
  const getPhotos = useCallback(() => {
    if (!agent) return [];
    const agentId = agent.id || "agent_1";
    return AGENT_IMAGES_MAP[agentId] || AGENT_IMAGES_MAP["agent_1"];
  }, [agent]);

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

  // Get agent name from agent data
  const getName = useCallback((): string => {
    if (!agent) return "Insurance Agent";
    return agent.title || "Insurance Agent";
  }, [agent]);

  // Get location string from agent data
  const getLocation = useCallback((): string => {
    if (!agent) return "Location";
    return agent.location || agent.description || "Location";
  }, [agent]);

  // Get distance string from agent data
  const getDistance = useCallback((): string => {
    if (!agent) return "";
    if (agent.distance !== undefined && agent.distance !== null) {
      const distanceNum = Number(agent.distance);
      if (!isNaN(distanceNum)) {
        return `${distanceNum.toFixed(1)} km away`;
      }
    }
    return "";
  }, [agent]);

  // Get description
  const getDescription = useCallback((): string => {
    if (!agent) return "Professional insurance services";
    const agentId = agent.id || "agent_1";
    return (
      AGENT_DESCRIPTIONS_MAP[agentId] ||
      agent.description ||
      "Professional insurance services"
    );
  }, [agent]);

  // Get rating from agent data
  const getRating = useCallback((): number | null => {
    if (!agent) return null;
    const agentData = agent.agentData as any;
    return agentData?.rating || null;
  }, [agent]);

  // Get user ratings total from agent data
  const getUserRatingsTotal = useCallback((): number | null => {
    if (!agent) return null;
    const agentData = agent.agentData as any;
    return agentData?.user_ratings_total || null;
  }, [agent]);

  // Get special tags from agent data
  const getSpecialTags = useCallback((): string[] => {
    if (!agent) return [];
    const agentData = agent.agentData as any;
    return agentData?.special_tags || [];
  }, [agent]);

  // Get phone number for the insurance agent
  const getPhoneNumber = useCallback((): string | null => {
    if (!agent) return null;
    const agentId = agent.id || "";
    const agentData = agent.agentData as any;
    return agentData?.phone || PHONE_NUMBERS_MAP[agentId] || null;
  }, [agent]);

  // Handle call button press
  const handleCall = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!agent) return;

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
    [agent, getPhoneNumber, getName]
  );

  // Handle WhatsApp button press
  const handleWhatsApp = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!agent) return;

      const phoneNumber = getPhoneNumber();
      const name = getName();

      if (!phoneNumber) {
        alert(`No WhatsApp number available for ${name}.`);
        return;
      }

      const formattedNumber = phoneNumber.replace(/[^0-9+]/g, "");
      const message = encodeURIComponent(
        `Hi, I'm interested in your insurance services. Can you provide more information?`
      );
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    },
    [agent, getPhoneNumber, getName]
  );

  // Handle send enquiry
  const handleSendEnquiry = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSendEnquiry) {
        onSendEnquiry(agent);
      }
    },
    [agent, onSendEnquiry]
  );

  // Handle image loading error
  const handleImageError = useCallback(() => {
    console.warn("⚠️ Failed to load image for agent:", agent?.id || "unknown");
    setImageError(true);
  }, [agent]);

  // Compute derived values
  const rating = getRating();
  const userRatingsTotal = getUserRatingsTotal();
  const distance = getDistance();
  const description = getDescription();
  const specialTags = getSpecialTags();
  const visibleServices = INSURANCE_SERVICES.slice(0, 4);
  const moreServices =
    INSURANCE_SERVICES.length > 4 ? INSURANCE_SERVICES.length - 4 : 0;
  const hasPhoneNumber = getPhoneNumber() !== null;

  // Early return if agent is not provided
  if (!agent) {
    return null;
  }

  return (
    <div
      onClick={() => onViewDetails(agent)}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
    >
      {/* Image Carousel with Gradient Overlay */}
      <div className="relative h-56 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
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
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="text-center">
              <Shield size={64} className="text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Insurance Agent</p>
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {specialTags.includes("Verified") && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 size={14} />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Agent Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {getName()}
        </h3>

        {/* Location */}
        <div className="flex items-start text-gray-600 mb-2">
          <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5 text-blue-500" />
          <span className="text-sm line-clamp-2">{getLocation()}</span>
        </div>

        {/* Distance */}
        {distance && (
          <p className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-1">
            <span>📍</span>
            {distance}
          </p>
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
            .filter((tag) => tag !== "Verified")
            .slice(0, 2)
            .map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200"
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
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl mb-4 shadow-md">
          <Shield size={14} />
          <span>Insurance Agent</span>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 tracking-wider mb-2.5 flex items-center gap-1">
            <Award size={12} />
            SERVICES OFFERED:
          </p>
          <div className="flex flex-wrap gap-2">
            {visibleServices.map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
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
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 font-bold text-xs py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
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
const InsuranceAgentsCard: React.FC<InsuranceAgentCardProps> = (props) => {
  // If no agent is provided, render the grid of dummy agents
  if (!props.agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Insurance Agents Near You
              </h1>
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                <Users size={14} />
                <span>{DUMMY_INSURANCE_AGENTS.length} verified agents available</span>
              </p>
            </div>
          </div>
          
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
              ⭐ Top Rated
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
              ✓ Jd Verified
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
              ⚡ Quick Response
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200">
              🔥 Popular
            </button>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_INSURANCE_AGENTS.map((agent) => (
            <SingleInsuranceAgentCard
              key={agent.place_id}
              agent={{
                id: agent.place_id,
                title: agent.name,
                location: agent.vicinity,
                distance: agent.distance,
                category: "Insurance Agent",
                agentData: {
                  rating: agent.rating,
                  user_ratings_total: agent.user_ratings_total,
                  geometry: agent.geometry,
                  business_status: agent.business_status,
                  price_level: agent.price_level,
                  types: agent.types,
                  special_tags: agent.special_tags,
                  phone: agent.phone,
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

  // If agent is provided, render individual card
  return (
    <SingleInsuranceAgentCard
      agent={props.agent}
      onViewDetails={props.onViewDetails}
      onSendEnquiry={props.onSendEnquiry}
    />
  );
};

export default InsuranceAgentsCard;