import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Phone,
    MessageCircle,
    Star,
    ArrowLeft,
    MapPin,
    Navigation,
    Calendar,
    Tag,
    Wallet,
    Clock,
    ChevronLeft,
    ChevronRight,
    BadgeCheck,
    Share2,
    ExternalLink,
} from "lucide-react";
import { getJobById, getUserById, API_BASE_URL } from "../services/api.service";
import { JobDetailsProps } from "../types/job.types";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";

// ─────────────────────────────────────────────────────────────────────────────
// Image Carousel
// ─────────────────────────────────────────────────────────────────────────────
const ImageCarousel: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
    const [idx, setIdx] = useState(0);

    if (!images.length) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                <span className="text-5xl sm:text-6xl md:text-7xl select-none">🔧</span>
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
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={16} className="text-gray-700 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={16} className="text-gray-700 sm:w-5 sm:h-5" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${i === idx ? "bg-white w-4 sm:w-5" : "bg-white/50 w-1 sm:w-1.5"
                                    }`}
                            />
                        ))}
                    </div>
                    {/* Counter */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/40 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                        {idx + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Info Row helper
// ─────────────────────────────────────────────────────────────────────────────
const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    accent?: boolean;
}> = ({ icon, label, value, accent }) => (
    <div className="flex items-start gap-2 sm:gap-3 py-2.5 sm:py-3 border-b border-gray-50 last:border-0">
        <div className={`mt-0.5 flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${accent ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400"
            }`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className={`${typography.body.xs} text-gray-400 font-medium uppercase tracking-wide mb-0.5`}>
                {label}
            </p>
            <div className={`${typography.body.small} text-gray-800 font-medium break-words`}>
                {value}
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Distance helper
// ─────────────────────────────────────────────────────────────────────────────
const calculateDistance = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
): string => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const JobDetailsPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobDetailsProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!jobId) return;

        const fetchJobDetails = async () => {
            try {
                setLoading(true);

                const jobResponse = await getJobById(jobId);
                if (!jobResponse.success) {
                    setError("Job not found");
                    return;
                }

                const jobData = jobResponse.data;

                // Build image URLs
                const urls = (jobData.images || []).map((p: string) =>
                    `${API_BASE_URL}/${p.replace(/\\/g, "/")}`
                );
                setImageUrls(urls);

                let customerName = "Customer";
                let customerPhone = "";
                let customerLat: number | null = null;
                let customerLng: number | null = null;

                try {
                    const userResponse = await getUserById(jobData.userId);
                    if (userResponse.success) {
                        customerName = userResponse.data.name;
                        customerPhone = userResponse.data.phone;
                        customerLat = Number(userResponse.data.latitude);
                        customerLng = Number(userResponse.data.longitude);
                    }
                } catch {
                    console.error("User fetch failed");
                }

                let distance = "N/A";
                if (navigator.geolocation && customerLat && customerLng) {
                    try {
                        const position = await new Promise<GeolocationPosition>((res, rej) =>
                            navigator.geolocation.getCurrentPosition(res, rej)
                        );
                        distance = calculateDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            customerLat!,
                            customerLng!
                        );
                    } catch { }
                }

                setJob({
                    title: jobData.subcategory
                        ? `${jobData.subcategory} – ${jobData.category}`
                        : jobData.category,

                    customerDetails: {
                        name: customerName,
                        phone: customerPhone,
                        distance,
                        rating: 4.7,
                        reviewCount: 23,
                    },

                    jobInformation: {
                        type: jobData.jobType,
                        budget: jobData.servicecharges,
                        budgetType: "fixed",
                        description: jobData.description || "No description provided",
                        startDate: new Date(jobData.startDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                        }),
                        endDate: new Date(jobData.endDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                        }),
                        area: jobData.area,
                        city: jobData.city,
                        state: jobData.state,
                        pincode: jobData.pincode,
                        location: `${jobData.area}, ${jobData.city}, ${jobData.state} – ${jobData.pincode}`,
                        category: jobData.category,
                        subcategory: jobData.subcategory,
                        latitude: jobData.latitude,
                        longitude: jobData.longitude,
                        images: jobData.images || [],
                        createdAt: jobData.createdAt,
                        updatedAt: jobData.updatedAt,
                    },

                    mapUrl: `https://www.google.com/maps?q=${jobData.latitude},${jobData.longitude}&output=embed`,
                });
            } catch {
                setError("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    // ── Google Maps directions URL ────────────────────────────────────────
    const directionsUrl = job?.jobInformation.latitude && job?.jobInformation.longitude
        ? `https://www.google.com/maps/dir/?api=1&destination=${job.jobInformation.latitude},${job.jobInformation.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            job?.jobInformation.location || ""
        )}`;

    // ── Loading ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className={`${typography.body.small} text-gray-500`}>Loading details…</p>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────
    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
                <div className="text-center max-w-sm">
                    <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
                    <h2 className={`${typography.heading.h4} text-gray-800 mb-2`}>Not Found</h2>
                    <p className={`${typography.body.base} text-gray-500 mb-6`}>
                        {error || "Job not available"}
                    </p>
                    <Button variant="primary" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const phone = job.customerDetails.phone;
    const cleanPhone = phone.replace(/\D/g, "");

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">

            {/* ── HERO IMAGE + TOP NAV OVERLAY ─────────────────────────── */}
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 bg-gray-200">
                <ImageCarousel images={imageUrls} title={job.title} />

                {/* Gradient overlay for nav readability */}
                <div className="absolute inset-x-0 top-0 h-16 sm:h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 sm:p-2.5 shadow-md transition-all active:scale-95"
                >
                    <ArrowLeft size={18} className="text-gray-800 sm:w-5 sm:h-5" />
                </button>

                {/* Share button */}
                <button
                    onClick={() =>
                        navigator.share?.({
                            title: job.title,
                            url: window.location.href,
                        }).catch(() => { })
                    }
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 sm:p-2.5 shadow-md transition-all active:scale-95"
                >
                    <Share2 size={18} className="text-gray-800 sm:w-5 sm:h-5" />
                </button>

                {/* Title floating at bottom of hero */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <h1 className={`${typography.heading.h5} text-white drop-shadow-md line-clamp-2 leading-snug`}>
                        {job.title}
                    </h1>
                    <div className="flex items-center gap-1 sm:gap-1.5 mt-1">
                        <MapPin size={12} className="text-white/80 sm:w-3.5 sm:h-3.5" />
                        <span className={`${typography.body.xs} text-white/90 font-medium truncate`}>
                            {job.jobInformation.area}, {job.jobInformation.city}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE BODY ──────────────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-3 sm:px-4 pb-44 space-y-3 sm:space-y-4 -mt-2">

                {/* ── QUICK STATS ROW ──────────────────────────────────── */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 grid grid-cols-3 divide-x divide-gray-100">
                    {/* Rating */}
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1 pr-3 sm:pr-4">
                        <div className="flex items-center gap-1">
                            <Star size={13} className="text-yellow-400 fill-yellow-400 sm:w-3.5 sm:h-3.5" />
                            <span className={`${typography.body.base} font-bold text-gray-900`}>
                                {job.customerDetails.rating}
                            </span>
                        </div>
                        <span className={`${typography.body.xs} text-gray-400`}>
                            {job.customerDetails.reviewCount} reviews
                        </span>
                    </div>

                    {/* Distance */}
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-4">
                        <span className={`${typography.body.base} font-bold text-gray-900`}>
                            {job.customerDetails.distance}
                        </span>
                        <span className={`${typography.body.xs} text-gray-400`}>Distance</span>
                    </div>

                    {/* Budget */}
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1 pl-3 sm:pl-4">
                        <span className={`${typography.body.base} font-bold text-orange-500`}>
                            {job.jobInformation.budget
                                ? `₹${job.jobInformation.budget}`
                                : "Discuss"}
                        </span>
                        <span className={`${typography.body.xs} text-gray-400`}>Budget</span>
                    </div>
                </div>

                {/* ── BADGES + STATUS ─────────────────────────────────── */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ${typography.body.xs} font-semibold`}>
                        <BadgeCheck size={11} className="sm:w-3.5 sm:h-3.5" /> Verified
                    </span>
                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 bg-green-50 text-green-600 border border-green-200 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ${typography.body.xs} font-semibold`}>
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500" />
                        Open Now
                    </span>
                    {job.jobInformation.type && (
                        <span className={`inline-flex items-center gap-1 sm:gap-1.5 bg-orange-50 text-orange-500 border border-orange-200 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 ${typography.body.xs} font-semibold`}>
                            <Tag size={10} className="sm:w-3 sm:h-3" /> {job.jobInformation.type}
                        </span>
                    )}
                </div>

                {/* ── CUSTOMER DETAILS ─────────────────────────────────── */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b border-gray-50">
                        <h2 className={`${typography.body.small} font-bold text-gray-900 uppercase tracking-wide`}>
                            Customer Details
                        </h2>
                    </div>
                    <div className="px-3 sm:px-4">
                        <InfoRow
                            icon={<span className="text-sm sm:text-base">👤</span>}
                            label="Name"
                            value={job.customerDetails.name}
                        />
                        <InfoRow
                            icon={<Phone size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Phone Number"
                            value={
                                <a
                                    href={`tel:${phone}`}
                                    className="text-orange-500 font-semibold hover:text-orange-600"
                                >
                                    {phone || "Not provided"}
                                </a>
                            }
                            accent
                        />
                        <InfoRow
                            icon={<MapPin size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Distance"
                            value={job.customerDetails.distance}
                        />
                    </div>
                </div>

                {/* ── JOB INFORMATION ──────────────────────────────────── */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b border-gray-50">
                        <h2 className={`${typography.body.small} font-bold text-gray-900 uppercase tracking-wide`}>
                            Job Information
                        </h2>
                    </div>
                    <div className="px-3 sm:px-4">
                        <InfoRow
                            icon={<Tag size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Category"
                            value={
                                <span>
                                    {job.jobInformation.category}
                                    {job.jobInformation.subcategory && (
                                        <span className={`ml-2 ${typography.body.xs} bg-orange-50 text-orange-500 border border-orange-200 px-1.5 sm:px-2 py-0.5 rounded-full`}>
                                            {job.jobInformation.subcategory}
                                        </span>
                                    )}
                                </span>
                            }
                            accent
                        />
                        <InfoRow
                            icon={<MapPin size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Location"
                            value={job.jobInformation.location}
                        />
                        <InfoRow
                            icon={<Wallet size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Budget"
                            value={
                                job.jobInformation.budget
                                    ? `₹${job.jobInformation.budget} (${job.jobInformation.budgetType})`
                                    : "To be discussed"
                            }
                            accent
                        />
                        <InfoRow
                            icon={<Calendar size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Schedule"
                            value={`${job.jobInformation.startDate} → ${job.jobInformation.endDate}`}
                        />
                        <InfoRow
                            icon={<Clock size={14} className="sm:w-3.5 sm:h-3.5" />}
                            label="Duration"
                            value="2–3 hours estimated"
                        />
                    </div>
                </div>

                {/* ── DESCRIPTION ─────────────────────────────────────── */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4">
                    <h2 className={`${typography.body.small} font-bold text-gray-900 uppercase tracking-wide mb-2 sm:mb-3`}>
                        Description
                    </h2>
                    <p className={`${typography.body.small} text-gray-600 leading-relaxed`}>
                        {job.jobInformation.description}
                    </p>
                </div>

                {/* ── MAP PREVIEW ─────────────────────────────────────── */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b border-gray-50 flex items-center justify-between">
                        <h2 className={`${typography.body.small} font-bold text-gray-900 uppercase tracking-wide`}>
                            Location
                        </h2>
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-0.5 sm:gap-1 ${typography.body.xs} text-orange-500 font-semibold hover:text-orange-600`}
                        >
                            <ExternalLink size={10} className="sm:w-3 sm:h-3" />
                            Open Maps
                        </a>
                    </div>
                    <div className="relative">
                        <iframe
                            src={job.mapUrl}
                            className="w-full h-40 sm:h-48 md:h-52"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Job Location Map"
                            allowFullScreen
                        />
                        {/* Tap-to-open overlay */}
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4 opacity-0 hover:opacity-100 transition-opacity"
                        >
                            <span className={`bg-white shadow-lg text-orange-600 ${typography.body.xs} font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-1.5`}>
                                <Navigation size={11} className="sm:w-3.5 sm:h-3.5" /> Get Directions
                            </span>
                        </a>
                    </div>
                </div>

            </div>

            {/* ── FIXED BOTTOM ACTION BAR ──────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-3 sm:px-4 py-2.5 sm:py-3 z-[100]">
                <div className="max-w-2xl mx-auto space-y-2">

                    {/* Row 1: Directions | Call (with number) | WhatsApp */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">

                        {/* Directions → Google Maps */}
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-lg sm:rounded-xl py-2 sm:py-2.5 text-gray-600 hover:text-orange-500 transition-all active:scale-95"
                        >
                            <Navigation size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className={`${typography.body.xs} font-semibold`}>Directions</span>
                        </a>

                        {/* Call — shows phone number below icon */}
                        <a
                            href={`tel:${phone}`}
                            className="flex flex-col items-center justify-center gap-0 sm:gap-0.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg sm:rounded-xl py-2 sm:py-2.5 transition-all active:scale-95 shadow-md shadow-green-200"
                        >
                            <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className={`${typography.body.xs} font-bold leading-tight`}>Call</span>
                            {phone && (
                                <span className="text-[9px] sm:text-[10px] font-medium opacity-90 truncate max-w-full px-1">
                                    {phone}
                                </span>
                            )}
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-lg sm:rounded-xl py-2 sm:py-2.5 transition-all active:scale-95 shadow-md shadow-emerald-200"
                        >
                            <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className={`${typography.body.xs} font-semibold`}>WhatsApp</span>
                        </a>
                    </div>

                    {/* Row 2: Accept Job (full width) */}
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => alert("Job accepted!")}
                        className="!py-3 sm:!py-3.5"
                    >
                        <span className="flex items-center justify-center gap-1.5">
                            ✓ Accept This Job
                        </span>
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default JobDetailsPage;