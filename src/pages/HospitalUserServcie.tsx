import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface HospitalUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

// You'll need to import your actual service functions here
// import { getUserHospitals, deleteHospital, Hospital } from "../services/HospitalService.service";

const HospitalUserService: React.FC<HospitalUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false
}) => {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHospitals = async () => {
            if (!userId) {
                setHospitals([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Replace with your actual API call
                // const response = await getUserHospitals(userId);
                // setHospitals(response.success ? response.data || [] : []);
                setHospitals([]); // Placeholder
            } catch (error) {
                console.error("Error fetching hospitals:", error);
                setHospitals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHospitals();
    }, [userId]);

    const filteredHospitals = selectedSubcategory
        ? hospitals.filter(h =>
            h.type &&
            selectedSubcategory.toLowerCase().includes(h.type.toLowerCase())
        )
        : hospitals;

    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🏥</span> Hospital & Medical Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
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
                        className="gap-1.5"
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
                {/* Add your hospital cards here */}
            </div>
        </div>
    );
};

export default HospitalUserService;