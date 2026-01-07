import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

/* ================= TYPES ================= */
interface Place {
    id: string;
    name: string;
    address: string;
    distance: number;
    lat: number;
    lon: number;
}

/* ================= UTILS ================= */
// Haversine formula to calculate distance in km
const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// Generate mock nearby places dynamically
const generateMockPlaces = (
    lat: number,
    lon: number,
    category: string,
    subcategory: string,
    count = 10
): Place[] => {
    return Array.from({ length: count }, (_, i) => {
        const deltaLat = (Math.random() - 0.5) / 100; // ~500m
        const deltaLon = (Math.random() - 0.5) / 100;
        const newLat = lat + deltaLat;
        const newLon = lon + deltaLon;

        return {
            id: `${category}-${subcategory}-${i}`,
            name: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} ${i + 1}`,
            address: `Street ${i + 1}`,
            lat: newLat,
            lon: newLon,
            distance: getDistance(lat, lon, newLat, newLon),
        };
    }).sort((a, b) => a.distance - b.distance);
};

/* ================= COMPONENT ================= */
const NearbyPlaces: React.FC = () => {
    const { category = "food", subcategory = "restaurants" } =
        useParams<{ category: string; subcategory: string }>();
    const navigate = useNavigate();

    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            setError("");

            try {
                const position = await new Promise<GeolocationPosition>(
                    (resolve, reject) =>
                        navigator.geolocation.getCurrentPosition(resolve, reject)
                );

                const { latitude, longitude } = position.coords;

                const mockPlaces = generateMockPlaces(
                    latitude,
                    longitude,
                    category,
                    subcategory,
                    10
                );
                setPlaces(mockPlaces);
            } catch (err: any) {
                setError(err.message || "Location permission denied");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [category, subcategory]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white shadow z-10 p-4 flex gap-3">
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg capitalize">
                            Nearby {subcategory}
                        </h1>
                        <p className="text-sm text-gray-500">{places.length} found</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {loading && (
                        <div className="flex flex-col items-center py-20">
                            <p className="mt-4">Finding nearby places...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 p-6 rounded-xl text-center">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="space-y-4">
                            {places.map((p) => (
                                <div key={p.id} className="bg-white p-4 rounded-xl shadow">
                                    <h3 className="font-semibold">{p.name}</h3>

                                    {/* Address with Google Maps link */}
                                    <div className="flex items-center text-sm mt-2">
                                        <MapPin size={14} className="mr-1" />
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {p.address}
                                        </a>
                                    </div>

                                    <p className="text-blue-600 text-sm mt-2">
                                        {p.distance.toFixed(2)} km away
                                    </p>

                                    {/* Buttons */}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => {
                                                localStorage.setItem(
                                                    "jobPrefillData",
                                                    JSON.stringify({
                                                        categoryName: category,
                                                        subcategory,
                                                        area: p.address,
                                                        latitude: p.lat,
                                                        longitude: p.lon,
                                                    })
                                                );
                                                navigate("/user-profile");
                                            }}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                                        >
                                            Post Job Here
                                        </button>

                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center"
                                        >
                                            View on Map
                                        </a>
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
