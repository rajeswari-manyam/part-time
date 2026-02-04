// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { X } from "lucide-react";

// // Service screens
// import HotelUserService from "./HotelUserService";
// import BeautyUserService from "./BeautyUserServcie";
// import HospitalUserService from "./HospitalUserServcie";
// import DigitalUserService from "./DigitalUserServcie";
// import SportsUserService from "./SportsUserService";
// import ShoppingUserService from "./ShoppingUserService";

// import { typography } from "../styles/typography";
// import Button from "../components/ui/Buttons";
// import CategoryFilterDropdown from "../components/CategoriesFilterDropDown";

// import categories from "../data/categories.json";

// interface ListedJobsProps {
//     userId: string;
// }

// const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
//     const navigate = useNavigate();

//     // ── Filter state ──
//     const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
//     const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

//     // ── Add Post Route Logic ──
//     const getAddPostRoute = (): string | null => {
//         if (!selectedCategoryId || !selectedSubcategory) return null;

//         const sub = selectedSubcategory.toLowerCase().replace(/\s+/g, "-");

//         switch (selectedCategoryId) {
//             case 3:
//                 return `/add-hospital-service-form?subcategory=${sub}`;
//             case 4:
//                 return `/add-hotel-service-form?subcategory=${sub}`;
//             case 5:
//                 return `/add-beauty-service-form?subcategory=${sub}`;
//             case 6:
//                 return `/add-sports-service-form?subcategory=${sub}`;
//             case 9:
//                 return `/add-shopping-form?subcategory=${sub}`;
//             case 12:
//                 return `/add-digital-service-form?subcategory=${sub}`;
//             default:
//                 return null;
//         }
//     };

//     const addPostRoute = getAddPostRoute();

//     // ── Clear Filters ──
//     const clearFilters = () => {
//         setSelectedCategoryId(null);
//         setSelectedSubcategory(null);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6">
//             <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">

//                 {/* ─── HEADER ─── */}
//                 <div className="flex flex-col sm:flex-row justify-between gap-3">
//                     <div>
//                         <h1 className={`${typography.heading.h3} text-gray-900`}>
//                             My Services
//                         </h1>
//                         <p className={`${typography.body.small} text-gray-500`}>
//                             Manage your service listings across all categories
//                         </p>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-2">
//                         <CategoryFilterDropdown
//                             selectedCategoryId={selectedCategoryId}
//                             selectedSubcategory={selectedSubcategory}
//                             onSelectCategory={setSelectedCategoryId}
//                             onSelectSubcategory={setSelectedSubcategory}
//                         />

//                         {(selectedCategoryId || selectedSubcategory) && (
//                             <button
//                                 onClick={clearFilters}
//                                 className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
//                             >
//                                 <X size={14} /> Clear
//                             </button>
//                         )}

//                         {addPostRoute && (
//                             <Button
//                                 variant="primary"
//                                 size="md"
//                                 onClick={() => navigate(addPostRoute)}
//                             >
//                                 + Add Post
//                             </Button>
//                         )}
//                     </div>
//                 </div>

//                 {/* ─── ACTIVE FILTER TAGS ─── */}
//                 {(selectedCategoryId || selectedSubcategory) && (
//                     <div className="flex flex-wrap gap-2">
//                         {selectedCategoryId && (
//                             <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
//                                 {
//                                     (categories as any).categories.find(
//                                         (c: any) => c.id === selectedCategoryId
//                                     )?.name
//                                 }
//                                 <button onClick={clearFilters}>
//                                     <X size={12} />
//                                 </button>
//                             </span>
//                         )}

//                         {selectedSubcategory && (
//                             <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full border">
//                                 {selectedSubcategory}
//                                 <button onClick={() => setSelectedSubcategory(null)}>
//                                     <X size={12} />
//                                 </button>
//                             </span>
//                         )}
//                     </div>
//                 )}

//                 {/* ─── SERVICE LISTS (OPTIMIZED) ─── */}
//                 <div className="space-y-6">

//                     {/* No category selected → show all */}
//                     {!selectedCategoryId && (
//                         <>
//                             <HospitalUserService userId={userId} />
//                             <HotelUserService userId={userId} />
//                             <SportsUserService userId={userId} />
//                             <DigitalUserService userId={userId} />
//                             <BeautyUserService userId={userId} />
//                             <ShoppingUserService userId={userId} />
//                         </>
//                     )}

//                     {/* Category specific */}
//                     {selectedCategoryId === 3 && (
//                         <HospitalUserService
//                             userId={userId}
//                             selectedSubcategory={selectedSubcategory}
//                         />
//                     )}

