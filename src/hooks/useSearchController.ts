// Search Controller - Hook (Controller Layer)
import { useReducer, useEffect, useCallback, useRef } from "react";
import { SearchState, SearchAction, Location, SearchQuery } from "../types/search.types";
import SearchService from "../services/searchService";
import VoiceService from "../services/voiceService";

const initialState: SearchState = {
  searchText: "",
  location: {
    city: "Hyderabad",
    state: "Telangana",
  },
  isListening: false,
  isSearching: false,
  suggestions: [],
  recentSearches: [],
  error: null,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload, error: null };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_LISTENING":
      return { ...state, isListening: action.payload };
    case "SET_SEARCHING":
      return { ...state, isSearching: action.payload };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload };
    case "ADD_RECENT_SEARCH":
      return {
        ...state,
        recentSearches: [action.payload, ...state.recentSearches.slice(0, 9)],
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_SEARCH":
      return { ...state, searchText: "", suggestions: [], error: null };
    default:
      return state;
  }
}

export const useSearchController = () => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const searchService = useRef(SearchService.getInstance()).current;
  const voiceService = useRef(VoiceService.getInstance()).current;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    const recentSearches = searchService.getRecentSearches();
    recentSearches.forEach((search) => {
      dispatch({ type: "ADD_RECENT_SEARCH", payload: search });
    });
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await searchService.getCurrentLocation();
      dispatch({ type: "SET_LOCATION", payload: location });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to get location",
      });
    }
  }, [searchService]);

  // Handle search text change with debouncing
  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch({ type: "SET_SEARCH_TEXT", payload: text });

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce suggestions
      if (text.length >= 2) {
        searchTimeoutRef.current = setTimeout(async () => {
          const suggestions = await searchService.getSearchSuggestions(text);
          dispatch({ type: "SET_SUGGESTIONS", payload: suggestions });
        }, 300);
      } else {
        dispatch({ type: "SET_SUGGESTIONS", payload: [] });
      }
    },
    [searchService]
  );

  // Handle search submission
  const handleSearch = useCallback(
    async (query?: string) => {
      const searchQuery = query || state.searchText;
      if (!searchQuery.trim()) return;

      dispatch({ type: "SET_SEARCHING", payload: true });

      try {
        const searchData: SearchQuery = {
          query: searchQuery,
          location: state.location,
          timestamp: new Date(),
        };

        // Save to recent searches
        searchService.saveRecentSearch(searchData);
        dispatch({ type: "ADD_RECENT_SEARCH", payload: searchData });

        // Perform search
        await searchService.performSearch(searchQuery, state.location);

        // Clear suggestions
        dispatch({ type: "SET_SUGGESTIONS", payload: [] });

        // In production, navigate to results page or update UI
        console.log("Search performed:", searchData);
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "Search failed",
        });
      } finally {
        dispatch({ type: "SET_SEARCHING", payload: false });
      }
    },
    [state.searchText, state.location, searchService]
  );

  // Start voice recognition
  const startVoiceRecognition = useCallback(() => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      dispatch({
        type: "SET_ERROR",
        payload: "Voice recognition is not supported in your browser",
      });
      return;
    }

    dispatch({ type: "SET_LISTENING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    voiceService.startListening(
      (result) => {
        dispatch({ type: "SET_SEARCH_TEXT", payload: result.transcript });
        if (result.isFinal) {
          dispatch({ type: "SET_LISTENING", payload: false });
        }
      },
      (error) => {
        dispatch({ type: "SET_ERROR", payload: error });
        dispatch({ type: "SET_LISTENING", payload: false });
      }
    );
  }, [voiceService]);

  // Stop voice recognition
  const stopVoiceRecognition = useCallback(() => {
    voiceService.stopListening();
    dispatch({ type: "SET_LISTENING", payload: false });
  }, [voiceService]);

  // Handle location change
  const handleLocationChange = useCallback((location: Location) => {
    dispatch({ type: "SET_LOCATION", payload: location });
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch({ type: "CLEAR_SEARCH" });
  }, []);

  return {
    state,
    handleSearchChange,
    handleSearch,
    startVoiceRecognition,
    stopVoiceRecognition,
    getCurrentLocation,
    handleLocationChange,
    clearSearch,
  };
};