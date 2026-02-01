import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone, Star, CheckCircle, Droplets } from "lucide-react";

/* ================= TYPES ================= */
export interface Supplier {
  id: string;
  name: string;
  description: string;
  location: string;
  distance: number;
  rating: number;
  totalRatings: number;
  isTrending?: boolean;
  isVerified?: boolean;
  services: string[];
  photos: string[];
}

interface SupplierCardProps {
  supplier?: Supplier;
  onViewDetails: (supplier: Supplier) => void;
}

/* ================= CONSTANTS ================= */
const PHONE_NUMBERS: Record<string, string> = {
  supplier_1: "07947150218",
  supplier_2: "07942689240",
  supplier_3: "07947433946",
  supplier_4: "07942682221",
};

const SUPPLIERS: Supplier[] = [
  // same data as your original SUPPLIERS array
];

/* ================= SINGLE CARD ================= */
const SingleSupplierCard: React.FC<SupplierCardProps> = ({ supplier, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!supplier) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % supplier.photos.length);
  };
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + supplier.photos.length) % supplier.photos.length);
  };
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = PHONE_NUMBERS[supplier.id];
    if (phone) window.location.href = `tel:${phone}`;
  };

  const visibleServices = supplier.services.slice(0, 4);
  const moreServices = supplier.services.length - 4;

  return (
    <div
      onClick={() => onViewDetails(supplier)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-[0.99]"
    >
      {/* Image Carousel */}
      <div className="relative h-48 bg-gray-100">
        {supplier.photos.length ? (
          <>
            <img
              src={supplier.photos[currentImageIndex]}
              alt={supplier.name}
              className="w-full h-full object-cover"
            />
            {supplier.photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                  {currentImageIndex + 1}/{supplier.photos.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Droplets size={64} className="text-blue-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {supplier.isTrending && (
            <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              Trending
            </span>
          )}
          {supplier.isVerified && (
            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="text-[16px] font-bold text-gray-900 mb-1.5 line-clamp-2">{supplier.name}</h3>

        <div className="flex items-center text-gray-500 mb-1 text-[13px]">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{supplier.location}</span>
        </div>

        <p className="text-xs font-semibold text-red-600 mb-2">{supplier.distance.toFixed(1)} km away</p>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {visibleServices.map((service, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-1 rounded"
            >
              <CheckCircle size={11} /> {service}
            </span>
          ))}
          {moreServices > 0 && (
            <span className="inline-flex items-center bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-1 rounded">
              +{moreServices} more
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3 mb-2">{supplier.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-[12px] font-semibold text-gray-900">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            {supplier.rating.toFixed(1)} ({supplier.totalRatings})
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-1 border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold text-xs py-2.5 rounded-lg"
          >
            <Phone size={14} /> Call
          </button>

          <button
            onClick={() => onViewDetails(supplier)}
            className="flex-1 flex items-center justify-center gap-1 border-2 border-green-600 bg-green-50 text-green-700 font-bold text-xs py-2.5 rounded-lg"
          >
            Get Deal
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= GRID/Wrappper Component ================= */
const MineralWaterSuppliers: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleViewDetails = (supplier: Supplier) => setSelectedSupplier(supplier);

  if (selectedSupplier) {
    return <SingleSupplierCard supplier={selectedSupplier} onViewDetails={handleViewDetails} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SUPPLIERS.map((supplier) => (
          <SingleSupplierCard key={supplier.id} supplier={supplier} onViewDetails={handleViewDetails} />
        ))}
      </div>
    </div>
  );
};

export default MineralWaterSuppliers;
