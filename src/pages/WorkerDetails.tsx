import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Phone, MessageCircle, Briefcase, ArrowLeft, MapPin, Mail, Calendar } from 'lucide-react';
import Button from '../components/ui/Buttons';
import typography, { combineTypography } from '../styles/typography';
import BudgetIcon from "../assets/icons/Budget.png";
import { getWorkerById, Worker, API_BASE_URL } from '../services/api.service';

const WorkerDetails: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [worker, setWorker] = useState<Worker | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchWorker = async () => {
            try {
                setLoading(true);
                const response = await getWorkerById(id);
                if (response.success) {
                    console.log("Worker data:", response.data);
                    setWorker(response.data);
                } else {
                    setError("Worker not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch worker details");
            } finally {
                setLoading(false);
            }
        };

        fetchWorker();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading worker details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    if (!worker) {
        return (
            <div className="text-center mt-10">
                <p className="text-gray-500 mb-4">Worker not found</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    // Generate initials from name
    const initials = worker.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    // Get profile picture URL
    const profilePicUrl = worker.profilePic
        ? (worker.profilePic.startsWith('http')
            ? worker.profilePic
            : `${API_BASE_URL}${worker.profilePic}`)
        : null;

    // Format date
    const memberSince = new Date(worker.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    // Handle phone number for call button
    const getPhoneNumber = () => {
        // Try to get phone from userId if it's a phone number
        // Otherwise, use email or show a message
        if (worker.userId && /^\d+$/.test(worker.userId)) {
            return worker.userId;
        }
        return worker.email || '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className={combineTypography(typography.heading.h4, "ml-4 text-gray-800")}>
                        Worker Profile
                    </h1>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                    <div className="flex flex-col items-center">
                        {/* Profile Picture */}
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-xl border-4 border-blue-100">
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl}
                                    alt={worker.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        const parent = target.parentElement;
                                        if (parent) {
                                            target.style.display = 'none';
                                            parent.className = 'w-32 h-32 rounded-full overflow-hidden mb-4 shadow-xl border-4 border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center';
                                            parent.innerHTML = `<span class="text-white text-4xl font-bold">${initials}</span>`;
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                    <span className="text-white text-4xl font-bold">{initials}</span>
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <h1 className={combineTypography(typography.heading.h3, "text-gray-800 mb-2")}>
                            {worker.name}
                        </h1>

                        {/* Status Badge */}
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold mb-3 ${worker.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                            }`}>
                            {worker.isActive ? '✓ Available' : 'Currently Unavailable'}
                        </span>

                        {/* Email */}
                        {worker.email && (
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Mail className="w-4 h-4" />
                                <span className={typography.body.base}>{worker.email}</span>
                            </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className={typography.body.base}>
                                {worker.area}, {worker.city}, {worker.state} - {worker.pincode}
                            </span>
                        </div>

                        {/* Member Since */}
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {memberSince}</span>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>
                        Service Categories
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {Array.isArray(worker.category) ? (
                            worker.category.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className={combineTypography(
                                        typography.body.base,
                                        "px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                                    )}
                                >
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className={combineTypography(
                                typography.body.base,
                                "px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                            )}>
                                {worker.category}
                            </span>
                        )}
                    </div>
                </div>

                {/* Sub-Categories Section */}
                {worker.subCategories && Array.isArray(worker.subCategories) && worker.subCategories.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                        <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>
                            Specializations
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {worker.subCategories.map((sub, idx) => (
                                <span
                                    key={idx}
                                    className={combineTypography(
                                        typography.body.base,
                                        "px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium"
                                    )}
                                >
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bio Section */}
                {worker.bio && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                        <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>
                            About
                        </h2>
                        <p className={combineTypography(typography.body.base, "text-gray-600 leading-relaxed")}>
                            {worker.bio}
                        </p>
                    </div>
                )}

                {/* Skills Section */}
                {worker.skills && Array.isArray(worker.skills) && worker.skills.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                        <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>
                            Skills & Expertise
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {worker.skills.map((skill, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-700">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className={typography.body.base}>{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Service Rates */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-6")}>
                        Service Rates
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <img src={BudgetIcon} alt="Budget" className="w-6 h-6" />
                                <span className={combineTypography(typography.body.base, "font-medium text-gray-700")}>
                                    Charge Type
                                </span>
                            </div>
                            <span className={combineTypography(typography.body.large, "font-bold text-blue-700 capitalize")}>
                                {worker.chargeType}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <img src={BudgetIcon} alt="Budget" className="w-6 h-6" />
                                <span className={combineTypography(typography.body.base, "font-medium text-gray-700")}>
                                    Service Charge
                                </span>
                            </div>
                            <span className={combineTypography(typography.heading.h4, "font-bold text-green-700")}>
                                ₹{worker.serviceCharge.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Images Section - Only show if images exist */}
                {worker.images && Array.isArray(worker.images) && worker.images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                        <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>
                            Work Gallery
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {worker.images.map((img, idx) => {
                                const imageUrl = img.startsWith('http') ? img : `${API_BASE_URL}${img}`;
                                return (
                                    <img
                                        key={idx}
                                        src={imageUrl}
                                        alt={`Work ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                        onError={(e) => {
                                            // Hide broken images
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {getPhoneNumber() && (
                            <Button
                                size="lg"
                                className="flex items-center justify-center gap-3 w-full"
                                onClick={() => {
                                    const phone = getPhoneNumber();
                                    if (phone) {
                                        window.location.href = `tel:${phone}`;
                                    }
                                }}
                            >
                                <Phone className="w-5 h-5" /> Call Worker
                            </Button>
                        )}

                        <Button
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={() => navigate(`/chat/${worker._id}`)}
                        >
                            <MessageCircle className="w-5 h-5" /> Send Message
                        </Button>
                    </div>

                    <Button
                        variant="success"
                        size="lg"
                        className="flex items-center justify-center gap-3 w-full"
                        onClick={() => navigate(`/send-enquiry/${worker._id}`)}
                    >
                        <Briefcase className="w-5 h-5" /> Send Job Invitation
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WorkerDetails;