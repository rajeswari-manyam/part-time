import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// ================= SPORTS CARD IMPORTS =================
import NearbyPlayAreaCard from "../components/cards/Sports/NearByPlayArear";
import NearbySportsCard from "../components/cards/Sports/NearBySports";
import NearbyFitnessCard from "../components/cards/Beauty/NearByFittness";
import NearbyStadiumCard from "../components/cards/Sports/NearByStadium";

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
        className="p-2 hover:bg-white/80 bg-white/60 backdrop-blur-sm rounded-full transition shadow-sm"
      >
        <MoreVertical size={18} className="text-gray-700" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-20">
            <button
              onClick={(e) => {
                onEdit(serviceId, e);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 text-blue-600"
            >
              ✏️ Edit
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={(e) => {
                onDelete(serviceId, e);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const SportsServicesList: React.FC = () => {
  const { subcategory } = useParams<{ subcategory?: string }>();
  const navigate = useNavigate();

  const [services, setServices] = useState<SportsServiceType[]>([]);
  const [loading] = useState(false);
  const [error] = useState("");

  /* ================= HANDLERS ================= */

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
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddPost = () => {
    navigate("/add-sports-service-form");
  };

  /* ================= HELPERS ================= */

  const getDisplayTitle = () => {
    if (!subcategory) return "All Sports Services";
    return subcategory
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const normalizeSubcategory = (sub?: string) =>
    sub ? sub.toLowerCase() : "";

  const getCardComponentForSubcategory = (
    sub?: string
  ): React.ComponentType<any> | null => {
    const normalized = normalizeSubcategory(sub);

    if (normalized.includes("gym") || normalized.includes("fitness"))
      return NearbyFitnessCard;

    if (
      normalized.includes("sports") &&
      (normalized.includes("club") || normalized.includes("academy"))
    )
      return NearbySportsCard;

    if (
      normalized.includes("play") ||
      normalized.includes("indoor") ||
      normalized.includes("kids")
    )
      return NearbyPlayAreaCard;

    if (normalized.includes("stadium") || normalized.includes("ground"))
      return NearbyStadiumCard;

    return null;
  };

  const shouldShowNearbyCards = () => {
    if (!subcategory) return false;
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
    ];
    return keywords.some((k) =>
      normalizeSubcategory(subcategory).includes(k)
    );
  };

  const renderNearbyCardsSection = () => {
    const CardComponent = getCardComponentForSubcategory(subcategory);
    if (!CardComponent) return null;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🏆 Nearby {getDisplayTitle()}
          </h2>
          <CardComponent onViewDetails={handleView} />
        </div>

        {services.length > 0 && (
          <>
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border">
                💪 Your Listed Services ({services.length})
              </span>
              <div className="flex-1 h-px bg-gray-300" />
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

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {getDisplayTitle()}
          </h1>
          <Button variant="gradient-blue" size="md" onClick={handleAddPost}>
            + Add Post
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        {shouldShowNearbyCards() ? (
          renderNearbyCardsSection()
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800">
              No Services Found
            </h3>
            <p className="text-gray-600">
              Be the first to add a sports service!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative bg-white rounded-xl border hover:shadow-lg cursor-pointer"
                onClick={() => handleView(service)}
              >
                <div className="absolute top-3 right-3 z-10">
                  <ActionDropdown
                    serviceId={service.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>

                <div className="h-48 bg-blue-50 flex items-center justify-center text-5xl">
                  {service.jobData?.icon || "🏃"}
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="font-bold">{service.title}</h2>
                  <p className="text-sm text-gray-600">
                    {service.location}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SportsServicesList;
