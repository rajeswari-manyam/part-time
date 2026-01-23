import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkerWithSkills, deleteWorkerSkill } from "../services/api.service";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import CategoriesData from "../components/data/Categories.json";
import SubCategoriesData from "../components/data/SubCategories.json";

interface WorkerSkill {
    _id: string;
    category: string[];
    subCategory: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
}

const WorkerList: React.FC = () => {
    const navigate = useNavigate();

    const workerId =
        localStorage.getItem("workerId") ||
        localStorage.getItem("@worker_id");

    const [profileExists, setProfileExists] = useState(false);
    const [skills, setSkills] = useState<WorkerSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!workerId) {
                setProfileExists(false);
                setLoading(false);
                return;
            }

            try {
                const res = await getWorkerWithSkills(workerId);
                setProfileExists(true);
                setSkills(res?.workerSkills || []);
            } catch (error) {
                console.warn("Worker profile not created yet");
                setProfileExists(false);
                setSkills([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [workerId]);

    const handleDelete = async (skillId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) return;

        try {
            const res = await deleteWorkerSkill(skillId);

            if (res.success) {
                setSkills(skills.filter(skill => skill._id !== skillId));
                alert("Skill deleted successfully!");
            } else {
                alert("Failed to delete skill");
            }
        } catch (error) {
            console.error("Error deleting skill:", error);
            alert("Failed to delete skill. Please try again.");
        }
    };

    const getCategoryIcon = (categories: string[]) => {
        const category = categories[0]?.toLowerCase() || "";

        if (category.includes("food") || category.includes("restaurant")) {
            return "🍽️";
        } else if (category.includes("hospital") || category.includes("health")) {
            return "🏥";
        } else if (category.includes("plumb") || category.includes("repair")) {
            return "🔧";
        } else if (category.includes("electric")) {
            return "⚡";
        } else if (category.includes("clean")) {
            return "🧹";
        } else if (category.includes("paint")) {
            return "🎨";
        } else if (category.includes("carpenter")) {
            return "🪚";
        } else if (category.includes("garden")) {
            return "🌿";
        }
        return "💼";
    };

    const getSubCategoryIcon = (category: string, subCategory: string) => {
        const cat = category?.toLowerCase() || "";
        const subCat = subCategory?.toLowerCase() || "";

        // Food & Restaurant subcategories
        if (cat.includes("food") || cat.includes("restaurant")) {
            if (subCat.includes("chef") || subCat.includes("cook")) return "👨‍🍳";
            if (subCat.includes("waiter") || subCat.includes("server")) return "🍽️";
            if (subCat.includes("delivery")) return "🚚";
            if (subCat.includes("bartend")) return "🍹";
        }

        // Hospital & Healthcare subcategories
        if (cat.includes("hospital") || cat.includes("health")) {
            if (subCat.includes("nurse")) return "👩‍⚕️";
            if (subCat.includes("doctor")) return "👨‍⚕️";
            if (subCat.includes("pharmacist")) return "💊";
            if (subCat.includes("therapist")) return "🩺";
        }

        // Plumbing & Repair subcategories
        if (cat.includes("plumb") || cat.includes("repair")) {
            if (subCat.includes("plumber")) return "🔧";
            if (subCat.includes("pipe")) return "🚰";
            if (subCat.includes("drain")) return "🚿";
        }

        // Electrical subcategories
        if (cat.includes("electric")) {
            if (subCat.includes("wiring")) return "🔌";
            if (subCat.includes("appliance")) return "⚡";
            if (subCat.includes("solar")) return "☀️";
        }

        // Cleaning subcategories
        if (cat.includes("clean")) {
            if (subCat.includes("house") || subCat.includes("home")) return "🏠";
            if (subCat.includes("office")) return "🏢";
            if (subCat.includes("carpet")) return "🧹";
            if (subCat.includes("window")) return "🪟";
        }

        // Painting subcategories
        if (cat.includes("paint")) {
            if (subCat.includes("interior")) return "🖌️";
            if (subCat.includes("exterior")) return "🎨";
            if (subCat.includes("spray")) return "🎨";
        }

        // Carpentry subcategories
        if (cat.includes("carpenter")) {
            if (subCat.includes("furniture")) return "🪑";
            if (subCat.includes("cabinet")) return "🗄️";
            if (subCat.includes("door")) return "🚪";
        }

        // Gardening subcategories
        if (cat.includes("garden")) {
            if (subCat.includes("lawn")) return "🌱";
            if (subCat.includes("landscape")) return "🌿";
            if (subCat.includes("tree")) return "🌳";
        }

        return null; // Return null to fallback to getCategoryIcon
    };

    const formatChargeType = (type: string) => {
        return type === "hour" ? "Hour" : type === "day" ? "Day" : "Fixed";
    };

    if (loading) {
        return (
            <div className="py-10 text-center text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    if (!profileExists) {
        return (
            <div className="my-6 bg-white rounded-2xl shadow-lg p-8 text-center border">
                <h2 className="text-2xl font-bold mb-3">
                    Create Your Worker Profile
                </h2>
                <p className="text-gray-600 mb-6">
                    Create your profile before adding skills.
                </p>

                <button
                    onClick={() => navigate("/worker-profile")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                    Create Profile
                </button>
            </div>
        );
    }

    return (
        <div className="my-4 md:my-6 px-2 md:px-0">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 px-2">My Skills</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {/* Skill Cards */}
                {skills.map((skill) => (
                    <div
                        key={skill._id}
                        className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative backdrop-blur-sm hover:bg-blue-50/50"
                    >
                        {/* Dropdown Menu */}
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === skill._id ? null : skill._id)}
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MoreVertical size={18} className="text-gray-600 md:w-5 md:h-5" />
                            </button>

                            {openDropdown === skill._id && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setOpenDropdown(null)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-36 md:w-40 bg-white rounded-lg shadow-xl border z-20">
                                        <button
                                            onClick={() => {
                                                navigate(`/worker-details/${skill._id}`);
                                                setOpenDropdown(null);
                                            }}
                                            className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm md:text-base rounded-t-lg"
                                        >
                                            <Eye size={14} className="md:w-4 md:h-4" /> View
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate(`/edit-skill/${skill._id}`);
                                                setOpenDropdown(null);
                                            }}
                                            className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600 text-sm md:text-base"
                                        >
                                            <Edit size={14} className="md:w-4 md:h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(skill._id);
                                                setOpenDropdown(null);
                                            }}
                                            className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600 text-sm md:text-base rounded-b-lg"
                                        >
                                            <Trash2 size={14} className="md:w-4 md:h-4" /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Icon and Category */}
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <div className="text-3xl md:text-4xl">
                                {getSubCategoryIcon(skill.category[0], skill.subCategory) || getCategoryIcon(skill.category)}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide line-clamp-1">
                                    {skill.category[0]}
                                </p>
                            </div>
                        </div>

                        {/* Skill Name */}
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 line-clamp-2">
                            {skill.subCategory}
                        </h3>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mb-3 md:mb-4">
                            <span className="text-xl md:text-2xl font-bold text-green-600">
                                ₹{skill.serviceCharge}
                            </span>
                            <span className="text-xs md:text-sm text-gray-500">
                                / {formatChargeType(skill.chargeType)}
                            </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <span className="inline-flex items-center gap-1 px-2.5 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm font-medium">
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></span>
                                ACTIVE
                            </span>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => navigate(`/worker-details/${skill._id}`)}
                            className="w-full px-4 py-2 md:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                        >
                            View Details
                        </button>
                    </div>
                ))}

                {/* Add New Skill Card */}
                <div
                    onClick={() => navigate("/add-skills")}
                    className="bg-white border-2 border-dashed border-blue-400 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50/70 hover:scale-105 transition-all duration-300 min-h-[280px] md:min-h-[300px] backdrop-blur-sm"
                >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3 md:mb-4 hover:bg-blue-700 transition-colors">
                        <svg
                            className="w-6 h-6 md:w-8 md:h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-1 md:mb-2">
                        Add New Skill
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 text-center">
                        Expand services
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {skills.length === 0 && (
                <div className="text-center py-8 md:py-12 px-4">
                    <div className="text-5xl md:text-6xl mb-3 md:mb-4">📋</div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">
                        No Skills Added Yet
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6 max-w-md mx-auto">
                        Start by adding your first skill to attract customers
                    </p>
                </div>
            )}
        </div>
    );
};

export default WorkerList;