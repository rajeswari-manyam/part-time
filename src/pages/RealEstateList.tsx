import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

/* ---------------- Nearby Cards ---------------- */

import NearbyPropertyDealersCard from "../components/cards/RealEstate/NearProperty";
import NearbyBuildersCard from "../components/cards/RealEstate/NearByBuilders";
import NearbyInteriorDesignersCard from "../components/cards/RealEstate/NearByInteriorDesigns";
import NearbyRentLeaseCard from "../components/cards/RealEstate/NearByrental";
import NearbyConstructionContractorsCard from "../components/cards/RealEstate/NearByConstructorContractors";

/* ---------------- TYPES ---------------- */

export interface RealEstateType {
    id: string;
    title: string;
    location: string;
    description: string;
    category: string;
    jobData?: {
        status: boolean;
        pincode: string;
        icon: string;
        propertyType?: string;
        price?: string;
        area?: string;
        bedrooms?: number;
        bathrooms?: number;
        amenities?: string[];
    };
}

/* ---------------- ACTION DROPDOWN ---------------- */

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
                className="p-2 bg-white/80 rounded-full shadow"
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[140px]">
                        <button
                            onClick={(e) => onEdit(serviceId, e)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
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

/* ---------------- MAIN COMPONENT ---------------- */

const RealEstateList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<RealEstateType[]>([]);
    const [loading, setLoading] = useState(false);

    /* ---------------- HANDLERS ---------------- */

    const handleView = (job: RealEstateType) => {
        navigate(`/real-estate/details/${job.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-real-estate-form/${id}`);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Delete this listing?")) return;
        setServices((prev) => prev.filter((s) => s.id !== id));
    };

    const handleAddPost = () => {
        navigate("/add-real-estate-form");
    };

    /* ---------------- UTILITIES ---------------- */

    const getDisplayTitle = () => {
        if (!subcategory) return "All Real Estate Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    const normalizeSubcategory = (sub?: string) =>
        sub?.toLowerCase().replace(/-/g, " ") || "";

    /* ---------------- CARD MATCHING ---------------- */

    const getNearbyCardComponent = (
        sub?: string
    ): React.ComponentType<any> | null => {
        const normalized = normalizeSubcategory(sub);

        if (normalized.includes("property")) return NearbyPropertyDealersCard;
        if (normalized.includes("builder")) return NearbyBuildersCard;
        if (normalized.includes("interior")) return NearbyInteriorDesignersCard;
        if (normalized.includes("rent") || normalized.includes("lease"))
            return NearbyRentLeaseCard;
        if (normalized.includes("construction"))
            return NearbyConstructionContractorsCard;

        return null;
    };

    const shouldShowNearbyCards = () =>
        Boolean(getNearbyCardComponent(subcategory));

    /* ---------------- RENDER NEARBY SECTION ---------------- */

    const renderNearbySection = () => {
        const CardComponent = getNearbyCardComponent(subcategory);
        if (!CardComponent) return null;

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        🏠 Nearby {getDisplayTitle()}
                    </h2>
                    <CardComponent onViewDetails={handleView} />
                </div>

                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-sm font-semibold px-4 py-2 bg-white border rounded-full">
                                🏠 Your Listings ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="relative">
                                    <CardComponent
                                        job={service}
                                        onViewDetails={handleView}
                                    />
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

    /* ---------------- UI ---------------- */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{getDisplayTitle()}</h1>
                    <Button variant="gradient-blue" onClick={handleAddPost}>
                        + Add Listing
                    </Button>
                </div>

                {shouldShowNearbyCards() ? (
                    renderNearbySection()
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-bold">
                            No Listings Found
                        </h3>
                        <p className="text-gray-600">
                            Be the first to add a listing in this category!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealEstateList;
