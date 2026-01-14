// import React, { useEffect, useRef, useState } from "react";

// // Props
// type Props = {
//     initialLat?: number;
//     initialLng?: number;
//     onSaveLocation?: (city: string, lat: number, lng: number) => void;
//     onNavigate?: () => void;
// };

// // Default Google Maps API Key
// const GOOGLE_MAPS_API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";

// // Component
// export default function LocationSelector({
//     initialLat,
//     initialLng,
//     onSaveLocation,
//     onNavigate,
// }: Props) {
//     // Refs
//     const inputRef = useRef<HTMLInputElement | null>(null);

//     // State
//     const [query, setQuery] = useState<string>("");
//     const [city, setCity] = useState<string>("");
//     const [address, setAddress] = useState<string>("");
//     const [lat, setLat] = useState<number | null>(null);
//     const [lng, setLng] = useState<number | null>(null);
//     const [googleMaps, setGoogleMaps] = useState<typeof google | null>(null);
//     const [showButtons, setShowButtons] = useState<boolean>(false);
//     const [isSaved, setIsSaved] = useState<boolean>(false);

//     /* ---------------------------- LOAD GOOGLE MAPS ---------------------------- */
//     useEffect(() => {
//         if (window.google?.maps) {
//             setGoogleMaps(window.google);
//             return;
//         }

//         const existingScript = document.getElementById("google-maps-script");
//         if (existingScript) {
//             existingScript.addEventListener("load", () => {
//                 setGoogleMaps(window.google);
//             });
//             return;
//         }

//         const script = document.createElement("script");
//         script.id = "google-maps-script";
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//         script.async = true;
//         script.defer = true;
//         script.onload = () => setGoogleMaps(window.google);
//         document.head.appendChild(script);
//     }, []);

//     /* ---------------------------- INITIALIZE AUTOCOMPLETE ---------------------------- */
//     useEffect(() => {
//         if (!googleMaps || !inputRef.current) return;

//         const auto = new googleMaps.maps.places.Autocomplete(inputRef.current, {
//             fields: ["geometry", "formatted_address", "address_components"],
//         });

//         auto.addListener("place_changed", () => {
//             const place = auto.getPlace();
//             if (!place.geometry || !place.geometry.location) return;

//             const loc = place.geometry.location;
//             const latitude = loc.lat();
//             const longitude = loc.lng();

//             setLat(latitude);
//             setLng(longitude);
//             setAddress(place.formatted_address || "");
//             setQuery(place.formatted_address || "");
//             extractCity(place.address_components || []);
//             setShowButtons(true);
//         });
//     }, [googleMaps]);

//     /* ----------------------------- EXTRACT CITY ----------------------------- */
//     const extractCity = (components: google.maps.GeocoderAddressComponent[]) => {
//         const result =
//             components.find((c) => c.types.includes("locality")) ||
//             components.find((c) => c.types.includes("administrative_area_level_1")) ||
//             components.find((c) => c.types.includes("country"));

//         setCity(result?.long_name || "");
//     };

//     /* ----------------------------- HANDLE INPUT CLICK ----------------------------- */
//     const handleInputClick = () => {
//         if (!showButtons && !isSaved) {
//             setShowButtons(true);
//         }
//     };

//     /* ----------------------------- USE CURRENT LOCATION ----------------------------- */
//     const handleUseCurrent = () => {
//         if (!navigator.geolocation) return alert("Geolocation not supported");

//         navigator.geolocation.getCurrentPosition(
//             (pos) => {
//                 if (!googleMaps) return;

//                 const latitude = pos.coords.latitude;
//                 const longitude = pos.coords.longitude;

//                 setLat(latitude);
//                 setLng(longitude);

//                 // Reverse geocode
//                 const geocoder = new googleMaps.maps.Geocoder();
//                 geocoder.geocode(
//                     { location: { lat: latitude, lng: longitude } },
//                     (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
//                         if (status === "OK" && results && results[0]) {
//                             setAddress(results[0].formatted_address || "");
//                             setQuery(results[0].formatted_address || "");
//                             extractCity(results[0].address_components || []);
//                         }
//                     }
//                 );
//             },
//             (err) => alert(err.message),
//             { enableHighAccuracy: true }
//         );
//     };

