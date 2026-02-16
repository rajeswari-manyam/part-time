import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

// Service screens
import HotelUserService from "./HotelUserService";
import BeautyUserService from "./BeautyUserServcie";
import HospitalUserService from "./HospitalUserServcie";
import DigitalUserService from "./DigitalUserServcie";
import SportsUserService from "./SportsUserService";
import ShoppingUserService from "./ShoppingUserService";
import EducationUserService from "./EducationUserService";
import AutomotiveUserService from "./AutomotiveUserService";
import PetUserService from "./PetUserService";
import EventUserService from "./EventUserService";
import IndustrialUserService from "./IndustrialUserService";
import BusinessUserService from "./BusinessUserService";
import CourierUserService from "./CourierUserService";
import DailyWageUserService from "./DailyWageUserService";
import AgricultureUserService from "./AgricultureUserService";
import CorporativeUserService from "./CorporativeUserService";
import WeddingUserService from "./WeddingUserService";
import ArtUserService from "./ArtUserService";
import PlumberUserService from "./PlumbarUserService";
import RealEstateUserService from "./RealEstateUserService";
import HomeUserService from "./Home&PersonalUserService";

import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import CategoryFilterDropdown from "../components/CategoriesFilterDropDown";


import categories from "../data/categories.json";

interface MyBusinessProps {
    userId: string;
}

const MyBusiness: React.FC<MyBusinessProps> = ({ userId }) => {
    const navigate = useNavigate();

    // ── Filter state ──
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    // ── Add Post Route Logic ──
    const getAddPostRoute = (): string | null => {
        if (!selectedCategoryId || !selectedSubcategory) return null;

        const sub = selectedSubcategory.toLowerCase().replace(/\s+/g, "-");

        switch (selectedCategoryId) {
            case 2:
                return `/add-automotive-form?subcategory=${sub}`;
            case 3:
                return `/add-hospital-service-form?subcategory=${sub}`;
            case 4:
                return `/add-hotel-service-form?subcategory=${sub}`;
            case 5:
                return `/add-beauty-service-form?subcategory=${sub}`;
            case 6:
                return `/add-sports-service-form?subcategory=${sub}`;
            case 7:
                return `/add-education-form?subcategory=${sub}`;
            case 9:
                return `/add-shopping-form?subcategory=${sub}`;
            case 12:
                return `/add-digital-service-form?subcategory=${sub}`;
            case 13: // Pet services category ID
                return `/add-pet-service-form?subcategory=${sub}`;
            case 14: // Event services category ID
                return `/add-event-service-form?subcategory=${sub}`;
            case 15: // Industrial services category ID
                return `/add-industrial-service-form?subcategory=${sub}`;
            case 16: // Business services category ID
                return `/add-business-service-form?subcategory=${sub}`;
            case 17: // Courier services category ID
                return `/add-courier-service-form?subcategory=${sub}`;
            case 18: // Daily wage services category ID
                return `/add-daily-wage-service-form?subcategory=${sub}`;
            case 19: // Agriculture services category ID
                return `/add-agriculture-service-form?subcategory=${sub}`;
            case 20: // Corporative services category ID
                return `/add-corporative-form?subcategory=${sub}`;
            case 21: // Wedding services category ID
                return `/add-wedding-form?subcategory=${sub}`;
            case 22: // Art services category ID
                return `/add-art-form?subcategory=${sub}`;
            case 23: // Plumber services category ID
                return `/add-plumber-form?subcategory=${sub}`;
            case 24: // Real Estate services category ID
                return `/add-real-estate-form?subcategory=${sub}`;
                case 25: // Home services category ID
                return `/add-home-service-form?subcategory=${sub}`;
            default:
                return null;
        }
    };

    const addPostRoute = getAddPostRoute();

    // ── Clear Filters ──
    const clearFilters = () => {
        setSelectedCategoryId(null);
        setSelectedSubcategory(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

                {/* ─── HEADER ─── */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                        <h1 className={`${typography.heading.h3} text-gray-900`}>
                            My Services
                        </h1>
                        <p className={`${typography.body.small} text-gray-500`}>
                            Manage your service listings across all categories
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <CategoryFilterDropdown
                            selectedCategoryId={selectedCategoryId}
                            selectedSubcategory={selectedSubcategory}
                            onSelectCategory={setSelectedCategoryId}
                            onSelectSubcategory={setSelectedSubcategory}
                        />

                        {(selectedCategoryId || selectedSubcategory) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                                <X size={14} /> Clear
                            </button>
                        )}

                        {addPostRoute && (
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => navigate(addPostRoute)}
                            >
                                + Add Post
                            </Button>
                        )}
                    </div>
                </div>

                {/* ─── ACTIVE FILTER TAGS ─── */}
                {(selectedCategoryId || selectedSubcategory) && (
                    <div className="flex flex-wrap gap-2">
                        {selectedCategoryId && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                                {
                                    (categories as any).categories.find(
                                        (c: any) => c.id === selectedCategoryId
                                    )?.name
                                }
                                <button onClick={clearFilters}>
                                    <X size={12} />
                                </button>
                            </span>
                        )}

                        {selectedSubcategory && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full border">
                                {selectedSubcategory}
                                <button onClick={() => setSelectedSubcategory(null)}>
                                    <X size={12} />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* ─── ALL SERVICE CARDS - Each component renders its own grid ─── */}
                <div className="space-y-6">
                    {/* When filter is active, show only filtered category */}
                    {selectedCategoryId ? (
                        <>
                            {selectedCategoryId === 2 && (
                                <AutomotiveUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 3 && (
                                <HospitalUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 4 && (
                                <HotelUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 5 && (
                                <BeautyUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 6 && (
                                <SportsUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 7 && (
                                <EducationUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 9 && (
                                <ShoppingUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 12 && (
                                <DigitalUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 13 && (
                                <PetUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 14 && (
                                <EventUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 15 && (
                                <IndustrialUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 16 && (
                                <BusinessUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}

                            {selectedCategoryId === 17 && (
                                <CourierUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 18 && (
                                <DailyWageUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 19 && (
                                <AgricultureUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 20 && (
                                <CorporativeUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 21 && (
                                <WeddingUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 22 && (
                                <ArtUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 23 && (
                                <PlumberUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 24 && (
                                <RealEstateUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                            {selectedCategoryId === 25 && (
                                <HomeUserService
                                    userId={userId}
                                    selectedSubcategory={selectedSubcategory}
                                    hideHeader={false}
                                    hideEmptyState={true}
                                />
                            )}
                        </>
                    ) : (
                        /* Show ALL cards from all categories - each in its own section */
                        <>
                            <AutomotiveUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <HospitalUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <HotelUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <BeautyUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <SportsUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <EducationUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <ShoppingUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <DigitalUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <PetUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <EventUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <IndustrialUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <BusinessUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <CourierUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <DailyWageUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <AgricultureUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <CorporativeUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <WeddingUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <ArtUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <PlumberUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <RealEstateUserService userId={userId} hideHeader={false} hideEmptyState={true} />
                            <HomeUserService userId={userId} hideHeader={false} hideEmptyState={true} />   
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBusiness;