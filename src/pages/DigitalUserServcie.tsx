import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserDigitalServices,
    deleteDigitalService,
    DigitalWorker
} from "../services/DigitalService.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ── Helper: parse services string or array ────────────────────────────────────
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map(s => s.trim()).filter(Boolean);
    return [];
};

// ── Get icon for service type ──────────────────────────────────────────────────
const getServiceIcon = (category?: string): string => {
    if (!category) return "💻";
    const n = category.toLowerCase();
    if (n.includes("website") || n.includes("web")) return "🌐";
    if (n.includes("mobile") || n.includes("app")) return "📱";
    if (n.includes("graphic") || n.includes("design")) return "🎨";
    if (n.includes("marketing") || n.includes("seo")) return "📈";
    if (n.includes("software") || n.includes("development")) return "⚙️";
    if (n.includes("cctv") || n.includes("security")) return "📹";
    if (n.includes("repair")) return "🔧";
    if (n.includes("data") || n.includes("analytics")) return "📊";
    return "💻";
};

interface DigitalUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideEmptyState?: boolean;
    hideHeader?: boolean;
}

const DigitalUserService: React.FC<DigitalUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideEmptyState = false,
    hideHeader = false
}) => {
    const navigate = useNavigate();
    const [digitalServices, setDigitalServices] = useState<DigitalWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchDigitalServices = async () => {
            if (!userId) { setDigitalServices([]); setLoading(false); return; }
            setLoading(true);
            try {
                const response = await getUserDigitalServices(userId);
                if (response.success && response.data) {
                    setDigitalServices(Array.isArray(response.data) ? response.data : [response.data]);
                } else {
                    setDigitalServices([]);
                }
            } catch (error) {
                console.error("Error fetching digital services:", error);
                setDigitalServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDigitalServices();
    }, [userId]);

    // ── Filter by subcategory (client-side) ───────────────────────────────────
    const filteredServices = selectedSubcategory
        ? digitalServices.filter(s =>
            s.category && s.category.toLowerCase() === selectedSubcategory.toLowerCase()
        )
        : digitalServices;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-digital-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        setDeleteLoading(id);
        try {
            const result = await deleteDigitalService(id);
            if (result.success) {
                setDigitalServices(prev => prev.filter(s => s._id !== id));
            } else {
                alert("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting digital service:", error);
            alert("Failed to delete service. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => navigate(`/tech-services/details/${id}`);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💻</span> Tech & Digital Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                </div>
            </div>
        );
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
    if (filteredServices.length === 0) {
        if (hideEmptyState) return null;
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>💻</span> Tech & Digital Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Digital Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your tech and digital services to showcase them here.
                    </p>
                    <Button variant="primary" size="md" onClick={() => navigate('/add-digital-service-form')}
                        className="gap-1.5">
                        + Add Digital Service
                    </Button>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER — mirrors RealEstateUserService card structure exactly
    // ============================================================================
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💻</span> Tech & Digital Services ({filteredServices.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map((service) => {
                    const id = service._id || "";
                    const location = [service.area, service.city, service.state]
                        .filter(Boolean).join(", ") || "Location not specified";
                    const servicesList = ensureArray(service.services);
                    const imageUrls = (service.images || []).filter(Boolean) as string[];
                    const icon = getServiceIcon(service.category);

                    return (
                        <div key={id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                            {/* ── Image — mirrors RealEstateUserService image section ── */}
                            <div className="relative h-48 bg-gradient-to-br from-indigo-600/10 to-indigo-600/5">
                                {imageUrls.length > 0 ? (
                                    <img src={imageUrls[0]} alt={service.name || "Digital Service"}
                                        className="w-full h-full object-cover"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">{icon}</span>
                                    </div>
                                )}

                                {/* Category badge — top left, mirrors property type badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-indigo-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {service.category || "Digital Service"}
                                    </span>
                                </div>

                                {/* Action Dropdown — top right, mirrors RealEstateUserService */}
                                <div className="absolute top-3 right-3">
                                    {deleteLoading === id ? (
                                        <div className="bg-white rounded-lg p-2 shadow-lg">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                                        </div>
                                    ) : (
                                        <ActionDropdown
                                            onEdit={() => handleEdit(id)}
                                            onDelete={() => handleDelete(id)}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* ── Details ── */}
                            <div className="p-4">
                                {/* Title */}
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {service.name || "Unnamed Service"}
                                </h3>

                                {/* Category */}
                                {service.category && (
                                    <p className="text-sm font-medium text-gray-700 mb-2">{service.category}</p>
                                )}

                                {/* Location — mirrors RealEstateUserService SVG pin */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                                </div>

                                {/* Description */}
                                {service.bio && (
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                                        {service.bio}
                                    </p>
                                )}

                                {/* Availability badge — mirrors RealEstateUserService status badges */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${service.availability
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${service.availability ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {service.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                    {service.chargeType && (
                                        <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                            {service.chargeType}
                                        </span>
                                    )}
                                </div>

                                {/* Experience + Charge — mirrors RealEstateUserService bedrooms+price row */}
                                <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                                    <div className="flex items-center gap-3">
                                        {service.experience && (
                                            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                                💼 {service.experience} yrs
                                            </span>
                                        )}
                                        {service.rating && (
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                ⭐ {service.rating}
                                            </span>
                                        )}
                                    </div>
                                    {service.serviceCharge && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {service.chargeType || "Charge"}
                                            </p>
                                            <p className="text-base font-bold text-indigo-600">
                                                ₹{Number(service.serviceCharge).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Services Tags — mirrors RealEstateUserService amenities tags */}
                                {servicesList.length > 0 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {servicesList.slice(0, 3).map((s, idx) => (
                                                <span key={idx}
                                                    className={`${typography.fontSize.xs} bg-indigo-600/5 text-indigo-700 px-2 py-0.5 rounded-full`}>
                                                    {s}
                                                </span>
                                            ))}
                                            {servicesList.length > 3 && (
                                                <span className={`${typography.fontSize.xs} text-gray-500`}>
                                                    +{servicesList.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* View Details — mirrors RealEstateUserService */}
                                <Button variant="outline" size="sm" onClick={() => handleView(id)}
                                    className="w-full mt-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600/10">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DigitalUserService;