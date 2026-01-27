import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FoodServiceAPI from "../services/FoodService.service";
import type { FoodService as FoodServiceType } from "../services/FoodService.service";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Nearby cards - these components already contain dummy data internally
import NearbyBakersCard from "../pages/NearByBackeries";
import NearbyCafes from "../pages/NearByCafes";
import NearbyIceCreamCard from "../pages/NearByIceCreamCard";
import NearbyJuiceCard from "../pages/NearByJuice";
import NearbyRestaurants from "../pages/NearByRestarents";
import NearbyStreetFoodCard from "../pages/NearByStreetFood";
import NearbySweetShopCard from "../pages/NearBySweetShop";
import NearbyCateringService from "./NearByCateringService";
import NearbyTiffinServiceCard from "./NearByTiffens";

export interface JobType {
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
    };
}

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
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] z-20">
                        <button
                            onClick={(e) => {
                                onEdit(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 flex items-center gap-2 text-orange-600 font-medium transition"
                        >
                            ✏️ Edit
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={(e) => {
                                onDelete(serviceId, e);
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium transition"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const FoodServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<JobType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchServices();
    }, [subcategory]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await FoodServiceAPI.getAllFoodServices();

            if (response.success && response.data) {
                let filteredData = response.data;

                if (subcategory) {
                    const readableSubcategory = subcategory
                        .replace(/-/g, " ")
                        .toLowerCase()
                        .trim();

                    filteredData = response.data.filter((service: FoodServiceType) =>
                        service.type.toLowerCase().includes(readableSubcategory)
                    );
                }

                const jobData: JobType[] = filteredData.map((service: FoodServiceType) => ({
                    id: service._id,
                    title: service.name,
                    location: `${service.area}, ${service.city}`,
                    description: service.type,
                    category: service.type,
                    jobData: {
                        status: service.status,
                        pincode: service.pincode,
                        icon: service.icon,
                        rating: service.rating,
                        user_ratings_total: service.user_ratings_total,
                        opening_hours: service.opening_hours,
                        geometry: service.geometry,
                    },
                }));

                setServices(jobData);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (job: JobType) => {
        navigate(`/food-services/details/${job.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-food-service-form/${id}`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            const response = await FoodServiceAPI.deleteFoodService(id);
            if (response.success) {
                setServices((prev) => prev.filter((s) => s.id !== id));
                alert("Service deleted successfully");
            } else {
                alert(response.error || "Failed to delete service");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete service");
        }
    };

    const handleAddPost = () => {
        navigate("/add-food-service-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Food Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    // Helper function to check if subcategory should show nearby cards
    const shouldShowNearbyCards = (): boolean => {
        if (!subcategory) return false;

        const validSubcategories = [
            "bakeries",
            "cafes",
            "ice-cream-parlours",
            "juice-smoothie-shops",
            "restaurants",
            "street-food",
            "sweet-shops",
            "mess-tiffin-services",
            "tiffin-services",
            "tiffin",
            "mess",
            "catering-services",
            "catering",
        ];

        return validSubcategories.includes(subcategory);
    };

    // Render nearby cards which have dummy data built-in, plus real API data
    const renderNearbyCardsSection = () => {
        // Map URL slugs to components - comprehensive mapping
        const cardMap: Record<string, React.ComponentType<any>> = {
            // Standard names
            "bakeries": NearbyBakersCard,
            "cafes": NearbyCafes,
            "ice-cream-parlours": NearbyIceCreamCard,
            "juice-smoothie-shops": NearbyJuiceCard,
            "restaurants": NearbyRestaurants,
            "street-food": NearbyStreetFoodCard,
            "sweet-shops": NearbySweetShopCard,

            // Tiffin services - all possible variations
            "mess-tiffin-services": NearbyTiffinServiceCard,
            "tiffin-services": NearbyTiffinServiceCard,
            "tiffin": NearbyTiffinServiceCard,
            "mess": NearbyTiffinServiceCard,

            // Catering services - all possible variations  
            "catering-services": NearbyCateringService,
            "catering": NearbyCateringService,
        };

        const CardComponent = subcategory ? cardMap[subcategory] : null;
        if (!CardComponent) return null;

        return (
            <div className="space-y-8">
                {/* Nearby Card Component - This will render its own dummy data internally */}
                <div>
                    <CardComponent onViewDetails={handleView} />
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                📍 Your Listed Services ({services.length})
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {getDisplayTitle()}
                    </h1>
                    <Button variant="gradient-blue" size="md" onClick={handleAddPost}>
                        + Add Post
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Content Rendering */}
                {shouldShowNearbyCards() ? (
                    // Render nearby cards with dummy data built-in
                    renderNearbyCardsSection()
                ) : (
                    // Regular display for other subcategories or no subcategory
                    <>
                        {services.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    No Services Found
                                </h3>
                                <p className="text-gray-600">
                                    Be the first to add a service in this category!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="relative group bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer overflow-hidden"
                                        onClick={() => handleView(service)}
                                    >
                                        {/* Dropdown */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <ActionDropdown
                                                serviceId={service.id}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </div>

                                        {/* Service Badge */}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                            <span>{service.jobData?.icon || "🍽️"}</span>
                                            <span>{service.category}</span>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {service.jobData?.icon || "🍽️"}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-2">
                                            <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                {service.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {service.location}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {service.description}
                                            </p>

                                            {service.jobData?.pincode && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">📍</span>
                                                    <span className="text-gray-700">
                                                        Pincode: {service.jobData.pincode}
                                                    </span>
                                                </div>
                                            )}

                                            {service.jobData?.status !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${service.jobData.status
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        <span className="mr-1">
                                                            {service.jobData.status ? "✓" : "✗"}
                                                        </span>
                                                        {service.jobData.status ? "Open" : "Closed"}
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

export default FoodServicesList;