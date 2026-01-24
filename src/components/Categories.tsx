import React from "react";
import { useNavigate } from "react-router-dom";
import categoryData from "../data/categories.json";
import { fontSize, fontWeight } from "../styles/typography";

// Import Icons
import AgricultureIcon from "../assets/icons/Agriculture.png";
import AutomotiveIcon from "../assets/icons/Automotive.png";
import BeautyIcon from "../assets/icons/Beauty.png";
import BusinessIcon from "../assets/icons/Business.png";
import CorporativeIcon from "../assets/icons/Corporative.png";
import CourierIcon from "../assets/icons/Courier.png";
import CreativeIcon from "../assets/icons/Creative.png";
import DailyWagesIcon from "../assets/icons/DailyWages.png";
import EducationIcon from "../assets/icons/Education.png";
import EventsIcon from "../assets/icons/Events.png";
import HomeIcon from "../assets/icons/Home.png";
import HospitalsIcon from "../assets/icons/Hospitals.png";
import IndustrialIcon from "../assets/icons/Industrial.png";
import PetIcon from "../assets/icons/Pet.png";
import PlumberIcon from "../assets/icons/Plumber.png";
import RealEstateIcon from "../assets/icons/RealEstate.png";
import RestaurantsIcon from "../assets/icons/Restarents.png";
import ShoppingIcon from "../assets/icons/Shopping.png";
import SportsIcon from "../assets/icons/Sports.png";
import TechIcon from "../assets/icons/Tech.png";
import TravelIcon from "../assets/icons/Travel.png";
import WeddingIcon from "../assets/icons/Wedding.png";

// Map Category IDs to Icons
const iconMap: Record<number, string> = {
    1: RestaurantsIcon,
    2: HospitalsIcon,
    3: PlumberIcon,
    4: TravelIcon,
    5: BeautyIcon,
    6: RealEstateIcon,
    7: ShoppingIcon,
    8: EducationIcon,
    9: AutomotiveIcon,
    10: HomeIcon,
    11: BusinessIcon,
    12: TechIcon,
    13: PetIcon,
    14: EventsIcon,
    15: IndustrialIcon,
    16: CourierIcon,
    17: SportsIcon,
    18: DailyWagesIcon,
    19: AgricultureIcon,
    20: CorporativeIcon,
    21: CreativeIcon,
    22: WeddingIcon,
};

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
                            className="group p-4 border rounded-xl hover:shadow-lg transition flex flex-col items-center text-center bg-white"
                        >
                            <div className="w-16 h-16 mb-3 p-2 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition">
                                <img
                                    src={iconMap[category.id] || category.icon}
                                    alt={category.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        // Fallback to emoji if image fails
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerText = category.icon;
                                    }}
                                />
                            </div>
                            <p className={`${fontWeight.semibold} text-sm md:text-base`}>
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
