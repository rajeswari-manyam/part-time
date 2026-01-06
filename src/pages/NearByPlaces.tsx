import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Phone, Clock, Loader2, AlertCircle } from "lucide-react";
import { getUserLocation } from "../services/api.service";

interface Place {
    place_id: string;
    name: string;
    vicinity: string;
    rating?: number;
    user_ratings_total?: number;
    distance?: number;
    business_status?: string;
    opening_hours?: {
        open_now?: boolean;
    };
    geometry?: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

// Map subcategory names to Google Places types
const getPlaceType = (subcategory: string): string => {
    const typeMapping: { [key: string]: string } = {
        'restaurants': 'restaurant',
        'cafes': 'cafe',
        'bakeries': 'bakery',
        'juice-smoothie-shops': 'cafe',
        'sweet-shops': 'store',
        'ice-cream-parlours': 'store',
        'grocery-stores': 'grocery_or_supermarket',
        'supermarkets': 'supermarket',
        'clothing-stores': 'clothing_store',
        'shoe-shops': 'shoe_store',
        'mobile-stores': 'electronics_store',
        'pet-shops': 'pet_store',
        'pet-grooming': 'veterinary_care',
        'pet-training': 'veterinary_care',
        'vet-clinics': 'veterinary_care',
    };

    return typeMapping[subcategory] || 'store';
};

const NearbyPlaces: React.FC = () => {
    const navigate = useNavigate();
    const { subcategory } = useParams<{ subcategory: string }>();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });

    // Calculate distance between two coordinates in km
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        const fetchLocationAndPlaces = async () => {
            try {
                setLoading(true);
                setError("");

                // Get user location
                const location = await getUserLocation();
                setUserLocation(location);

                // Get the appropriate place type
                const placeType = getPlaceType(subcategory || "");

                // Call your backend API instead of Google directly
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://192.168.1.13:3000";
                const response = await fetch(
                    `${API_BASE_URL}/getNearbyPlaces?latitude=${location.latitude}&longitude=${location.longitude}&type=${placeType}&radius=5000`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.results) {
                    // Calculate distances and add to results
                    const placesWithDistance = data.results.map((place: Place) => ({
                        ...place,
                        distance: place.geometry ? calculateDistance(
                            location.latitude,
                            location.longitude,
                            place.geometry.location.lat,
                            place.geometry.location.lng
                        ) : undefined
                    }));

                    // Sort by distance
                    placesWithDistance.sort((a: Place, b: Place) =>
                        (a.distance || 999) - (b.distance || 999)
                    );

                    setPlaces(placesWithDistance);
                } else {
                    throw new Error(data.message || "Failed to fetch places");
                }
            } catch (err) {
                console.error("Error fetching places:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch nearby places");
            } finally {
                setLoading(false);
            }
        };

        fetchLocationAndPlaces();
    }, [subcategory]);

    const displayName = subcategory?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Places";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-lg sticky top-0 z-10 border-b border-slate-200">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="font-semibold text-lg">Nearby {displayName}</h1>
                                <p className="text-sm text-slate-500">{places.length} places found</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <p className="text-slate-600 text-lg">Finding nearby places...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <p className="text-red-700 text-lg font-semibold mb-2">Error Loading Places</p>
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && places.length === 0 && (
                        <div className="text-center py-12">
                            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg font-semibold">No places found nearby</p>
                            <p className="text-slate-400 mt-2">Try a different category or expand your search range</p>
                        </div>
                    )}

                    {/* Places List */}
                    {!loading && !error && places.length > 0 && (
                        <div className="space-y-4">
                            {places.map((place) => (
                                <div
                                    key={place.place_id}
                                    className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon/Avatar */}
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                                            🏪
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                                                    {place.name}
                                                </h3>
                                                {place.distance !== undefined && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                                                        {place.distance.toFixed(1)} km
                                                    </span>
                                                )}
                                            </div>

                                            {/* Rating */}
                                            {place.rating && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                className={
                                                                    i < Math.floor(place.rating!)
                                                                        ? "text-yellow-400 fill-yellow-400"
                                                                        : "text-slate-300"
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {place.rating.toFixed(1)}
                                                    </span>
                                                    {place.user_ratings_total && (
                                                        <span className="text-xs text-slate-500">
                                                            ({place.user_ratings_total} reviews)
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Location */}
                                            <div className="flex items-start gap-2 text-sm text-slate-600 mb-2">
                                                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-blue-500" />
                                                <span className="line-clamp-2">{place.vicinity}</span>
                                            </div>

                                            {/* Status badges */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {place.opening_hours?.open_now !== undefined && (
                                                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${place.opening_hours.open_now
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        <Clock size={12} />
                                                        {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                                                    </span>
                                                )}
                                                {place.business_status === 'OPERATIONAL' && (
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
                                            <Phone size={16} />
                                            Call
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NearbyPlaces;