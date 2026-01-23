import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getAllAutomotive,
    deleteAutomotive,
    AutomotiveService,
} from "../services/CategoriesApi.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";



const AutomotiveList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<AutomotiveService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

    const IMAGE_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://13.204.29.0:3001/";


    const handleView = (id: string) => {
        navigate(`/automotive/details/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/add-automotive-form`);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this service?"
        );
        if (!confirmDelete) return;

        try {
            await deleteAutomotive(id);

            // Remove deleted item from UI instantly
            setServices((prev) => prev.filter((service) => service._id !== id));

            alert("Service deleted successfully");
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete service");
        }
    };

    const handleAddPost = () => {
        navigate("/add-automotive-form");
    };

    /* ------------------ Image Navigation ------------------ */

    const handlePrevImage = (serviceId: string, totalImages: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) - 1 + totalImages) % totalImages
        }));
    };

    const handleNextImage = (serviceId: string, totalImages: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) + 1) % totalImages
        }));
    };

    /* ------------------ Fetch Services ------------------ */

    useEffect(() => {
        fetchServices();
    }, [subcategory]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllAutomotive();
            const servicesData = response.data || [];

            if (!Array.isArray(servicesData)) {
                setServices([]);
                return;
            }

            if (!subcategory) {
                setServices(servicesData);
                return;
            }

            const readableSubcategory = subcategory
                .replace(/-/g, " ")
                .toLowerCase()
                .trim();

            const categoryMap: Record<string, string[]> = {
                "car repair / service": ["car service", "car repair", "service center"],
                "bike repair": ["bike repair", "bike service"],
                "car wash": ["car wash", "car cleaning"],
                "bike wash": ["bike wash", "bike cleaning"],
                "tyre shops": ["tyre", "tire"],
                "battery shops": ["battery"],
                "automobile spare parts": ["spare parts", "auto parts"],
                "towing services": ["towing"],
                "car hire / rentals": ["car rental", "car hire"],
            };

            const matchTerms =
                categoryMap[readableSubcategory] || [readableSubcategory];

            const filtered = servicesData.filter((service) =>
                matchTerms.some((term) =>
                    service.businessType?.toLowerCase().includes(term)
                )
            );

            setServices(filtered);
        } catch (err) {
            console.error(err);
            setError("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    /* ------------------ Helpers ------------------ */

    const getDisplayTitle = () => {
        if (!subcategory) return "All Automotive Services";
        return subcategory
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        // Remove leading slash if present to avoid double slashes
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${IMAGE_BASE_URL}${cleanPath}`;
    };

    const getServiceImages = (service: AutomotiveService): string[] => {
        // Check if service has images array
        if (service.images && Array.isArray(service.images) && service.images.length > 0) {
            return service.images;
        }
        // Return empty array if no images
        return [];
    };

    /* ------------------ Loading / Error ------------------ */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className={typography.body.large}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    /* ------------------ UI ------------------ */

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className={typography.heading.h3}>{getDisplayTitle()}</h1>

                <Button variant="gradient-blue" size="md" onClick={handleAddPost}>
                    + Add Post
                </Button>
            </div>

            {/* Empty State */}
            {services.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No services found
                </div>
            ) : (
                <div className="space-y-6">
                    {services.map((service: AutomotiveService) => {
                        const images = getServiceImages(service);
                        const currentIndex = currentImageIndex[service._id] || 0;

                        return (
                            <div
                                key={service._id}
                                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col md:flex-row max-w-4xl"
                                onClick={() => handleView(service._id)}
                            >
                                {/* IMAGE GALLERY WITH ARROWS */}
                                {images.length > 0 ? (
                                    <div className="relative w-full md:w-56 h-60 flex-shrink-0 bg-gray-100">
                                        <img
                                            src={getImageUrl(images[currentIndex])}
                                            alt={`${service.name} ${currentIndex + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Navigation Arrows - Only show if more than 1 image */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => handlePrevImage(service._id, images.length, e)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleNextImage(service._id, images.length, e)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>

                                                {/* Image Counter */}
                                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                    {currentIndex + 1} / {images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full md:w-56 h-60 flex-shrink-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {/* CONTENT */}
                                <div className="flex-1 p-4 flex flex-col gap-3">
                                    <h2 className={typography.heading.h4}>{service.name}</h2>

                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>{service.area}, {service.city}</span>
                                    </div>

                                    {service.description && (
                                        <p className="text-gray-600 text-sm">{service.description}</p>
                                    )}

                                    {/* Services Offered */}
                                    {service.services && service.services.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Services Offered:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {service.services.map((svc: string, idx: number) => (
                                                    <span key={idx} className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        <span className="mr-1">✓</span> {svc}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Availability */}
                                    {service.availability && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-400">🕒</span>
                                            <span className="text-gray-700">{service.availability}</span>
                                        </div>
                                    )}

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                                        {service.businessType && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">💼</span>
                                                <span className="text-gray-700">{service.businessType}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div
                                        className="flex gap-2 mt-auto pt-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => handleEdit(service._id)}
                                            className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AutomotiveList;