import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Trash2, Edit, Search, Loader2 } from 'lucide-react';
import { getAllJobs, deleteJob } from '../services/api.service';
import Categories from "../../src/data/categories.json";

interface Job {
    _id: string;
    userId: string;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    images: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    locationString?: string;
}

interface ApiResponse {
    success: boolean;
    count: number;
    data: Job[];
}

const AllJobs: React.FC = () => {
    const [apiData, setApiData] = useState<ApiResponse>({ success: true, count: 0, data: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [locationCache, setLocationCache] = useState<{ [key: string]: string }>({});
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

    useEffect(() => {
        fetchAllJobs();
    }, []);

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
                        const processedImages = (job.images || []).map((img: string) => {
                            if (img.startsWith('http://') || img.startsWith('https://')) {
                                return img;
                            }
                            const cleanPath = img.replace(/\\/g, '/');
                            const path = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
                            return `http://192.168.1.6:3000/${path}`;
                        });

                        return {
                            ...job,
                            images: processedImages,
                            locationString: await getLocationFromCoordinates(job.latitude, job.longitude)
                        };
                    })
                );

                if (jobsWithDetails.length > 0) {
                    console.log('Sample job images:', jobsWithDetails[0].images);
                }

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

    const handleDeleteJob = async (jobId: string, jobTitle: string) => {
        if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
            return;
        }

        try {
            setDeletingJobId(jobId);
            console.log('🗑️ Deleting job:', jobId);

            const response = await deleteJob(jobId);
            console.log('✅ Delete response:', response);

            await fetchAllJobs();

            console.log('✅ Job deleted successfully');
        } catch (error) {
            console.error('❌ Error deleting job:', error);
            setError('Failed to delete job. Please try again.');

            setTimeout(() => setError(null), 3000);
        } finally {
            setDeletingJobId(null);
        }
    };

    const categories = ['all', ...Categories.categories.map((cat) => cat.name)];

    const filteredJobs = apiData.data.filter(job => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === 'all' || job.category.trim() === filterCategory;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header & Search */}
                <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Listed Jobs</h1>
                        <p className="text-gray-600">Manage and view all your job postings</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={fetchAllJobs}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Search className="w-4 h-4" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">
                            {apiData.count === 0 ? 'No jobs have been posted yet' : 'Try adjusting your search or filters'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job: Job) => (
                            <div key={job._id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                                {/* Images */}
                                {job.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-1">
                                        {job.images.map((img: string, idx: number) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={job.title}
                                                className="w-full h-32 object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src =
                                                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Job Content */}
                                <div className="p-4">
                                    {/* Category Badge */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {(() => {
                                            const category = getCategoryDetails(job.category);
                                            return (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {category.icon} {category.name}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    {/* Job Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>

                                    {/* Job Description */}
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>

                                    {/* Location and Date */}
                                    <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{job.locationString}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(job.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => console.log('Edit', job._id)}
                                            className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id, job.title)}
                                            disabled={deletingJobId === job._id}
                                            className="flex-1 px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
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