//     /* ----------------------------- SAVE LOCATION ----------------------------- */
//     const handleSave = () => {
//         if (!city || lat === null || lng === null) {
//             return alert("Please select a location");
//         }

//         onSaveLocation?.(city, lat, lng);

//         // Hide buttons immediately
//         setShowButtons(false);
//         setIsSaved(true);

//         // Navigate after showing success message
//         setTimeout(() => {
//             onNavigate?.();
//         }, 1000);
//     };

//     /* ----------------------------- RENDER ----------------------------- */
//     return (
//         <div className="w-full space-y-3">
//             {/* Location Input - Matches Search Bar Style */}
//             <div className="bg-white rounded-xl md:rounded-2xl border-2 border-blue-400 shadow-lg overflow-hidden">
//                 <div className="flex items-center">
//                     <div className="pl-3 md:pl-5">
//                         <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                         </svg>
//                     </div>
//                     <input
//                         ref={inputRef}
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         onClick={handleInputClick}
//                         className="flex-1 px-3 md:px-4 py-3 md:py-4 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
//                         placeholder="Enter your location"
//                     />
//                 </div>
//             </div>

//             {/* Selected Address Display - Hide when saved */}
//             {address && !isSaved && (
//                 <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
//                     <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Selected:</p>
//                     <p className="text-xs text-gray-700 line-clamp-2">{address}</p>
//                     {city && (
//                         <div className="flex items-center gap-1 mt-1">
//                             <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                             </svg>
//                             <p className="text-xs font-semibold text-gray-900">{city}</p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Action Buttons - Only show when buttons are visible and not saved */}
//             {showButtons && !isSaved && (
//                 <div className="flex gap-2">
//                     {/* Use Current Location Button */}
//                     <button
//                         onClick={handleUseCurrent}
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-xs md:text-sm font-medium text-gray-700"
//                     >
//                         <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                         </svg>
//                         <span className="hidden sm:inline">Current</span>
//                     </button>

//                     {/* Save Button */}
//                     <button
//                         onClick={handleSave}
//                         disabled={!city}
//                         className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
//                     >
//                         Save
//                     </button>
//                 </div>
//             )}

//             {/* Saved Message - Remove this section */}
//         </div>
//     );
// }


import React, { useEffect, useRef, useState } from "react";

// Props
type Props = {
    initialLat?: number;
    initialLng?: number;
    onSaveLocation?: (city: string, lat: number, lng: number) => void;
    onNavigate?: () => void;
};

// Default Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";

