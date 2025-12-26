import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchedWorkersProps } from '../types/MatchedWorkers';
import Filters from "../components/cards/FilterCard";
import WorkerCard from "../components/cards/WorkerCard";
import { ArrowLeft } from "lucide-react";

const MatchedWorkers: React.FC = () => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('distance');
    const [filterBy, setFilterBy] = useState('5+ years');

    const workers: MatchedWorkersProps[] = [
        { id: 1, name: 'Ramesh Kumar', initials: 'RK', rating: 4.9, reviews: 58, distance: '1.5 km', price: '₹550/hr', experience: '10 years experience' },
        { id: 2, name: 'Suresh Kumar', initials: 'SK', rating: 4.7, reviews: 42, distance: '2.8 km', price: '₹650/hr', experience: '8 years experience' },
        { id: 3, name: 'Amit Sharma', initials: 'AS', rating: 4.8, reviews: 65, distance: '3.2 km', price: '₹600/hr', experience: '12 years experience' },
        { id: 4, name: 'Vijay Singh', initials: 'VS', rating: 4.6, reviews: 38, distance: '4.1 km', price: '₹500/hr', experience: '7 years experience' },
    ];

    const handleViewProfile = (workerId: number) => {
        navigate(`/worker-profile/${workerId}`);
    };

    const handleNewJobPost = () => {
        navigate('/user-profile');
    };

    return (
        <div className="h-screen bg-white flex flex-col max-w-2xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center px-4 py-3 border-b">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-lg font-semibold">Matched Workers</h1>
            </div>

            <Filters
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                workerCount={workers.length}
                onNewJobPost={handleNewJobPost}
            />

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {workers.map((worker) => (
                    <WorkerCard key={worker.id} worker={worker} onViewProfile={handleViewProfile} />
                ))}
            </div>
        </div>
    );
};

export default MatchedWorkers;
