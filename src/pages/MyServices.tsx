import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkerWithSkills, deleteWorkerSkill } from "../services/api.service";
import {
    MoreVertical, Eye, Edit, Trash2, ImageIcon,
    CheckCircle, AlertCircle, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { combineTypography, typography } from "../styles/typography";
import Button from "../components/ui/Buttons";

interface WorkerSkill {
    _id: string;
    category: string[];
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    profilePic?: string;
    images?: string[];
}

// ─── Inline toast ────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
const Toast: React.FC<{ message: string; type: ToastType; onDismiss: () => void }> = ({
    message, type, onDismiss,
}) => {
    useEffect(() => {
        const t = setTimeout(onDismiss, 3000);
        return () => clearTimeout(t);
    }, [onDismiss]);
    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3
        rounded-xl shadow-lg text-sm border max-w-sm w-[calc(100%-2rem)]
        ${type === "success"
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-red-50 border-red-300 text-red-800"}`}
        >
            {type === "success"
                ? <CheckCircle size={16} className="flex-shrink-0 text-green-600" />
                : <AlertCircle size={16} className="flex-shrink-0 text-red-600" />}
            <span className="flex-1">{message}</span>
            <button onClick={onDismiss}><X size={14} className="opacity-60" /></button>
        </div>
    );
};

// ─── Per-card image carousel ──────────────────────────────────────────────────
const ImageCarousel: React.FC<{ images: string[]; altBase: string }> = ({ images, altBase }) => {
    const [idx, setIdx] = useState(0);

    if (images.length === 0) {
        return (
            <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <ImageIcon size={32} className="text-blue-300" />
            </div>
        );
    }

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx(i => (i - 1 + images.length) % images.length);
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx(i => (i + 1) % images.length);
    };

    return (
        <div className="relative w-full h-40 overflow-hidden bg-gray-100 group">
            {/* Current image */}
            <img
                src={images[idx]}
                alt={`${altBase} ${idx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-200"
            />

            {/* Arrows — only show if multiple images */}
            {images.length > 1 && (
                <>
                    {/* Left arrow */}
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60
              text-white rounded-full w-7 h-7 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60
              text-white rounded-full w-7 h-7 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* Counter badge */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs
            px-2 py-0.5 rounded-full font-medium">
                        {idx + 1}/{images.length}
                    </div>

                    {/* Dot indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all
                  ${i === idx ? "bg-white scale-125" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const WorkerList: React.FC = () => {
    const navigate = useNavigate();
    const workerId =
        localStorage.getItem("workerId") || localStorage.getItem("@worker_id");

    const [profileExists, setProfileExists] = useState(false);
    const [skills, setSkills] = useState<WorkerSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!workerId) { setProfileExists(false); setLoading(false); return; }
            try {
                const res = await getWorkerWithSkills(workerId);
                setProfileExists(true);
                setSkills(res?.workerSkills || []);
            } catch {
                setProfileExists(false);
                setSkills([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, [workerId]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = () => setOpenDropdown(null);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const handleDelete = async (skillId: string) => {
        if (!window.confirm("Delete this skill?")) return;
        try {
            const res = await deleteWorkerSkill(skillId);
            if (res.success) {
                setSkills(prev => prev.filter(s => s._id !== skillId));
                setToast({ message: "Skill deleted successfully", type: "success" });
            }
        } catch {
            setToast({ message: "Failed to delete skill", type: "error" });
        }
    };

    const formatCharge = (type: string) =>
        type === "hour" ? "hr" : type === "day" ? "day" : "fixed";

    // ── Loading ──
    if (loading) {
        return (
            <div className="py-10 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading worker dashboard...
            </div>
        );
    }

    // ── No profile yet ──
    if (!profileExists) {
        return (
            <div className="my-10">
                <div className="max-w-xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 text-center border border-blue-100">
                    <div className="text-5xl mb-4">👷‍♂️</div>
                    <h2 className="text-xl font-bold mb-3 text-gray-800">Complete Your Worker Profile</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Set up your profile to start receiving job requests and showcase your skills.
                    </p>
                    <Button onClick={() => navigate("/worker-profile")} variant="primary" size="lg">
                        Create Worker Profile
                    </Button>
                </div>
            </div>
        );
    }

    // ── Skills grid ──
    return (
        <div className="my-4 md:my-6">
            {toast && (
                <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
            )}

            {/* Header row */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">My Skills</h2>
                <Button onClick={() => navigate("/add-skills")} variant="primary" size="sm">
                    + Add Skill
                </Button>
            </div>

            {skills.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="font-bold text-lg mb-2">No Skills Added Yet</h3>
                    <p className="text-gray-600 mb-6 text-sm">
                        Add your first skill to start receiving job requests
                    </p>
                    <Button onClick={() => navigate("/add-skills")} variant="primary" size="lg">
                        Add Your First Skill
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {skills.map(skill => {
                        // Filter valid image URLs
                        const allImages = [
                            ...(skill.images || []),
                        ].filter(img => img && img.trim() !== "");

                        return (
                            <div
                                key={skill._id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
                            >
                                {/* ✅ Image carousel with left/right arrows */}
                                <ImageCarousel images={allImages} altBase={skill.subCategory} />

                                {/* Card body */}
                                <div className="p-3 md:p-4 relative">
                                    {/* ⋮ Menu */}
                                    <div
                                        className="absolute top-2 right-2"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenDropdown(openDropdown === skill._id ? null : skill._id)
                                            }
                                            className="p-1.5 hover:bg-gray-100 rounded-full transition"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {openDropdown === skill._id && (
                                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border z-20">
                                                <button
                                                    onClick={() => {
                                                        navigate(`/worker-details/${skill._id}`);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm rounded-t-xl"
                                                >
                                                    <Eye size={13} /> View
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate(`/edit-skill/${skill._id}`);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-blue-600"
                                                >
                                                    <Edit size={13} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDelete(skill._id);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600 rounded-b-xl"
                                                >
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text info */}
                                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5 pr-8">
                                        {skill.category?.[0] || ""}
                                    </p>
                                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1 pr-6 leading-tight">
                                        {skill.subCategory}
                                    </h3>
                                    {skill.skill && skill.skill !== "General" && (
                                        <p className="text-xs text-gray-500 mb-2 truncate">{skill.skill}</p>
                                    )}
                                    <p className="text-green-600 font-bold text-lg mb-3">
                                        ₹{skill.serviceCharge}
                                        <span className="text-xs text-gray-400 ml-1 font-normal">
                                            / {formatCharge(skill.chargeType)}
                                        </span>
                                    </p>

                                    <button
                                        onClick={() => navigate(`/worker-details/${skill._id}`)}
                                        className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-xl
                      hover:bg-blue-700 active:bg-blue-800 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add new skill card */}
                    <div
                        onClick={() => navigate("/add-skills")}
                        className="border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center
              justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all
              p-6 min-h-[220px]"
                    >
                        <div className="text-3xl mb-2">➕</div>
                        <p className="font-bold text-blue-600 text-sm md:text-base">Add New Skill</p>
                        <p className="text-xs text-gray-400 mt-1">Expand your services</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerList;