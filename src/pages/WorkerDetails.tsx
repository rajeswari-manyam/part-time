import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Phone, MessageCircle, Briefcase, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Buttons';
import typography, { combineTypography } from '../styles/typography';
import BudgetIcon from "../assets/icons/Budget.png";

interface Skill {
    name: string;
}

interface WorkerProfile {
    id: number;
    initials: string;
    name: string;
    rating: number;
    reviewCount: number;
    experience: number;
    about: string;
    skills: Skill[];
    hourlyRate: number;
    dailyRate: number;
}

const workersData: WorkerProfile[] = [
    {
        id: 1,
        initials: 'RK',
        name: 'Ramesh Kumar',
        rating: 4.9,
        reviewCount: 58,
        experience: 10,
        about: 'Professional plumber with 10+ years of experience in residential and commercial plumbing.',
        skills: [{ name: 'Plumbing' }, { name: 'Pipe Fitting' }, { name: 'Leak Repair' }, { name: 'Bathroom Work' }],
        hourlyRate: 550,
        dailyRate: 4000
    },
    {
        id: 2,
        initials: 'SK',
        name: 'Suresh Kumar',
        rating: 4.7,
        reviewCount: 42,
        experience: 8,
        about: 'Expert electrician specializing in home and commercial electrical works.',
        skills: [{ name: 'Electrical' }, { name: 'Wiring' }],
        hourlyRate: 650,
        dailyRate: 4500
    },
    // Add more workers if needed
];

const ServiceWorkerProfile: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [worker, setWorker] = useState<WorkerProfile | null>(null);

    useEffect(() => {
        const workerFound = workersData.find(w => w.id === Number(id));
        setWorker(workerFound || null);
    }, [id]);

    if (!worker) return <div className="text-center mt-10">Worker not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-200"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="ml-4 text-xl font-semibold text-gray-800">Worker Profile</h1>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-xl">
                            {worker.initials}
                        </div>
                        <h1 className={combineTypography(typography.heading.h3, "text-gray-800 mb-3")}>
                            {worker.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-6 h-6 ${i < Math.round(worker.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                            <span className={combineTypography(typography.body.large, "ml-2 text-gray-700")}>
                                {worker.rating}
                            </span>
                        </div>
                        <p className={combineTypography(typography.body.base, "text-gray-600")}>
                            {worker.reviewCount} reviews • {worker.experience} years experience
                        </p>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-4")}>About</h2>
                    <p className={combineTypography(typography.body.base, "text-gray-600 leading-relaxed")}>
                        {worker.about}
                    </p>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-6")}>
                        Skills & Expertise
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {worker.skills.map((skill, index) => (
                            <span
                                key={index}
                                className={combineTypography(typography.body.base, "px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-medium")}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Service Rates */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className={combineTypography(typography.heading.h4, "text-gray-800 mb-6")}>Service Rates</h2>
                    <div className="space-y-3">
                        <div className={combineTypography(typography.body.base, "flex items-center gap-2 text-gray-700")}>
                            <img src={BudgetIcon} alt="Budget" className="w-5 h-5" />
                            <span className="font-medium">Hourly:</span>
                            <span className="font-semibold">₹{worker.hourlyRate}/hour</span>
                        </div>
                        <div className={combineTypography(typography.body.base, "flex items-center gap-2 text-gray-700")}>
                            <img src={BudgetIcon} alt="Budget" className="w-5 h-5" />
                            <span className="font-medium">Daily:</span>
                            <span className="font-semibold">₹{worker.dailyRate.toLocaleString()}/day</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                         
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={() => navigate(`/call/${worker.id}`)}
                        >
                            <Phone className="w-5 h-5" /> Call Worker
                        </Button>

                        <Button
                          
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                            onClick={() => navigate(`/chat/${worker.id}`)}
                        >
                            <MessageCircle className="w-5 h-5" /> Send Message
                        </Button>
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="success"
                            size="lg"
                            className="flex items-center justify-center gap-3 w-full"
                        >
                            <Briefcase className="w-5 h-5" /> Send Job Invitation
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceWorkerProfile;
