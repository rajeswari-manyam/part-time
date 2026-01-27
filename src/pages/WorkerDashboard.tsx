import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkerWithSkills } from "../services/api.service";
import { useAuth } from "../context/AuthContext";

const WorkerDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?._id) return;

        const fetchSkills = async () => {
            try {
                console.log("Fetching worker with skills for ID:", user._id);
                const res = await getWorkerWithSkills(user._id);
                console.log("Worker with skills response:", res);

                if (res?.workerSkills) {
                    setSkills(res.workerSkills);
                } else {
                    // If no skills, redirect to add skills page
                    navigate("/add-skills");
                }
            } catch (err) {
                console.error("Error fetching skills:", err);
                navigate("/add-skills");
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
        // Only run once per user
    }, [user?._id, navigate]);

    if (loading) return <p>Loading your dashboard...</p>;

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">My Skills</h1>

            {skills.length === 0 ? (
                <p>No skills added yet. Add your first skill!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map(skill => (
                        <div key={skill._id} className="p-4 bg-white rounded-xl shadow">
                            <h2 className="font-semibold text-lg">{skill.skill}</h2>
                            <p className="text-gray-600">
                                {skill.category} / {skill.subCategory}
                            </p>
                            <p className="text-green-600 mt-2">
                                ₹{skill.serviceCharge} / {skill.chargeType}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                onClick={() => navigate("/add-skills")}
            >
                + Add New Skill
            </button>
        </div>
    );
};

export default WorkerDashboard;
