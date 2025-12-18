// ServiceMarketplace.tsx - Main marketplace component

import React, { useState, useCallback, useMemo } from 'react';
import { ServiceMarketplaceProps, TabType, Job } from '../types/Job';
import { generateSampleJobs } from '../components/data/SimpleData';
import JobCard from '../components/cards/JobCard';
import { Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        role="tab"
        aria-selected={active}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${active
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
    >
        {label}
    </button>
);

const ServiceMarketplace: React.FC<ServiceMarketplaceProps> = ({
    initialTab = "matched",
    jobs: providedJobs,
    onJobAccept,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    const jobs = useMemo(
        () => providedJobs || generateSampleJobs(),
        [providedJobs]
    );

    const handleJobView = useCallback((jobId: string) => {
        navigate(`/jobs/${jobId}`);
    }, [navigate]);

    // Memoized tab change handler
    const handleTabChange = useCallback((tab: TabType) => {
        setActiveTab(tab);
    }, []);

    // Statistics for header
    const stats = useMemo(() => ({
        activeJobs: jobs.filter((j: Job) => j.status === 'available').length,
        thisMonth: jobs.filter((j: Job) => {
            const jobDate = new Date(j.postedAt);
            const now = new Date();
            return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
        }).length
    }), [jobs]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header with Stats and Tabs */}
                <div className="flex items-center justify-between mb-6">
                    {/* Tabs Navigation */}
                    <nav className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 inline-flex" role="tablist">
                        <TabButton
                            active={activeTab === 'matched'}
                            onClick={() => handleTabChange('matched')}
                            label={t("marketplace.tabs.matched")}
                        />
                        <TabButton
                            active={activeTab === 'invitations'}
                            onClick={() => handleTabChange('invitations')}
                            label={t("marketplace.tabs.invitations")}
                        />
                        <TabButton
                            active={activeTab === 'my-jobs'}
                            onClick={() => handleTabChange('my-jobs')}
                            label={t("marketplace.tabs.myJobs")}
                        />
                    </nav>

                    {/* Stats Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            aria-label={`${stats.activeJobs} active jobs`}
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span>{t("marketplace.stats.activeJobs")}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{stats.activeJobs}</span>
                        </button>
                        <button
                            className="px-5 py-2.5 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
                            aria-label={`${stats.thisMonth} jobs this month`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>{t("marketplace.stats.thisMonth")}</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-sm">{stats.thisMonth}</span>
                        </button>
                    </div>
                </div>
                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="list">
                    {jobs.length > 0 ? (
                        jobs.map((job: Job, index: number) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                index={index}
                                onViewDetails={handleJobView}
                                onAccept={onJobAccept}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12">
                            <p className="text-slate-500 text-lg">{t("marketplace.noJobs")}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ServiceMarketplace;