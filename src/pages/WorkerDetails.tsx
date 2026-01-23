import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Star,
    Phone,
    MessageCircle,
    Briefcase,
    ArrowLeft,
    MapPin,
    Calendar,
    Loader2
} from 'lucide-react';

import Button from '../components/ui/Buttons';
import typography, { combineTypography } from '../styles/typography';
import { getWorkerSkillById, WorkerSkillResponse } from '../services/api.service';

interface WorkerSkill {
    _id: string;
    userId: string;
    workerId: string;
    name: string;
    category: string[];
    subCategory: string;
    skill: string;
    serviceCharge: number;
    chargeType: 'hour' | 'day' | 'fixed';
    profilePic: string;
    images: string[];
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    createdAt: string;
}

const WorkerDetails: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [worker, setWorker] = useState<WorkerSkill | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkerDetails = async () => {
            if (!id) {
                setError('Worker ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await getWorkerSkillById(id);

                if (response.success && response.workerSkill) {
                    setWorker(response.workerSkill);
                } else {
                    setError('Failed to load worker details');
                }
            } catch (err: any) {
                console.error('Error fetching worker details:', err);
                setError(err.message || 'Failed to load worker details');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkerDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-blue-600 mx-auto mb-3 md:mb-4" />
                    <p className="text-sm md:text-base text-gray-600">Loading worker details...</p>
                </div>
            </div>
        );
    }

    if (error || !worker) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center max-w-md">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <span className="text-xl md:text-2xl">❌</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2">Error Loading Worker</h2>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{error || 'Worker not found'}</p>
                    <Button onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    /* ---------------- HELPERS ---------------- */
    const initials = worker.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    const memberSince = new Date(worker.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    const getPhoneNumber = () => worker.userId ?? '';

    // Get display image
    const displayImage = worker.profilePic || worker.images?.[0] || null;

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-3 md:p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center mb-4 md:mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white transition-colors"
                    >
                        <ArrowLeft size={20} className="md:w-6 md:h-6" />
                    </button>
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold ml-3 md:ml-4">
                        Worker Profile
                    </h1>
                </div>

                {/* Profile */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 text-center mb-4 md:mb-6">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={worker.name}
                            className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full object-cover mb-3 md:mb-4 border-4 border-blue-100"
                        />
                    ) : (
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                            {initials}
                        </div>
                    )}

                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                        {worker.name}
                    </h1>

                    <span className="inline-block px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold bg-green-100 text-green-700 mt-2">
                        ✓ Available
                    </span>

                    <div className="flex justify-center items-center gap-1.5 md:gap-2 text-gray-600 mt-3 text-sm md:text-base">
                        <MapPin size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                        <span className="text-center">
                            {worker.area}, {worker.city}, {worker.state} - {worker.pincode}
                        </span>
                    </div>

                    <div className="flex justify-center items-center gap-1.5 md:gap-2 text-gray-500 mt-2 text-xs md:text-sm">
                        <Calendar size={12} className="md:w-3.5 md:h-3.5" />
                        <span>Member since {memberSince}</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                        Service Categories
                    </h2>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {worker.category.map((cat, idx) => (
                            <span
                                key={idx}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm md:text-base"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Skills & Subcategory */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                        Skills & Specialization
                    </h2>
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-start gap-2 md:gap-3 p-3 bg-blue-50 rounded-lg">
                            <Star size={16} className="md:w-[18px] md:h-[18px] text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Subcategory</p>
                                <p className="text-gray-700 text-sm md:text-base">{worker.subCategory}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 md:gap-3 p-3 bg-green-50 rounded-lg">
                            <Briefcase size={16} className="md:w-[18px] md:h-[18px] text-green-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900 text-sm md:text-base">Primary Skill</p>
                                <p className="text-gray-700 text-sm md:text-base">{worker.skill}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rates */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                        Service Rates
                    </h2>

                    <div className="flex justify-between items-center p-3 md:p-4 bg-blue-50 rounded-xl mb-2 md:mb-3">
                        <span className="text-gray-700 text-sm md:text-base">Charge Type</span>
                        <strong className="capitalize text-blue-700 text-sm md:text-base">
                            {worker.chargeType === 'hour' ? 'Per Hour' :
                                worker.chargeType === 'day' ? 'Per Day' : 'Fixed'}
                        </strong>
                    </div>

                    <div className="flex justify-between items-center p-3 md:p-4 bg-green-50 rounded-xl">
                        <span className="text-gray-700 text-sm md:text-base">Service Charge</span>
                        <strong className="text-green-700 text-lg md:text-xl">₹{worker.serviceCharge}</strong>
                    </div>
                </div>

                {/* Location Details */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                        Location Details
                    </h2>
                    <div className="space-y-1.5 md:space-y-2 text-gray-700 text-sm md:text-base">
                        <p><strong>Area:</strong> {worker.area}</p>
                        <p><strong>City:</strong> {worker.city}</p>
                        <p><strong>State:</strong> {worker.state}</p>
                        <p><strong>Pincode:</strong> {worker.pincode}</p>
                        <p className="text-xs md:text-sm text-gray-500">
                            <strong>Coordinates:</strong> {worker.latitude.toFixed(4)}, {worker.longitude.toFixed(4)}
                        </p>
                    </div>
                </div>

                {/* Images Gallery */}
                {worker.images && worker.images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                            Portfolio
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            {worker.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Work ${idx + 1}`}
                                    className="w-full h-32 md:h-40 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                        <Button onClick={() => window.location.href = `tel:${getPhoneNumber()}`}>
                            <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                            <span className="text-sm md:text-base">Call Worker</span>
                        </Button>

                        <Button onClick={() => navigate(`/chat/${worker._id}`)}>
                            <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" />
                            <span className="text-sm md:text-base">Send Message</span>
                        </Button>
                    </div>

                    <Button
                        variant="success"
                        className="w-full mb-3"
                        onClick={() => navigate(`/send-enquiry/${worker._id}`)}
                    >
                        <Briefcase size={16} className="md:w-[18px] md:h-[18px]" />
                        <span className="text-sm md:text-base">Send Job Invitation</span>
                    </Button>

                    <button
                        onClick={() => navigate(`/edit-skill/${worker._id}`)}
                        className="w-full px-4 py-2.5 md:py-3 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors text-sm md:text-base font-medium"
                    >
                        Edit This Skill
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WorkerDetails;