// Component
export default function LocationSelector({
    initialLat,
    initialLng,
    onSaveLocation,
    onNavigate,
}: Props) {
    // Refs
    const inputRef = useRef<HTMLInputElement | null>(null);

    // State
    const [query, setQuery] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [googleMaps, setGoogleMaps] = useState<typeof google | null>(null);
    const [showButtons, setShowButtons] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /* ---------------------------- LOAD GOOGLE MAPS ---------------------------- */
    useEffect(() => {
        if (window.google?.maps) {
            setGoogleMaps(window.google);
            return;
        }

        const existingScript = document.getElementById("google-maps-script");
        if (existingScript) {
            existingScript.addEventListener("load", () => {
                setGoogleMaps(window.google);
            });
            return;
        }

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleMaps(window.google);
        document.head.appendChild(script);
    }, []);

    /* ---------------------------- INITIALIZE AUTOCOMPLETE ---------------------------- */
    useEffect(() => {
        if (!googleMaps || !inputRef.current) return;

        const auto = new googleMaps.maps.places.Autocomplete(inputRef.current, {
            fields: ["geometry", "formatted_address", "address_components"],
        });

        auto.addListener("place_changed", () => {
            const place = auto.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            const loc = place.geometry.location;
            const latitude = loc.lat();
            const longitude = loc.lng();

            setLat(latitude);
            setLng(longitude);
            setAddress(place.formatted_address || "");
            setQuery(place.formatted_address || "");
            extractCity(place.address_components || []);
            setShowButtons(true);
        });
    }, [googleMaps]);

    /* ----------------------------- EXTRACT CITY ----------------------------- */
    const extractCity = (components: google.maps.GeocoderAddressComponent[]) => {
        const result =
            components.find((c) => c.types.includes("locality")) ||
            components.find((c) => c.types.includes("administrative_area_level_2")) ||
            components.find((c) => c.types.includes("administrative_area_level_1")) ||
            components.find((c) => c.types.includes("country"));

        setCity(result?.long_name || "");
    };

    /* ----------------------------- HANDLE INPUT CLICK ----------------------------- */
    const handleInputClick = () => {
        if (!showButtons && !isSaved) {
            setShowButtons(true);
        }
    };

    /* ----------------------------- USE CURRENT LOCATION ----------------------------- */
    const handleUseCurrent = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                if (!googleMaps) {
                    setIsLoading(false);
                    return;
                }

                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;

                setLat(latitude);
                setLng(longitude);

                // Reverse geocode
                const geocoder = new googleMaps.maps.Geocoder();
                geocoder.geocode(
                    { location: { lat: latitude, lng: longitude } },
                    (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                        setIsLoading(false);
                        if (status === "OK" && results && results[0]) {
                            setAddress(results[0].formatted_address || "");
                            setQuery(results[0].formatted_address || "");
                            extractCity(results[0].address_components || []);
                        } else {
                            alert("Failed to get address for your location");
                        }
                    }
                );
            },
            (err) => {
                setIsLoading(false);
                alert(`Location error: ${err.message}`);
            },
            { enableHighAccuracy: true }
        );
    };

    /* ----------------------------- SAVE LOCATION ----------------------------- */
    const handleSave = () => {
        if (!city || lat === null || lng === null) {
            alert("Please select a location first");
            return;
        }

        // Call the callback with the location data
        onSaveLocation?.(city, lat, lng);

        // Mark as saved and hide buttons
        setIsSaved(true);
        setShowButtons(false);

        // Navigate after a brief delay to show success state
        setTimeout(() => {
            onNavigate?.();
        }, 1000);
    };

    /* ----------------------------- CLEAR/RESET ----------------------------- */
    const handleClear = () => {
        setQuery("");
        setCity("");
        setAddress("");
        setLat(null);
        setLng(null);
        setShowButtons(false);
        setIsSaved(false);
    };

    /* ----------------------------- RENDER ----------------------------- */
    return (
        <div className="w-full max-w-2xl mx-auto space-y-2">


            {/* Location Input */}
            <div className="bg-white rounded-xl md:rounded-2xl border-2 border-blue-400 shadow-lg overflow-hidden">
                <div className="flex items-center">
                    <div className="pl-3 md:pl-5">
                        <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onClick={handleInputClick}
                        disabled={isSaved}
                        className="flex-1 px-3 md:px-4 py-3 md:py-4 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Enter your location"
                    />
                    {query && !isSaved && (
                        <button
                            onClick={handleClear}
                            className="pr-3 md:pr-5 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Selected Address Display */}
            {address && !isSaved && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
                                Selected Location
                            </p>
                            <p className="text-sm text-gray-700 mb-2">{address}</p>
                            {city && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-blue-200">
                                    <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-semibold text-gray-900">{city}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Action Buttons */}
            {showButtons && !isSaved && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Use Current Location Button */}
                    <button
                        onClick={handleUseCurrent}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all text-sm md:text-base font-semibold text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Getting Location...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>Use Current Location</span>
                            </>
                        )}
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!city || !lat || !lng}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm md:text-base flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save & Continue</span>
                    </button>
                </div>
            )}


        </div>
    );
}