import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEvents, deleteEventService, EventWorker } from "../services/EventWorker.service";
import { typography } from "../styles/typography";
import Button from "../components/ui/Buttons";
import ActionDropdown from "../components/ActionDropDown";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// ── Build a proper absolute image URL from a raw backend path ────────────────
const buildImageUrl = (path: string): string => {
    if (!path) return "";
    // Already a full URL — use as-is
    if (/^(https?:\/\/|blob:|data:)/i.test(path)) return path;
    // Normalise Windows backslashes → forward slashes
    const clean = path.replace(/\\/g, "/").replace(/^\//, "");
    // Strip trailing slash from base URL to avoid double-slash
    const base = (API_BASE_URL || "").replace(/\/$/, "");
    const url = `${base}/${clean}`;
    console.log("🖼️ Image URL built:", path, "=>", url);
    return url;
};

const getImageUrls = (images?: string[]): string[] => {
    const urls = (images || []).map(buildImageUrl).filter(Boolean);
    console.log("🖼️ getImageUrls input:", images, "output:", urls);
    return urls;
};

interface EventUserServiceProps {
    userId: string;
    selectedSubcategory?: string | null;
    hideHeader?: boolean;
    hideEmptyState?: boolean;
}

const EventUserService: React.FC<EventUserServiceProps> = ({
    userId,
    selectedSubcategory,
    hideHeader = false,
    hideEmptyState = false,
}) => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventWorker[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchEvents = async () => {
            if (!userId) { setEvents([]); setLoading(false); return; }
            setLoading(true);
            try {
                const response = await getUserEvents(userId);
                if (response.success && response.data) {
                    setEvents(Array.isArray(response.data) ? response.data : [response.data]);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]);
            } finally { setLoading(false); }
        };
        fetchEvents();
    }, [userId]);

    // ── Filter ────────────────────────────────────────────────────────────────
    const filteredEvents = selectedSubcategory
        ? events.filter(e => e.category && e.category.toLowerCase().includes(selectedSubcategory.toLowerCase()))
        : events;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleEdit = (id: string) => navigate(`/add-event-service-form?id=${id}`);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this event service?")) return;
        setDeleteLoading(id);
        try {
            const res = await deleteEventService(id);
            if (res.success) {
                setEvents(prev => prev.filter(e => e._id !== id));
            } else {
                alert(res.message || "Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete service. Please try again.");
        } finally { setDeleteLoading(null); }
    };

    const handleView = (id: string) => navigate(`/event-services/details/${id}`);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🎉</span> Event Services
                    </h2>
                )}
                <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
            </div>
        );
    }

    // ── Empty ─────────────────────────────────────────────────────────────────
    if (filteredEvents.length === 0) {
        if (hideEmptyState) return null;
        return (
            <div>
                {!hideHeader && (
                    <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                        <span>🎉</span> Event Services (0)
                    </h2>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className={`${typography.heading.h6} text-gray-700 mb-2`}>No Event Services Yet</h3>
                    <p className={`${typography.body.small} text-gray-500 mb-4`}>
                        Start adding your event services to showcase them here.
                    </p>
                    <Button variant="primary" size="md" onClick={() => navigate("/add-event-service-form")}
                        className="gap-1.5 bg-purple-600 hover:bg-purple-700">
                        + Add Event Service
                    </Button>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div>
            {!hideHeader && (
                <h2 className={`${typography.heading.h5} text-gray-800 mb-3 flex items-center gap-2`}>
                    <span>🎉</span> Event Services ({filteredEvents.length})
                </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredEvents.map((event) => {
                    const id = event._id || "";
                    const location = [event.area, event.city, event.state].filter(Boolean).join(", ") || "Location not specified";

                    // ✅ Build proper absolute URLs for every image path
                    const imageUrls = getImageUrls(event.images);

                    const services = event.services || [];

                    return (
                        <div key={id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">

                            {/* ── Image ── */}
                            <div className="relative h-48 bg-gradient-to-br from-purple-600/10 to-purple-600/5">
                                {imageUrls.length > 0 ? (
                                    <img
                                        src={imageUrls[0]}
                                        alt={event.name || "Event Service"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100"><span style="font-size:3rem">🎉</span></div>`;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">🎉</span>
                                    </div>
                                )}

                                {/* Category Badge — top left */}
                                <div className="absolute top-3 left-3">
                                    <span className={`${typography.misc.badge} bg-purple-600 text-white px-3 py-1 rounded-full shadow-md`}>
                                        {event.category || "Event Service"}
                                    </span>
                                </div>

                                {/* Action Dropdown — top right */}
                                <div className="absolute top-3 right-3">
                                    {deleteLoading === id ? (
                                        <div className="bg-white rounded-lg p-2 shadow-lg">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />
                                        </div>
                                    ) : (
                                        <ActionDropdown
                                            onEdit={() => handleEdit(id)}
                                            onDelete={() => handleDelete(id)}
                                        />
                                    )}
                                </div>

                                {/* Image count badge */}
                                {imageUrls.length > 1 && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">
                                        1 / {imageUrls.length}
                                    </div>
                                )}
                            </div>

                            {/* ── Details ── */}
                            <div className="p-4">
                                {/* Title */}
                                <h3 className={`${typography.heading.h6} text-gray-900 mb-2 truncate`}>
                                    {event.name || "Unnamed Service"}
                                </h3>

                                {/* Location */}
                                <div className="flex items-start gap-2 mb-3">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2`}>{location}</p>
                                </div>

                                {/* Description / bio */}
                                {(event.description || event.bio) && (
                                    <p className={`${typography.body.small} text-gray-600 line-clamp-2 mb-3`}>
                                        {event.description || event.bio}
                                    </p>
                                )}

                                {/* Availability badge */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium ${event.availability
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${event.availability ? "bg-green-500" : "bg-red-500"}`} />
                                        {event.availability ? "Available" : "Busy"}
                                    </span>
                                    {event.chargeType && (
                                        <span className="inline-flex items-center text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200">
                                            {event.chargeType}
                                        </span>
                                    )}
                                </div>

                                {/* Experience + Charge row */}
                                <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        {event.experience ? (
                                            <>
                                                <span className="text-purple-500 text-base">⭐</span>
                                                <span className="text-sm font-semibold text-gray-900">{event.experience} yrs exp</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </div>
                                    {event.serviceCharge && (
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{event.chargeType || "Charge"}</p>
                                            <p className="text-base font-bold text-purple-600">₹{event.serviceCharge}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Services Tags */}
                                {services.length > 0 && (
                                    <div className="mb-3">
                                        <p className={`${typography.body.xs} text-gray-500 mb-1 font-medium`}>Services:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {services.slice(0, 3).map((s, idx) => (
                                                <span key={idx} className={`${typography.fontSize.xs} bg-purple-600/5 text-purple-700 px-2 py-0.5 rounded-full`}>
                                                    {s}
                                                </span>
                                            ))}
                                            {services.length > 3 && (
                                                <span className={`${typography.fontSize.xs} text-gray-500`}>
                                                    +{services.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* View Details */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleView(id)}
                                    className="w-full mt-2 border-purple-600 text-purple-600 hover:bg-purple-600/10"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventUserService;