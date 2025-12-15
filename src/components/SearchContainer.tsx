import React from "react";
import { useSearchController } from "../hooks/useSearchController";
import LocationSelector from "./LocationSelector";
import SearchBar from "./SearchBar";
import SearchIcon from "../assets/icons/Search.png";
import VoiceIcon from "../assets/icons/Voice.png";
import MobileIcon from "../assets/icons/mobile.jpeg"; // <-- make sure this exists


const ICON_SIZE = "w-5 h-5"; // 🔑 single source of truth

const SearchContainer: React.FC = () => {
    const {
        state,
        handleSearchChange,
        handleSearch,
        startVoiceRecognition,
        stopVoiceRecognition,
        getCurrentLocation,
        handleLocationChange,
        clearSearch,
    } = useSearchController();

    const handleVoiceToggle = () => {
        state.isListening ? stopVoiceRecognition() : startVoiceRecognition();
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* ================= LEFT ================= */}
                <div className="flex-1 w-full">
                    {/* Location + Search */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="w-full md:w-1/3">
                            <LocationSelector
                                location={state.location}
                                onLocationChange={handleLocationChange}
                                onGetCurrentLocation={getCurrentLocation}
                            />
                        </div>

                        {/* Search bar wrapper */}
                        <div className="w-full md:flex-1 relative">
                            <SearchBar
                                searchText={state.searchText}
                                isListening={state.isListening}
                                isSearching={state.isSearching}
                                suggestions={state.suggestions}
                                onSearchChange={handleSearchChange}
                                onSearch={handleSearch}
                                onVoiceSearch={handleVoiceToggle}
                                onClearSearch={clearSearch}
                            />

                            {/* Search Icon (if needed outside SearchBar) */}
                            <img
                                src={SearchIcon}
                                alt="Search"
                                className={`${ICON_SIZE} absolute right-4 top-1/2 -translate-y-1/2`}
                            />
                        </div>
                    </div>

                  {/* Voice bar – SAME height as search bar */}
<div
  onClick={handleVoiceToggle}
  className="mt-3 h-12 flex items-center gap-3 
             border border-blue-300 bg-blue-50 
             px-4 rounded-xl cursor-pointer 
             hover:bg-blue-100 transition"
>
  <img src={VoiceIcon} alt="Voice" className="w-5 h-5 opacity-70" />
  <span className="text-sm text-blue-700">
    Speak to search services instantly – "Find a plumber near me"
  </span>
</div>

                </div>

                {/* ================= RIGHT ================= */}
                <div className="w-full lg:w-52 flex justify-center lg:justify-end">
                    <button className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 hover:shadow-md transition">
                        <img src={MobileIcon} alt="Download App" className={ICON_SIZE} />
                        <span className="text-sm font-medium">Download App</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchContainer;
