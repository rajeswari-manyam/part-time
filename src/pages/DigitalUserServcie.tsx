import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

interface DigitalUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
}

// You'll need to import your actual service functions here
// import { getUserDigitalServices, deleteDigitalService, DigitalService } from "../services/DigitalService.service";

const DigitalUserService: React.FC<DigitalUserServiceProps> = ({
    userId,
    selectedSubcategory
}) => {
    const navigate = useNavigate();
    const [digitalServices, setDigitalServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDigitalServices = async () => {
            if (!userId) {
                setDigitalServices([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Replace with your actual API call
                // const response = await getUserDigitalServices(userId);
                // setDigitalServices(response.success ? response.data || [] : []);
                setDigitalServices([]); // Placeholder
            } catch (error) {
                console.error("Error fetching digital services:", error);
                setDigitalServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDigitalServices();
    }, [userId]);

    const filteredServices = selectedSubcategory
        ? digitalServices.filter(s =>
            s.type &&
            selectedSubcategory.toLowerCase().includes(s.type.toLowerCase())
        )
        : digitalServices;

    if (loading) {
        return (
            <div>
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💻</span> Digital Services
                </h2>
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (filteredServices.length === 0) {
        return (
            <div>
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>💻</span> Digital Services (0)
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>
                        No Digital Services Yet
                    </h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your digital services to showcase them here.
                    </p>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/add-digital-service-form')}
                        className="gap-1.5"
                    >
                        + Add Digital Service
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                <span>💻</span> Digital Services ({filteredServices.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Add your digital service cards here */}
            </div>
        </div>
    );
};

export default DigitalUserService;