//                     {selectedCategoryId === 4 && (
//                         <HotelUserService
//                             userId={userId}
//                             selectedSubcategory={selectedSubcategory}
//                         />
//                     )}

//                     {selectedCategoryId === 5 && (
//                         <BeautyUserService
//                             userId={userId}
//                             selectedSubcategory={selectedSubcategory}
//                         />
//                     )}

//                     {selectedCategoryId === 6 && (
//                         <SportsUserService
//                             userId={userId}
//                             selectedSubcategory={selectedSubcategory}
//                         />
//                     )}

//                     {selectedCategoryId === 9 && (
//                         <ShoppingUserService
//                             userId={userId}
//                             selectedSubcategory={selectedSubcategory}
//                         />
//                     )}

//                     {selectedCategoryId === 12 && (
//                         <DigitalUserService
//                             userId={userId}
//                             selectedSubcategory={selectedSubcategory}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ListedJobs;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";

// Service screens - Import for counting services
import HotelUserService from "./HotelUserService";
import BeautyUserService from "./BeautyUserServcie";
import HospitalUserService from "./HospitalUserServcie";
import DigitalUserService from "./DigitalUserServcie";
import SportsUserService from "./SportsUserService";
import ShoppingUserService from "./ShoppingUserService";

import { typography } from "../styles/typography";

interface ListedJobsProps {
    userId: string;
}

interface CategoryCardData {
    id: number;
    name: string;
    icon: string;
    color: string;
    bgColor: string;
    addRoute: string;
}

const ListedJobs: React.FC<ListedJobsProps> = ({ userId }) => {
    const navigate = useNavigate();

    // ── Category Cards Data ──
    const categoryCards: CategoryCardData[] = [
        {
            id: 3,
            name: "Hospital & Medical Services",
            icon: "🏥",
            color: "border-purple-300 hover:border-purple-500",
            bgColor: "bg-purple-50",
            addRoute: "/add-hospital-service-form"
        },
        {
            id: 4,
            name: "Hotel & Travel Services",
            icon: "🏨",
            color: "border-orange-300 hover:border-orange-500",
            bgColor: "bg-orange-50",
            addRoute: "/add-hotel-service-form"
        },
        {
            id: 5,
            name: "Beauty & Wellness",
            icon: "💆",
            color: "border-pink-300 hover:border-pink-500",
            bgColor: "bg-pink-50",
            addRoute: "/add-beauty-service-form"
        },
        {
            id: 6,
            name: "Sports & Fitness",
            icon: "⚽",
            color: "border-green-300 hover:border-green-500",
            bgColor: "bg-green-50",
            addRoute: "/add-sports-service-form"
        },
        {
            id: 9,
            name: "Shopping & Retail",
            icon: "🛍️",
            color: "border-blue-300 hover:border-blue-500",
            bgColor: "bg-blue-50",
            addRoute: "/add-shopping-form"
        },
        {
            id: 12,
            name: "Digital Services",
            icon: "💻",
            color: "border-indigo-300 hover:border-indigo-500",
            bgColor: "bg-indigo-50",
            addRoute: "/add-digital-service-form"
        }
    ];

    // ── Handle Card Click to navigate to detailed view ──
    const handleViewCategory = (categoryId: number) => {
        // You can implement a detailed category view page
        navigate(`/my-services/${categoryId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ─── HEADER ─── */}
                <div className="mb-8">
                    <h1 className={`${typography.heading.h3} text-gray-900 mb-2`}>
                        My Services
                    </h1>
                    <p className={`${typography.body.base} text-gray-600`}>
                        Manage your service listings across all categories
                    </p>
                </div>

                {/* ─── CATEGORY CARDS GRID ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryCards.map((category) => (
                        <div
                            key={category.id}
                            className={`${category.bgColor} ${category.color} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}
                        >
                            {/* Icon */}
                            <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                                {category.icon}
                            </div>

                            {/* Category Name */}
                            <h3 className={`${typography.heading.h5} text-gray-900 mb-4`}>
                                {category.name}
                            </h3>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleViewCategory(category.id)}
                                    className="flex-1 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border border-gray-300 flex items-center justify-center gap-2"
                                >
                                    View All
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate(category.addRoute)}
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <Plus size={18} />
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── INFO SECTION ─── */}
                <div className="mt-12 bg-white border border-gray-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-3">✨</div>
                    <h3 className={`${typography.heading.h5} text-gray-900 mb-2`}>
                        Get Started with Your Services
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Click on any category card to view your existing services or click "Add" to create new service listings. Build your presence across multiple service categories!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ListedJobs;