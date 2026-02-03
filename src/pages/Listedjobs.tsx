import React, { useEffect, useState, useRef } from "react";
import { Trash2, Edit, Loader2, ChevronDown, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Service imports ─────────────────────────────────────────────────────────
import { getUserHotels, deleteHotel, Hotel } from "../services/HotelService.service";
import { getUserBeautyWorkers, deleteBeautyWorkerById, BeautyWorker } from "../services/Beauty.Service.service";
import { getUserHospitals, deleteHospital, Hospital } from "../services/HospitalService.service";
import { getUserDigitalServices, deleteDigitalService, DigitalWorker } from "../services/DigitalService.service";

import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";

// ── Category / subcategory JSON ─────────────────────────────────────────────
import categories from "../data/categories.json";
import subcategories from "../data/subcategories.json";

// ============================================================================
// TYPES
// ============================================================================
interface Category {
    id: number;
    name: string;
    icon: string;
}

interface Subcategory {
    name: string;
    icon: string;
}

interface SubcategoryGroup {
    categoryId: number;
    items: Subcategory[];
}

// ============================================================================
// ACTION DROPDOWN
// ============================================================================
const ActionDropdown: React.FC<{
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}> = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg border border-gray-200 transition-all hover:shadow-xl"
            >
                <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                    <button
                        onClick={(e) => {
                            onEdit(e);
                            setIsOpen(false);
                        }}
                        className={`${typography.body.small} w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors`}
                    >
                        <Edit size={16} />
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            onDelete(e);
                            setIsOpen(false);
                        }}
                        className={`${typography.body.small} w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors`}
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// CATEGORY FILTER DROPDOWN  (top-right corner)
// ============================================================================
const CategoryFilterDropdown: React.FC<{
    selectedCategoryId: number | null;
    selectedSubcategory: string | null;
    onSelectCategory: (categoryId: number | null) => void;
    onSelectSubcategory: (subcategoryName: string | null) => void;
}> = ({ selectedCategoryId, selectedSubcategory, onSelectCategory, onSelectSubcategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categoriesData: Category[] = categories.categories;
    const subcategoriesData: SubcategoryGroup[] = subcategories.subcategories;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getSelectedLabel = () => {
        if (selectedSubcategory) return selectedSubcategory;
        if (selectedCategoryId) {
            const cat = categoriesData.find((c) => c.id === selectedCategoryId);
            return cat ? cat.name : "All Services";
        }
        return "All Services";
    };

    const handleCategoryClick = (categoryId: number) => {
        if (selectedCategoryId === categoryId) {
            onSelectCategory(null);
            onSelectSubcategory(null);
        } else {
            onSelectCategory(categoryId);
            onSelectSubcategory(null);
        }
    };

    const handleSubcategoryClick = (categoryId: number, subcategoryName: string) => {
        onSelectCategory(categoryId);
        onSelectSubcategory(subcategoryName);
        setIsOpen(false);
    };

    const handleClearFilters = () => {
        onSelectCategory(null);
        onSelectSubcategory(null);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
                <Filter size={18} className="text-gray-600" />
                <span className={typography.body.small}>{getSelectedLabel()}</span>
                <ChevronDown
                    size={18}
                    className={`text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-30">
                    {/* Clear */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
                        <button
                            onClick={handleClearFilters}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm font-medium text-blue-600"
                        >
                            <span>🔄</span> Clear All Filters
                        </button>
                    </div>

                    {/* Categories + subcategories */}
                    <div className="p-2">
                        {categoriesData.map((category) => {
                            const categorySubcategories = subcategoriesData.find(
                                (sc) => sc.categoryId === category.id
                            );
                            const isExpanded = selectedCategoryId === category.id;

                            return (
                                <div key={category.id} className="mb-1">
                                    <button
                                        onClick={() => handleCategoryClick(category.id)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between gap-2 transition-colors ${selectedCategoryId === category.id && !selectedSubcategory
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : "hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{category.icon}</span>
                                            <span className={typography.body.small}>{category.name}</span>
                                        </div>
                                        {categorySubcategories && (
                                            <ChevronDown
                                                size={16}
                                                className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""
                                                    }`}
                                            />
                                        )}
                                    </button>

                                    {isExpanded && categorySubcategories && (
                                        <div className="ml-4 mt-1 space-y-0.5">
                                            {categorySubcategories.items.map((sub, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSubcategoryClick(category.id, sub.name)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedSubcategory === sub.name
                                                        ? "bg-blue-50 text-blue-700 font-medium"
                                                        : "hover:bg-gray-50 text-gray-600"
                                                        }`}
                                                >
                                                    <span className="text-sm">{sub.icon}</span>
                                                    <span className={`${typography.body.xs} truncate`}>
                                                        {sub.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface ListedJobsProps {
    userId: string;
}

const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
    const navigate = useNavigate();

    // ── State ──────────────────────────────────────────────────────────────────
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [beautyServices, setBeautyServices] = useState<BeautyWorker[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [digitalServices, setDigitalServices] = useState<DigitalWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Filter state ───────────────────────────────────────────────────────────
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    // ── Fetch all services ─────────────────────────────────────────────────────
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                if (!userId) {
                    setHotels([]);
                    setBeautyServices([]);
                    setHospitals([]);
                    setLoading(false);
                    return;
                }

                const [hotelsRes, beautyRes, hospitalsRes, digitalRes] = await Promise.all([
                    getUserHotels(userId),
                    getUserBeautyWorkers(userId),
                    getUserHospitals(userId),
                    getUserDigitalServices(userId),
                ]);

                setHotels(hotelsRes.success ? hotelsRes.data || [] : []);
                setBeautyServices(beautyRes.success ? beautyRes.data || [] : []);
                setHospitals(hospitalsRes.success ? hospitalsRes.data || [] : []);
                setDigitalServices(digitalRes.success ? digitalRes.data || [] : []);
            } catch (error) {
                console.error("Error fetching services:", error);
                setHotels([]);
                setBeautyServices([]);
                setHospitals([]);
                setDigitalServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [userId]);

    // ── Filter logic ───────────────────────────────────────────────────────────
    const getFilteredServices = () => {
        let filteredHotels = hotels;
        let filteredBeauty = beautyServices;
        let filteredHospitals = hospitals;
        let filteredDigital = digitalServices;

        if (selectedCategoryId !== null) {
            // Category 3 = Healthcare / Hospitals
            if (selectedCategoryId === 3) {
                filteredHotels = [];
                filteredBeauty = [];
                filteredDigital = [];
                if (selectedSubcategory) {
                    filteredHospitals = hospitals.filter(
                        (h) =>
                            h.hospitalType &&
                            h.hospitalType.toLowerCase().includes(selectedSubcategory.toLowerCase())
                    );
                }
            }
            // Category 4 = Hotels & Travel
            else if (selectedCategoryId === 4) {
                filteredBeauty = [];
                filteredHospitals = [];
                filteredDigital = [];
                if (selectedSubcategory) {
                    filteredHotels = hotels.filter(
                        (h) =>
                            h.type &&
                            selectedSubcategory.toLowerCase().includes(h.type.toLowerCase())
                    );
                }
            }
            // Category 5 = Beauty & Wellness
            else if (selectedCategoryId === 5) {
                filteredHotels = [];
                filteredHospitals = [];
                filteredDigital = [];
                if (selectedSubcategory) {
                    filteredBeauty = beautyServices.filter(
                        (b) =>
                            b.category &&
                            selectedSubcategory.toLowerCase().includes(b.category.toLowerCase())
                    );
                }
            }
            // Category 12 = Tech & Digital Services
            else if (selectedCategoryId === 12) {
                filteredHotels = [];
                filteredHospitals = [];
                filteredBeauty = [];
                if (selectedSubcategory) {
                    filteredDigital = digitalServices.filter(
                        (d) =>
                            d.category &&
                            selectedSubcategory.toLowerCase().includes(d.category.toLowerCase())
                    );
                }
            }
            // Other categories → hide all current service types
            else {
                filteredHotels = [];
                filteredBeauty = [];
                filteredHospitals = [];
                filteredDigital = [];
            }
        }

        return { filteredHotels, filteredBeauty, filteredHospitals, filteredDigital };
    };

    const { filteredHotels, filteredBeauty, filteredHospitals, filteredDigital } = getFilteredServices();
    const totalServices =
        filteredHotels.length + filteredBeauty.length + filteredHospitals.length + filteredDigital.length;

    // ── Determine which "Add Post" route to show based on the active filter ───
    const getAddPostRoute = (): string | null => {
        if (!selectedCategoryId || !selectedSubcategory) return null;

        const sub = selectedSubcategory
            .toLowerCase()
            .split(" ")
            .join("-");

        if (selectedCategoryId === 3)
            return `/add-hospital-service-form?subcategory=${sub}`;
        if (selectedCategoryId === 4)
            return `/add-hotel-service-form?subcategory=${sub}`;
        if (selectedCategoryId === 5)
            return `/beauty-form?subcategory=${sub}`;
        if (selectedCategoryId === 12)
            return `/add-digital-service-form?subcategory=${sub}`;
        return null;
    };

    const addPostRoute = getAddPostRoute();

    // ── Delete handlers ────────────────────────────────────────────────────────
    const handleDeleteHotel = async (hotelId: string) => {
        if (!window.confirm("Delete this service?")) return;
        setDeletingId(hotelId);
        try {
            const result = await deleteHotel(hotelId);
            if (result.success) {
                setHotels((prev) => prev.filter((h) => h._id !== hotelId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting hotel:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteBeauty = async (beautyId: string) => {
        if (!window.confirm("Delete this service?")) return;
        setDeletingId(beautyId);
        try {
            const result = await deleteBeautyWorkerById(beautyId);
            if (result.success) {
                setBeautyServices((prev) => prev.filter((b) => b._id !== beautyId));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting beauty service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteHospital = async (hospitalId: string) => {
        if (!window.confirm("Delete this hospital?")) return;
        setDeletingId(hospitalId);
        try {
            const result = await deleteHospital(hospitalId);
            if (result.success) {
                setHospitals((prev) => prev.filter((h) => h.id !== hospitalId));
            } else {
                alert("Failed to delete hospital. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting hospital:", error);
            alert("Failed to delete hospital. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteDigital = async (id: string, category: string, serviceName: string) => {
        if (!window.confirm("Delete this digital service?")) return;
        setDeletingId(id);
        try {
            const result = await deleteDigitalService(id, category, serviceName);
            if (result.success) {
                setDigitalServices((prev) => prev.filter((d) => d._id !== id));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting digital service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Shared helpers ─────────────────────────────────────────────────────────
    const openDirections = (service: { latitude?: number; longitude?: number; area?: string; city?: string; state?: string }) => {
        if (service.latitude && service.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${service.latitude},${service.longitude}`,
                "_blank"
            );
        } else if (service.area || service.city) {
            const addr = encodeURIComponent(
                [service.area, service.city, service.state].filter(Boolean).join(", ")
            );
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${addr}`,
                "_blank"
            );
        }
    };

    const openCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // ============================================================================
    // CARD RENDERERS
    // ============================================================================

    // ── Hospital Card ──────────────────────────────────────────────────────────
    const renderHospitalCard = (hospital: Hospital) => {
        const id = hospital.id || "";
        const location =
            [hospital.area, hospital.city, hospital.state].filter(Boolean).join(", ") ||
            "Location not set";
        const departments = hospital.departments
            ? hospital.departments.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
        const services = hospital.services
            ? hospital.services.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
        const imageUrl =
            hospital.images && hospital.images.length > 0
                ? hospital.images[0].startsWith("http")
                    ? hospital.images[0]
                    : `${API_BASE_URL}/${hospital.images[0]}`
                : null;

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                {/* Banner */}
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex flex-col items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={hospital.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl sm:text-6xl">🏥</span>
                    )}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/add-hospital-service-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDeleteHospital(id);
                            }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {hospital.name || "Unnamed Hospital"}
                    </h2>

                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    {/* Type + rating badges */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {hospital.hospitalType && (
                            <span
                                className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-emerald-100 text-emerald-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-200`}
                            >
                                <span className="shrink-0">🏥</span>
                                <span className="truncate">{hospital.hospitalType}</span>
                            </span>
                        )}
                        {hospital.rating && (
                            <span
                                className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-yellow-50 text-yellow-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-yellow-200`}
                            >
                                <span>⭐</span> {hospital.rating}
                            </span>
                        )}
                    </div>

                    {/* Departments */}
                    {departments.length > 0 && (
                        <div>
                            <p
                                className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}
                            >
                                Departments:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {departments.slice(0, 3).map((d, idx) => (
                                    <span
                                        key={`${id}-dept-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-emerald-50 text-emerald-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-200`}
                                    >
                                        <span>🏥</span> {d}
                                    </span>
                                ))}
                                {departments.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{departments.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Services */}
                    {services.length > 0 && (
                        <div>
                            <p
                                className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}
                            >
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-svc-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-teal-50 text-teal-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-teal-200`}
                                    >
                                        <span>✓</span> {s}
                                    </span>
                                ))}
                                {services.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{services.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(hospital as any)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => hospital.services && openCall(hospital.services)}
                            className="w-full sm:flex-1 justify-center gap-1.5"
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">
                                {hospital.pincode ? `Pin: ${hospital.pincode}` : "No Pincode"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Hotel Card ─────────────────────────────────────────────────────────────
    const renderHotelCard = (hotel: Hotel) => {
        const id = hotel._id || "";
        const location =
            [hotel.area, hotel.city, hotel.state].filter(Boolean).join(", ") ||
            "Location not set";
        const amenities = hotel.service
            ? hotel.service.split(",").map((s) => s.trim()).filter(Boolean)
            : [];

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex flex-col items-center justify-center">
                    <span className="text-5xl sm:text-6xl">🏨</span>
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/add-hotel-service-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDeleteHotel(id);
                            }}
                        />
                    </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {hotel.name || "Unnamed Service"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {hotel.type && (
                            <span
                                className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-gray-100 text-gray-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200`}
                            >
                                <span className="shrink-0">🏨</span>
                                <span className="truncate">{hotel.type}</span>
                            </span>
                        )}
                        <span
                            className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-green-50 text-green-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-green-200`}
                        >
                            <span>⏰</span> Open 24 Hrs
                        </span>
                    </div>

                    {hotel.description && (
                        <p className={`${typography.card.description} text-gray-600 line-clamp-2`}>
                            {hotel.description}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className={`${typography.body.xs} font-semibold text-gray-700`}>
                            {hotel.ratings || "N/A"}
                        </span>
                        {hotel.priceRange && (
                            <span
                                className={`ml-auto ${typography.body.xs} font-semibold text-green-700`}
                            >
                                ₹ {hotel.priceRange}
                            </span>
                        )}
                    </div>

                    {amenities.length > 0 && (
                        <div>
                            <p
                                className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}
                            >
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {amenities.slice(0, 3).map((a, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-gray-100 text-gray-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200`}
                                    >
                                        <span>✓</span> {a}
                                    </span>
                                ))}
                                {amenities.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{amenities.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(hotel)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-green-600 text-green-700 hover:bg-green-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => hotel.phone && openCall(hotel.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5"
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{hotel.phone || "No Phone"}</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Beauty Card ────────────────────────────────────────────────────────────
    const renderBeautyCard = (beauty: BeautyWorker) => {
        const id = beauty._id || "";
        const location =
            [beauty.area, beauty.city, beauty.state].filter(Boolean).join(", ") ||
            "Location not set";
        const services = Array.isArray(beauty.services) ? beauty.services : [];
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
        const imageUrl =
            beauty.images && beauty.images.length > 0
                ? `${API_BASE_URL}/${beauty.images[0]}`
                : null;

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex flex-col items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={beauty.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl sm:text-6xl">💅</span>
                    )}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/beauty-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                handleDeleteBeauty(id);
                            }}
                        />
                    </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {beauty.name || "Unnamed Service"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {beauty.category && (
                            <span
                                className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-rose-100 text-rose-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-rose-200`}
                            >
                                <span className="shrink-0">💅</span>
                                <span className="truncate">{beauty.category}</span>
                            </span>
                        )}
                        <span
                            className={`inline-flex items-center gap-1 ${typography.misc.badge} ${beauty.availability
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                                } px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border`}
                        >
                            <span>{beauty.availability ? "✓" : "⏸"}</span>{" "}
                            {beauty.availability ? "Available" : "Unavailable"}
                        </span>
                    </div>

                    {beauty.bio && (
                        <p
                            className={`${typography.card.description} text-gray-600 line-clamp-2 italic`}
                        >
                            "{beauty.bio}"
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {beauty.rating && (
                            <>
                                <span className="text-yellow-500">★</span>
                                <span
                                    className={`${typography.body.xs} font-semibold text-gray-700`}
                                >
                                    {beauty.rating.toFixed(1)}
                                </span>
                            </>
                        )}
                        {beauty.experience && (
                            <span className={`${typography.body.xs} text-gray-500`}>
                                • {beauty.experience}{" "}
                                {beauty.experience === 1 ? "year" : "years"} exp
                            </span>
                        )}
                        {beauty.serviceCharge && (
                            <span
                                className={`ml-auto ${typography.body.xs} font-semibold text-rose-700`}
                            >
                                ₹ {beauty.serviceCharge}+
                            </span>
                        )}
                    </div>

                    {services.length > 0 && (
                        <div>
                            <p
                                className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}
                            >
                                Services:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-rose-50 text-rose-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-rose-200`}
                                    >
                                        <span>✓</span> {s}
                                    </span>
                                ))}
                                {services.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{services.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(beauty as any)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-rose-600 text-rose-700 hover:bg-rose-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => beauty.phone && openCall(beauty.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5 bg-rose-500 hover:bg-rose-600"
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{beauty.phone || "No Phone"}</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // ── Digital Service Card ────────────────────────────────────────────────────────────
    const renderDigitalCard = (digital: DigitalWorker) => {
        const id = digital._id || "";
        const location =
            [digital.area, digital.city, digital.state].filter(Boolean).join(", ") ||
            "Location not set";
        const services = Array.isArray(digital.services) ? digital.services : [];
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
        const imageUrl =
            digital.images && digital.images.length > 0
                ? digital.images[0].startsWith("http")
                    ? digital.images[0]
                    : `${API_BASE_URL}/${digital.images[0]}`
                : null;

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
                <div className="relative w-full h-36 sm:h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={digital.name || digital.serviceName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl sm:text-6xl">💻</span>
                    )}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <ActionDropdown
                            onEdit={(e) => {
                                e.stopPropagation();
                                navigate(`/add-digital-service-form?id=${id}`);
                            }}
                            onDelete={(e) => {
                                e.stopPropagation();
                                const cat = digital.category || "Tech & Digital Services";
                                const sName = digital.serviceName || digital.name || "Unknown Service";
                                handleDeleteDigital(id, cat, sName);
                            }}
                        />
                    </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <h2 className={`${typography.card.title} text-gray-800 truncate`}>
                        {digital.serviceName || digital.name || "Unnamed Service"}
                    </h2>
                    <p className={`${typography.body.xs} text-gray-500 flex items-center gap-1.5`}>
                        <span className="shrink-0">📍</span>
                        <span className="truncate">{location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                            className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-blue-100 text-blue-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-blue-200`}
                        >
                            <span className="shrink-0">💻</span>
                            <span className="truncate">{digital.subCategory || digital.category}</span>
                        </span>
                        {digital.rating && (
                            <span
                                className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-yellow-50 text-yellow-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-yellow-200`}
                            >
                                <span>⭐</span> {digital.rating}
                            </span>
                        )}
                    </div>

                    {digital.description && (
                        <p className={`${typography.card.description} text-gray-600 line-clamp-2`}>
                            {digital.description}
                        </p>
                    )}

                    {services.length > 0 && (
                        <div>
                            <p
                                className={`${typography.misc.caption} font-semibold uppercase tracking-wide mb-1.5`}
                            >
                                Skills:
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {services.slice(0, 3).map((s, idx) => (
                                    <span
                                        key={`${id}-skill-${idx}`}
                                        className={`inline-flex items-center gap-1 ${typography.misc.badge} bg-indigo-50 text-indigo-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-indigo-200`}
                                    >
                                        <span>✓</span> {s}
                                    </span>
                                ))}
                                {services.length > 3 && (
                                    <span className={`${typography.misc.badge} text-gray-500`}>
                                        +{services.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDirections(digital as any)}
                            className="w-full sm:flex-1 justify-center gap-1.5 border-blue-600 text-blue-700 hover:bg-blue-50"
                        >
                            <span>📍</span> Directions
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => digital.phone && openCall(digital.phone)}
                            className="w-full sm:flex-1 justify-center gap-1.5"
                        >
                            <span className="shrink-0">📞</span>
                            <span className="truncate">{digital.phone || "No Phone"}</span>
                        </Button>
                    </div>

                </div>
            </div>
        );
    };

    // ============================================================================
    // LOADING
    // ============================================================================
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
                    <p className={`${typography.body.base} text-gray-600`}>
                        Loading your services...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ─── HEADER  ──  title left  |  filter + Add Post right ───── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: title */}
                    <div>
                        <h1 className={`${typography.heading.h3} text-gray-900`}>
                            My Services
                        </h1>
                        <p className={`${typography.body.small} text-gray-500 mt-1`}>
                            Manage your service listings across all categories
                        </p>
                    </div>

                    {/* Right: filter dropdown  +  conditional Add Post */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <CategoryFilterDropdown
                            selectedCategoryId={selectedCategoryId}
                            selectedSubcategory={selectedSubcategory}
                            onSelectCategory={setSelectedCategoryId}
                            onSelectSubcategory={setSelectedSubcategory}
                        />

                        {/* "× Clear" chip shown when a filter is active */}
                        {(selectedCategoryId || selectedSubcategory) && (
                            <button
                                onClick={() => {
                                    setSelectedCategoryId(null);
                                    setSelectedSubcategory(null);
                                }}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <X size={14} /> Clear
                            </button>
                        )}

                        {/* Add Post — only visible after BOTH category & subcategory are picked */}
                        {addPostRoute && (
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => navigate(addPostRoute)}
                                className="whitespace-nowrap"
                            >
                                + Add Post
                            </Button>
                        )}
                    </div>
                </div>

                {/* ─── ACTIVE FILTER PILLS (below header, replaces the old banner) ── */}
                {(selectedCategoryId || selectedSubcategory) && (
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedCategoryId && (
                            <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                                {(() => {
                                    const cat = (categories as any).categories.find(
                                        (c: any) => c.id === selectedCategoryId
                                    );
                                    return cat ? `${cat.icon} ${cat.name}` : "Category";
                                })()}
                                <button
                                    onClick={() => {
                                        setSelectedCategoryId(null);
                                        setSelectedSubcategory(null);
                                    }}
                                    className="ml-1 hover:text-blue-900"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {selectedSubcategory && (
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full border border-blue-200">
                                {selectedSubcategory}
                                <button
                                    onClick={() => setSelectedSubcategory(null)}
                                    className="ml-1 hover:text-blue-800"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        <span className={`${typography.body.xs} text-gray-500`}>
                            · {totalServices} service{totalServices !== 1 ? "s" : ""} found
                        </span>
                    </div>
                )}

                {/* ─── SERVICES GRID ──────────────────────────────────────────── */}
                {totalServices === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="text-5xl mb-4">
                            {selectedCategoryId || selectedSubcategory ? "🔍" : "📋"}
                        </div>
                        <h3 className={`${typography.heading.h4} text-gray-900 mb-2`}>
                            {selectedCategoryId || selectedSubcategory
                                ? "No services found in this category"
                                : "No services listed yet"}
                        </h3>
                        <p
                            className={`${typography.body.base} text-gray-500 mb-6 max-w-md mx-auto`}
                        >
                            {selectedCategoryId || selectedSubcategory
                                ? "Try clearing the filter or browse other categories"
                                : "Select a category and subcategory above, then tap + Add Post to get started"}
                        </p>
                        {(selectedCategoryId || selectedSubcategory) && (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => {
                                    setSelectedCategoryId(null);
                                    setSelectedSubcategory(null);
                                }}
                            >
                                Clear Filter & View All
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Hospital Services */}
                        {filteredHospitals.length > 0 && (
                            <div>
                                <h2
                                    className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                                >
                                    <span>🏥</span> Hospital & Healthcare Services ({filteredHospitals.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {filteredHospitals.map(renderHospitalCard)}
                                </div>
                            </div>
                        )}

                        {/* Hotel Services */}
                        {filteredHotels.length > 0 && (
                            <div>
                                <h2
                                    className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                                >
                                    <span>🏨</span> Hotel & Travel Services ({filteredHotels.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {filteredHotels.map(renderHotelCard)}
                                </div>
                            </div>
                        )}

                        {/* Digital Services */}
                        {filteredDigital.length > 0 && (
                            <div>
                                <h2
                                    className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                                >
                                    <span>💻</span> Tech & Digital Services ({filteredDigital.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {filteredDigital.map(renderDigitalCard)}
                                </div>
                            </div>
                        )}

                        {/* Beauty Services */}
                        {filteredBeauty.length > 0 && (
                            <div>
                                <h2
                                    className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}
                                >
                                    <span>💅</span> Beauty & Wellness Services ({filteredBeauty.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredBeauty.map(renderBeautyCard)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ListedJobs;