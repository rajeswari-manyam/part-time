import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import { MoreVertical } from "lucide-react";

// Import beauty/wellness card components
import NearbyBeautyCard, { DUMMY_BEAUTY_PARLOURS } from "../components/cards/Beauty/NearByBeauty";
import NearbyFitnessCard, { DUMMY_FITNESS_CENTRES } from "../components/cards/Beauty/NearByFittness";
import NearbyMakeupCard, { DUMMY_MAKEUP_ARTISTS } from "../components/cards/Beauty/NearByMackup";
import NearbySalonCard, { DUMMY_SALONS } from "../components/cards/Beauty/NearSaloane";
import NearbySpaServiceCard, { DUMMY_SPA_SERVICES } from "../components/cards/Beauty/NearbySpaServiceCard";
import NearbyYogaCard from "../components/cards/Beauty/NearbyYogaCard";
import NearbyTattooCard from "../components/cards/Beauty/NearTatoo";
import NearbyMehendiCard, { DUMMY_MEHENDI_ARTISTS } from "../components/cards/Beauty/NearByMehende";
import NearbySkinClinicCard, { DUMMY_SKIN_CLINICS } from "../components/cards/Beauty/NearBySkinClik";

export interface BeautyServiceType {
    id: string;
    title: string;
    location: string;
    description: string;
    distance?: number;
    category: string;
    jobData?: any;
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
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium transition"
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

const BeautyServicesList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<BeautyServiceType[]>([]);
    const [loading] = useState(false);
    const [error] = useState("");

