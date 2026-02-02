import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// ================= CARD IMPORTS =================
import NearbyMaidCard from "../components/cards/Home Repair/NearByMaidService";
import NearbyCookCard from "../components/cards/Home Repair/NearByCookingCard";
import BabySitterCard from "../components/cards/Home Repair/NearBy BabySitterServices";
import ElderCareCard from "../components/cards/Home Repair/NearByElderlyCareService";
import HousekeepingCard from "../components/cards/Home Repair/NearByHouseKeepingService";
import NearbyLaundryCard from "../components/cards/Home Repair/NearByLaundaryCard";
import MineralWaterSuppliers from "../components/cards/Home Repair/NearByWaterSuppliers";

// ================= TYPES =================
export interface HomePersonalService {
    id: string;
    title: string;
    location: string;
    description: string;
    category: string;
}

// ================= ACTION DROPDOWN =================
const ActionDropdown: React.FC<{
    serviceId: string;
    onEdit: (id: string, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ serviceId, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 bg-white rounded-full shadow"
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-20">
                    <button
                        onClick={(e) => {
                            onEdit(serviceId, e);
                            setOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={(e) => {
                            onDelete(serviceId, e);
                            setOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-red-100 text-red-600"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// ================= MAIN COMPONENT =================
const HomePersonalServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<HomePersonalService[]>([]);

    // ---------- Helpers ----------
    const normalize = (val?: string) => val?.toLowerCase() || "";

    const getTitle = () =>
        subcategory
            ? subcategory
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")
            : "Home & Personal Services";

    // ---------- Smart Card Matching (LIKE AUTOMOTIVE) ----------
    const getCardComponent = (): React.ComponentType<any> | null => {
        const s = normalize(subcategory);

        if (s.includes("maid")) return NearbyMaidCard;
        if (s.includes("cook")) return NearbyCookCard;
        if (s.includes("baby") || s.includes("sitter")) return BabySitterCard;
        if (s.includes("elder")) return ElderCareCard;
        if (s.includes("house") || s.includes("keeping")) return HousekeepingCard;
        if (s.includes("laundry")) return NearbyLaundryCard;
        if (s.includes("water")) return MineralWaterSuppliers;

        return null;
    };

    const shouldShowNearbyCards = () => !!getCardComponent();

    // ---------- Handlers ----------
    const handleAddPost = () => {
        navigate("/add-home-personal-service-form");
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-home-personal-service-form/${id}`);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Delete this service?")) return;
        setServices((prev) => prev.filter((s) => s.id !== id));
    };

    // ---------- Render Nearby Section ----------
    const renderNearbySection = () => {
        const CardComponent = getCardComponent();
        if (!CardComponent) return null;

        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    🏠 Nearby {getTitle()}
                </h2>

                <CardComponent />

                {services.length > 0 && (
                    <>
                        <div className="flex items-center my-8 gap-4">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="px-4 py-2 bg-white border rounded-full text-sm font-semibold">
                                🏠 Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <CardComponent job={service} />
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

    // ================= RENDER =================
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{getTitle()}</h1>
                    <Button variant="gradient-blue" onClick={handleAddPost}>
                        + Add Post
                    </Button>
                </div>

                {/* Content */}
                {shouldShowNearbyCards() ? (
                    renderNearbySection()
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        No services found for this category
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePersonalServicesList;
