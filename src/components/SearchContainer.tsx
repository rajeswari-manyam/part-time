import React from "react";
import { useSearchController } from "../hooks/useSearchController";

import LocationSelector from "./LocationSelector";
import SearchIcon from "../assets/icons/Search.png";
import VoiceIcon from "../assets/icons/Voice.png";
import MobileIcon from "../assets/icons/mobile.jpeg";

const SearchContainer: React.FC = () => {
 
    const {
        state,
        handleSearchChange,
        handleSearch,
        startVoiceRecognition,
        stopVoiceRecognition,
        getCurrentLocation,
        handleLocationChange,
    } = useSearchController();

    const handleVoiceToggle = () => {
        state.isListening ? stopVoiceRecognition() : startVoiceRecognition();
    };

    const onSearchClick = () => {
        handleSearch();
    };

    return (
        <div className="w-full bg-gradient-to-b from-blue-50/50 to-white py-4 md:py-8 px-3 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-3 md:gap-6 items-stretch lg:items-start">
                    {/* Location Box - Full width on mobile, fixed on desktop */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <LocationSelector
                            location={state.location}
                            onLocationChange={handleLocationChange}
                            onGetCurrentLocation={getCurrentLocation}
                        />
                    </div>

                    {/* Right Side - Search + Download */}
                    <div className="flex-1 space-y-3 md:space-y-4">
                        {/* Search Bar Container */}
                        <div className="bg-white rounded-xl md:rounded-2xl border-2 border-blue-400 shadow-lg overflow-hidden">
                            <div className="flex items-center">
                                {/* Search Icon - Hide on small mobile */}
                                <div className="hidden sm:block pl-3 md:pl-5">
                                    <img src={SearchIcon} alt="Search" className="w-4 md:w-5 h-4 md:h-5 opacity-40" />
                                </div>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    value={state.searchText}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder={"searchPlaceholder"}
                                    className="flex-1 px-3 md:px-4 py-3 md:py-4 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
                                />

                                {/* Voice Button */}
                                <button
                                    onClick={handleVoiceToggle}
                                    className={`p-2 md:p-4 hover:bg-gray-50 transition rounded-full ${state.isListening ? 'bg-red-50 animate-pulse' : ''
                                        }`}
                                    title="Voice search"
                                >
                                    <img
                                        src={VoiceIcon}
                                        alt="Voice"
                                        className="w-5 md:w-6 h-5 md:h-6"
                                    />
                                </button>

                                {/* Search Button with Gradient */}
                                <button
                                    onClick={onSearchClick}
                                    disabled={state.isSearching}
                                    className="bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:from-[#090B7A] hover:to-[#5A95E0] px-4 md:px-10 py-3 md:py-4 transition-all duration-300 flex items-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {state.isSearching ? (
                                        <>
                                            <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span className="text-white font-semibold text-xs md:text-base hidden sm:inline">searching</span>
                                        </>
                                    ) : (
                                        <>
                                            <img src={SearchIcon} alt="Search" className="w-4 md:w-5 h-4 md:h-5 invert" />
                                            <span className="text-white font-semibold text-xs md:text-base hidden sm:inline">search</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Voice Instruction */}
                        <div className="bg-blue-50 rounded-lg md:rounded-xl px-3 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-3 border border-blue-200">
                            <img src={VoiceIcon} alt="" className="w-4 md:w-5 h-4 md:h-5 opacity-60 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-blue-700">
                                {state.isListening
                                    ? `🎤 listening`
                                    : "voiceHint"
                                }
                            </span>
                        </div>
                    </div>

                    {/* Download App Button - Show on tablet and desktop only */}
                    <button className="hidden md:flex flex-shrink-0 items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 lg:px-5 py-3 lg:py-3.5 hover:shadow-lg transition">
                        <img src={MobileIcon} alt="Download App" className="w-5 h-5" />
                        <span className="text-sm font-semibold whitespace-nowrap">downloadApp</span>
                    </button>
                </div>

                {/* Mobile Download App Button - Bottom sticky or as card */}
                <div className="md:hidden mt-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-3 hover:shadow-lg transition">
                        <img src={MobileIcon} alt="Download App" className="w-5 h-5" />
                        <span className="text-sm font-semibold">downloadApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchContainer;