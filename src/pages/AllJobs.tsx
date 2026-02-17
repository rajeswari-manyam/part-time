import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin, Phone, MessageCircle, Star, Loader2,
    ChevronDown, ChevronLeft, ChevronRight, Navigation,
    BadgeCheck, ArrowRight, IndianRupee, Wrench,
} from "lucide-react";
import { getWorkersWithSkills, API_BASE_URL } from "../services/api.service";
import CategoriesData from "../data/categories.json";

// ── Worker shape returned by getWorkersWithSkills ─────────────────────────────
interface WorkerCard {
    _id: string;
    name: string;
    profilePic: string;
    images: string[];
    skills: string[];
    categories: string[];
    subCategories: string[];
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    area: string;
    city: string;
    state: string;
    pincode: string;
    totalSkills: number;
    // optional extras the API may include
    distance?: number;
    isActive?: boolean;
    phone?: string;
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

interface AllJobsProps {
    latitude?: number;
    longitude?: number;
    searchText?: string;
    filterCategory?: string;
}

// ── Smart image URL resolver ──────────────────────────────────────────────────
const resolveImageUrl = (path: string): string | null => {
    if (!path || typeof path !== "string") return null;
    const cleaned = path.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    const normalized = cleaned.replace(/\\/g, "/");
    const base = (API_BASE_URL || "").replace(/\/$/, "");
    const rel = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${base}${rel}`;
};

const getImageUrls = (images?: string[]): string[] =>
    (images || []).map(resolveImageUrl).filter(Boolean) as string[];

const chargeLabel = (type: string) => {
    if (type === "hour") return "/ hr";
    if (type === "day") return "/ day";
    if (type === "fixed") return "fixed";
    return "";
};

// ── Image Carousel ────────────────────────────────────────────────────────────
const ImageCarousel: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
    const [idx, setIdx] = useState(0);
    const [imgError, setImgError] = useState(false);

    useEffect(() => { setImgError(false); setIdx(0); }, [images]);

    if (!images.length || imgError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                <Wrench size={40} className="text-orange-300" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full group">
            <img
                src={images[idx]}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => {
                    if (idx < images.length - 1) setIdx(i => i + 1);
                    else setImgError(true);
                }}
            />
            {images.length > 1 && (
                <>
                    <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ChevronLeft size={14} className="text-gray-700" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ChevronRight size={14} className="text-gray-700" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                                className={`h-1.5 rounded-full transition-all duration-200 ${i === idx ? "bg-white w-4" : "bg-white/60 w-1.5"}`} />
                        ))}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                        {idx + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
};

const RADIUS_OPTIONS = [2, 5, 10, 20, 50];

// ── Main Component ────────────────────────────────────────────────────────────
const AllJobs: React.FC<AllJobsProps> = ({ searchText = "" }) => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState<WorkerCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedRadius, setSelectedRadius] = useState(10);
    const [radiusDropdownOpen, setRadiusDropdownOpen] = useState(false);

    // ── Fetch on mount ────────────────────────────────────────────────────────
    useEffect(() => { fetchWorkers(); }, []);

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            if (!t.closest("#category-dropdown")) setDropdownOpen(false);
            if (!t.closest("#radius-dropdown")) setRadiusDropdownOpen(false);
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            setError("");

            // ── NEW API: getWorkersWithSkills ─────────────────────────────
            // GET /getWorkersWithSkills
            // Response: { success, count, workers: WorkerListItem[] }
            const res = await getWorkersWithSkills();
            const data: WorkerCard[] = res.workers || [];

            console.log("✅ getWorkersWithSkills →", data.length, "workers");
            if (data[0]?.images?.length) {
                console.log("🖼️ raw images:", data[0].images);
                console.log("🖼️ resolved:", getImageUrls(data[0].images));
            }

            setWorkers(data);
            if (data.length === 0) setError("No workers found");
        } catch (err: any) {
            setError(err.message || "Failed to fetch workers");
            setWorkers([]);
        } finally {
            setLoading(false);
        }
    };

    // ── Filter ────────────────────────────────────────────────────────────────
    const filtered = workers.filter(w => {
        const sl = searchText.toLowerCase();
        const matchSearch = !sl
            || w.name.toLowerCase().includes(sl)
            || w.skills.some(s => s.toLowerCase().includes(sl))
            || w.categories.some(c => c.toLowerCase().includes(sl))
            || w.subCategories.some(s => s.toLowerCase().includes(sl));
        const matchCat = selectedCategory === "all"
            || w.categories.some(c => c === selectedCategory);
        const matchRadius = w.distance == null || w.distance <= selectedRadius * 1000;
        return matchSearch && matchCat && matchRadius;
    });

    const categoryLabel = selectedCategory === "all"
        ? "All Categories"
        : CategoriesData.categories.find(c => c.name === selectedCategory)?.name || selectedCategory;

    const handleView = (id: string) => navigate(`/worker-details/${id}`);

    // ── States ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-[40vh] flex justify-center items-center">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
    );

    if (error && workers.length === 0) return (
        <div className="min-h-[40vh] flex flex-col justify-center items-center p-6">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Workers</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={fetchWorkers}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition font-semibold">
                    Try Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

            {/* ── HEADER ───────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        Nearby Opportunities
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Browse all available workers in your area</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Radius */}
                    <div id="radius-dropdown" className="relative">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                            <span className="text-sm text-gray-500 font-medium">Within:</span>
                            <button onClick={() => setRadiusDropdownOpen(p => !p)}
                                className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-orange-500 transition-colors">
                                {selectedRadius} km
                                <ChevronDown size={14} className={`transition-transform duration-200 ${radiusDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                        {radiusDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                {RADIUS_OPTIONS.map(r => (
                                    <button key={r} onClick={() => { setSelectedRadius(r); setRadiusDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedRadius === r ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                                        {r} km
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div id="category-dropdown" className="relative">
                        <button onClick={() => setDropdownOpen(p => !p)}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-600 shadow-sm transition-all min-w-[150px] justify-between">
                            <span className="truncate">{categoryLabel}</span>
                            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                <div className="max-h-72 overflow-y-auto py-1">
                                    <button onClick={() => { setSelectedCategory("all"); setDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === "all" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                                        All Categories
                                    </button>
                                    <div className="border-t border-gray-100 my-1" />
                                    {CategoriesData.categories.map(cat => (
                                        <button key={cat.name} onClick={() => { setSelectedCategory(cat.name); setDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === cat.name ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results count */}
            <p className="mb-5 text-sm text-gray-500">
                Found <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
                worker{filtered.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && <span className="ml-1 text-orange-500">in "{categoryLabel}"</span>}
            </p>

            {/* ── EMPTY ────────────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-gray-300 text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">
                        No workers found{searchText ? ` for "${searchText}"` : ""}{selectedCategory !== "all" ? ` in "${categoryLabel}"` : ""}
                    </p>
                    {(searchText || selectedCategory !== "all") && (
                        <button onClick={() => setSelectedCategory("all")}
                            className="mt-4 text-orange-500 hover:text-orange-600 font-medium text-sm underline underline-offset-2">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                /* ── GRID ──────────────────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(worker => {
                        // Prefer images array; fall back to profilePic
                        const imgs = getImageUrls(
                            worker.images?.length ? worker.images : (worker.profilePic ? [worker.profilePic] : [])
                        );

                        const distLabel = worker.distance != null
                            ? worker.distance >= 1000
                                ? `${(worker.distance / 1000).toFixed(1)} km`
                                : `${Math.round(worker.distance)} m`
                            : null;

                        const locationStr = [worker.area, worker.city, worker.state].filter(Boolean).join(", ") || "Nearby";

                        // Deduplicated tags: subcategories first, then categories
                        const tags = [
                            ...(worker.subCategories || []),
                            ...(worker.categories || []),
                        ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);

                        const skillsPreview = (worker.skills || []).slice(0, 2).join(", ");

                        return (
                            <div key={worker._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">

                                {/* ── IMAGE ─────────────────────────────────── */}
                                <div className="relative h-52 bg-gray-100 flex-shrink-0 overflow-hidden">
                                    <ImageCarousel images={imgs} name={worker.name} />

                                    {/* Available / Busy */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow ${worker.isActive !== false ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${worker.isActive !== false ? "bg-white" : "bg-red-200"}`} />
                                            {worker.isActive !== false ? "Available" : "Busy"}
                                        </span>
                                    </div>

                                    {/* Distance */}
                                    {distLabel && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                                                <MapPin size={11} className="text-orange-500" />{distLabel}
                                            </span>
                                        </div>
                                    )}

                                    {/* Total skills badge */}
                                    {worker.totalSkills > 0 && (
                                        <div className="absolute bottom-3 left-3 z-10">
                                            <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                {worker.totalSkills} skill{worker.totalSkills !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* ── BODY ──────────────────────────────────── */}
                                <div className="flex flex-col flex-1 px-4 pt-3 pb-4">

                                    {/* Tags */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {tags.map((tag, i) => (
                                                <span key={i} className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${i === 0 ? "bg-orange-50 text-orange-500 border-orange-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Name */}
                                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 leading-snug mb-1">
                                        {worker.name}
                                    </h3>

                                    {/* Skills preview */}
                                    {skillsPreview && (
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                            <span className="font-medium text-gray-700">Skills: </span>
                                            {skillsPreview}
                                            {worker.skills.length > 2 && ` +${worker.skills.length - 2} more`}
                                        </p>
                                    )}

                                    {/* Location */}
                                    <div className="flex items-start gap-1.5 mb-3 text-xs text-gray-500">
                                        <MapPin size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                                        <span className="line-clamp-1">{locationStr}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold text-gray-800">{(worker.rating || 4.5).toFixed(1)}</span>
                                        {worker.reviewCount != null && (
                                            <span className="text-xs text-gray-400">({worker.reviewCount} reviews)</span>
                                        )}
                                        {worker.isVerified && (
                                            <span className="ml-auto inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
                                                <BadgeCheck size={13} className="text-purple-500" />Verified
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1" />

                                    {/* Price + CTA */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                                                Service Charge
                                            </p>
                                            {worker.serviceCharge > 0 ? (
                                                <p className="text-xl font-extrabold text-orange-500 flex items-center gap-0.5 leading-none">
                                                    <IndianRupee size={16} className="mt-0.5" />
                                                    {worker.serviceCharge.toLocaleString("en-IN")}
                                                    <span className="text-xs font-medium text-gray-400 ml-0.5">
                                                        {chargeLabel(worker.chargeType)}
                                                    </span>
                                                </p>
                                            ) : (
                                                <p className="text-sm font-semibold text-gray-400 italic">Negotiable</p>
                                            )}
                                        </div>
                                        <button onClick={() => handleView(worker._id)}
                                            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                                            View Details <ArrowRight size={15} />
                                        </button>
                                    </div>

                                    {/* Call / WhatsApp / Directions */}
                                    {worker.phone && (
                                        <div className="grid grid-cols-3 gap-2 mt-3">
                                            <a href={`tel:${worker.phone}`}
                                                className="flex items-center justify-center gap-1.5 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl py-1.5 text-xs font-semibold transition-all">
                                                <Phone size={13} />Call
                                            </a>
                                            <a href={`https://wa.me/${worker.phone.replace(/\D/g, "")}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-1.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl py-1.5 text-xs font-semibold transition-all">
                                                <MessageCircle size={13} />WhatsApp
                                            </a>
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([worker.area, worker.city].filter(Boolean).join(", "))}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl py-1.5 text-xs font-semibold transition-all">
                                                <Navigation size={13} />Directions
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllJobs;