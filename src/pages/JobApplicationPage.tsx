import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft, Phone, Loader2, Users, MapPin,
    Tag, ChevronUp, ChevronDown, Grid3x3, Layers, Wrench, UserMinus
} from "lucide-react";
import {
    getConfirmedWorkers,
    getWorkerWithSkills,
    getJobById,
    getUserById,
    removeWorker,
    ConfirmedWorkers,
    API_BASE_URL,
} from "../services/api.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const resolveImageUrl = (path?: string): string | null => {
    if (!path || typeof path !== "string") return null;
    const cleaned = path.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
    const base = (API_BASE_URL || "").replace(/\/$/, "");
    const rel = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    return `${base}${rel}`;
};

const formatChargeType = (ct?: string): string => {
    const map: Record<string, string> = {
        hour: "hour", hourly: "hour",
        day: "day", daily: "day",
        fixed: "fixed", monthly: "month",
        per_project: "project",
    };
    return ct ? (map[ct.toLowerCase()] || ct) : "hour";
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface EnrichedWorker {
    _id: string;
    workerId: string;
    userId?: string;
    name: string;
    profilePic: string | null;
    area: string;
    city: string;
    state: string;
    serviceCharge: number;
    chargeType: string;
    isActive: boolean;
    categories: string[];
    subCategories: string[];
    skills: string[];
    phone?: string;
    status?: string;
}

// ── Worker Card ───────────────────────────────────────────────────────────────
const WorkerCard: React.FC<{
    worker: EnrichedWorker;
    jobId: string;
    onRemoved: (workerId: string) => void;
}> = ({ worker, jobId, onRemoved }) => {
    const [expanded, setExpanded] = useState(true);
    const [removing, setRemoving] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);

    const cleanPhone = (worker.phone || "").replace(/\D/g, "");
    const locationStr = [worker.area, worker.city, worker.state].filter(Boolean).join(", ");
    const initials = (worker.name || "?")
        .split(" ")
        .map((n) => n[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleRemove = async () => {
        if (!confirmRemove) {
            setConfirmRemove(true);
            return;
        }
        try {
            setRemoving(true);
            await removeWorker(worker.workerId || worker._id, jobId);
            onRemoved(worker._id);
        } catch (err) {
            console.error("Remove worker failed:", err);
            alert("Failed to remove worker. Please try again.");
        } finally {
            setRemoving(false);
            setConfirmRemove(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* ── Header Row ── */}
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-gray-200">
                            {worker.profilePic ? (
                                <img
                                    src={worker.profilePic}
                                    alt={worker.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : (
                                <span className="text-white font-bold text-xl">{initials || "?"}</span>
                            )}
                        </div>
                        <div
                            className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                worker.isActive ? "bg-green-400" : "bg-gray-400"
                            }`}
                        />
                    </div>

                    {/* Name + Location + Status */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{worker.name || "Worker"}</h3>
                        {locationStr && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                                <p className="text-xs text-gray-500 truncate">{locationStr}</p>
                            </div>
                        )}

                        {/* ── Phone Number Display ── */}
                        {cleanPhone ? (
                            <div className="flex items-center gap-1 mt-1">
                                <Phone size={11} className="text-blue-400 flex-shrink-0" />
                                <a
                                    href={`tel:${cleanPhone}`}
                                    className="text-xs font-semibold text-blue-500 hover:underline"
                                >
                                    +91 {cleanPhone}
                                </a>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 mt-1 italic">No phone available</p>
                        )}

                        <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-1.5 ${
                                worker.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    worker.isActive ? "bg-green-500" : "bg-gray-400"
                                }`}
                            />
                            {worker.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Expand / Collapse toggle */}
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition active:scale-95"
                    >
                        {expanded ? (
                            <ChevronUp size={16} className="text-gray-600" />
                        ) : (
                            <ChevronDown size={16} className="text-gray-600" />
                        )}
                    </button>
                </div>

                {/* ── Expandable Detail Section ── */}
                {expanded && (
                    <div className="mt-4 space-y-4">
                        <div className="border-t border-gray-100" />

                        {/* Charge Rate */}
                        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full">
                            <Tag size={13} className="text-teal-500" />
                            <span className="text-sm font-bold">
                                ₹{worker.serviceCharge} / {formatChargeType(worker.chargeType)}
                            </span>
                        </div>

                        {/* Category */}
                        {worker.categories.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Grid3x3 size={10} />
                                    Category
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {worker.categories.map((cat, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full"
                                        >
                                            <Grid3x3 size={11} />
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subcategory */}
                        {worker.subCategories.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Layers size={10} />
                                    Subcategory
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {worker.subCategories.map((sub, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-full"
                                        >
                                            <Layers size={11} />
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills */}
                        {worker.skills.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Wrench size={10} />
                                    Skills
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {worker.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-violet-50 text-violet-600 border border-violet-200 px-3 py-1.5 rounded-full"
                                        >
                                            <Wrench size={11} />
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Call + WhatsApp + Remove Buttons ── */}
            <div className="px-5 pb-5 grid grid-cols-3 gap-2">
                <a
                    href={cleanPhone ? `tel:${cleanPhone}` : undefined}
                    className={`flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                        cleanPhone
                            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-100"
                            : "bg-gray-100 text-gray-400 pointer-events-none"
                    }`}
                >
                    <Phone size={15} />
                    Call
                </a>
                <a
                    href={cleanPhone ? `https://wa.me/91${cleanPhone}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                        cleanPhone
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-100"
                            : "bg-gray-100 text-gray-400 pointer-events-none"
                    }`}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WA
                </a>

                {/* ── Remove Button ── */}
                <button
                    onClick={handleRemove}
                    disabled={removing}
                    className={`flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                        confirmRemove
                            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                            : "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100"
                    } disabled:opacity-60 disabled:pointer-events-none`}
                >
                    {removing ? (
                        <Loader2 size={15} className="animate-spin" />
                    ) : (
                        <UserMinus size={15} />
                    )}
                    {removing ? "..." : confirmRemove ? "Sure?" : "Remove"}
                </button>
            </div>

            {/* Confirm hint */}
            {confirmRemove && !removing && (
                <p className="text-center text-xs text-red-400 pb-3 -mt-2">
                    Tap Remove again to confirm
                </p>
            )}
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const JobApplicantsPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();

    const [workers, setWorkers] = useState<EnrichedWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobInfo, setJobInfo] = useState<{ category: string; subcategory?: string } | null>(null);
    const totalSlots = 3;

    useEffect(() => {
        if (!jobId) return;
        (async () => {
            try {
                setLoading(true);
                setError(null);

                // ── 1. Get job info ──
                try {
                    const jobRes = await getJobById(jobId);
                    if (jobRes.success || jobRes.data) {
                        setJobInfo({
                            category: jobRes.data?.subcategory || jobRes.data?.category || "Job",
                            subcategory: jobRes.data?.subcategory,
                        });
                    }
                } catch { /* non-critical */ }

                // ── 2. Get confirmed workers ──
                const res = await getConfirmedWorkers(jobId);
                if (!res.success || res.data.length === 0) {
                    setError("No applicants found for this job.");
                    return;
                }

                // ── 3. Enrich each worker with full details + phone number ──
                const enriched = await Promise.allSettled(
                    res.data.map(async (cw: ConfirmedWorkers) => {
                        const wId = cw._id;

                        let name: string = cw.name || "";
                        let phone: string = "";
                        let profilePic: string | null = resolveImageUrl(cw.profilePic);
                        let area: string = cw.area || "";
                        let city: string = cw.city || "";
                        let state: string = cw.state || "";
                        let serviceCharge: number = cw.serviceCharge || 0;
                        let chargeType: string = cw.chargeType || "hour";
                        let isActive: boolean = cw.isActive ?? true;
                        let categories: string[] = Array.isArray(cw.category) ? cw.category : [];
                        let subCategories: string[] = cw.subCategories || [];
                        let skills: string[] = cw.skills || [];

                        // ── Fetch phone number from user profile ──
                        if (cw.userId) {
                            try {
                                const userRes = await getUserById(cw.userId);
                                if (userRes.success && userRes.data?.phone) {
                                    phone = userRes.data.phone;
                                }
                            } catch { /* phone fetch failed, leave empty */ }
                        }

                        // ── Try getWorkerWithSkills for richer data ──
                        if (wId) {
                            try {
                                const skillRes = await getWorkerWithSkills(wId);
                                if (skillRes.success && skillRes.worker) {
                                    const w = skillRes.worker;
                                    name = name || w.name || "";
                                    profilePic = profilePic || resolveImageUrl(w.profilePic);
                                    area = area || w.area || "";
                                    city = city || w.city || "";
                                    state = state || w.state || "";
                                    serviceCharge = w.serviceCharge ?? serviceCharge;
                                    chargeType = w.chargeType || chargeType;
                                    isActive = true;

                                    if (skillRes.workerSkills?.length) {
                                        const allCats = skillRes.workerSkills.flatMap((s) => s.category || []);
                                        const allSubs = skillRes.workerSkills.map((s) => s.subCategory).filter(Boolean);
                                        const allSkills = skillRes.workerSkills.map((s) => s.skill).filter(Boolean);
                                        categories = Array.from(new Set(allCats));
                                        subCategories = Array.from(new Set(allSubs));
                                        skills = Array.from(new Set(allSkills));
                                    } else {
                                        categories = (w.categories || []).flat();
                                        subCategories = w.subCategories || [];
                                        skills = w.skills || [];
                                    }

                                    // Also try userId from worker response for phone
                                    if (!phone && w.userId) {
                                        try {
                                            const userRes = await getUserById(w.userId);
                                            if (userRes.success && userRes.data?.phone) {
                                                phone = userRes.data.phone;
                                            }
                                        } catch { /* ignore */ }
                                    }
                                }
                            } catch { /* use raw cw data */ }
                        }

                        return {
                            _id: cw._id,
                            workerId: wId,
                            userId: cw.userId,
                            name,
                            phone,
                            profilePic,
                            area,
                            city,
                            state,
                            serviceCharge,
                            chargeType,
                            isActive,
                            categories,
                            subCategories,
                            skills,
                        } as EnrichedWorker;
                    })
                );

                const finalWorkers = enriched
                    .filter(
                        (r): r is PromiseFulfilledResult<EnrichedWorker> => r.status === "fulfilled"
                    )
                    .map((r) => r.value);

                setWorkers(finalWorkers);
            } catch {
                setError("Failed to load applicants. Please try again.");
            } finally {
                setLoading(false);
            }
        })();
    }, [jobId]);

    // ── Remove worker from list after successful API call ──
    const handleWorkerRemoved = (removedId: string) => {
        setWorkers((prev) => prev.filter((w) => w._id !== removedId));
    };

    const filledSlots = workers.length;
    const remainingSlots = Math.max(0, totalSlots - filledSlots);
    const progressPercent = Math.min(100, (filledSlots / totalSlots) * 100);
    const headerSubtitle = jobInfo?.category || "Services";

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                    <p className="text-sm text-gray-500">Loading applicants…</p>
                </div>
            </div>
        );

    if (error && workers.length === 0)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                    <div className="text-5xl mb-4">📭</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Applicants Yet</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Sticky Header ── */}
            <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition active:scale-95"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-bold text-gray-900">Confirmed Workers</h1>
                        <p className="text-xs text-gray-400 truncate">
                            {headerSubtitle} · {filledSlots}/{totalSlots} slots
                        </p>
                    </div>
                    <div className="flex-shrink-0 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                        <span className="text-xs font-bold text-orange-600">
                            {filledSlots}/{totalSlots}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="max-w-lg mx-auto mt-3">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-700"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                        {filledSlots > 0
                            ? `${filledSlots} confirmed · ${remainingSlots} slot${remainingSlots !== 1 ? "s" : ""} remaining`
                            : `${totalSlots} slots available`}
                    </p>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
                {workers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={36} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">No Workers Yet</h3>
                        <p className="text-sm text-gray-400">
                            No workers have applied for this job yet.
                        </p>
                    </div>
                ) : (
                    workers.map((worker) => (
                        <WorkerCard
                            key={worker._id || worker.workerId}
                            worker={worker}
                            jobId={jobId!}
                            onRemoved={handleWorkerRemoved}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default JobApplicantsPage;