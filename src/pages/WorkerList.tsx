import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBriefcase, IoAddCircle, IoSettingsOutline, IoCheckmarkCircle } from 'react-icons/io5';

import { getWorkerWithSkills } from "../services/api.service";

interface WorkerSkill {
    _id: string;
    workerId: string;
    userId: string;
    category: string[];
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: 'hour' | 'day' | 'fixed';
    isActive?: boolean;
}

const getCategoryEmoji = (category: string | string[]) => {
    const map: Record<string, string> = {
        'Home Services': '🏠',
        'Cleaning': '🧹',
        'Plumbing': '🔧',
        'Electrical': '⚡',
        'Electrician': '⚡',
        'Carpentry': '🪚',
        'Painting': '🎨',
        'Beauty & Wellness': '💆',
        'Beauty': '💄',
        'Salons': '💇',
        'Salon': '💇',
        'Makeup Artists': '💄',
        'Spa': '🧖',
        'Fitness': '💪',
        'Teaching': '📚',
        'Technology': '💻',
        'Transportation': '🚗',
        'Food & Catering': '🍽️',
        'Healthcare': '⚕️',
        'Pet Care': '🐾',
        'Events': '🎉',
        'Repair': '🔨',
    };

    const str = Array.isArray(category) ? category[0] : category;
    if (!str) return '🔧';
    const key = Object.keys(map).find(k => str.toLowerCase().includes(k.toLowerCase()));
    return key ? map[key] : '🔧';
};

const WorkerList: React.FC = () => {
    const navigate = useNavigate();

    const [workerSkills, setWorkerSkills] = useState<WorkerSkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [workerId, setWorkerId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [hasValidWorkerProfile, setHasValidWorkerProfile] = useState(false);

    const validateWorkerProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const userDataStr =
                localStorage.getItem('user_data') ||
                localStorage.getItem('@user_data') ||
                localStorage.getItem('@app_user_data');
            if (!userDataStr) return setHasValidWorkerProfile(false);

            const userData = JSON.parse(userDataStr);
            const userId = userData.id || userData._id || userData.userId;
            setCurrentUserId(userId);

            const storedWorkerId = localStorage.getItem('@worker_id');
            if (!storedWorkerId) return setHasValidWorkerProfile(false);

            const workerData = await getWorkerWithSkills(storedWorkerId);
            if (workerData?.worker?.userId === userId) {
                setWorkerId(storedWorkerId);
                setHasValidWorkerProfile(true);
                fetchWorkerSkills(storedWorkerId);
            } else {
                localStorage.removeItem('@worker_id');
                setHasValidWorkerProfile(false);
            }
        } catch (err) {
            console.error(err);
            setHasValidWorkerProfile(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        validateWorkerProfile();
    }, [validateWorkerProfile]);

    const fetchWorkerSkills = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await getWorkerWithSkills(id);
            setWorkerSkills(res?.workerSkills || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = () => navigate('/add-skill');
    const handleEditSkill = (skill: WorkerSkill) => navigate(`/edit-skill/${skill._id}`);

    if (!hasValidWorkerProfile) return null;

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="loader mb-4"></div>
                <span className="text-gray-500">Loading your skills...</span>
            </div>
        );

    return (
        <div className="bg-gray-50 py-4 border-b border-gray-200">
            {/* Header */}
            <div className="px-6 mb-4">
                <div className="flex items-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                        {React.createElement(IoBriefcase as any, { size: 24, color: "white" })}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">My Skills</h2>
                        <p className="text-sm text-gray-500">Tap to view details</p>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-100 text-indigo-600 text-sm">
                        Manage All {React.createElement(IoSettingsOutline as any, { size: 16 })}
                    </button>
                </div>
                <div className="flex items-center bg-green-100 px-3 py-1 rounded gap-1 w-max">
                    {React.createElement(IoCheckmarkCircle as any, { size: 20, color: "#16a34a" })}
                    <span className="text-green-800 text-sm">
                        You have <span className="font-bold">{workerSkills.length}</span> verified skill{workerSkills.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Skills Scroll */}
            <div className="px-6 overflow-x-auto flex gap-4">
                {workerSkills.map(skill => (
                    <div
                        key={skill._id}
                        className="bg-white rounded-xl border border-gray-200 p-4 min-w-[200px] flex flex-col items-center shadow"
                    >
                        <span className="text-3xl">{getCategoryEmoji(skill.category)}</span>
                        <h3 className="font-bold mt-2">{skill.subCategory}</h3>
                        <p className="text-sm text-gray-500">{skill.category[0]}</p>
                        <p className="mt-1 font-semibold">${skill.serviceCharge} / {skill.chargeType}</p>
                        <button
                            onClick={() => handleEditSkill(skill)}
                            className="mt-2 px-2 py-1 rounded bg-blue-600 text-white text-sm"
                        >
                            Edit
                        </button>
                    </div>
                ))}

                {/* Add New Skill Card */}
                <div
                    className="min-w-[200px] border-2 border-dashed border-blue-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer"
                    onClick={handleAddSkill}
                >
                    {React.createElement(IoAddCircle as any, { size: 40, color: "#2563eb" })}
                    <h3 className="font-bold mt-2 text-blue-600 text-center">Add New Skill</h3>
                    <p className="text-gray-500 text-sm text-center">Expand services</p>
                </div>
            </div>
        </div>
    );
};

export default WorkerList;