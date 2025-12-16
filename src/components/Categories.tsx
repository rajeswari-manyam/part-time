import React from "react";
import { fontSize, fontWeight } from "../styles/typography";

interface Category {
    id: string;
    name: string;
    icon: string;
    link: string;
}

export const categories: Category[] = [
    {
        id: "1",
        name: "Restaurants & Food",
        icon: "🍽️",
        link: "/restaurants",
    },
    {
        id: "2",
        name: "Hospitals & Healthcare",
        icon: "🏥",
        link: "/hospitals",
    },
    {
        id: "3",
        name: "Plumbers & Home Repair",
        icon: "🔧",
        link: "/plumbers",
    },
    {
        id: "4",
        name: "Hotels & Travel",
        icon: "🏨",
        link: "/hotels",
    },
    {
        id: "5",
        name: "Beauty & Wellness",
        icon: "💅",
        link: "/beauty",
    },
    {
        id: "6",
        name: "Real Estate",
        icon: "🏢",
        link: "/real-estate",
    },
    {
        id: "7",
        name: "Shopping & Retail",
        icon: "🛍️",
        link: "/shopping",
    },
    {
        id: "8",
        name: "Education & Training",
        icon: "🎓",
        link: "/education",
    },
    {
        id: "9",
        name: "Automotive",
        icon: "🚗",
        link: "/automotive",
    },
    {
        id: "10",
        name: "Business Services",
        icon: "💼",
        link: "/business",
    },
    {
        id: "11",
        name: "Tech & Digital",
        icon: "💻",
        link: "/tech",
    },
    {
        id: "12",
        name: "Pet Services",
        icon: "🐾",
        link: "/pets",
    },
    {
        id: "13",
        name: "Events & Entertainment",
        icon: "🎉",
        link: "/events",
    },
    {
        id: "14",
        name: "Industrial Services",
        icon: "🏭",
        link: "/industrial",
    },
    {
        id: "15",
        name: "Courier & Logistics",
        icon: "📦",
        link: "/courier",
    },
    {
        id: "16",
        name: "Daily Wage Labour",
        icon: "👷",
        link: "/labour",
    },
    {
        id: "17",
        name: "Agriculture & Farming",
        icon: "🌾",
        link: "/agriculture",
    },
    {
        id: "18",
        name: "Corporate Services",
        icon: "🏛️",
        link: "/corporate",
    },
    {
        id: "19",
        name: "Creative & Art",
        icon: "🎨",
        link: "/creative",
    },
    {
        id: "20",
        name: "Wedding Services",
        icon: "💒",
        link: "/wedding",
    },
];

const Categories: React.FC = () => {

    const handleCategoryClick = (link: string) => {
        window.location.href = link;
    };

    return (
        <div className="w-full bg-white py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="mb-6">
                    <h2 className={`${fontSize["3xl"]} ${fontWeight.bold} text-gray-800`}>
                        Popular Categories
                    </h2>
                    <p className={`${fontSize.base} text-gray-600 mt-2`}>
                        Explore services across various categories
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.link)}
                            className="group flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            {/* Icon Container */}
                            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-3 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                                <span className={fontSize["4xl"]}>
                                    {category.icon}
                                </span>
                            </div>

                            {/* Category Name */}
                            <h3 className={`${fontSize.sm} ${fontWeight.semibold} text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-300`}>
                                {category.name}
                            </h3>
                        </button>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-8 text-center">
                    <button className={`bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:from-[#090B7A] hover:to-[#5A95E0] text-white px-8 py-3 rounded-full ${fontWeight.semibold} ${fontSize.base} transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}>
                        View All Categories →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Categories;