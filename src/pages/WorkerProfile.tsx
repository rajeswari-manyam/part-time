import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

      // Navigate to add skills
      navigate("/add-skills");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow">
      <h2 className={typography.heading.h3}>Create Worker Profile</h2>

      {error && <p className="text-red-600">{error}</p>}

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
      <div className="space-y-3">
        <input
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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

        <Button fullWidth onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Continue to Add Skills"}
        </Button>
      </div>
    </div>
  );
};

export default WorkerProfile;