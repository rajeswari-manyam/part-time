import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import typography from "../styles/typography";

interface Worker {
    _id: string;
    name: string;
    email?: string;
    bio?: string;
    skills?: string;
    category: string;
    subCategories?: string;
    serviceCharge: number;
    chargeType: "hour" | "day" | "fixed";
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    profilePic?: string;
    images?: string[];
}

const WorkersList: React.FC = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch("http://192.168.1.13:3000/getAllWorkers", {
                    method: "GET",
                    redirect: "follow",
                });
                const data = await response.json();

                if (data.success && Array.isArray(data.data)) {
                    setWorkers(data.data);
                } else {
                    setError(data.message || "Failed to fetch workers");
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading workers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center">
                <p className="text-red-500 mb-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className={`${typography.heading.h2} text-center mb-8`}>All Workers</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map((worker) => (
                    <div key={worker._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                        {/* Profile Photo */}
                        {worker.profilePic && (
                            <img
                                src={worker.profilePic}
                                alt={worker.name}
                                className="w-24 h-24 rounded-full object-cover mx-auto"
                            />
                        )}

                        <h2 className="text-lg font-semibold text-gray-800 text-center">{worker.name}</h2>
                        <p className="text-sm text-gray-600 text-center">{worker.category}</p>
                        {worker.subCategories && (
                            <p className="text-sm text-gray-500 text-center">Sub: {worker.subCategories}</p>
                        )}

                        {worker.skills && (
                            <p className="text-sm text-gray-700 text-center">
                                Skills: {worker.skills}
                            </p>
                        )}

                        <p className="text-sm text-gray-600 text-center">
                            Location: {worker.area}, {worker.city}
                        </p>

                        <p className="text-sm text-gray-600 text-center">
                            Charge: ₹{worker.serviceCharge} / {worker.chargeType}
                        </p>

                        {/* Button to navigate to worker profile */}
                        <button
                            onClick={() => navigate("/worker-profile")}
                            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition"
                        >
                            Post Skills
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkersList;
