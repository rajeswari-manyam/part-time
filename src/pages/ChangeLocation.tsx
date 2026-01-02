// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import locationIcon from "../assets/icons/Location.png";
// import { useLocation } from "../store/Location.context";
// type Props = {
//     initialLat?: number;
//     initialLng?: number;
//     onSaveLocation?: (city: string, lat: number, lng: number) => void;
// };

// const GOOGLE_MAPS_API_KEY = "AIzaSyA6myHzS10YXdcazAFalmXvDkrYCp5cLc8";

// export default function SearchMapWithSave({ initialLat, initialLng, onSaveLocation }: Props) {
//     const navigate = useNavigate();
//     const { setLocationWithCoordinates } = useLocation();

//     const mapRef = useRef<any>(null);
//     const markerRef = useRef<any>(null);
//     const inputRef = useRef<HTMLInputElement | null>(null);

//     const [query, setQuery] = useState("");
//     const [city, setCity] = useState("");
//     const [address, setAddress] = useState("");
//     const [googleMaps, setGoogleMaps] = useState<any>(null);

//     const defaultLocation = {
//         lat: initialLat || 17.4894387,
//         lng: initialLng || 78.4602418,
//     };

//     /* ---------------------------- LOAD GOOGLE MAPS FIRST ---------------------------- */
//     useEffect(() => {
//         if (window.google?.maps) {
//             setGoogleMaps(window.google);
//             return;
//         }

//         const existingScript = document.getElementById("google-maps-script");
//         if (existingScript) {
//             existingScript.addEventListener('load', () => {
//                 setGoogleMaps(window.google);
//             });
//             return;
//         }

//         const script = document.createElement("script");
//         script.id = "google-maps-script";
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//         script.async = true;
//         script.defer = true;
//         script.onload = () => {
//             setGoogleMaps(window.google);
//         };
//         document.head.appendChild(script);
//     }, []);

//     /* ------------------------------ INITIALIZE MAP ------------------------------ */
//     useEffect(() => {
//         if (!googleMaps) return;

//         const map = new googleMaps.maps.Map(document.getElementById("map") as HTMLElement, {
//             center: defaultLocation,
//             zoom: 14,
//         });

//         mapRef.current = map;

//         const marker = new googleMaps.maps.Marker({
//             map,
//             position: initialLat ? defaultLocation : undefined,
//             draggable: true,
//         });

//         markerRef.current = marker;

//         /* ------------------------- AUTOCOMPLETE ------------------------ */
//         if (inputRef.current) {
//             const auto = new googleMaps.maps.places.Autocomplete(inputRef.current, {
//                 fields: ["geometry", "formatted_address", "address_components"],
//             });

//             auto.addListener("place_changed", () => {
//                 const place = auto.getPlace();
//                 if (!place.geometry) return;

//                 const loc = place.geometry.location;
//                 const lat = loc.lat();
//                 const lng = loc.lng();

//                 marker.setPosition({ lat, lng });
//                 map.setCenter({ lat, lng });
//                 map.setZoom(15);

//                 setAddress(place.formatted_address || "");
//                 setQuery(place.formatted_address || "");

//                 extractCity(place.address_components || []);
//             });
//         }

//         /* ------------------------ marker drag ------------------------ */
//         marker.addListener("dragend", () => {
//             const pos = marker.getPosition();
//             if (!pos) return;
//             reverseGeocode(pos.lat(), pos.lng());
//         });

//         /* ------------------------ click on map ------------------------ */
//         map.addListener("click", (e: any) => {
//             if (!e.latLng) return;
//             const lat = e.latLng.lat();
//             const lng = e.latLng.lng();
//             marker.setPosition({ lat, lng });
//             reverseGeocode(lat, lng);
//         });

//     }, [googleMaps]);

//     /* ----------------------------- REVERSE GEOCODE ----------------------------- */
//     const reverseGeocode = (lat: number, lng: number) => {
//         if (!googleMaps) return;

//         const geocoder = new googleMaps.maps.Geocoder();
//         geocoder.geocode({ location: { lat, lng } }, (res: any) => {
//             if (res && res[0]) {
//                 setAddress(res[0].formatted_address);
//                 setQuery(res[0].formatted_address);
//                 extractCity(res[0].address_components || []);
//             }
//         });
//     };

//     /* ----------------------------- EXTRACT CITY ----------------------------- */
//     const extractCity = (components: any[]) => {
//         const result =
//             components.find((c) => c.types.includes("locality")) ||
//             components.find((c) => c.types.includes("administrative_area_level_1")) ||
//             components.find((c) => c.types.includes("country"));

//         setCity(result?.long_name || "");
//     };

//     /* ----------------------------- USE CURRENT LOCATION ----------------------------- */
//     const handleUseCurrent = () => {
//         if (!navigator.geolocation) return alert("Geolocation not supported");

//         navigator.geolocation.getCurrentPosition(
//             (pos) => {
//                 if (!googleMaps) return;

//                 const lat = pos.coords.latitude;
//                 const lng = pos.coords.longitude;

//                 const map = mapRef.current;
//                 const marker = markerRef.current;

//                 marker.setPosition({ lat, lng });
//                 map.setCenter({ lat, lng });
//                 map.setZoom(15);

//                 reverseGeocode(lat, lng);
//             },
//             (err) => alert(err.message),
//             { enableHighAccuracy: true }
//         );
//     };

//     /* ----------------------------- SAVE LOCATION ----------------------------- */
//     const handleSave = () => {
//         const marker = markerRef.current;
//         if (!marker || !city) return alert("Please select a location");

//         const pos = marker.getPosition();
//         if (!pos) return;

//         const lat = pos.lat();
//         const lng = pos.lng();

//         setLocationWithCoordinates(city, { latitude: lat, longitude: lng }, "India");
//         onSaveLocation?.(city, lat, lng);

//         navigate("/rental", { replace: true });
//     };

//     /* ----------------------------- RENDER ----------------------------- */
//     return (
//         <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 lg:gap-10 lg:ml-10 max-w-7xl mx-auto">

//             {/* Map Container */}
//             <div className="w-full lg:w-2/3 border rounded-lg shadow overflow-hidden">
//                 <div
//                     id="map"
//                     className="w-full h-[300px] sm:h-[400px] lg:h-[500px]"
//                 />
//             </div>

//             {/* Controls Container */}
//             <div className="w-full lg:w-1/3 space-y-4">

//                 {/* Search Input */}
//                 <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                         Search Location
//                     </label>
//                     <input
//                         ref={inputRef}
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                         placeholder="Search city or address"
//                     />
//                 </div>

//                 {/* Current Location Display */}
//                 {address && (
//                     <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                         <p className="text-xs text-gray-500 mb-1">Selected Location:</p>
//                         <p className="text-sm text-gray-700 line-clamp-2">{address}</p>
//                         {city && (
//                             <p className="text-sm font-medium text-gray-900 mt-1">City: {city}</p>
//                         )}
//                     </div>
//                 )}

//                 {/* Use Current Location Button */}
//                 <button
//                     onClick={handleUseCurrent}
//                     className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                     <img src={locationIcon} alt="Location" className="w-5 h-5" />
//                     <span className="text-sm font-medium text-gray-700">Use Current Location</span>
//                 </button>

//                 {/* Save Button */}
//                 <button
//                     onClick={handleSave}
//                     className="w-full bg-gradient-to-r from-[#0A0747] to-[#4EC8FF] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
//                 >
//                     Save Location
//                 </button>
//             </div>
//         </div>
//     );
// }
export default {};