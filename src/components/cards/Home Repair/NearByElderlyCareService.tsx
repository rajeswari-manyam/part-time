import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Zap,
} from "lucide-react";

/* ================= TYPES ================= */

export interface ElderCareService {
  id: string;
  name: string;
  description?: string;
  location?: string;
  distance?: number;
  rating?: number;
  totalRatings?: number;
  isVerified?: boolean;
  isResponsive?: boolean;
  services?: string[];
  photos?: string[];
  geometry?: { lat: number; lng: number };
}

interface Props {
  service: ElderCareService;
  onViewDetails: (service: ElderCareService) => void;
}

/* ================= PHONE MAP ================= */

const PHONE_MAP: Record<string, string> = {
  service_1: "08904990694",
  service_2: "07947481092",
  service_3: "08123872364",
  service_4: "09035048696",
};

/* ================= CARD ================= */

const ElderCareCafeCard: React.FC<Props> = ({ service, onViewDetails }) => {
  const [index, setIndex] = useState(0);
  const photos = service.photos || [];

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((p) => (p + 1) % photos.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((p) => (p - 1 + photos.length) % photos.length);
  };

  const call = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = PHONE_MAP[service.id];
    if (phone) window.location.href = `tel:${phone}`;
  };

  const directions = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (service.geometry) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${service.geometry.lat},${service.geometry.lng}`,
        "_blank"
      );
    }
  };

  return (
    <div
      onClick={() => onViewDetails(service)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 shrink-0">
        {photos[index] ? (
          <>
            <img
              src={photos[index]}
              className="w-full h-full object-cover"
              alt={service.name}
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            ❤️
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {service.isVerified && (
            <span className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
              <CheckCircle size={12} /> Verified
            </span>
          )}
          {service.isResponsive && (
            <span className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
              <Zap size={12} /> Fast
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
          {service.name}
        </h2>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={14} />
          <span className="line-clamp-1">{service.location}</span>
        </div>

        {service.distance && (
          <p className="text-xs font-semibold text-green-600">
            {service.distance} km away
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-3 mb-auto">
          {service.description}
        </p>

        {/* Rating */}
        {service.rating && (
          <div className="flex items-center gap-2 text-sm">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{service.rating}</span>
            <span className="text-gray-500">
              ({service.totalRatings})
            </span>
          </div>
        )}

        {/* Services */}
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">
            Services
          </p>
          <div className="flex flex-wrap gap-2">
            {(service.services || []).slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs"
              >
                ✓ {s}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 mt-auto">
          <button
            onClick={directions}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border-2 border-indigo-600 rounded-lg hover:bg-indigo-100 font-semibold"
          >
            <Navigation size={16} />
            Directions
          </button>
          <button
            onClick={call}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 border-2 border-green-600 rounded-lg hover:bg-green-100 font-semibold"
          >
            <Phone size={16} />
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= LIST ================= */

const ElderlyCareCafeScreen: React.FC<{ services: ElderCareService[] }> = ({
  services,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <ElderCareCafeCard
          key={s.id}
          service={s}
          onViewDetails={(v) => console.log(v.name)}
        />
      ))}
    </div>
  );
};

export default ElderlyCareCafeScreen;
