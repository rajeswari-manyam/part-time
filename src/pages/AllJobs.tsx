import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, Trash2, Edit, Search, Loader2, TrendingUp } from 'lucide-react';
import { getAllJobs, deleteJob } from '../services/api.service';
import Categories from "../../src/data/categories.json";

interface Job {
    _id: string;
    userId: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
    locationString?: string;
}

interface ApiResponse {
    success: boolean;
    count: number;
    data: Job[];
}

// Image base URL - update this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const AllJobs: React.FC = () => {
    const navigate = useNavigate();
    const [apiData, setApiData] = useState<ApiResponse>({ success: true, count: 0, data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [locationCache, setLocationCache] = useState<{ [key: string]: string }>({});
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

    // Helper function to format image URL
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        // Remove leading slash if present and normalize backslashes
        const cleanPath = imagePath.replace(/^\//, '').replace(/\\/g, '/');
        return `${API_BASE_URL}/${cleanPath}`;
    };

    useEffect(() => {
        fetchAllJobs();
    }, []);

    const buildLocationFromBackend = (job: Job) => {
        return [job.area, job.city, job.state, job.pincode].filter(Boolean).join(', ');
    };

    const getLocationFromCoordinates = async (lat: number, lng: number): Promise<string> => {
        const cacheKey = `${lat},${lng}`;
        if (locationCache[cacheKey]) return locationCache[cacheKey];

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
            const data = await res.json();
            if (data && data.address) {
                const addr = data.address;
                const parts = [
                    addr.city || addr.town || addr.village || '',
                    addr.county || addr.state_district || '',
                    addr.state || '',
                    addr.postcode || ''
                ].filter(Boolean);
                const locationString = parts.join(', ');
                setLocationCache(prev => ({ ...prev, [cacheKey]: locationString }));
                return locationString;
            }
        } catch (err) {
            console.error('Error fetching location:', err);
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    const fetchAllJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllJobs();

            if (response.success) {
                const jobsWithDetails: Job[] = await Promise.all(
                    response.data.map(async (job: Job) => {
                        const backendLocation = buildLocationFromBackend(job);

                        return {
                            ...job,
                            locationString:
                                backendLocation ??
                                (job.latitude && job.longitude
                                    ? await getLocationFromCoordinates(job.latitude, job.longitude)
                                    : "Location not available")
                        };
                    })
                );

                setApiData({ ...response, data: jobsWithDetails });
            } else {
                setError('Failed to fetch jobs');
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const thresholds: { limit: number; label: (d: number) => string }[] = [
            { limit: 0, label: () => 'Today' },
            { limit: 1, label: () => 'Yesterday' },
            { limit: 7, label: (d) => `${d} days ago` },
            { limit: 30, label: (d) => `${Math.floor(d / 7)} weeks ago` },
            { limit: Infinity, label: (d) => `${Math.floor(d / 30)} months ago` }
        ];

        const threshold = thresholds.find(t => diffDays <= t.limit);
        return threshold ? threshold.label(diffDays) : '';
    };

    const getCategoryDetails = (name: string) => {
        return Categories.categories.find(c => c.name === name) || { name, icon: '' };
    };

    const handleDeleteJob = async (jobId: string, categoryName: string) => {
        if (!window.confirm(`Are you sure you want to delete this ${categoryName} job?`)) {
            return;
        }

        try {
            setDeletingJobId(jobId);
            const response = await deleteJob(jobId);
            await fetchAllJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job. Please try again.');
            setTimeout(() => setError(null), 3000);
        } finally {
            setDeletingJobId(null);
        }
    };

    const categories = ['all', ...Categories.categories.map((cat) => cat.name)];

    const filteredJobs = apiData.data.filter(job => {
        const matchesSearch =
            (job.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (job.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === 'all' || (job.category?.trim() || '') === filterCategory;
        return matchesSearch && matchesFilter;
    });

    const activeJobsCount = apiData.count;
    const thisMonthCount = apiData.data.filter(job => {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
    }).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-800 mb-4">{error}</p>
                    <button
                        onClick={fetchAllJobs}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Tabs and Stats */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        {/* Tabs */}
                        <div className="flex gap-2">

                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="mb-6 flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={fetchAllJobs}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Refresh
                    </button>
                </div>

                {/* Job Cards */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">
                            {apiData.count === 0 ? 'No jobs have been posted yet' : 'Try adjusting your search or filters'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredJobs.map((job: Job) => (
                            <div key={job._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {getCategoryDetails(job.category).name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{getCategoryDetails(job.category).name}</span>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            available
                                        </span>
                                    </div>

                                    {/* Job Image */}
                                    {job.images && job.images.length > 0 && (
                                        <div className="mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                src={getImageUrl(job.images[0])}
                                                alt={job.category}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {job.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(() => {
                                            const category = getCategoryDetails(job.category);
                                            return (
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                                    {category.icon} {category.name}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="truncate max-w-[200px]">{job.locationString || 'Remote'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(job.createdAt)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/job-details/${job._id}`)}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => console.log('Edit', job._id)}
                                            className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2 font-medium"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id, getCategoryDetails(job.category).name)}
                                            disabled={deletingJobId === job._id}
                                            className="flex-1 px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                        >
                                            {deletingJobId === job._id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllJobs;