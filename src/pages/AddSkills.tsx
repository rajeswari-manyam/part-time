
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

  const categories = CategoriesData.categories;
  const subcategories = SubCategoriesData.subcategories;

  const availableSubcategories = selectedCategory
    ? subcategories.find(s => s.categoryId === selectedCategory)?.items || []
    : [];

  const handleSubmit = async () => {
    const workerId = localStorage.getItem("workerId");
    if (!workerId) return navigate("/create-worker");

    if (!selectedCategory || !selectedSubcategory || !chargeAmount) {
      alert("Fill all required fields");
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

    try {
      const res = await addWorkerSkill(payload);
      if (!res.success) return alert(res.message);

      localStorage.setItem("workerSkillId", res.skill._id);
      navigate("/worker-dashboard");
    } catch (error: any) {
      console.error("Error adding skill:", error);
      if (error.message.includes("409")) {
        alert("This skill is already added for your profile.");
      } else {
        alert("Failed to add skill. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow">
      <h2>Add Skills & Charges</h2>

      <CategorySelector
        categories={categories}
        subcategories={availableSubcategories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategoryChange={e => setSelectedCategory(Number(e.target.value))}
        onSubcategoryChange={setSelectedSubcategory}
      />
      <input
        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Skills"
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

      <Button fullWidth onClick={handleSubmit}>Save Skills</Button>
    </div>
  );
};

export default AddSkillsScreen;
