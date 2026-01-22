import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Star,
    Phone,
    MessageCircle,
    Briefcase,
    ArrowLeft,
    MapPin,
    Mail,
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading worker details...</p>
                </div>
            </div>
        );
    }

    if (error || !worker) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Error Loading Worker</h2>
                    <p className="text-gray-600 mb-6">{error || 'Worker not found'}</p>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className={combineTypography(typography.heading.h4, "ml-4")}>
                        Worker Profile
                    </h1>
                </div>

                {/* Profile */}
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center mb-6">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={worker.name}
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-blue-100"
                        />
                    ) : (
                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {initials}
                        </div>
                    )}

                    <h1 className={combineTypography(typography.heading.h3)}>
                        {worker.name}
                    </h1>

                    <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 mt-2">
                        ✓ Available
                    </span>

                    <div className="flex justify-center items-center gap-2 text-gray-600 mt-3">
                        <MapPin size={16} />
                        {worker.area}, {worker.city}, {worker.state} - {worker.pincode}
                    </div>

                    <div className="flex justify-center items-center gap-2 text-gray-500 mt-2 text-sm">
                        <Calendar size={14} /> Member since {memberSince}
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "mb-4")}>
                        Service Categories
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {worker.category.map((cat, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Skills & Subcategory */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "mb-4")}>
                        Skills & Specialization
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Star size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900">Subcategory</p>
                                <p className="text-gray-700">{worker.subCategory}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <Briefcase size={18} className="text-green-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-900">Primary Skill</p>
                                <p className="text-gray-700">{worker.skill}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rates */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "mb-4")}>
                        Service Rates
                    </h2>

                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl mb-3">
                        <span className="text-gray-700">Charge Type</span>
                        <strong className="capitalize text-blue-700">
                            {worker.chargeType === 'hour' ? 'Per Hour' : 
                             worker.chargeType === 'day' ? 'Per Day' : 'Fixed'}
                        </strong>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                        <span className="text-gray-700">Service Charge</span>
                        <strong className="text-green-700 text-xl">₹{worker.serviceCharge}</strong>
                    </div>
                </div>

                {/* Location Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "mb-4")}>
                        Location Details
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Area:</strong> {worker.area}</p>
                        <p><strong>City:</strong> {worker.city}</p>
                        <p><strong>State:</strong> {worker.state}</p>
                        <p><strong>Pincode:</strong> {worker.pincode}</p>
                        <p className="text-sm text-gray-500">
                            <strong>Coordinates:</strong> {worker.latitude.toFixed(4)}, {worker.longitude.toFixed(4)}
                        </p>
                    </div>
                </div>

                {/* Images Gallery */}
                {worker.images && worker.images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h2 className={combineTypography(typography.heading.h4, "mb-4")}>
                            Portfolio
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {worker.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Work ${idx + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Button onClick={() => window.location.href = `tel:${getPhoneNumber()}`}>
                            <Phone size={18} /> Call Worker
                        </Button>

                        <Button onClick={() => navigate(`/chat/${worker._id}`)}>
                            <MessageCircle size={18} /> Send Message
                        </Button>
                    </div>

                    <Button
                        variant="success"
                        className="w-full"
                        onClick={() => navigate(`/send-enquiry/${worker._id}`)}
                    >
                        <Briefcase size={18} /> Send Job Invitation
                    </Button>

                    <button
                        onClick={() => navigate(`/edit-skill/${worker._id}`)}
                        className="w-full mt-3 px-4 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                        Edit This Skill
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WorkerDetails;