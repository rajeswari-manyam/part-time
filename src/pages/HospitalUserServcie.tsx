import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteHospital, Hospital } from "../services/HospitalService.service";
import { ServiceItem } from "../services/api.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

// ============================================================================
// HELPERS
// ============================================================================
const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "string") return input.split(",").map(s => s.trim()).filter(Boolean);
    return [];
};

// ============================================================================
// PROPS
// ============================================================================
interface HospitalUserServiceProps {
    userId: string;
    data?: ServiceItem[];           // ✅ received from MyBusiness via getAllDataByUserId
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const HospitalUserService: React.FC<HospitalUserServiceProps> = ({
    userId,
    data = [],                      // ✅ no internal fetch — use prop directly
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();

    // Cast to Hospital[] so all existing field access works
    const [hospitals, setHospitals] = useState<Hospital[]>(data as Hospital[]);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredHospitals = selectedSubcategory
        ? hospitals.filter(h =>
            h.hospitalType &&
            h.hospitalType.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : hospitals;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => {
        navigate(`/add-hospital-service-form?id=${id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this hospital?")) return;
        setDeleteLoading(id);
        try {
            const response = await deleteHospital(id);
            if (response.success) {
                setHospitals(prev => prev.filter(h => h.id !== id));
            } else {
                alert(response.message || "Failed to delete hospital");
            }
        } catch (error) {
            console.error("Error deleting hospital:", error);
            alert("Failed to delete hospital");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleView = (id: string) => {
        navigate(`/hospital-services/details/${id}`);
    };

    // ============================================================================
    // CARD
    // ============================================================================
    const renderCard = (hospital: Hospital) => {
        const id = hospital.id || "";
        const imageUrls = (hospital.images || []).filter(Boolean) as string[];
        const location = [hospital.area, hospital.city, hospital.state]
            .filter(Boolean).join(", ") || "Location not specified";
        const departments = ensureArray(hospital.departments);
        const services = ensureArray(hospital.services);

        return (
            <div
                key={id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
                {/* ── Image Section ── */}
                <div className="relative h-48 bg-gradient-to-br from-[#1A5F9E]/10 to-[#1A5F9E]/5">
                    {imageUrls.length > 0 ? (
                        <img
                            src={imageUrls[0]}
                            alt={hospital.name || "Hospital"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">🏥</span>
                        </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`${typography.misc.badge} bg-[#1A5F9E] text-white px-3 py-1 rounded-full shadow-md`}>
                            {hospital.hospitalType || "Hospital"}
                        </span>
                    </div>

                    {/* Action Dropdown */}
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
                    <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                        {hospital.name || "Unnamed Hospital"}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                    </div>

                    {/* Departments */}
                    {departments.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Departments:</p>
                            <div className="flex flex-wrap gap-1">
                                {departments.slice(0, 3).map((dept, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-[#1A5F9E]/5 text-[#1A5F9E] px-2 py-0.5 rounded-full`}>
                                        {dept}
                                    </span>
                                ))}
                                {departments.length > 3 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{departments.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Services */}
                    {services.length > 0 && (
                        <div className="mb-3">
                            <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                            <div className="flex flex-wrap gap-1">
                                {services.slice(0, 2).map((service, idx) => (
                                    <span key={idx} className={`${typography.fontSize.xs} bg-[#1A5F9E]/10 text-[#1A5F9E] px-2 py-0.5 rounded-full`}>
                                        {service}
                                    </span>
                                ))}
                                {services.length > 2 && (
                                    <span className={`${typography.fontSize.xs} text-gray-500`}>
                                        +{services.length - 2} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Details */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(id)}
                        className="w-full mt-2 border-[#1A5F9E] text-[#1A5F9E] hover:bg-[#1A5F9E]/10"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        );
    };

    // ============================================================================
    // EMPTY STATE
    // ============================================================================
    if (filteredHospitals.length === 0) {
        if (hideEmptyState) return null;

        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏥</span> Hospital & Medical Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🏥</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Hospital Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your hospital and medical services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate("/add-hospital-service-form")}
                        className="gap-1.5 bg-[#1A5F9E] hover:bg-[#154a7e]"
                    >
                        + Add Hospital Service
                    </Button>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏥</span> Hospital & Medical Services ({filteredHospitals.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredHospitals.map(renderCard)}
            </div>
        </div>
    );
};

export default HospitalUserService;