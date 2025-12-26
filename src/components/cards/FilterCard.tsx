import React from 'react';
import typography, { combineTypography } from '../../styles/typography';
import Button from '../ui/Buttons';

interface FiltersProps {
    sortBy: string;
    setSortBy: (value: string) => void;
    filterBy: string;
    setFilterBy: (value: string) => void;
    workerCount: number;
    onNewJobPost?: () => void;
}

const Filters: React.FC<FiltersProps> = ({
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    workerCount,
    onNewJobPost
}) => {
    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className={combineTypography(typography.heading.h2, "text-gray-900")}>
                    Filter & Sort Workers
                </h2>

                {/* Post New Job Button - Always visible */}
                <Button  
                    onClick={onNewJobPost}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post New Job
                </Button>
            </div>

            <div className="flex gap-4 mb-6">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                >
                    <option value="distance">Sort by Distance</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="price">Sort by Price</option>
                </select>

                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
                >
                    <option value="5+ years">5+ Years Experience</option>
                    <option value="3+ years">3+ Years Experience</option>
                    <option value="all">All Experience</option>
                </select>
            </div>

            <h3 className={combineTypography(typography.heading.h4, "text-gray-900 mb-4")}>
                {workerCount} Workers Available
            </h3>

            {/* Show additional message if no workers match */}
            {workerCount === 0 && (
                <p className="text-gray-600 text-sm mt-2">
                    No workers found matching your criteria. Create a new job posting to reach more workers.
                </p>
            )}
        </div>
    );
};

export default Filters;