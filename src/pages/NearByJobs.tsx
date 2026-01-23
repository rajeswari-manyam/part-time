import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar, AlertCircle, Briefcase, MapPin, Clock, DollarSign, Loader2 } from 'lucide-react';
import { getNearbyJobs, getJobById } from "../services/api.service";

// Type matching your API response
interface Job {
  _id: string;
  userId: string;
  description: string;
  category: string;
  subcategory: string;
  jobType: 'FULL_TIME' | 'PART_TIME';
  servicecharges: string;
  startDate: string;
  endDate: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  distance?: string;
}

type TabType = 'matched' | 'invitations' | 'my-jobs';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    role="tab"
    aria-selected={active}
    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${active
      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
  >
    {label}
    {count !== undefined && (
      <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-slate-100'
        }`}>
        {count}
      </span>
    )}
  </button>
);

const JobCard: React.FC<{
  job: Job;
  onViewDetails: (id: string) => void;
  onAccept?: (id: string) => void;
  showAcceptButton?: boolean;
}> = ({
  job,
  onViewDetails,
  onAccept,
  showAcceptButton = false
}) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const isUrgent = useMemo(() => {
      const startDate = new Date(job.startDate);
      const today = new Date();
      const diffDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }, [job.startDate]);

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:scale-[1.02]">
        {job.images && job.images.length > 0 ? (
          <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
            <img
              src={`${process.env.REACT_APP_API_BASE_URL || 'http://13.204.29.0:3001'}${job.images[0]}`}
              alt={job.category}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><Briefcase class="w-16 h-16 text-slate-300" /></div>`;
                }
              }}
            />
            {isUrgent && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Urgent
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
            <Briefcase className="w-16 h-16 text-slate-300" />
            {isUrgent && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Urgent
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {job.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${job.jobType === 'FULL_TIME'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
                  }`}>
                  {job.jobType.replace('_', ' ')}
                </span>
                {job.distance && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {parseFloat(job.distance).toFixed(1)} km away
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {job.subcategory || job.category}
              </h3>
              <p className="text-slate-600 line-clamp-2">{job.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm truncate">{job.city}, {job.state}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm font-semibold">₹{job.servicecharges}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-sm">{formatDate(job.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Briefcase className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm truncate">{job.area}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onViewDetails(job._id)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              View Details
            </button>
            {showAcceptButton && onAccept && (
              <button
                onClick={() => onAccept(job._id)}
                className="px-4 py-2.5 border-2 border-green-500 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300"
              >
                BookNow
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

interface NearByJobsProps {
  initialTab?: TabType;
  onJobAccept?: (jobId: string) => void;
  currentUserId?: string;
  // NEW: Accept selected location from parent
  selectedLocation?: { latitude: number; longitude: number; city: string } | null;
}

const NearByJobs: React.FC<NearByJobsProps> = ({
  initialTab = 'matched',
  onJobAccept,
  currentUserId,
  selectedLocation, // NEW
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptedJobs, setAcceptedJobs] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // NEW: Use selected location if provided, otherwise get current location
  useEffect(() => {
    if (selectedLocation) {
      // Use the location from LocationSelector
      setUserLocation({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      return;
    }

    // Otherwise, get current device location
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    };

    getUserLocation();
  }, [selectedLocation]); // Re-run when selectedLocation changes

  // Fetch nearby jobs when location is available
  useEffect(() => {
    if (!userLocation) return;

    const fetchNearbyJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getNearbyJobs(
          userLocation.latitude,
          userLocation.longitude
        );

        if (result.success && Array.isArray(result.jobs)) {
          const jobDetailsPromises = result.jobs.map(async (job: any) => {
            try {
              const fullJobData = await getJobById(job._id);
              return {
                ...fullJobData.data,
                distance: job.distance
              };
            } catch (error) {
              console.error(`Failed to fetch job ${job._id}:`, error);
              return null;
            }
          });

          const fullJobs = await Promise.all(jobDetailsPromises);
          const validJobs = fullJobs.filter(job => job !== null) as Job[];

          setJobs(validJobs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load nearby jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyJobs();
  }, [userLocation]);

  const handleJobView = useCallback((jobId: string) => {
    navigate(`/jobs/${jobId}`);
  }, [navigate]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const handleAccept = useCallback((jobId: string) => {
    navigate(`/booknow/${jobId}`);
  }, [navigate]);

  const filteredJobs = useMemo(() => {
    switch (activeTab) {
      case 'matched':
        return jobs.filter(job =>
          job.userId !== currentUserId &&
          !acceptedJobs.has(job._id)
        );

      case 'invitations':
        return jobs.filter(job => acceptedJobs.has(job._id));

      case 'my-jobs':
        return currentUserId
          ? jobs.filter(job => job.userId === currentUserId)
          : [];

      default:
        return jobs;
    }
  }, [jobs, activeTab, currentUserId, acceptedJobs]);

  const stats = useMemo(() => {
    const now = new Date();
    const allMatchedJobs = jobs.filter(job => job.userId !== currentUserId);

    return {
      matched: allMatchedJobs.length,
      invitations: acceptedJobs.size,
      myJobs: currentUserId ? jobs.filter(j => j.userId === currentUserId).length : 0,
      thisMonth: jobs.filter((j) => {
        const jobDate = new Date(j.createdAt);
        return jobDate.getMonth() === now.getMonth() &&
          jobDate.getFullYear() === now.getFullYear();
      }).length
    };
  }, [jobs, currentUserId, acceptedJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Display selected location */}
        {selectedLocation && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              📍 Showing jobs near: <span className="font-semibold">{selectedLocation.city}</span>
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <nav className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 inline-flex" role="tablist">
            <TabButton
              active={activeTab === 'matched'}
              onClick={() => handleTabChange('matched')}
              label="Matched Jobs"
              count={stats.matched}
            />
            <TabButton
              active={activeTab === 'invitations'}
              onClick={() => handleTabChange('invitations')}
              label="Invitations"
              count={stats.invitations}
            />
            <TabButton
              active={activeTab === 'my-jobs'}
              onClick={() => handleTabChange('my-jobs')}
              label="My Jobs"
              count={stats.myJobs}
            />
          </nav>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Active Jobs</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{filteredJobs.length}</span>
            </button>
            <button className="px-5 py-2.5 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>This Month</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-full text-sm">{stats.thisMonth}</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 text-lg">
              {!userLocation ? "Getting your location..." : "Loading jobs..."}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 text-lg font-semibold mb-2">Error Loading Jobs</p>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onViewDetails={handleJobView}
                  onAccept={handleAccept}
                  showAcceptButton={activeTab === 'matched'}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-semibold">
                  {activeTab === 'matched' && 'No matched jobs available'}
                  {activeTab === 'invitations' && 'No invitations yet'}
                  {activeTab === 'my-jobs' && 'You haven\'t posted any jobs'}
                </p>
                <p className="text-slate-400 mt-2">
                  {activeTab === 'matched' && 'Check back later for new opportunities'}
                  {activeTab === 'invitations' && 'Accept jobs from the Matched Jobs tab'}
                  {activeTab === 'my-jobs' && 'Create your first job posting'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default NearByJobs;