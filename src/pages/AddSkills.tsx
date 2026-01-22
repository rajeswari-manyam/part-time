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

  const categories = CategoriesData.categories;
  const subcategories = SubCategoriesData.subcategories;

  const availableSubcategories = selectedCategory
    ? subcategories.find(s => s.categoryId === selectedCategory)?.items || []
    : [];

  const handleSubmit = async () => {
    const workerId = localStorage.getItem("workerId") || localStorage.getItem("@worker_id");

    if (!workerId) {
      alert("Worker profile not found. Please create your profile first.");
      navigate("/worker-profile");
      return;
    }

    if (!selectedCategory || !selectedSubcategory || !chargeAmount) {
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
      if (!res.success) {
        alert(res.message);
        return;
      }

      localStorage.setItem("workerSkillId", res.skill._id);

      // Show success message
      alert("Skill added successfully!");

      // Navigate to home page to show the worker's skills
      navigate("/home");
    } catch (error: any) {
      console.error("Error adding skill:", error);
      if (error.message.includes("409")) {
        alert("This skill is already added for your profile.");
      } else {
        alert("Failed to add skill. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Skills & Charges</h2>

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
    </div>
  );
};

export default AddSkillsScreen;