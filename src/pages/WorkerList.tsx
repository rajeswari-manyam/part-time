import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoBriefcase,
    IoAddCircle,
    IoSettingsOutline,
    IoCheckmarkCircle
} from 'react-icons/io5';

import { getWorkerWithSkills } from "../services/api.service";

interface WorkerSkill {
    _id: string;
    category: string[];
    subCategory: string;
    serviceCharge: number;
    chargeType: 'hour' | 'day' | 'fixed';
}

const getCategoryEmoji = (category: string[]) => {
    const map: Record<string, string> = {
        Cleaning: '🧹',
        Plumbing: '🔧',
        Electrical: '⚡',
        Carpentry: '🪚',
        Painting: '🎨',
        Beauty: '💄',
        Fitness: '💪',
        Teaching: '📚',
        Technology: '💻',
        Transportation: '🚗',
        Healthcare: '⚕️',
    };

    const key = category?.[0];
    return map[key] || '🔧';
};

const WorkerList: React.FC = () => {
    const navigate = useNavigate();

    const [skills, setSkills] = useState<WorkerSkill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const workerId =
            localStorage.getItem("workerId") ||
            localStorage.getItem("@worker_id");

        if (!workerId) {
            setLoading(false);
            return;
        }

        const fetchSkills = async () => {
            try {
                const res = await getWorkerWithSkills(workerId);
                setSkills(res?.workerSkills || []);
            } catch (err) {
                console.error("Failed to load skills", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const handleCardClick = (skillId: string) => {
        navigate(`/worker-details/${skillId}`);
    };

    const handleEditClick = (e: React.MouseEvent, skillId: string) => {
        e.stopPropagation(); // Prevent card click from firing
        navigate(`/edit-skill/${skillId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <span className="text-gray-500">Loading your skills...</span>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-4 border-b border-gray-200">
            {/* Header */}
            <div className="px-6 mb-4">
                <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                        {IoBriefcase({ size: 22, color: "white" }) as React.ReactElement}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold">My Skills</h2>
                        <p className="text-sm text-gray-500">Manage your services</p>
                    </div>

                    <button className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-100 text-indigo-600 text-sm">
                        Manage {IoSettingsOutline({ size: 16 }) as React.ReactElement}
                    </button>
                </div>

                <div className="flex items-center bg-green-100 px-3 py-1 rounded gap-1 w-max">
                    {IoCheckmarkCircle({ size: 18, color: "#16a34a" }) as React.ReactElement}
                    <span className="text-sm text-green-800">
                        {skills.length} active skill{skills.length !== 1 && 's'}
                    </span>
                </div>
            </div>

            {/* Skill Cards */}
            <div className="px-6 flex gap-4 overflow-x-auto pb-4">
                {skills.map(skill => (
                    <div
                        key={skill._id}
                        onClick={() => handleCardClick(skill._id)}
                        className="min-w-[200px] bg-white border rounded-xl p-4 text-center shadow cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <span className="text-3xl">{getCategoryEmoji(skill.category)}</span>
                        <h3 className="font-bold mt-2">{skill.subCategory}</h3>
                        <p className="text-gray-500 text-sm">{skill.category[0]}</p>
                        <p className="mt-1 font-semibold">
                            ₹{skill.serviceCharge} / {skill.chargeType}
                        </p>

                        <button
                            onClick={(e) => handleEditClick(e, skill._id)}
                            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                            Edit
                        </button>
                    </div>
                ))}

                {/* Add Skill */}
                <div
                    onClick={() => navigate('/add-skills')}
                    className="min-w-[200px] border-2 border-dashed border-blue-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                >
                    {IoAddCircle({ size: 40, color: "#2563eb" }) as React.ReactElement}
                    <p className="font-bold text-blue-600 mt-2">Add Skill</p>
                </div>
            </div>
        </div>
    );
};

export default WorkerList;