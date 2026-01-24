// src/pages/CategoryPage.tsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import subcategoryData from "../data/subcategories.json";
import categoryData from "../data/categories.json";
import {
    PLACE_SUBCATEGORIES,
    WORKER_SUBCATEGORIES,
    AUTOMOTIVE_SUBCATEGORIES,
} from "../utils/SubCategories";

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
                state: { from: `/category/${id}` } // Remember where they wanted to go
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
        return null;
    }

    if (!category || !subcategoryGroup) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="text-center">
                    <p className="text-xl text-gray-600">No subcategories found</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

        // Check if this is an automotive subcategory
        if (AUTOMOTIVE_SUBCATEGORIES.includes(slug)) {
            navigate(`/automotive/${slugWithDash}`);
        }
        // Check if this is a place subcategory
        else if (PLACE_SUBCATEGORIES.includes(slug)) {
            navigate(`/nearby-places/${slugWithDash}`);
        }
        // Check if this is a worker subcategory
        else if (WORKER_SUBCATEGORIES.includes(slug)) {
            navigate(`/matched-workers/${slugWithDash}`);
        }
        // Default fallback → workers
        else {
            navigate(`/matched-workers/${slugWithDash}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/")}
                    className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                    ← Back to Home
                </button>

                <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {subcategoryGroup.items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleClick(item.name)}
                            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition text-center cursor-pointer"
                        >
                            <div className="text-4xl mb-2">{item.icon}</div>
                            <p className="font-semibold">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;