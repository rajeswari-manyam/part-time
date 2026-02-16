import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    MessageCircle,
    Star,
    Loader2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Navigation,
    BadgeCheck,
    TrendingUp,
    Search,
} from "lucide-react";
import { getNearbyJobs, API_BASE_URL } from "../services/api.service";
import CategoriesData from "../data/categories.json";

interface Job {
    _id: string;
    title?: string;
    description?: string;
    category?: string;
    subcategory?: string;
    city?: string;
    area?: string;
    images?: string[];
    createdAt: string;
    distance?: number;
    rating?: number;
    reviewCount?: number;
    phone?: string;
    isVerified?: boolean;
    isTrending?: boolean;
    isTopSearch?: boolean;
    isOpen?: boolean;
    tags?: string[];
}

interface AllJobsProps {
    latitude?: number;
    longitude?: number;
    searchText?: string;
    filterCategory?: string;
}

// ── Image Carousel ────────────────────────────────────────────────────────────
const ImageCarousel: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
    const [idx, setIdx] = useState(0);

    if (!images.length) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 text-5xl select-none">
                🔧
            </div>
        );
    }

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx((i) => (i - 1 + images.length) % images.length);
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx((i) => (i + 1) % images.length);
    };

    return (
        <div className="relative w-full h-full group">
            <img
                src={images[idx]}
                alt={title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={16} className="text-gray-700" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-3" : "bg-white/60 w-1.5"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge: React.FC<{ type: "verified" | "trending" | "topSearch" }> = ({ type }) => {
    const configs = {
        verified: { icon: <BadgeCheck size={12} />, label: "Verified", className: "bg-purple-50 text-purple-600 border border-purple-200" },
        trending: { icon: <TrendingUp size={12} />, label: "Trending", className: "bg-orange-50 text-orange-500 border border-orange-200" },
        topSearch: { icon: <Search size={12} />, label: "Top Search", className: "bg-blue-50 text-blue-600 border border-blue-200" },
    };
    const c = configs[type];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.className}`}>
            {c.icon}{c.label}
        </span>
    );
};

const RADIUS_OPTIONS = [2, 5, 10, 20, 50];

const AllJobs: React.FC<AllJobsProps> = ({
    latitude,
    longitude,
    searchText = "",
}) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedRadius, setSelectedRadius] = useState(10);
    const [radiusDropdownOpen, setRadiusDropdownOpen] = useState(false);

    const currentLatitude = latitude || 17.4433;
    const currentLongitude = longitude || 78.3772;

    useEffect(() => { fetchJobs(); }, [currentLatitude, currentLongitude]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("#category-dropdown")) setDropdownOpen(false);
            if (!target.closest("#radius-dropdown")) setRadiusDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getNearbyJobs(currentLatitude, currentLongitude);
            const jobsData = res.jobs || res.data || [];
            setJobs(jobsData);
            if (jobsData.length === 0) setError("No jobs found in your area");
        } catch (err: any) {
            setError(err.message || "Failed to fetch jobs");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrls = (images?: string[]): string[] =>
        (images || []).map((p) => p ? `${API_BASE_URL}/${p.replace(/\\/g, "/")}` : null).filter(Boolean) as string[];

    const filteredJobs = jobs.filter((job) => {
        const sl = searchText.toLowerCase();
        const matchesSearch = !sl ||
            (job.title?.toLowerCase() || "").includes(sl) ||
            (job.description?.toLowerCase() || "").includes(sl) ||
            (job.category?.toLowerCase() || "").includes(sl) ||
            (job.subcategory?.toLowerCase() || "").includes(sl);
        const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
        const matchesRadius = job.distance == null || job.distance <= selectedRadius * 1000;
        return matchesSearch && matchesCategory && matchesRadius;
    });

    const selectedCategoryLabel =
        selectedCategory === "all"
            ? "All Categories"
            : CategoriesData.categories.find((c) => c.name === selectedCategory)?.name || selectedCategory;

    const handleViewJob = (jobId: string) => {
        console.log("Navigating to job:", jobId);
        navigate(`/job-details/${jobId}`);
    };

    if (loading) {
        return (
            <div className="min-h-[40vh] flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error && jobs.length === 0) {
        return (
            <div className="min-h-[40vh] flex flex-col justify-center items-center p-6">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Jobs</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={fetchJobs} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">All Services</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Browse all available services in your area</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Within radius */}
                    <div id="radius-dropdown" className="relative">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                            <span className="text-sm text-gray-500 font-medium">Within:</span>
                            <button
                                onClick={() => setRadiusDropdownOpen((p) => !p)}
                                className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                            >
                                {selectedRadius} km
                                <ChevronDown size={14} className={`transition-transform duration-200 ${radiusDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                        {radiusDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                {RADIUS_OPTIONS.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => { setSelectedRadius(r); setRadiusDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedRadius === r ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                    >
                                        {r} km
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div id="category-dropdown" className="relative">
                        <button
                            onClick={() => setDropdownOpen((p) => !p)}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-600 shadow-sm transition-all min-w-[150px] justify-between"
                        >
                            <span className="truncate">{selectedCategoryLabel}</span>
                            <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                <div className="max-h-72 overflow-y-auto py-1">
                                    <button
                                        onClick={() => { setSelectedCategory("all"); setDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === "all" ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                    >
                                        All Categories
                                    </button>
                                    <div className="border-t border-gray-100 my-1" />
                                    {CategoriesData.categories.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => { setSelectedCategory(cat.name); setDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === cat.name ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                        >
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
                Found <span className="font-semibold text-gray-800">{filteredJobs.length}</span>{" "}
                service{filteredJobs.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && <span className="ml-1 text-orange-500">in "{selectedCategoryLabel}"</span>}
            </p>

            {/* ── EMPTY STATE ────────────────────────────────────────────── */}
            {filteredJobs.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-gray-300 text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">
                        No services found
                        {searchText ? ` for "${searchText}"` : ""}
                        {selectedCategory !== "all" ? ` in "${selectedCategoryLabel}"` : ""}
                    </p>
                    {(searchText || selectedCategory !== "all") && (
                        <button onClick={() => setSelectedCategory("all")} className="mt-4 text-orange-500 hover:text-orange-600 font-medium text-sm underline underline-offset-2">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (

                /* ── CARD GRID ─────────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredJobs.map((job) => {
                        const imageUrls = getImageUrls(job.images);

                        const distanceLabel =
                            job.distance != null
                                ? job.distance >= 1000
                                    ? `${(job.distance / 1000).toFixed(1)} km`
                                    : `${Math.round(job.distance)} m`
                                : null;

                        // Google Maps — opens directions to job location
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            [job.area, job.city].filter(Boolean).join(", ")
                        )}`;

                        return (
                            <div
                                key={job._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
                            >
                                {/* IMAGE */}
                                <div className="relative h-52 bg-gray-100 flex-shrink-0">
                                    <ImageCarousel images={imageUrls} title={job.title || job.category || "Service"} />

                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${job.isOpen !== false ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${job.isOpen !== false ? "bg-white" : "bg-red-200"}`} />
                                            {job.isOpen !== false ? "Open Now" : "Closed"}
                                        </span>
                                    </div>

                                    {distanceLabel && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                {distanceLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* BODY */}
                                <div className="flex flex-col flex-1 p-4">
                                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">
                                        {job.title || job.category || "Service"}
                                    </h3>

                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                        <MapPin size={11} className="flex-shrink-0 text-gray-400" />
                                        <span className="truncate">
                                            {[job.area, job.city].filter(Boolean).join(", ") || "Nearby"}
                                        </span>
                                    </div>

                                    {(job.isVerified || job.isTrending || job.isTopSearch) && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {job.isVerified && <Badge type="verified" />}
                                            {job.isTrending && <Badge type="trending" />}
                                            {job.isTopSearch && <Badge type="topSearch" />}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-3">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold text-gray-800">{(job.rating || 4.5).toFixed(1)}</span>
                                        {job.reviewCount != null && <span className="text-xs text-gray-400">({job.reviewCount})</span>}
                                    </div>

                                    {(job.tags?.length || job.subcategory || job.category) && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {(job.tags || [job.subcategory, job.category]).filter(Boolean).slice(0, 3).map((tag, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 border border-gray-200 text-xs px-2.5 py-0.5 rounded-full">
                                                    ✓ {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex-1" />

                                    {/* ── ACTION BUTTONS ─────────────────────── */}
                                    <div className="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-gray-100">

                                        {/* Directions → Google Maps */}
                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center gap-1 border border-gray-200 rounded-xl py-2 px-1 text-gray-600 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all text-xs font-medium"
                                        >
                                            <Navigation size={15} />
                                            <span>Directions</span>
                                        </a>

                                        {/* Call — phone number shown below icon */}
                                        {job.phone ? (
                                            <a
                                                href={`tel:${job.phone}`}
                                                className="flex flex-col items-center justify-center gap-0.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl py-2 px-1 transition-all"
                                            >
                                                <Phone size={15} />
                                                <span className="text-xs font-bold">Call</span>
                                                <span className="text-[9px] opacity-90 truncate max-w-full px-0.5 leading-tight">
                                                    {job.phone}
                                                </span>
                                            </a>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400 rounded-xl py-2 px-1 text-xs font-medium cursor-not-allowed">
                                                <Phone size={15} />
                                                <span>No Phone</span>
                                            </div>
                                        )}

                                        {/* View → navigates to JobDetailsPage */}
                                        <button
                                            onClick={() => handleViewJob(job._id)}
                                            className="flex flex-col items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl py-2 px-1 transition-all active:scale-95 text-xs font-medium"
                                        >
                                            <Eye size={15} />
                                            <span>View</span>
                                        </button>
                                    </div>

                                    {/* WhatsApp full-width secondary row */}
                                    {job.phone && (
                                        <a
                                            href={`https://wa.me/${job.phone.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 text-xs font-semibold transition-all active:scale-[0.99]"
                                        >
                                            <MessageCircle size={14} />
                                            WhatsApp
                                        </a>
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