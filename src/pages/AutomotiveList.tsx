import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getAllAutomotive,
    deleteAutomotive,
    AutomotiveService,
} from "../services/CategoriesApi.service";
import { bikeRepairDummyData } from "../data/BikeRepair";
import { carRepairDummyData } from "../data/CarRepair";
import { carWashDummyData } from "../data/CarWash";
import { bikeWashDummyData } from "../data/BikeWash";
import { tyreShopsDummyData } from "../data/TyreShops";
import { batteryShopsDummyData } from "../data/BatteryShops";
import { sparePartsDummyData } from "../data/SparePart";
import { carRentalDummyData } from "../data/CarRental";
import { towingServicesDummyData } from "../data/TowningSerivice";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import { MapPin, ChevronLeft, ChevronRight, X, Navigation, Phone } from "lucide-react";

const AutomotiveList: React.FC = () => {
    const { subcategory } = useParams<{ subcategory?: string }>();
    const navigate = useNavigate();

    const [services, setServices] = useState<AutomotiveService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
    const [distances, setDistances] = useState<Record<string, string>>({});
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Fullscreen viewer state
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState<string[]>([]);
    const [viewerCurrentIndex, setViewerCurrentIndex] = useState(0);

    const IMAGE_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://13.204.29.0:3001/";

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Location access denied or unavailable");
                }
            );
        }
    }, []);

    // Calculate distances when user location and services are available
    useEffect(() => {
        if (userLocation && services.length > 0) {
            const newDistances: Record<string, string> = {};
            services.forEach((service) => {
                if (service.latitude && service.longitude) {
                    const distance = calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        service.latitude,
                        service.longitude
                    );
                    newDistances[service._id] = distance;
                }
            });
            setDistances(newDistances);
        }
    }, [userLocation, services]);

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance.toFixed(1) + " km";
    };

    // Open Google Maps with directions
    const handleOpenMap = (service: AutomotiveService, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!service.latitude || !service.longitude) {
            alert("Location not available for this service");
            return;
        }

        let mapsUrl = "";

        if (userLocation) {
            // With user location - show directions
            mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${service.latitude},${service.longitude}&travelmode=driving`;
        } else {
            // Without user location - just show the location
            mapsUrl = `https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`;
        }

        window.open(mapsUrl, '_blank');
    };

    // Handle phone call
    const handleCall = (phone: string, e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `tel:${phone}`;
    };

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

    // Fullscreen viewer functions
    const openImageViewer = (images: string[], startIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setViewerImages(images);
        setViewerCurrentIndex(startIndex);
        setIsViewerOpen(true);
    };

    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };

    const viewerPrevImage = () => {
        setViewerCurrentIndex((prev) =>
            prev === 0 ? viewerImages.length - 1 : prev - 1
        );
    };

    const viewerNextImage = () => {
        setViewerCurrentIndex((prev) =>
            (prev + 1) % viewerImages.length
        );
    };

    // Keyboard navigation for viewer
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isViewerOpen) return;

            if (e.key === 'ArrowLeft') viewerPrevImage();
            if (e.key === 'ArrowRight') viewerNextImage();
            if (e.key === 'Escape') closeImageViewer();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isViewerOpen, viewerImages.length]);

    useEffect(() => {
        fetchServices();
    }, [subcategory]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            // Determine which dummy data to use based on subcategory
            let dummyServices: AutomotiveService[] = [];

            if (subcategory) {
                const readableSubcategory = subcategory
                    .replace(/-/g, " ")
                    .toLowerCase()
                    .trim();

                // Determine which dummy data to show
                if (readableSubcategory.includes("bike")) {
                    dummyServices = bikeRepairDummyData;
                } else if (readableSubcategory.includes("car")) {
                    dummyServices = carRepairDummyData;
                } else {
                    // For other categories or all, combine both
                    dummyServices = [...carRepairDummyData, ...bikeRepairDummyData];
                }
            } else {
                // If no subcategory, show all dummy data
                dummyServices = [...carRepairDummyData, ...bikeRepairDummyData];
            }

            // Then fetch API data
            const response = await getAllAutomotive();
            const servicesData = response.data || [];

            if (!Array.isArray(servicesData)) {
                setServices(dummyServices);
                setLoading(false);
                return;
            }

            let filteredApiData = servicesData;

            // Apply subcategory filter if present
            if (subcategory) {
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

                filteredApiData = servicesData.filter((service) =>
                    matchTerms.some((term) =>
                        service.businessType?.toLowerCase().includes(term)
                    )
                );
            }

            // Combine dummy data first, then API data
            // Remove duplicates based on _id
            const combinedServices = [...dummyServices, ...filteredApiData];
            const uniqueServices = combinedServices.filter(
                (service, index, self) =>
                    index === self.findIndex((s) => s._id === service._id)
            );

            setServices(uniqueServices);
        } catch (err) {
            console.error(err);
            setError("Failed to load services");
            // If API fails, still show appropriate dummy data based on subcategory
            if (subcategory) {
                const readableSubcategory = subcategory
                    .replace(/-/g, " ")
                    .toLowerCase()
                    .trim();

                switch (readableSubcategory) {
                    case "bike repair":
                        setServices(bikeRepairDummyData);
                        break;
                    case "car repair / service":
                    case "car repair":
                    case "car service":
                        setServices(carRepairDummyData);
                        break;
                    case "car wash":
                        setServices(carWashDummyData);
                        break;
                    case "bike wash":
                        setServices(bikeWashDummyData);
                        break;
                    case "tyre shops":
                        setServices(tyreShopsDummyData);
                        break;
                    case "battery shops":
                        setServices(batteryShopsDummyData);
                        break;
                    case "automobile spare parts":
                        setServices(sparePartsDummyData);
                        break;
                    case "car hire / rentals":
                    case "car rental":
                    case "car hire":
                        setServices(carRentalDummyData);
                        break;
                    case "towing services":
                        setServices(towingServicesDummyData);
                        break;
                    default:
                        setServices([]);
                }
            } else {
                setServices([]);
            }
        } finally {
            setLoading(false);
        }
    };

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
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return `${IMAGE_BASE_URL}${cleanPath}`;
    };

    const getServiceImages = (service: AutomotiveService): string[] => {
        if (service.images && Array.isArray(service.images) && service.images.length > 0) {
            return service.images;
        }
        return [];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className={typography.body.large}>Loading...</p>
            </div>
        );
    }

    if (error && services.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map((service: AutomotiveService) => {
                        const images = getServiceImages(service);
                        const currentIndex = currentImageIndex[service._id] || 0;

                        return (
                            <div
                                key={service._id}
                                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col"
                                onClick={() => handleView(service._id)}
                            >
                                {/* IMAGE GALLERY */}
                                {images.length > 0 ? (
                                    <div
                                        className="relative w-full h-48 flex-shrink-0 bg-gray-100 cursor-zoom-in"
                                        onClick={(e) => openImageViewer(images, currentIndex, e)}
                                    >
                                        <img
                                            src={getImageUrl(images[currentIndex])}
                                            alt={`${service.name} ${currentIndex + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePrevImage(service._id, images.length, e);
                                                    }}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition z-10"
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNextImage(service._id, images.length, e);
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition z-10"
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>

                                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                    {currentIndex + 1} / {images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-48 flex-shrink-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {/* CONTENT */}
                                <div className="flex-1 p-4 flex flex-col gap-2">
                                    <h2 className={`${typography.heading.h4} line-clamp-1`}>{service.name}</h2>

                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <span className="line-clamp-1">{service.area}, {service.city}</span>
                                            {distances[service._id] && (
                                                <span className="text-xs text-green-600 font-medium block">
                                                    {distances[service._id]} away
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {service.description && (
                                        <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
                                    )}

                                    {service.businessType && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-400">💼</span>
                                            <span className="text-gray-700 line-clamp-1">{service.businessType}</span>
                                        </div>
                                    )}

                                    {service.availability && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-400">🕒</span>
                                            <span className="text-gray-700 line-clamp-1">{service.availability}</span>
                                        </div>
                                    )}

                                    {/* Services Offered */}
                                    {service.services && service.services.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Services:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {service.services.slice(0, 3).map((svc: string, idx: number) => (
                                                    <span key={idx} className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        <span className="mr-1">✓</span> {svc}
                                                    </span>
                                                ))}
                                                {service.services.length > 3 && (
                                                    <span className="text-xs text-gray-500 px-2 py-1">
                                                        +{service.services.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* CONTACT BUTTONS */}
                                    <div
                                        className="flex gap-2 mt-auto pt-3 border-t"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={(e) => handleOpenMap(service, e)}
                                            className="flex-1 px-3 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                                            title="Get Directions on Google Maps"
                                        >
                                            <Navigation size={18} />
                                            <span>Navigate</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleCall(service.phone, e)}
                                            className="flex-1 px-3 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
                                            title={`Call ${service.phone}`}
                                        >
                                            <Phone size={18} />
                                            <span>Call Now</span>
                                        </button>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div
                                        className="flex gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => handleEdit(service._id)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
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

            {/* FULLSCREEN IMAGE VIEWER */}
            {isViewerOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={closeImageViewer}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeImageViewer}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition z-20"
                        aria-label="Close viewer"
                    >
                        <X size={24} />
                    </button>

                    {/* Main Image */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getImageUrl(viewerImages[viewerCurrentIndex])}
                            alt={`Image ${viewerCurrentIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Navigation Arrows */}
                        {viewerImages.length > 1 && (
                            <>
                                <button
                                    onClick={viewerPrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={viewerNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg">
                            {viewerCurrentIndex + 1} / {viewerImages.length}
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {viewerImages.length > 1 && (
                        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-2">
                            {viewerImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setViewerCurrentIndex(idx);
                                    }}
                                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${idx === viewerCurrentIndex
                                        ? 'border-white'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutomotiveList;