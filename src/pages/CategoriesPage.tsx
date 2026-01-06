import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import subcategoryData from "../data/subcategories.json";
import categoryData from "../data/categories.json";

// Define which categories are for workers and which for places
const WORKER_CATEGORY_IDS = [1, 2, 3, 5, 6, 9, 10, 11, 12, 13, 15, 17, 18, 20, 21, 22];
const PLACE_CATEGORY_IDS = [1, 4, 7, 8, 14, 16, 19]; // Example: Restaurants, Shops, Hotels, etc.

const CategoryPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const categoryId = Number(id);

    const category = categoryData.categories.find(
        (cat) => cat.id === categoryId
    );

    const subcategory = subcategoryData.subcategories.find(
        (sub) => sub.categoryId === categoryId
    );

    if (!category || !subcategory) {
        return <div className="p-6">No subcategories found</div>;
    }

    const handleSubcategoryClick = (name: string) => {
        const slug = name.toLowerCase().replace(/\s+/g, "-");

        // Decide whether to navigate to workers or places
        if (WORKER_CATEGORY_IDS.includes(categoryId)) {
            navigate(`/matched-workers/${slug}`);
        } else if (PLACE_CATEGORY_IDS.includes(categoryId)) {
            navigate(`/nearby-places/${slug}`);
        } else {
            // Default fallback
            navigate(`/matched-workers/${slug}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {subcategory.items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleSubcategoryClick(item.name)}
                        className="p-4 bg-white rounded-xl shadow hover:shadow-md transition text-center cursor-pointer"
                    >
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <p className="font-semibold">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
