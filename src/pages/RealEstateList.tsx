import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Nearby cards (already have dummy data)
import NearbyPropertyDealersCard from "../components/cards/RealEstate/NearProperty";
import NearbyBuildersCard from "../components/cards/RealEstate/NearByBuilders";
import NearbyArchitectsCard from "../components/cards/RealEstate/Nearbyarchitects";
import NearbyInteriorDesignersCard from "../components/cards/RealEstate/NearByInteriorDesigns";
import NearbyRentLeaseCard from "../components/cards/RealEstate/NearByrental";
import NearbyConstructionContractorsCard from "../components/cards/RealEstate/NearByConstructorContractors";

/* ---------------- TYPES ---------------- */

export interface JobType {
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

/* ---------------- DUMMY DATA ---------------- */

const DUMMY_SERVICES: JobType[] = [
    {
        id: "1",
        title: "Luxury Apartment",
        location: "Anna Nagar, Chennai",
        description: "Residential Apartment",
        category: "Property",
        jobData: {
            status: true,
            pincode: "600040",
            icon: "🏢",
            propertyType: "Apartment",
            price: "₹85 Lakhs",
            area: "1200 sqft",
            bedrooms: 3,
            bathrooms: 2,
        },
    },
    {
        id: "2",
        title: "Independent Villa",
        location: "Whitefield, Bangalore",
        description: "Premium Villa",
        category: "Builders",
        jobData: {
            status: true,
            pincode: "560066",
            icon: "🏠",
            propertyType: "Villa",
            price: "₹2.5 Cr",
            area: "2400 sqft",
            bedrooms: 4,
            bathrooms: 3,
        },
    },
    {
        id: "3",
        title: "Commercial Office Space",
        location: "Hitech City, Hyderabad",
        description: "Office Space",
        category: "Commercial",
        jobData: {
            status: false,
            pincode: "500081",
            icon: "🏬",
            propertyType: "Office",
            price: "₹1.2 Cr",
            area: "1800 sqft",
        },
    },
];

/* ---------------- ACTION DROPDOWN ---------------- */

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
                className="p-2 bg-white/80 rounded-full shadow"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
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
            )}
        </div>
    );
};

/* ---------------- MAIN COMPONENT ---------------- */

const RealEstateList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<JobType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // simulate API delay
        setTimeout(() => {
            if (subcategory) {
                setServices(
                    DUMMY_SERVICES.filter((s) =>
                        s.category.toLowerCase().includes(subcategory.replace("-", " "))
                    )
                );
            } else {
                setServices(DUMMY_SERVICES);
            }
            setLoading(false);
        }, 500);
    }, [subcategory]);

    const handleView = (job: JobType) => {
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

    const shouldShowNearbyCards = () =>
        [
            "property-dealers",
            "builders",
            "architects",
            "interior-designers",
            "rent",
            "construction",
        ].includes(subcategory || "");

    const renderNearbyCardsSection = () => {
        const cardMap: Record<string, React.ComponentType<any>> = {
            "property-dealers": NearbyPropertyDealersCard,
            builders: NearbyBuildersCard,
        
        };

        const CardComponent = subcategory ? cardMap[subcategory] : null;
        if (!CardComponent) return null;

        return <CardComponent onViewDetails={handleView} />;
    };

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
                    <h1 className="text-3xl font-bold">Real Estate Listings</h1>
                    <Button variant="gradient-blue" onClick={handleAddPost}>
                        + Add Listing
                    </Button>
                </div>

                {shouldShowNearbyCards() && renderNearbyCardsSection()}

                {/* Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="relative bg-white rounded-xl border hover:shadow-lg transition cursor-pointer"
                            onClick={() => handleView(service)}
                        >
                            <div className="absolute top-3 right-3">
                                <ActionDropdown
                                    serviceId={service.id}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>

                            <div className="h-44 bg-blue-50 flex items-center justify-center text-5xl">
                                {service.jobData?.icon}
                            </div>

                            <div className="p-4 space-y-2">
                                <h2 className="font-bold text-lg">{service.title}</h2>
                                <p className="text-sm text-gray-600">{service.location}</p>
                                <p className="text-sm text-gray-600">{service.description}</p>

                                {service.jobData?.price && (
                                    <p className="text-blue-600 font-bold">
                                        {service.jobData.price}
                                    </p>
                                )}

                                <span
                                    className={`inline-block text-xs px-2 py-1 rounded-full ${service.jobData?.status
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {service.jobData?.status ? "Available" : "Sold / Rented"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default RealEstateList;
