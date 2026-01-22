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
import { ArrowLeft, Trash2 } from "lucide-react";

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
          const skill = response.workerSkill;

          // Find category ID from category name
          const categoryName = skill.category[0];
          const category = categories.find((c) => c.name === categoryName);
          
          if (category) {
            setSelectedCategory(category.id);
          }

          setSelectedSubcategory(skill.subCategory);
          setSkills(skill.skill);
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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading skill data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold ml-4">Edit Skill</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
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
            onCategoryChange={(e) => setSelectedCategory(Number(e.target.value))}
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
            onVoiceClick={() => {}}
            isListening={false}
          />

          <div className="space-y-3 mt-6">
            <Button fullWidth onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Skill"}
            </Button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete Skill
            </button>

            <button
              onClick={() => navigate("/home")}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSkillScreen;