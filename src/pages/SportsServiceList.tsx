import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Plus,
  Trophy,
  Dumbbell,
  Activity,
  Target,
} from "lucide-react";

// Import existing sports card components
import NearbyPlayAreaCard, { DUMMY_PLAY_AREAS } from "../components/cards/Sports/NearByPlayArear";
import NearbySportsCard, { DUMMY_SPORTS_CLUBS } from "../components/cards/Sports/NearBySports";
import NearbyFitnessCard, { DUMMY_FITNESS_CENTRES } from "../components/cards/Beauty/NearByFittness";
import NearbyStadiumCard, { DUMMY_STADIUMS } from "../components/cards/Sports/NearByStadium";

/* ================= TYPES ================= */

export interface SportsServiceType {
  id: string;
  title: string;
  location: string;
  description: string;
  distance?: number;
  category: string;
  jobData?: {
    status: boolean;
    pincode: string;
    icon: string;
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: { open_now: boolean };
    geometry?: { location: { lat: number; lng: number } };
    phone?: string;
    photos?: string[];
    price_range?: string;
    services?: string[];
    special_tags?: string[];
    years_in_business?: number;
  };
}

/* ================= ACTION DROPDOWN ================= */

const ActionDropdown: React.FC<{
  serviceId: string;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ serviceId, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-white/90 bg-white/70 backdrop-blur-md rounded-full transition-all shadow-lg hover:shadow-xl border border-gray-200/50"
        aria-label="More options"
      >
        <MoreVertical size={18} className="text-gray-700" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[160px] z-20 overflow-hidden">
            <button
              onClick={(e) => {
                onEdit(serviceId, e);
                setIsOpen(false);
              }}
              className="w-full px-5 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 flex items-center gap-3 text-cyan-700 font-semibold transition-all group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                ✏️
              </span>
              <span>Edit Service</span>
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={(e) => {
                onDelete(serviceId, e);
                setIsOpen(false);
              }}
              className="w-full px-5 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center gap-3 text-red-600 font-semibold transition-all group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                🗑️
              </span>
              <span>Delete Service</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= STATS CARD ================= */

const StatsCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div
    className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/20 backdrop-blur-sm group hover:scale-105`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-3 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
        {icon}
      </div>
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="text-sm font-semibold text-white/90 uppercase tracking-wide">
      {label}
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */

const SportsServicesList: React.FC = () => {
  const { subcategory } = useParams<{ subcategory?: string }>();
  const navigate = useNavigate();

  const [services, setServices] = useState<SportsServiceType[]>([]);
  const [loading] = useState(false);
  const [error] = useState("");

  const handleView = (service: any) => {
    navigate(`/sports-services/details/${service.id}`);
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/add-sports-service-form/${id}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      setServices((prev) => prev.filter((s) => s.id !== id));
      alert("Service deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  const handleAddPost = () => {
    navigate("/add-sports-service-form");
  };

  const getDisplayTitle = () => {
    if (!subcategory) return "All Sports Services";
    return subcategory
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return "";
    return sub.toLowerCase().trim().replace(/\s+/g, "-");
  };

  const getCardComponentForSubcategory = (
    subcategory: string | undefined
  ): React.ComponentType<any> | null => {
    if (!subcategory) return null;

    const normalized = normalizeSubcategory(subcategory);

    // GYMS / FITNESS CENTRES
    if (
      normalized.includes("gym") ||
      normalized.includes("fitness") ||
      normalized === "fitness-centres-/-gyms"
    ) {
      return NearbyFitnessCard;
    }

    // SPORTS CLUBS
    if (
      normalized.includes("sports") &&
      (normalized.includes("club") || normalized.includes("academy"))
    ) {
      return NearbySportsCard;
    }

    // INDOOR PLAY AREAS
    if (
      normalized.includes("indoor") ||
      normalized.includes("play") ||
      normalized.includes("kids")
    ) {
      return NearbyPlayAreaCard;
    }

    // STADIUMS
    if (normalized.includes("stadium") || normalized.includes("ground")) {
      return NearbyStadiumCard;
    }

    return null;
  };

  const shouldShowNearbyCards = (): boolean => {
    if (!subcategory) return false;

    const normalized = normalizeSubcategory(subcategory);
    const keywords = [
      "gym",
      "fitness",
      "sports",
      "club",
      "academy",
      "play",
      "indoor",
      "stadium",
      "ground",
      "training",
    ];

    return keywords.some((keyword) => normalized.includes(keyword));
  };

  const getDummyCount = () => {
    const normalized = normalizeSubcategory(subcategory);

    if (normalized.includes("gym") || normalized.includes("fitness")) {
      return DUMMY_FITNESS_CENTRES.length;
    }
    if (normalized.includes("sports") && normalized.includes("club")) {
      return DUMMY_SPORTS_CLUBS.length;
    }
    if (normalized.includes("play") || normalized.includes("indoor")) {
      return DUMMY_PLAY_AREAS.length;
    }
    if (normalized.includes("stadium")) {
      return DUMMY_STADIUMS.length;
    }

    return 0;
  };

  const renderNearbyCardsSection = () => {
    const CardComponent = getCardComponentForSubcategory(subcategory);

    if (!CardComponent) {
      return null;
    }

    return (
      <div className="space-y-8">

        {/* Nearby Services */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-2 h-10 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Nearby {getDisplayTitle()}
              </span>
            </h2>
          </div>
          <CardComponent onViewDetails={handleView} />
        </div>

        {/* User Services Section */}
        {services.length > 0 && (
          <>
            <div className="my-12 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider shadow-lg">
                  💪 Your Listed Services ({services.length})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="relative">
                  <CardComponent job={service} onViewDetails={handleView} />
                  <div className="absolute top-3 right-3 z-10">
                    <ActionDropdown
                      serviceId={service.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-cyan-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-bold text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2 leading-tight">
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getDisplayTitle()}
              </span>
            </h1>

          </div>

          <button
            onClick={handleAddPost}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
          >
            <Plus
              size={24}
              className="group-hover:rotate-90 transition-transform"
            />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-lg">
            <p className="text-red-700 font-bold text-lg">{error}</p>
          </div>
        )}

        {/* Content Rendering */}
        {shouldShowNearbyCards() ? (
          renderNearbyCardsSection()
        ) : (
          <>
            {services.length === 0 ? (
              <div className="text-center py-24">
                <div className="mb-8 relative inline-block">
                  <div className="text-8xl animate-bounce">🏆</div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">
                  No Services Found
                </h3>
                <p className="text-gray-600 text-xl font-semibold mb-8 max-w-md mx-auto">
                  Be the champion! Add the first service in this category and
                  inspire others.
                </p>
                <button
                  onClick={handleAddPost}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3"
                >
                  <Plus size={24} />
                  <span>Add First Service</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="relative group bg-white rounded-3xl border-2 border-gray-200 hover:border-cyan-500 hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-1"
                    onClick={() => handleView(service)}
                  >
                    {/* Dropdown */}
                    <div className="absolute top-4 right-4 z-10">
                      <ActionDropdown
                        serviceId={service.id}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>

                    {/* Service Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 z-10 shadow-lg">
                      <span className="text-lg">
                        {service.jobData?.icon || "🏃"}
                      </span>
                      <span>{service.category}</span>
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full h-56 bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 animate-pulse"></div>
                      <span className="text-7xl mb-3 relative z-10">
                        {service.jobData?.icon || "🏃"}
                      </span>
                      <span className="text-sm font-bold text-gray-500 relative z-10">
                        No Image
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h2 className="text-xl font-black text-gray-900 line-clamp-1">
                        {service.title}
                      </h2>
                      <p className="text-sm text-gray-600 font-semibold line-clamp-1 flex items-center gap-2">
                        <span>📍</span>
                        {service.location}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      {service.jobData?.pincode && (
                        <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-xl">
                          <span className="font-bold text-gray-700">
                            Pincode:
                          </span>
                          <span className="text-gray-600 font-semibold">
                            {service.jobData.pincode}
                          </span>
                        </div>
                      )}

                      {service.jobData?.status !== undefined && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center text-sm font-black px-4 py-2 rounded-xl shadow-md ${service.jobData.status
                              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                              : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                              }`}
                          >
                            <span className="mr-2 text-lg">
                              {service.jobData.status ? "✓" : "✗"}
                            </span>
                            {service.jobData.status ? "Available" : "Busy"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SportsServicesList;