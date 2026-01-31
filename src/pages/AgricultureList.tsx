import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

/* ================= AGRICULTURE CARDS ================= */

import TractorServiceCard from "../components/cards/Agriculture/NearByTractor";
import WaterPumpServiceCard from "../components/cards/Agriculture/NearByWaterPumpService";
import FertilizerDealerCard from "../components/cards/Agriculture/NearByFertilizerShops";
import SeedDealerCard from "../components/cards/Agriculture/NearBySeedDealer";
import FarmingToolCard from "../components/cards/Agriculture/NearByFarmingTools";
import VeterinaryClinicCard from "../components/cards/Agriculture/NearByVetenary";

/* ================= TYPES ================= */

export interface AgricultureService {
    id: string;
    title: string;
    location: string;
    description: string;
    category: string;
    agricultureData?: {
        status?: boolean;
        rating?: number;
        user_ratings_total?: number;
        phone?: string;
        photos?: string[];
        services?: string[];
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
                className="p-2 bg-white/70 hover:bg-white rounded-full shadow"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-xl z-20 min-w-[140px]">
                        <button
                            onClick={(e) => onEdit(serviceId, e)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-green-600"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={(e) => onDelete(serviceId, e)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600"
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

const AgricultureServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<AgricultureService[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    /* ================= HELPERS ================= */

    const normalize = (value?: string) =>
        value?.toLowerCase().replace(/\s+/g, "-") || "";

    const getTitle = () =>
        subcategory
            ? subcategory
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")
            : "Agriculture Services";

    /* ================= CARD MATCHING ================= */

    const getCardComponent = (): React.ComponentType<any> | null => {
        const sub = normalize(subcategory);

        if (sub.includes("tractor")) return TractorServiceCard;
        if (sub.includes("water") || sub.includes("pump")) return WaterPumpServiceCard;
        if (sub.includes("fertilizer")) return FertilizerDealerCard;
        if (sub.includes("seed")) return SeedDealerCard;
        if (sub.includes("tool")) return FarmingToolCard;
        if (sub.includes("veterinary") || sub.includes("animal"))
            return VeterinaryClinicCard;

        return null;
    };

    const shouldShowNearbyCards = () => !!getCardComponent();

    /* ================= ACTIONS ================= */

    const handleView = (service: any) => {
        navigate(`/agriculture-services/details/${service.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-agriculture-service-form/${id}`);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Delete this service?")) return;
        setServices((prev) => prev.filter((s) => s.id !== id));
    };

    const handleAddPost = () => {
        navigate("/add-agriculture-service-form");
    };

    /* ================= RENDER NEARBY ================= */

    const renderNearbyCards = () => {
        const Card = getCardComponent();
        if (!Card) return null;

        return (
            <div className="space-y-10">
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        🌾 Nearby {getTitle()}
                    </h2>
                    <Card onViewDetails={handleView} />
                </div>

                {services.length > 0 && (
                    <>
                        <div className="flex items-center gap-4 my-10">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="px-4 py-1 bg-white border rounded-full text-sm font-semibold">
                                🌱 Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <Card job={service} onViewDetails={handleView} />
                                    <div className="absolute top-3 right-3">
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

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" />
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {getTitle()}
                    </h1>
                 <Button
  variant="gradient-blue"
  className="bg-green-600 hover:bg-green-700"
  onClick={handleAddPost}
>
  + Add Post
</Button>

                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        {error}
                    </div>
                )}

                {shouldShowNearbyCards() ? (
                    renderNearbyCards()
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🌾</div>
                        <h3 className="text-xl font-bold">No Services Found</h3>
                        <p className="text-gray-600">
                            Be the first to add a service in this category
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgricultureServicesList;
