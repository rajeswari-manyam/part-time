import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import LocationSection from "../components/WorkerProfile/LocationSection";
import ProfilePhotoUpload from "../components/WorkerProfile/ProfilePhotoUpload";
import { createWorkerBase, CreateWorkerBasePayload } from "../services/api.service";

const WorkerProfile: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          // Example using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();

          // Fill address fields
          setAddress(data.address.road || data.address.neighbourhood || "");
          setCity(data.address.city || data.address.town || data.address.village || "");
          setState(data.address.state || "");
          setPincode(data.address.postcode || "");
        } catch (err) {
          console.error("Error fetching address:", err);
        }
      }, (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to fetch current location.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/loginPage");
        return;
      }

      if (!fullName || !address || !city || !state || !pincode) {
        alert("Please fill all required fields");
        return;
      }

      setLoading(true);
      setError(null);

      const payload: CreateWorkerBasePayload = {
        userId,
        name: fullName,
        area: address,
        city,
        state,
        pincode,
        latitude,
        longitude,
      };

      const res = await createWorkerBase(payload);
      if (!res.success) throw new Error(res.message);

      // Store workerId in both formats for compatibility
      localStorage.setItem("workerId", res.worker._id);
      localStorage.setItem("@worker_id", res.worker._id);

      // Show success message
      alert("Profile created successfully!");

      // Navigate to add skills
      navigate("/add-skills");
    } catch (e: any) {
      setError(e.message);
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 md:py-8 px-4 md:px-6">
      <div className="max-w-xl mx-auto">

        {/* Header with Back Button */}
        <div className="flex items-center mb-4 md:mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-white transition-colors"
            disabled={loading}
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 ml-3 md:ml-4">
            Create Worker Profile
          </h2>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6">

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
              {error}
            </div>
          )}

          {/* Profile Photo Upload */}
          <ProfilePhotoUpload
            profilePhoto={profilePhoto}
            onPhotoUpload={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              setProfilePhotoFile(file);
              const r = new FileReader();
              r.onload = () => setProfilePhoto(r.result as string);
              r.readAsDataURL(file);
            }}
          />

          {/* Form Fields */}
          <div className="space-y-3 md:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Location Section */}
            <LocationSection
              address={address}
              city={city}
              state={state}
              pincode={pincode}
              latitude={latitude}
              longitude={longitude}
              onAddressChange={setAddress}
              onCityChange={setCity}
              onStateChange={setState}
              onPincodeChange={setPincode}
              onAddressVoice={() => { }}
              onCityVoice={() => { }}
              onUseCurrentLocation={fetchLocation}
              isAddressListening={false}
              isCityListening={false}
            />

            {/* Submit Button */}
            <div className="pt-2 md:pt-4">
              <Button fullWidth onClick={handleSubmit} disabled={loading}>
                <span className="text-sm md:text-base">
                  {loading ? "Saving..." : "Continue to Add Skills"}
                </span>
              </Button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => navigate("/")}
              className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg">
            <p className="text-xs md:text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> Complete your profile to start receiving job requests from customers in your area.
            </p>
          </div>

          {/* Required Fields Note */}
          <p className="text-xs md:text-sm text-gray-500 text-center mt-4">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-4 md:h-0"></div>
      </div>
    </div>
  );
};

export default WorkerProfile;