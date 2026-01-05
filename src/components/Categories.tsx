import React from "react";
import { useNavigate } from "react-router-dom";
import categoryData from "../data/categories.json";
import { fontSize, fontWeight } from "../styles/typography";

interface Category {
    id: number;
    name: string;
    icon: string;
}

const Categories: React.FC = () => {
    const navigate = useNavigate();
    const categories: Category[] = categoryData.categories;

    const handleCategoryClick = (id: number) => {
        navigate(`/category/${id}`);
    };

    return (
        <div className="w-full bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                <div className="mb-6">
                    <h2 className={`${fontSize["3xl"]} ${fontWeight.bold}`}>
                        Popular Categories
                    </h2>
                    <p className={`${fontSize.base} text-gray-600`}>
                        Explore services by category
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="group p-4 border rounded-xl hover:shadow-lg transition"
                        >
                            <div className="text-4xl mb-2">{category.icon}</div>
                            <p className={`${fontWeight.semibold}`}>
                                {category.name}
                            </p>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Categories;
