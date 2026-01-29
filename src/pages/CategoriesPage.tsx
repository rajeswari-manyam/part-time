import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import subcategoryData from "../data/subcategories.json";
import categoryData from "../data/categories.json";
import { ArrowLeft } from "lucide-react";
import {
    PLACE_SUBCATEGORIES,
    WORKER_SUBCATEGORIES,
    AUTOMOTIVE_SUBCATEGORIES,
    FOOD_SUBCATEGORIES,
    HOSPITAL_SUBCATEGORIES,
    HOTEL_SUBCATEGORIES,
    BEAUTY_SUBCATEGORIES,
    REAL_ESTATE_SUBCATEGORIES,
    SHOPPING_SUBCATEGORIES,
    EDUCATION_SUBCATEGORIES,
} from "../utils/SubCategories";
import { HOVER_BG, ACTIVE_TAB } from "../styles/colors";

const CategoryPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const categoryId = Number(id);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", {
                replace: true,
                state: { from: `/category/${id}` }
            });
        }
    }, [isAuthenticated, navigate, id]);

    const category = categoryData.categories.find(
        (cat) => cat.id === categoryId
    );

    const subcategoryGroup = subcategoryData.subcategories.find(
        (sub) => sub.categoryId === categoryId
    );

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/30 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!category || !subcategoryGroup) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-6">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Category Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        Sorry, we couldn't find any subcategories for this category.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    const handleClick = (name: string) => {
        const slug = name.toLowerCase().trim();
        const slugWithDash = slug.replace(/\s+/g, "-");

        console.log("🔍 Clicked:", name);
        console.log("🔍 Slug:", slug);
        console.log("🔍 Slug with dash:", slugWithDash);

        // Check if this is an automotive subcategory
        if (AUTOMOTIVE_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to automotive");
            navigate(`/automotive/${slugWithDash}`);
        }
        // Check if this is an education subcategory
        else if (EDUCATION_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to education");
            navigate(`/education/${slugWithDash}`);
        }
        // Check if this is a food subcategory
        else if (FOOD_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to food services");
            navigate(`/food-services/${slugWithDash}`);
        }
        // Check if this is a hospital subcategory
        else if (HOSPITAL_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to hospital services");
            navigate(`/hospital-services/${slugWithDash}`);
        }
        // ✅ Check if this is a hotel/travel subcategory
        else if (HOTEL_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to hotel services");
            navigate(`/hotel-services/${slugWithDash}`);
        }
        // ✅ Check if this is a beauty subcategory (MUST come before PLACE_SUBCATEGORIES)
        else if (BEAUTY_SUBCATEGORIES.includes(slug) || BEAUTY_SUBCATEGORIES.includes(slugWithDash)) {
            console.log("✅ Navigating to beauty services");
            navigate(`/beauty-services/${slugWithDash}`);
        }
        // ✅ Check if this is a real estate subcategory
        else if (REAL_ESTATE_SUBCATEGORIES.includes(slug) || REAL_ESTATE_SUBCATEGORIES.includes(slugWithDash)) {
            console.log("✅ Navigating to real estate");
            navigate(`/real-estate/${slugWithDash}`);
        }
        // ✅ NEW: Check if this is a shopping subcategory
        else if (SHOPPING_SUBCATEGORIES.includes(slug) || SHOPPING_SUBCATEGORIES.includes(slugWithDash)) {
            console.log("✅ Navigating to shopping");
            navigate(`/shopping/${slugWithDash}`);
        }
        // Check if this is a place subcategory
        else if (PLACE_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to nearby places");
            navigate(`/nearby-places/${slugWithDash}`);
        }
        // Check if this is a worker subcategory
        else if (WORKER_SUBCATEGORIES.includes(slug)) {
            console.log("✅ Navigating to matched workers");
            navigate(`/matched-workers/${slugWithDash}`);
        }
        // Default fallback → workers
        else {
            console.log("⚠️ No match found, defaulting to workers");
            navigate(`/matched-workers/${slugWithDash}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </button>

                {/* Category Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        {category.name}
                    </h1>
                    <p className="text-gray-600">
                        Choose a service from {category.name.toLowerCase()}
                    </p>
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {subcategoryGroup.items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(item.name)}
                            className={`group subcategory-btn-${index} p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 hover:-translate-y-1`}
                        >
                            <style>
                                {`
                                    .subcategory-btn-${index}:hover { border-color: ${ACTIVE_TAB} !important; }
                                    .subcategory-btn-${index}:hover .icon-container { background-color: ${HOVER_BG} !important; }
                                    .subcategory-btn-${index}:hover .subcategory-text { color: ${ACTIVE_TAB} !important; }
                                `}
                            </style>

                            {/* Icon Container */}
                            <div className="icon-container w-16 h-16 mb-3 flex items-center justify-center bg-blue-50 rounded-full transition-all duration-300 group-hover:scale-110">
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </span>
                            </div>

                            {/* Subcategory Name */}
                            <p className="subcategory-text font-semibold text-sm md:text-base text-gray-800 transition-colors duration-300">
                                {item.name}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                {subcategoryGroup.items.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No Services Available
                        </h3>
                        <p className="text-gray-600">
                            We're working on adding more services to this category.
                        </p>
                    </div>
                )}

                {/* Helper Text */}
                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">Need Help?</h3>
                            <p className="text-sm text-blue-800">
                                Select a service to view available workers or locations in your area.
                                Make sure your location is enabled for better results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;