    const handleView = (service: any) => {
        navigate(`/beauty-services/details/${service.id}`);
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/add-beauty-service-form/${id}`);
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
        navigate("/add-beauty-service-form");
    };

    const getDisplayTitle = () => {
        if (!subcategory) return "All Beauty & Wellness Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    // ✅ Normalize subcategory to handle different route formats
    const normalizeSubcategory = (sub: string | undefined): string => {
        if (!sub) return "";
        const normalized = sub.toLowerCase();
        console.log("📍 Raw subcategory:", sub);
        console.log("📍 Normalized subcategory:", normalized);
        return normalized;
    };

    // ✅ Smart matching function to handle route variations
    const getCardComponentForSubcategory = (
        subcategory: string | undefined
    ): React.ComponentType<any> | null => {
        if (!subcategory) return null;

        const normalized = normalizeSubcategory(subcategory);

        // BEAUTY PARLOUR MATCHING
        if (
            (normalized.includes("beauty") && normalized.includes("parlour")) ||
            normalized.includes("beautyparlour")
        ) {
            console.log("✅ Matched to NearbyBeautyCard");
            return NearbyBeautyCard;
        }
 

const fitnessKeywords = [
  "fitness centre",
  "fitness centers",
  "fitness centres",
  "fitness center",
  "fitness",
  "gym",
  "gyms",
];

if (fitnessKeywords.some(keyword => normalized.includes(keyword))) {
  console.log("✅ Matched to NearbyFitnessCard");
  return NearbyFitnessCard;
}

        // MAKEUP ARTIST MATCHING
        if (
            normalized.includes("makeup") ||
            normalized.includes("make-up") ||
            (normalized.includes("makeup") && normalized.includes("artist"))
        ) {
            console.log("✅ Matched to NearbyMakeupCard");
            return NearbyMakeupCard;
        }

        // SALON MATCHING
        if (normalized.includes("salon") || normalized.includes("saloon")) {
            console.log("✅ Matched to NearbySalonCard");
            return NearbySalonCard;
        }

        // SPA MATCHING
        if (
            normalized.includes("spa") ||
            normalized.includes("massage") ||
            (normalized.includes("spa") && normalized.includes("massage"))
        ) {
            console.log("✅ Matched to NearbySpaServiceCard");
            return NearbySpaServiceCard;
        }

        // YOGA MATCHING
        if (
            normalized.includes("yoga") ||
            (normalized.includes("yoga") && normalized.includes("centre"))
        ) {
            console.log("✅ Matched to NearbyYogaCard");
            return NearbyYogaCard;
        }

        // TATTOO MATCHING
        if (
            normalized.includes("tattoo") ||
            (normalized.includes("tattoo") && normalized.includes("studio"))
        ) {
            console.log("✅ Matched to NearbyTattooCard");
            return NearbyTattooCard;
        }

        // MEHENDI MATCHING
        if (
            normalized.includes("mehendi") ||
            normalized.includes("mehndi") ||
            (normalized.includes("mehendi") && normalized.includes("artist"))
        ) {
            console.log("✅ Matched to NearbyMehendiCard");
            return NearbyMehendiCard;
        }

        // SKIN CLINIC MATCHING
        if (
            normalized.includes("skin") && normalized.includes("clinic") ||
            normalized.includes("dermatologist")
        ) {
            console.log("✅ Matched to NearbySkinClinicCard");
            return NearbySkinClinicCard;
        }

        console.warn(`⚠️ No matching card component for: "${subcategory}"`);
        return null;
    };

    // ✅ Helper function to check if subcategory should show nearby cards
    const shouldShowNearbyCards = (): boolean => {
        if (!subcategory) return false;

        const normalized = normalizeSubcategory(subcategory);

        const keywords = [
            "beauty",
            "parlour",
            "fitness",
            "gym",
            "makeup",
            "salon",
            "spa",
            "massage",
            "yoga",
            "tattoo",
            "skin",
            "mehendi",
            "mehndi",
        ];

        const hasMatch = keywords.some((keyword) => normalized.includes(keyword));
        console.log(`📊 Should show nearby cards for "${subcategory}":`, hasMatch);
        return hasMatch;
    };

    // ✅ Helper function to get dummy data for each subcategory
    const getDummyDataForSubcategory = (subcategory: string | undefined): BeautyServiceType[] => {
        if (!subcategory) return [];

        const normalized = normalizeSubcategory(subcategory);

        // BEAUTY PARLOUR
        if (
            (normalized.includes("beauty") && normalized.includes("parlour")) ||
            normalized.includes("beautyparlour")
        ) {
            return DUMMY_BEAUTY_PARLOURS.map(item => ({
                id: item.place_id,
                title: item.name,
                location: item.vicinity,
                description: `${item.rating}★ rating with ${item.user_ratings_total} reviews`,
                category: 'Beauty Parlour',
                distance: parseFloat(item.distance_text?.replace(' km', '').replace(' mts', '').replace('m', '') || '0'),
                jobData: item
            }));
        }

        // FITNESS/GYM
        if (
            normalized.includes("fitness") ||
            normalized.includes("gym") ||
            (normalized.includes("fitness") && normalized.includes("centre"))
        ) {
            return DUMMY_FITNESS_CENTRES.map(item => ({
                id: item.place_id,
                title: item.name,
                location: item.vicinity,
                description: `${item.rating}★ rating with ${item.user_ratings_total} reviews`,
                category: 'Fitness Centre',
                distance: item.distance,
                jobData: item
            }));
        }

        // MAKEUP ARTIST
        if (
            normalized.includes("makeup") ||
            normalized.includes("make-up") ||
            (normalized.includes("makeup") && normalized.includes("artist"))
        ) {
            return DUMMY_MAKEUP_ARTISTS.map(item => ({
                id: item.id,
                title: item.title || 'Makeup Artist',
                location: item.location || 'Location',
                description: item.description || '',
                category: 'Makeup Artist',
                jobData: item
            }));
        }

        // SALON
        if (normalized.includes("salon") || normalized.includes("saloon")) {
            return DUMMY_SALONS.map(item => ({
                id: item.place_id,
                title: item.name,
                location: item.vicinity,
                description: `${item.rating}★ rating with ${item.user_ratings_total} reviews`,
                category: 'Salon',
                distance: item.distance,
                jobData: item
            }));
        }

        // SPA
        if (
            normalized.includes("spa") ||
            normalized.includes("massage") ||
            (normalized.includes("spa") && normalized.includes("massage"))
        ) {
            return DUMMY_SPA_SERVICES.map(item => ({
                id: item.id,
                title: item.title,
                location: item.location,
                description: '',
                category: 'Spa & Massage',
                jobData: item
            }));
        }

        // YOGA
        if (
            normalized.includes("yoga") ||
            (normalized.includes("yoga") && normalized.includes("centre"))
        ) {
            return [
                { id: 'yoga_1', title: 'Peaceful Yoga Center', location: 'Banjara Hills, Hyderabad', description: '', category: 'Yoga' },
                { id: 'yoga_2', title: 'Wellness Yoga Academy', location: 'Jubilee Hills, Hyderabad', description: '', category: 'Yoga' },
                { id: 'yoga_3', title: 'Fitness Yoga Studio', location: 'Gachibowli, Hyderabad', description: '', category: 'Yoga' },
                { id: 'yoga_4', title: 'Harmony Yogashala', location: 'Madhapur, Hyderabad', description: '', category: 'Yoga' },
            ];
        }

        // TATTOO
        if (
            normalized.includes("tattoo") ||
            (normalized.includes("tattoo") && normalized.includes("studio"))
        ) {
            return [
                { id: 'tattoo_1', title: 'Artistic Tattoo Studio', location: 'Banjara Hills, Hyderabad', description: '', category: 'Tattoo' },
                { id: 'tattoo_2', title: 'Ink Masters Studio', location: 'Jubilee Hills, Hyderabad', description: '', category: 'Tattoo' },
                { id: 'tattoo_3', title: 'Creative Tattoo Art', location: 'Gachibowli, Hyderabad', description: '', category: 'Tattoo' },
                { id: 'tattoo_4', title: '3D Tattoo Studio', location: 'Madhapur, Hyderabad', description: '', category: 'Tattoo' },
            ];
        }

        // MEHENDI
        if (
            normalized.includes("mehendi") ||
            normalized.includes("mehndi") ||
            (normalized.includes("mehendi") && normalized.includes("artist"))
        ) {
            return DUMMY_MEHENDI_ARTISTS.map(item => ({
                id: item.id,
                title: item.title,
                location: item.location,
                description: '',
                category: 'Mehendi Artist',
                jobData: item
            }));
        }

        // SKIN CLINIC
        if (
            normalized.includes("skin") && normalized.includes("clinic") ||
            normalized.includes("dermatologist")
        ) {
            return DUMMY_SKIN_CLINICS.map(item => ({
                id: item.id,
                title: item.title,
                location: item.location,
                description: '',
                category: 'Skin Clinic',
                jobData: item
            }));
        }

        return [];
    };

    // ✅ Render nearby cards which have dummy data built-in
    const renderNearbyCardsSection = () => {
        const CardComponent = getCardComponentForSubcategory(subcategory);
        const dummyData = getDummyDataForSubcategory(subcategory);

        if (!CardComponent) {
            console.error(`❌ No card component available for subcategory: "${subcategory}"`);
            return null;
        }

        if (dummyData.length === 0) {
            console.warn(`⚠️ No dummy data available for subcategory: "${subcategory}"`);
        }

        return (
            <div className="space-y-8">
                {/* Nearby Card Components - renders built-in dummy data */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        💆 Nearby {getDisplayTitle()}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dummyData.map((item) => (
                            <CardComponent key={item.id} job={item} onViewDetails={handleView} />
                        ))}
                    </div>
                </div>

                {/* Real API Services Section */}
                {services.length > 0 && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                                💆 Your Listed Services ({services.length})
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white">
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
                    renderNearbyCardsSection()
                ) : (
                    <>
                        {services.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">💆</div>
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
                                        className="relative group bg-white rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-lg transition cursor-pointer overflow-hidden"
                                        onClick={() => handleView(service)}
                                    >
                                        <div className="absolute top-3 right-3 z-10">
                                            <ActionDropdown
                                                serviceId={service.id}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </div>

                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                            <span>{service.jobData?.icon || "💆"}</span>
                                            <span>{service.category}</span>
                                        </div>

                                        <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-5xl mb-2">
                                                {service.jobData?.icon || "💆"}
                                            </span>
                                            <span className="text-sm">No Image</span>
                                        </div>

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

export default BeautyServicesList;