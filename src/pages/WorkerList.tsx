import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import typography from "../styles/typography";
import { getWorkerWithSkills, WorkerListItem } from "../services/api.service";

const WorkerList: React.FC = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState<WorkerListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            // Here we fetch worker dynamically by userId stored in localStorage
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const data = await getWorkerWithSkills(userId); // Returns worker object or null if not created
            if (data?.worker) {
                setWorkers([{
                    _id: data.worker._id,
                    name: data.worker.name,
                    profilePic: data.worker.profilePic || "",
                    images: data.worker.images || [],        // <-- added
                    skills: data.worker.skills || [],
                    categories: data.worker.categories?.flat() || [],
                    subCategories: data.worker.subCategories || [], // <-- added
                    area: data.worker.area || "",
                    city: data.worker.city || "",
                    state: data.worker.state || "",          // <-- added
                    pincode: data.worker.pincode || "",     // <-- added
                    serviceCharge: data.worker.serviceCharge || 0,
                    chargeType: data.worker.chargeType || "fixed",
                    totalSkills: data.totalSkills || 0,
                }]);
            } else {
                setWorkers([]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className={`${typography.heading.h2} mb-8`}>
                Worker Profile
            </h1>

            {workers.length === 0 ? (
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/worker-profile")}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-500"
                    >
                        Create Profile
                    </button>
                </div>
            ) : (
                workers.map(worker => (
                    <div key={worker._id} className="bg-white p-6 rounded-2xl shadow mb-6">
                        <h2 className="text-lg font-semibold">{worker.name}</h2>
                        {worker.skills.length > 0 ? (
                            <p>Skills: {worker.skills.join(", ")}</p>
                        ) : (
                            <p>No skills added yet</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default WorkerList;
