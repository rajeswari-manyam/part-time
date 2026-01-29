import React, { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Award,
  Scale,
  CheckCircle,
  Briefcase,
} from "lucide-react";

/* ================= TYPES ================= */

export interface LawyerService {
  place_id: string;
  name: string;
  vicinity: string;
  distance?: number;
  photos: { photo_reference: string }[];
  geometry: {
    location: { lat: number; lng: number };
  };
  business_status: string;
  specializations: string[];
  phone?: string;
  whatsapp?: string;
}

/* ================= CONSTANTS ================= */

// Export dummy lawyers data
export const DUMMY_LAWYERS: LawyerService[] = [
  {
    place_id: "lawyer_1",
    name: "Credence Associates",
    vicinity: "Gunrock Road Trimulgherry, Hyderabad",
    distance: 3.2,
    photos: [{ photo_reference: "lawyer_photo_1" }],
    geometry: {
      location: { lat: 17.4435, lng: 78.4895 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Lawyers", "Lawyers For High Court"],
    phone: "08460412283",
    whatsapp: "08460412283",
  },
  {
    place_id: "lawyer_2",
    name: "TSA Advocates & Solicitors",
    vicinity: "Road No 1 Banjara Hills, Hyderabad",
    distance: 8.2,
    photos: [{ photo_reference: "lawyer_photo_2" }],
    geometry: {
      location: { lat: 17.4239, lng: 78.4738 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Lawyers", "Lawyers For High Court"],
    phone: "08460494569",
    whatsapp: "08460494569",
  },
  {
    place_id: "lawyer_3",
    name: "Jayaprakash Katighar",
    vicinity: "Ameerpet, Hyderabad",
    distance: 5.8,
    photos: [{ photo_reference: "lawyer_photo_3" }],
    geometry: {
      location: { lat: 17.4374, lng: 78.4482 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Lawyers", "Lawyers For High Court"],
    phone: "08511414405",
    whatsapp: "08511414405",
  },
  {
    place_id: "lawyer_4",
    name: "Arun Satyavolu & Co Advocates LLP",
    vicinity: "Kubera Towers Himayat Nagar, Hyderabad",
    distance: 10.5,
    photos: [{ photo_reference: "lawyer_photo_4" }],
    geometry: {
      location: { lat: 17.4019, lng: 78.4863 },
    },
    business_status: "OPERATIONAL",
    specializations: ["Lawyers", "Civil Lawyers"],
    phone: "08511319783",
    whatsapp: "08511319783",
  },
];

// Lawyer images
const LAWYER_IMAGES_MAP: { [key: string]: string[] } = {
  lawyer_1: [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800",
    "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800",
  ],
  lawyer_2: [
    "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800",
  ],
  lawyer_3: [
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800",
  ],
  lawyer_4: [
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800",
  ],
};

// Lawyer descriptions
const LAWYER_DESCRIPTIONS_MAP: { [key: string]: string } = {
  lawyer_1:
    "Experienced legal professionals specializing in High Court matters. Providing expert counsel and representation for complex legal cases.",
  lawyer_2:
    "Trusted advocates with extensive experience in litigation and legal advisory services. Located in prestigious Banjara Hills.",
  lawyer_3:
    "Dedicated High Court lawyer with proven track record in civil and criminal cases. Personalized legal solutions.",
  lawyer_4:
    "Leading law firm offering comprehensive legal services. Expert team specializing in civil law and corporate matters.",
};

// Legal services offered
const LEGAL_SERVICES = [
  "Civil Law",
  "Criminal Defense",
  "Corporate Law",
  "Family Law",
  "Property Disputes",
  "High Court Matters",
  "Legal Advisory",
  "Litigation Support",
];

/* ================= COMPONENT ================= */

interface NearbyLawyerCardProps {
  job?: any;
  onViewDetails: (job: any) => void;
}

const SingleLawyerCard: React.FC<NearbyLawyerCardProps> = ({
  job,
  onViewDetails,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const getPhotos = useCallback(() => {
    if (!job) return [];
    const jobId = job.id || "lawyer_1";
    return LAWYER_IMAGES_MAP[jobId] || LAWYER_IMAGES_MAP["lawyer_1"];
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
    if (!job) return "Legal Services";
    return job.title || "Legal Services";
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

  const getDescription = useCallback((): string => {
    if (!job) return "Professional legal services";
    const jobId = job.id || "lawyer_1";
    return (
      LAWYER_DESCRIPTIONS_MAP[jobId] ||
      job.description ||
      "Professional legal services"
    );
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
    console.warn("⚠️ Failed to load image for lawyer:", job?.id || "unknown");
    setImageError(true);
  }, [job]);

  const distance = getDistance();
  const description = getDescription();
  const specializations = getSpecializations();
  const visibleServices = LEGAL_SERVICES.slice(0, 4);
  const moreServices = LEGAL_SERVICES.length > 4 ? LEGAL_SERVICES.length - 4 : 0;
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
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-amber-100">
            <span className="text-6xl">⚖️</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        {/* Lawyer Name */}
        <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2">
          {getName()}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 mb-1">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="text-[13px] line-clamp-1">{getLocation()}</span>
        </div>

        {/* Distance */}
        {distance && (
          <p className="text-xs font-semibold text-amber-700 mb-2">{distance}</p>
        )}

        {/* Specializations */}
        {specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {specializations.map((spec, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-[13px] text-gray-600 leading-relaxed mb-2.5 line-clamp-3">
          {description}
        </p>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[11px] font-semibold px-2 py-1 rounded-xl mb-2">
          <Scale size={12} />
          <span>Legal Services</span>
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
                className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[11px] font-medium px-2 py-1 rounded"
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            disabled={!hasPhoneNumber}
            className={`flex-1 flex items-center justify-center gap-1 font-bold text-xs py-2.5 rounded-lg transition-all active:scale-95 ${
              hasPhoneNumber
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Phone size={14} />
            <span>Call</span>
          </button>

          <button
            onClick={handleWhatsApp}
            disabled={!hasWhatsApp}
            className={`flex-1 flex items-center justify-center gap-1 font-bold text-xs py-2.5 rounded-lg transition-all active:scale-95 ${
              hasWhatsApp
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleSendEnquiry}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            <Briefcase size={14} />
            <span>Enquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component
const NearbyLawyerCard: React.FC<NearbyLawyerCardProps> = (props) => {
  if (!props.job) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {DUMMY_LAWYERS.map((lawyer) => (
          <SingleLawyerCard
            key={lawyer.place_id}
            job={{
              id: lawyer.place_id,
              title: lawyer.name,
              location: lawyer.vicinity,
              distance: lawyer.distance,
              category: "Legal Services",
              jobData: {
                specializations: lawyer.specializations,
                geometry: lawyer.geometry,
                business_status: lawyer.business_status,
                phone: lawyer.phone,
                whatsapp: lawyer.whatsapp,
              },
            }}
            onViewDetails={props.onViewDetails}
          />
        ))}
      </div>
    );
  }

  return <SingleLawyerCard job={props.job} onViewDetails={props.onViewDetails} />;
};

export default NearbyLawyerCard;