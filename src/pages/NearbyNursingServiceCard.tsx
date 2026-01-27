// src/components/NearbyNursingServiceCard.tsx

import React, { useState, useCallback } from 'react';
import { PhoneIcon, MapIcon, CheckCircleIcon, ChatBubbleLeftEllipsisIcon, StarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, MedicalIcon } from '@heroicons/react/24/solid';
import { DUMMY_NURSING_SERVICES, NURSING_DESCRIPTIONS_MAP, NURSING_IMAGES_MAP, PHONE_NUMBERS_MAP, NURSING_SERVICES } from '../data/nursingData';

export interface JobType {
    id: string;
    title: string;
    description?: string;
    location?: string;
    distance?: number;
    jobData?: any;
}

interface NearbyNursingServiceCardProps {
    job: JobType;
    onViewDetails: (job: JobType) => void;
}

const NearbyNursingServiceCard: React.FC<NearbyNursingServiceCardProps> = ({ job, onViewDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const photos = NURSING_IMAGES_MAP[job.id] || [];
    const currentPhoto = photos[currentImageIndex];

    const getName = () => job.title || 'Nursing Service';
    const getLocation = () => job.location || job.description || 'Location';
    const getDistance = () => job.distance ? `${job.distance.toFixed(1)} km away` : '';
    const getDescription = () => NURSING_DESCRIPTIONS_MAP[job.id] || job.description || 'Professional nursing services';
    const getRating = () => job.jobData?.rating || null;
    const getUserRatingsTotal = () => job.jobData?.user_ratings_total || null;
    const getOpeningStatus = () => {
        const isOpen = job.jobData?.opening_hours?.open_now;
        if (isOpen === undefined) return null;
        return isOpen ? 'Available Now' : 'Currently Unavailable';
    };
    const getSpecialTags = () => job.jobData?.special_tags || [];
    const getCustomerReview = () => job.jobData?.customer_review || null;
    const getPhoneNumber = () => PHONE_NUMBERS_MAP[job.id] || null;

    const hasPhoneNumber = Boolean(getPhoneNumber());

    const handleCall = () => {
        const phoneNumber = getPhoneNumber();
        if (!phoneNumber) return alert(`No contact number available for ${getName()}`);
        window.open(`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`);
    };

    const handleDirections = () => {
        const lat = job.jobData?.geometry?.location?.lat;
        const lng = job.jobData?.geometry?.location?.lng;
        if (!lat || !lng) return alert('Unable to get location coordinates');
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${job.id}`;
        window.open(url, '_blank');
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImageIndex < photos.length - 1) setCurrentImageIndex(prev => prev + 1);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImageIndex > 0) setCurrentImageIndex(prev => prev - 1);
    };

    const visibleServices = NURSING_SERVICES.slice(0, 4);
    const moreServices = NURSING_SERVICES.length > 4 ? NURSING_SERVICES.length - 4 : 0;

    return (
        <div
            onClick={() => onViewDetails(job)}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:scale-[0.98] transition-transform duration-200"
        >
            {/* Image Carousel */}
            <div className="relative w-full h-52">
                {currentPhoto ? (
                    <img src={currentPhoto} alt={getName()} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <MedicalIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Navigation Arrows */}
                {photos.length > 1 && (
                    <>
                        {currentImageIndex > 0 && (
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2"
                            >
                                <ChevronLeftIcon className="w-5 h-5 text-white" />
                            </button>
                        )}
                        {currentImageIndex < photos.length - 1 && (
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2"
                            >
                                <ChevronRightIcon className="w-5 h-5 text-white" />
                            </button>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-md text-xs text-white">
                            {currentImageIndex + 1} / {photos.length}
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{getName()}</h3>

                <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapIcon className="w-4 h-4 mr-1" />
                    <span className="truncate">{getLocation()}</span>
                </div>

                {getDistance() && <p className="text-purple-700 text-xs font-semibold mb-2">{getDistance()}</p>}

                {getSpecialTags().length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {getSpecialTags().map((tag, idx) => (
                            <span key={idx} className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {getCustomerReview() && (
                    <div className="flex items-center text-green-600 text-xs font-medium mb-2 gap-1">
                        <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" />
                        <span className="truncate">{getCustomerReview()}</span>
                    </div>
                )}

                <p className="text-gray-600 text-sm mb-2 line-clamp-3">{getDescription()}</p>

                <div className="flex items-center bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded mb-2 w-max">
                    <MedicalIcon className="w-3.5 h-3.5 mr-1" />
                    Nursing Service
                </div>

                {/* Rating and Status */}
                <div className="flex items-center gap-2 mb-3">
                    {getRating() && (
                        <div className="flex items-center gap-1">
                            <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">{getRating()!.toFixed(1)}</span>
                            {getUserRatingsTotal() && (
                                <span className="text-xs text-gray-500">({getUserRatingsTotal()})</span>
                            )}
                        </div>
                    )}
                    {getOpeningStatus() && (
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${getOpeningStatus()?.includes('Available') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <ClockIcon className="w-3 h-3" />
                            {getOpeningStatus()}
                        </div>
                    )}
                </div>

                {/* Services */}
                <div className="mb-3">
                    <span className="text-gray-500 text-xs font-bold tracking-wide mb-1 block">SERVICES:</span>
                    <div className="flex flex-wrap gap-1">
                        {visibleServices.map((service, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded">
                                <CheckCircleIcon className="w-3 h-3" />
                                {service}
                            </span>
                        ))}
                        {moreServices > 0 && (
                            <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                                +{moreServices} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button onClick={handleDirections} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md border border-indigo-600 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition">
                        <MapIcon className="w-4 h-4" />
                        Directions
                    </button>
                    <button
                        onClick={handleCall}
                        disabled={!hasPhoneNumber}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md border ${hasPhoneNumber ? 'border-green-600 bg-green-50 text-green-700 hover:bg-green-100' : 'border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed'} text-xs font-semibold transition`}
                    >
                        <PhoneIcon className="w-4 h-4" />
                        Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NearbyNursingServiceCard;
