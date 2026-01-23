import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Buttons";
import CategorySelector from "../components/WorkerProfile/CategorySelector";
import ServiceChargesSection from "../components/WorkerProfile/ServiceCharges";
import {
  getWorkerSkillById,
  updateWorkerSkill,
  deleteWorkerSkill,
  UpdateWorkerSkillPayload,
} from "../services/api.service";
import CategoriesData from "../components/data/Categories.json";
import SubCategoriesData from "../components/data/SubCategories.json";
import { ArrowLeft, Trash2, Loader2, ExternalLink } from "lucide-react";

interface WorkerSkill {
  _id: string;
  category: string[];
  subCategory: string;
  skill: string;
  serviceCharge: number;
  chargeType: "hour" | "day" | "fixed";
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

const EditSkillScreen: React.FC = () => {
  const navigate = useNavigate();
  const { skillId } = useParams<{ skillId: string }>();

  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [skills, setSkills] = useState("");

  const [chargeType, setChargeType] = useState<"hourly" | "daily" | "fixed">("hourly");
  const [chargeAmount, setChargeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  // Store original skill data for display
  const [originalSkill, setOriginalSkill] = useState<any>(null);

  const categories = CategoriesData.categories;
  const subcategories = SubCategoriesData.subcategories;

  const availableSubcategories = selectedCategory
    ? subcategories.find((s) => s.categoryId === selectedCategory)?.items || []
    : [];

  // Fetch existing skill data
  useEffect(() => {
    const fetchSkillData = async () => {
      if (!skillId) {
        setError("Skill ID not found");
        setFetchLoading(false);
        return;
      }

      try {
        const response = await getWorkerSkillById(skillId);

        if (response.success && response.workerSkill) {
          const skill: any = response.workerSkill;
          setOriginalSkill(skill);

          // Find category ID from category name
          const categoryName = skill.category[0];
          const category = categories.find((c) => c.name === categoryName);

          if (category) {
            setSelectedCategory(category.id);
          }

          setSelectedSubcategory(skill.subCategory);
          setSkills(skill.skill || "");
          setChargeAmount(String(skill.serviceCharge));

          // Convert chargeType to match the UI format
          const uiChargeType =
            skill.chargeType === "hour"
              ? "hourly"
              : skill.chargeType === "day"
                ? "daily"
                : "fixed";
          setChargeType(uiChargeType);
        }
      } catch (err: any) {
        console.error("Error fetching skill:", err);
        setError("Failed to load skill data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSkillData();
  }, [skillId, categories]);

  const handleUpdate = async () => {
    setError("");

    if (!skillId) {
      setError("Skill ID not found");
      return;
    }

    if (!selectedCategory || !selectedSubcategory || !chargeAmount) {
      setError("Please fill all required fields");
      alert("Please fill all required fields");
      return;
    }

    const categoryName = categories.find((c) => c.id === selectedCategory)?.name || "";

    const payload: UpdateWorkerSkillPayload = {
      category: categoryName,
      subCategory: selectedSubcategory,
      skill: skills || "General",
      serviceCharge: Number(chargeAmount),
      chargeType: chargeType === "hourly" ? "hour" : chargeType === "daily" ? "day" : "fixed",
    };

    setLoading(true);

    try {
      const res = await updateWorkerSkill(skillId, payload);

      if (!res || !res.success) {
        const errorMsg = "Failed to update skill. Please try again.";
        setError(errorMsg);
        alert(errorMsg);
        return;
      }

      alert("Skill updated successfully!");
      navigate("/home");
    } catch (error: any) {
      console.error("Error updating skill:", error);

      let errorMessage = "Failed to update skill. Please try again.";

      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("ERR_CONNECTION_REFUSED")
      ) {
        errorMessage = "Unable to connect to server. Please check if the backend is running.";
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skillId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this skill? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await deleteWorkerSkill(skillId);

      if (res.success) {
        alert("Skill deleted successfully!");
        navigate("/home");
      } else {
        alert("Failed to delete skill");
      }
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatChargeType = (type: string) => {
    return type === "hour" ? "Hourly" : type === "day" ? "Daily" : "Fixed";
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-blue-600 mx-auto mb-3 md:mb-4" />
          <p className="text-sm md:text-base text-gray-600">Loading skill data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 md:py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center mb-4 md:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white transition-colors"
            disabled={loading}
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold ml-3 md:ml-4 text-gray-800">
            Edit Skill
          </h1>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

          {/* Left Side - Current Job Details */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">
              Current Skill Details
            </h2>

            {originalSkill && (
              <div className="space-y-4 md:space-y-5">
                {/* Category */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-base md:text-lg font-semibold text-gray-800">
                    {originalSkill.category[0]}
                  </p>
                </div>

                {/* Subcategory */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Subcategory</p>
                  <p className="text-base md:text-lg font-semibold text-gray-800">
                    {originalSkill.subCategory}
                  </p>
                </div>

                {/* Job Type / Charge Type */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Type</p>
                  <p className="text-base md:text-lg font-semibold text-gray-800 uppercase">
                    {formatChargeType(originalSkill.chargeType)}
                  </p>
                </div>

                {/* Service Charges */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Service Charges</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ₹{originalSkill.serviceCharge}
                  </p>
                </div>

                {/* Description */}
                {originalSkill.skill && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-base text-gray-700">
                      {originalSkill.skill}
                    </p>
                  </div>
                )}

                {/* Location */}
                {(originalSkill?.area || originalSkill?.city) && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Location</p>
                    <div className="space-y-1.5 text-gray-700 text-sm md:text-base mb-3">
                      {originalSkill.area && <p><strong>Area:</strong> {originalSkill.area}</p>}
                      {originalSkill.city && <p><strong>City:</strong> {originalSkill.city}</p>}
                      {originalSkill.state && <p><strong>State:</strong> {originalSkill.state}</p>}
                      {originalSkill.pincode && <p><strong>Pincode:</strong> {originalSkill.pincode}</p>}
                      {originalSkill.latitude && originalSkill.longitude && (
                        <p className="text-xs text-gray-500">
                          <strong>Coordinates:</strong> {originalSkill.latitude.toFixed(4)}, {originalSkill.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>

                    {/* Google Maps Embed */}
                    {originalSkill.latitude && originalSkill.longitude && (
                      <div className="space-y-2">
                        {/* Embedded Map */}
                        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${originalSkill.latitude},${originalSkill.longitude}&zoom=15`}
                            allowFullScreen
                            title="Location Map"
                          ></iframe>
                        </div>

                        {/* Open in Google Maps Button */}
                        <button
                          onClick={() => window.open(
                            `https://www.google.com/maps/search/?api=1&query=${originalSkill.latitude},${originalSkill.longitude}`,
                            "_blank"
                          )}
                          className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <ExternalLink size={16} />
                          Open in Google Maps
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Edit Form */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">
              Edit Skill Information
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
                {error}
              </div>
            )}



            {/* Category Selector */}
            <CategorySelector
              categories={categories}
              subcategories={availableSubcategories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={(e) => setSelectedCategory(Number(e.target.value))}
              onSubcategoryChange={setSelectedSubcategory}
            />

            {/* Skills Input with Label */}
            <div className="mt-4 md:mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Skills Description
              </label>
              <textarea
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                placeholder="e.g., Residential Cleaning, Commercial Cleaning"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            {/* Service Charges Section with proper spacing */}
            <div className="mt-4 md:mt-5">
              <ServiceChargesSection
                chargeType={chargeType}
                chargeAmount={chargeAmount}
                onChargeTypeChange={setChargeType}
                onChargeAmountChange={setChargeAmount}
                onVoiceClick={() => { }}
                isListening={false}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6 md:mt-8">
              {/* Update Button */}
              <Button fullWidth onClick={handleUpdate} disabled={loading}>
                <span className="text-sm md:text-base">
                  {loading ? "Updating..." : "Update Skill"}
                </span>
              </Button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full px-4 py-2.5 md:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-sm md:text-base font-medium"
              >
                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                Delete Skill
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => navigate("/home")}
                className="w-full px-4 py-2 md:py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {/* Warning Message */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs md:text-sm text-yellow-800">
                <span className="font-semibold">⚠️ Note:</span> Deleting this skill will permanently remove it from your profile. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-4 md:h-0"></div>
      </div>
    </div>
  );
};

export default EditSkillScreen;