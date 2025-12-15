import React, { useState } from "react";
import { FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { Location } from "../types/search.types";

const MapMarkerIcon = FaMapMarkerAlt as any;
const ChevronDownIcon = FaChevronDown as any;

interface LocationSelectorProps {
    location: Location;
    onLocationChange: (location: Location) => void;
    onGetCurrentLocation: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    location,
    onLocationChange,
    onGetCurrentLocation,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const popularCities = [
        { city: "Hyderabad", state: "Telangana" },
        { city: "Bangalore", state: "Karnataka" },
        { city: "Mumbai", state: "Maharashtra" },
        { city: "Delhi", state: "Delhi" },
        { city: "Chennai", state: "Tamil Nadu" },
        { city: "Pune", state: "Maharashtra" },
        { city: "Kolkata", state: "West Bengal" },
        { city: "Ahmedabad", state: "Gujarat" },
    ];

    const handleCitySelect = (city: Location) => {
        onLocationChange(city);
        setIsOpen(false);
    };

    const handleCurrentLocation = () => {
        onGetCurrentLocation();
        setIsOpen(false);
    };

    return (
        <div className="relative h-full">
            {/* Location Button - Matches search bar height */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-6 py-5 h-full bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 group w-full lg:w-auto min-w-[280px]"
            >
                <MapMarkerIcon className="text-blue-600 text-2xl flex-shrink-0" />
                <div className="text-left flex-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        Your Location
                    </p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">
                        {location.city}, {location.state}
                    </p>
                </div>
                <ChevronDownIcon
                    className={`text-gray-400 text-sm transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-0 mt-3 w-full lg:w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden">
                        {/* Current Location Button */}
                        <button
                            onClick={handleCurrentLocation}
                            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition-colors duration-200 border-b-2 border-gray-100"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapMarkerIcon className="text-blue-600 text-xl" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-gray-900 text-base">Use Current Location</p>
                                <p className="text-xs text-gray-500 mt-0.5">Detect automatically</p>
                            </div>
                        </button>

                        {/* Popular Cities */}
                        <div className="p-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-2 mb-3">
                                Popular Cities
                            </p>
                            <div className="space-y-1">
                                {popularCities.map((city) => (
                                    <button
                                        key={`${city.city}-${city.state}`}
                                        onClick={() => handleCitySelect(city)}
                                        className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${location.city === city.city && location.state === city.state
                                            ? "bg-blue-600 text-white shadow-lg font-bold"
                                            : "text-gray-700 hover:bg-gray-100 font-medium"
                                            }`}
                                    >
                                        <p className="text-base">
                                            {city.city}, {city.state}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LocationSelector;