import React, { useEffect, useRef, useState } from "react";

// Props
type Props = {
    initialLat?: number;
    initialLng?: number;
    onSaveLocation?: (city: string, lat: number, lng: number) => void;
    onNavigate?: () => void;
};

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";

// Theme colors
const BG_COLOR = "#F0F0F0";
const PRIMARY_COLOR = "#1A5F9E";

export default function LocationSelector({
    initialLat,
    initialLng,
    onSaveLocation,
    onNavigate,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [query, setQuery] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [googleMaps, setGoogleMaps] = useState<typeof google | null>(null);
    const [showButtons, setShowButtons] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /* ---------------- LOAD GOOGLE MAPS ---------------- */
    useEffect(() => {
        if (window.google?.maps) {
            setGoogleMaps(window.google);
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleMaps(window.google);
        document.head.appendChild(script);
    }, []);

    /* ---------------- AUTOCOMPLETE ---------------- */
    useEffect(() => {
        if (!googleMaps || !inputRef.current) return;

        const auto = new googleMaps.maps.places.Autocomplete(inputRef.current, {
            fields: ["geometry", "formatted_address", "address_components"],
        });

        auto.addListener("place_changed", () => {
            const place = auto.getPlace();
            if (!place.geometry?.location) return;

            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();

            setLat(latitude);
            setLng(longitude);
            setAddress(place.formatted_address || "");
            setQuery(place.formatted_address || "");
            extractCity(place.address_components || []);
            setShowButtons(true);
        });
    }, [googleMaps]);

    /* ---------------- CITY EXTRACTION ---------------- */
    const extractCity = (components: google.maps.GeocoderAddressComponent[]) => {
        const result =
            components.find((c) => c.types.includes("locality")) ||
            components.find((c) => c.types.includes("administrative_area_level_2")) ||
            components.find((c) => c.types.includes("administrative_area_level_1")) ||
            components.find((c) => c.types.includes("country"));

        setCity(result?.long_name || "");
    };

    const handleInputClick = () => {
        if (!showButtons && !isSaved) setShowButtons(true);
    };

    /* ---------------- USE CURRENT LOCATION ---------------- */
    const handleUseCurrent = () => {
        if (!navigator.geolocation || !googleMaps) return;

        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;

                setLat(latitude);
                setLng(longitude);

                const geocoder = new googleMaps.maps.Geocoder();
                geocoder.geocode(
                    { location: { lat: latitude, lng: longitude } },
                    (results, status) => {
                        setIsLoading(false);
                        if (status === "OK" && results?.[0]) {
                            setAddress(results[0].formatted_address || "");
                            setQuery(results[0].formatted_address || "");
                            extractCity(results[0].address_components || []);
                            setShowButtons(true);
                        }
                    }
                );
            },
            () => setIsLoading(false),
            { enableHighAccuracy: true }
        );
    };

    /* ---------------- SAVE ---------------- */
    const handleSave = () => {
        if (!city || lat === null || lng === null) return;

        onSaveLocation?.(city, lat, lng);
        setIsSaved(true);
        setShowButtons(false);

        setTimeout(() => onNavigate?.(), 800);
    };

    /* ---------------- CLEAR ---------------- */
    const handleClear = () => {
        setQuery("");
        setCity("");
        setAddress("");
        setLat(null);
        setLng(null);
        setShowButtons(false);
        setIsSaved(false);
    };

    /* ---------------- RENDER ---------------- */
    return (
        <div className="w-full max-w-2xl mx-auto space-y-3">

            {/* INPUT BOX */}
            <div
                className="rounded-2xl border-2 shadow-md"
                style={{ backgroundColor: BG_COLOR, borderColor: PRIMARY_COLOR }}
            >
                <div className="flex items-center">
                    <div className="pl-4">
                        <span style={{ color: PRIMARY_COLOR }}>📍</span>
                    </div>

                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onClick={handleInputClick}
                        disabled={isSaved}
                        className="flex-1 px-4 py-4 outline-none text-sm md:text-base"
                        style={{ backgroundColor: BG_COLOR, color: PRIMARY_COLOR }}
                        placeholder="Enter your location"
                    />

                    {query && !isSaved && (
                        <button
                            onClick={handleClear}
                            className="pr-4"
                            style={{ color: PRIMARY_COLOR }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* SELECTED LOCATION */}
            {address && !isSaved && (
                <div
                    className="p-4 rounded-xl border"
                    style={{ backgroundColor: BG_COLOR, borderColor: PRIMARY_COLOR }}
                >
                    <p
                        className="text-xs font-semibold uppercase mb-1"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Selected Location
                    </p>
                    <p className="text-sm text-gray-700">{address}</p>

                    {city && (
                        <span
                            className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold"
                            style={{
                                backgroundColor: BG_COLOR,
                                border: `1px solid ${PRIMARY_COLOR}`,
                                color: PRIMARY_COLOR,
                            }}
                        >
                            {city}
                        </span>
                    )}
                </div>
            )}

            {/* BUTTONS */}
            {showButtons && !isSaved && (
                <div className="flex gap-3">
                    <button
                        onClick={handleUseCurrent}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-xl font-semibold border-2"
                        style={{
                            backgroundColor: BG_COLOR,
                            borderColor: PRIMARY_COLOR,
                            color: PRIMARY_COLOR,
                        }}
                    >
                        {isLoading ? "Getting Location..." : "Use Current Location"}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!city || !lat || !lng}
                        className="flex-1 py-3 rounded-xl font-semibold text-white"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        Save & Continue
                    </button>
                </div>
            )}
        </div>
    );
}
