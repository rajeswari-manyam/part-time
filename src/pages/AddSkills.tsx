import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Buttons";
import CategorySelector from "../components/WorkerProfile/CategorySelector";
import ServiceChargesSection from "../components/WorkerProfile/ServiceCharges";
import { addWorkerSkill, AddWorkerSkillPayload } from "../services/api.service";
import CategoriesData from "../components/data/Categories.json";
import SubCategoriesData from "../components/data/SubCategories.json";

const AddSkillsScreen: React.FC = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [skills, setSkills] = useState("");

  const [chargeType, setChargeType] = useState<"hourly" | "daily" | "fixed">("hourly");
  const [chargeAmount, setChargeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = CategoriesData.categories;
  const subcategories = SubCategoriesData.subcategories;

  const availableSubcategories = selectedCategory
    ? subcategories.find(s => s.categoryId === selectedCategory)?.items || []
    : [];

  const handleSubmit = async () => {
    setError("");

    const workerId = localStorage.getItem("workerId") || localStorage.getItem("@worker_id");

    if (!workerId) {
      setError("Worker profile not found. Please create your profile first.");
      alert("Worker profile not found. Please create your profile first.");
      navigate("/worker-profile");
      return;
    }

    if (!selectedCategory || !selectedSubcategory || !chargeAmount) {
      setError("Please fill all required fields");
      alert("Please fill all required fields");
      return;
    }

    const categoryName = categories.find(c => c.id === selectedCategory)?.name || "";

    const payload: AddWorkerSkillPayload = {
      workerId,
      category: categoryName,
      subCategory: selectedSubcategory,
      skill: skills || "General",
      serviceCharge: Number(chargeAmount),
      chargeType: chargeType === "hourly" ? "hour" : chargeType === "daily" ? "day" : "fixed",
    };

    setLoading(true);

    try {
      const res = await addWorkerSkill(payload);

      if (!res || !res.success) {
        const errorMsg = res?.message || "Failed to add skill. Please try again.";
        setError(errorMsg);
        alert(errorMsg);
        return;
      }

      localStorage.setItem("workerSkillId", res.skill._id);

      // Show success message
      alert("Skill added successfully!");

      // Navigate to home page to show the worker's skills
      navigate("/home");
    } catch (error: any) {
      console.error("Error adding skill:", error);

      let errorMessage = "Failed to add skill. Please try again.";

      // Check for specific error types
      if (error.message?.includes("Failed to fetch") || error.message?.includes("ERR_CONNECTION_REFUSED")) {
        errorMessage = "Unable to connect to server. Please check if the backend is running.";
      } else if (error.message?.includes("409")) {
        errorMessage = "This skill is already added for your profile.";
      } else if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Skills & Charges</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <CategorySelector
        categories={categories}
        subcategories={availableSubcategories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategoryChange={e => setSelectedCategory(Number(e.target.value))}
        onSubcategoryChange={setSelectedSubcategory}
      />

      <input
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mt-4"
        placeholder="Skills (e.g., Residential Cleaning, Commercial Cleaning)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <ServiceChargesSection
        chargeType={chargeType}
        chargeAmount={chargeAmount}
        onChargeTypeChange={setChargeType}
        onChargeAmountChange={setChargeAmount}
        onVoiceClick={() => { }}
        isListening={false}
      />

      <Button fullWidth onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Skills & Go to Home"}
      </Button>

      <button
        onClick={() => navigate("/home")}
        className="w-full mt-3 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  );
};

export default AddSkillsScreen;