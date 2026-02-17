import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";
import { getUserHospitals, deleteHospital, Hospital } from "../services/HospitalService.service";

const ensureArray = (input: any): string[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
    return [];
};

interface HospitalUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const HospitalUserService: React.FC<HospitalUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    const fetchHospitals = async () => {
        if (!userId) {
            setHospitals([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getUserHospitals(userId);
            console.log("User hospitals response:", response);
            setHospitals(response.success ? response.data || [] : []);
        } catch (error) {
            console.error("Error fetching hospitals:", error);
            setHospitals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, [userId]);

    const filteredHospitals = selectedSubcategory
        ? hospitals.filter(h =>
            h.hospitalType &&
            h.hospitalType.toLowerCase().includes(selectedSubcategory.toLowerCase())
        )
        : hospitals;

    const handleEdit = (hospitalId: string) => {
        navigate(`/add-hospital-service-form?id=${hospitalId}`);
    };

    const handleDelete = async (hospitalId: string) => {
        if (!window.confirm("Are you sure you want to delete this hospital?")) return;

        setDeleteLoading(hospitalId);
        try {
            const response = await deleteHospital(hospitalId);
            if (response.success) {
                setHospitals(prev => prev.filter(h => h.id !== hospitalId));
                alert("Hospital deleted successfully!");
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

    const handleView = (hospitalId: string) => {
        navigate(`/hospital-services/details/${hospitalId}`);
    };

    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏥</span> Hospital & Medical Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A5F9E]"></div>
                </div>
            </div>
        );
    }

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
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Hospital Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your hospital and medical services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-hospital-service-form')}
                        className="gap-1.5 bg-[#1A5F9E] hover:bg-[#154a7e]"
                    >
                        + Add Hospital Service
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🏥</span> Hospital & Medical Services ({filteredHospitals.length})
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredHospitals.map((hospital) => (
                    <div
                        key={hospital.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Hospital Image */}
                        <div className="relative h-48 bg-gradient-to-br from-[#1A5F9E]/10 to-[#1A5F9E]/5">
                            {hospital.images && hospital.images.length > 0 ? (
                                <img
                                    src={hospital.images[0]}
                                    alt={hospital.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-6xl">🏥</span>
                                </div>
                            )}

                            {/* Type Badge */}
                            <div className="absolute top-3 left-3">
                                <span className={`${typography.misc.badge} bg-[#1A5F9E] text-white px-3 py-1 rounded-full shadow-md`}>
                                    {hospital.hospitalType || 'Hospital'}
                                </span>
                            </div>

                            {/* Action Dropdown */}
                            <div className="absolute top-3 right-3">
                                {deleteLoading === hospital.id ? (
                                    <div className="bg-white rounded-lg p-2 shadow-lg">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                    </div>
                                ) : (
                                    <ActionDropdown
                                        onEdit={() => handleEdit(hospital.id!)}
                                        onDelete={() => handleDelete(hospital.id!)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Hospital Details */}
                        <div className="p-4">
                            <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                {hospital.name || 'Unnamed Hospital'}
                            </h3>

                            {/* Location */}
                            <div className="flex items-start gap-2 mb-3">
                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>
                                    {[hospital.area, hospital.city, hospital.state]
                                        .filter(Boolean)
                                        .join(', ') || 'Location not specified'}
                                </p>
                            </div>

                            {/* Departments */}
                            {ensureArray(hospital.departments).length > 0 && (
                                <div className="mb-3">
                                    <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                        Departments:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {ensureArray(hospital.departments).slice(0, 3).map((dept, idx) => (
                                            <span
                                                key={idx}
                                                className={`${typography.fontSize.xs} bg-[#1A5F9E]/5 text-[#1A5F9E] px-2 py-0.5 rounded-full`}
                                            >
                                                {dept}
                                            </span>
                                        ))}
                                        {ensureArray(hospital.departments).length > 3 && (
                                            <span className={`${typography.fontSize.xs} text-gray-500`}>
                                                +{ensureArray(hospital.departments).length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {ensureArray(hospital.services).length > 0 && (
                                <div className="mb-3">
                                    <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>
                                        Services:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {ensureArray(hospital.services).slice(0, 2).map((service, idx) => (
                                            <span
                                                key={idx}
                                                className={`${typography.fontSize.xs} bg-[#1A5F9E]/10 text-[#1A5F9E] px-2 py-0.5 rounded-full`}
                                            >
                                                {service}
                                            </span>
                                        ))}
                                        {ensureArray(hospital.services).length > 2 && (
                                            <span className={`${typography.fontSize.xs} text-gray-500`}>
                                                +{ensureArray(hospital.services).length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* View Details Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(hospital.id!)}
                                className="w-full mt-2 border-[#1A5F9E] text-[#1A5F9E] hover:bg-[#1A5F9E]/10"
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalUserService;