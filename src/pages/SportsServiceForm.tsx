import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    addSportsActivity,
    updateSportsActivity,
    getSportsActivityById,
    SportsWorker
} from "../services/Sports.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import subcategoriesData from '../data/subcategories.json';
import { X, Upload, MapPin } from 'lucide-react';

// ── Availability options ─────────────────────────────────────────────────────
const availabilityOptions = ['Full Time', 'Part Time', 'On Demand', 'Weekends Only'];

// ── Charge Type options ──────────────────────────────────────────────────────
const chargeTypeOptions = ['Hour', 'Day', 'Session', 'Month', 'Package'];

// ── Pull sports subcategories from JSON (categoryId 6) ──────────────────────
const getSportsSubcategories = () => {
    const sportsCategory = subcategoriesData.subcategories.find(cat => cat.categoryId === 17);
    return sportsCategory ? sportsCategory.items.map(item => item.name) : [];
};

// ── Common sports services by category ───────────────────────────────────────
const getCommonServices = (subCategory: string): string[] => {
    const normalized = subCategory.toLowerCase();

    if (normalized.includes('gym') || normalized.includes('fitness')) {
        return ['Personal Training', 'Group Classes', 'Weight Training', 'Cardio', 'Strength Training', 'Diet Consultation'];
    }
    if (normalized.includes('yoga')) {
        return ['Hatha Yoga', 'Vinyasa', 'Ashtanga', 'Power Yoga', 'Meditation', 'Pranayama'];
    }
    if (normalized.includes('swimming')) {
        return ['Swimming Lessons', 'Adult Classes', 'Kids Classes', 'Competitive Training', 'Water Aerobics'];
    }
    if (normalized.includes('cricket')) {
        return ['Batting Coaching', 'Bowling Coaching', 'Fielding', 'Match Practice', 'Fitness Training'];
    }
    if (normalized.includes('football') || normalized.includes('soccer')) {
        return ['Dribbling', 'Shooting', 'Passing', 'Defense', 'Goalkeeping', 'Match Tactics'];
    }
    if (normalized.includes('basketball')) {
        return ['Shooting Skills', 'Dribbling', 'Defense', 'Team Play', 'Conditioning'];
    }
    if (normalized.includes('tennis')) {
        return ['Forehand', 'Backhand', 'Serve', 'Volleys', 'Match Play'];
    }
    if (normalized.includes('badminton')) {
        return ['Basic Strokes', 'Smash', 'Drop Shot', 'Serve', 'Footwork', 'Match Practice'];
    }
    if (normalized.includes('stadium') || normalized.includes('ground')) {
        return ['Field Booking', 'Event Hosting', 'Tournament Organization', 'Equipment Rental'];
    }

    return ['Training', 'Coaching', 'Practice Sessions', 'Competition Prep'];
};

// ============================================================================
// SHARED INPUT CLASSES - Mobile First
// ============================================================================
const inputBase =
    `w-full px-4 py-3 border border-gray-300 rounded-xl ` +
    `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
    `placeholder-gray-400 transition-all duration-200 ` +
    `${typography.form.input} bg-white`;

// ============================================================================
// REUSABLE LABEL
// ============================================================================
const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <label className={`block ${typography.form.label} text-gray-800 mb-2`}>
        {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

// ============================================================================
// SECTION CARD WRAPPER
// ============================================================================
const SectionCard: React.FC<{ title?: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        {title && (
            <div className="flex items-center justify-between mb-1">
                <h3 className={`${typography.card.subtitle} text-gray-900`}>{title}</h3>
                {action}
            </div>
        )}
        {children}
    </div>
);

// ============================================================================
// GOOGLE MAPS GEOCODING HELPER
// ============================================================================
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

// ============================================================================
// COMPONENT
// ============================================================================
const SportsForm = () => {
    const navigate = useNavigate();

    // ── URL helpers ──────────────────────────────────────────────────────────
    const getIdFromUrl = () => new URLSearchParams(window.location.search).get('id');
    const getSubcategoryFromUrl = () => {
        const sub = new URLSearchParams(window.location.search).get('subcategory');
        return sub
            ? sub.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            : null;
    };

    // ── state ────────────────────────────────────────────────────────────────
    const [editId] = useState<string | null>(getIdFromUrl());
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const sportsTypes = getSportsSubcategories();
    const defaultType = getSubcategoryFromUrl() || sportsTypes[0] || 'Gym & Fitness';

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        serviceName: '',
        subCategory: defaultType,
        description: '',
        services: [] as string[],
        experience: '',
        serviceCharge: '',
        chargeType: chargeTypeOptions[0],
        bio: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        availability: true,
    });

    // ── images ───────────────────────────────────────────────────────────────
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // ── services ─────────────────────────────────────────────────────────────
    const [customService, setCustomService] = useState('');
    const [commonServices] = useState<string[]>(getCommonServices(defaultType));

    // ── geo ──────────────────────────────────────────────────────────────────
    const [locationLoading, setLocationLoading] = useState(false);

    // ── fetch for edit ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!editId) return;
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const response = await getSportsActivityById(editId);
                if (!response.success || !response.data) throw new Error('Service not found');

                const data = response.data;
                setFormData(prev => ({
                    ...prev,
                    userId: data.userId || '',
                    serviceName: data.serviceName || '',
                    subCategory: data.subCategory || defaultType,
                    description: data.description || '',
                    services: data.services || [],
                    experience: data.experience?.toString() || '',
                    serviceCharge: data.serviceCharge?.toString() || '',
                    chargeType: data.chargeType || chargeTypeOptions[0],
                    bio: data.bio || '',
                    area: data.area || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    latitude: data.latitude?.toString() || '',
                    longitude: data.longitude?.toString() || '',
                    availability: data.availability !== false,
                }));

                if (data.images && Array.isArray(data.images)) setExistingImages(data.images);
            } catch (err) {
                console.error(err);
                setError('Failed to load service data');
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [editId]);

    // ── Auto-detect coordinates when area is entered ────────────────────────
    useEffect(() => {
        const detectCoordinates = async () => {
            if (formData.area && !formData.latitude && !formData.longitude) {
                const fullAddress = `${formData.area}, ${formData.city}, ${formData.state}, ${formData.pincode}`
                    .replace(/, ,/g, ',').replace(/^,|,$/g, '');

                if (fullAddress.trim()) {
                    const coords = await geocodeAddress(fullAddress);
                    if (coords) {
                        setFormData(prev => ({
                            ...prev,
                            latitude: coords.lat.toString(),
                            longitude: coords.lng.toString(),
                        }));
                    }
                }
            }
        };

        const timer = setTimeout(detectCoordinates, 1000);
        return () => clearTimeout(timer);
    }, [formData.area, formData.city, formData.state, formData.pincode]);

    // ── generic input ────────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── services management ──────────────────────────────────────────────────
    const handleAddService = (service: string) => {
        if (!service.trim()) return;
        if (formData.services.includes(service)) {
            setError(`"${service}" is already added`);
            return;
        }
        setFormData(prev => ({ ...prev, services: [...prev.services, service] }));
        setCustomService('');
        setError('');
    };

    const handleRemoveService = (index: number) => {
        setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
    };

    // ── image helpers ────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const availableSlots = 5 - (selectedImages.length + existingImages.length);
        if (availableSlots <= 0) {
            setError('Maximum 5 images allowed');
            return;
        }

        const validFiles = files.slice(0, availableSlots).filter(file => {
            if (!file.type.startsWith('image/')) {
                setError(`${file.name} is not a valid image`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError(`${file.name} exceeds 5 MB`);
                return false;
            }
            return true;
        });

        if (!validFiles.length) return;

        const newPreviews: string[] = [];
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === validFiles.length)
                    setImagePreviews(prev => [...prev, ...newPreviews]);
            };
            reader.readAsDataURL(file);
        });
        setSelectedImages(prev => [...prev, ...validFiles]);
        setError('');
    };

    const handleRemoveNewImage = (i: number) => {
        setSelectedImages(prev => prev.filter((_, idx) => idx !== i));
        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const handleRemoveExistingImage = (i: number) =>
        setExistingImages(prev => prev.filter((_, idx) => idx !== i));

    // ── geolocation ──────────────────────────────────────────────────────────
    const getCurrentLocation = () => {
        setLocationLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude.toString();
                const lng = pos.coords.longitude.toString();
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await res.json();

                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
                            area: data.address.suburb || data.address.neighbourhood || data.address.road || prev.area,
                            city: data.address.city || data.address.town || data.address.village || prev.city,
                            state: data.address.state || prev.state,
                            pincode: data.address.postcode || prev.pincode,
                        }));
                    }
                } catch (e) {
                    console.error(e);
                }

                setLocationLoading(false);
            },
            (err) => {
                setError(`Location error: ${err.message}`);
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // ── submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (!formData.serviceName || !formData.subCategory)
                throw new Error('Please fill in all required fields (Service Name, Category)');
            if (formData.services.length === 0)
                throw new Error('Please add at least one service');
            if (!formData.latitude || !formData.longitude)
                throw new Error('Please provide a valid location');

            // Create FormData for multipart upload
            const formDataToSend = new FormData();

            // Append all fields
            formDataToSend.append('userId', formData.userId);
            formDataToSend.append('serviceName', formData.serviceName);
            formDataToSend.append('subCategory', formData.subCategory);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('services', JSON.stringify(formData.services));
            formDataToSend.append('experience', formData.experience);
            formDataToSend.append('serviceCharge', formData.serviceCharge);
            formDataToSend.append('chargeType', formData.chargeType);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('area', formData.area);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('state', formData.state);
            formDataToSend.append('pincode', formData.pincode);
            formDataToSend.append('latitude', formData.latitude);
            formDataToSend.append('longitude', formData.longitude);
            formDataToSend.append('availability', formData.availability.toString());

            // Append images
            selectedImages.forEach((image) => {
                formDataToSend.append('images', image);
            });

            if (isEditMode && editId) {
                await updateSportsActivity(editId, formDataToSend);
                setSuccessMessage('Service updated successfully!');
                setTimeout(() => navigate('/listed-jobs'), 1500);
            } else {
                await addSportsActivity(formDataToSend);
                setSuccessMessage('Service created successfully!');
                setTimeout(() => navigate('/listed-jobs'), 1500);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => window.history.back();

    // ── loading screen ───────────────────────────────────────────────────────
    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className={`${typography.body.base} text-gray-600`}>Loading...</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER - Mobile First Design
    // ============================================================================
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Header - Fixed ── */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <h1 className={`${typography.heading.h5} text-gray-900`}>
                            {isEditMode ? 'Update Sports Service' : 'Add Sports Service'}
                        </h1>
                        <p className={`${typography.body.small} text-gray-500`}>
                            {isEditMode ? 'Update your service listing' : 'Create new service listing'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

                {/* ── Alerts ── */}
                {error && (
                    <div className={`p-4 bg-red-50 border border-red-200 rounded-xl ${typography.form.error}`}>
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className={`p-4 bg-green-50 border border-green-200 rounded-xl ${typography.body.small} text-green-700`}>
                        {successMessage}
                    </div>
                )}

                {/* ─── 1. SERVICE NAME ──────────────────────────────────────── */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Service Name</FieldLabel>
                        <input
                            type="text"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleInputChange}
                            placeholder="e.g., Elite Fitness Training, Pro Cricket Academy"
                            className={inputBase}
                        />
                    </div>
                </SectionCard>

                {/* ─── 2. CATEGORY ───────────────────────────────────────────── */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Category</FieldLabel>
                        <select
                            name="subCategory"
                            value={formData.subCategory}
                            onChange={handleInputChange}
                            className={inputBase + ' appearance-none bg-white'}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            {sportsTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </SectionCard>

                {/* ─── 3. SERVICES OFFERED ────────────────────────────────────── */}
                <SectionCard title="Services Offered">
                    {/* Common Services */}
                    <div>
                        <p className={`${typography.body.small} text-gray-700 mb-2`}>Quick Select:</p>
                        <div className="flex flex-wrap gap-2">
                            {commonServices.map((service) => (
                                <button
                                    key={service}
                                    type="button"
                                    onClick={() => handleAddService(service)}
                                    disabled={formData.services.includes(service)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition ${formData.services.includes(service)
                                        ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    {formData.services.includes(service) ? '✓ ' : '+ '}
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Service Input */}
                    <div>
                        <p className={`${typography.body.small} text-gray-700 mb-2`}>Add Custom Service:</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customService}
                                onChange={(e) => setCustomService(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddService(customService);
                                    }
                                }}
                                placeholder="Type custom service..."
                                className={inputBase}
                            />
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAddService(customService)}
                                className="whitespace-nowrap"
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Selected Services */}
                    {formData.services.length > 0 && (
                        <div>
                            <p className={`${typography.body.small} font-medium text-gray-700 mb-2`}>
                                Selected Services ({formData.services.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {formData.services.map((service, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200"
                                    >
                                        <span className={typography.misc.badge}>{service}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveService(idx)}
                                            className="hover:text-blue-900"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </SectionCard>

                {/* ─── 4. PROFESSIONAL DETAILS ───────────────────────────────── */}
                <SectionCard title="Professional Details">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel>Experience (years)</FieldLabel>
                            <input
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="Years"
                                min="0"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel>Service Charge (₹)</FieldLabel>
                            <input
                                type="number"
                                name="serviceCharge"
                                value={formData.serviceCharge}
                                onChange={handleInputChange}
                                placeholder="Amount"
                                min="0"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    <div>
                        <FieldLabel>Charge Type</FieldLabel>
                        <select
                            name="chargeType"
                            value={formData.chargeType}
                            onChange={handleInputChange}
                            className={inputBase + ' appearance-none bg-white'}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            {chargeTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <span className={`${typography.body.small} font-semibold text-gray-800`}>Currently Available</span>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, availability: !prev.availability }))}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${formData.availability ? 'bg-emerald-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.availability ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </SectionCard>

                {/* ─── 5. DESCRIPTION & BIO ──────────────────────────────────── */}
                <SectionCard title="Description">
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Brief description of your service..."
                        className={inputBase + ' resize-none'}
                    />
                </SectionCard>

                <SectionCard title="Bio (Optional)">
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about yourself, your expertise, and achievements..."
                        className={inputBase + ' resize-none'}
                    />
                </SectionCard>

                {/* ─── 6. LOCATION DETAILS ────────────────────────────────────── */}
                <SectionCard
                    title="Location Details"
                    action={
                        <Button
                            variant="success"
                            size="sm"
                            onClick={getCurrentLocation}
                            disabled={locationLoading}
                            className="!py-1.5 !px-3"
                        >
                            {locationLoading ? (
                                <>
                                    <span className="animate-spin mr-1">⌛</span>
                                    Detecting...
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-4 h-4 inline mr-1.5" />
                                    Auto Detect
                                </>
                            )}
                        </Button>
                    }
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel required>Area</FieldLabel>
                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                placeholder="Area name"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel required>City</FieldLabel>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel required>State</FieldLabel>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel required>PIN Code</FieldLabel>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                placeholder="PIN code"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    {/* Location Tip */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className={`${typography.body.small} text-blue-800`}>
                            📍 <span className="font-medium">Tip:</span> Click the button to automatically detect your location, or enter your address manually above.
                        </p>
                    </div>

                    {/* Coordinates Display */}
                    {formData.latitude && formData.longitude && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                            <p className={`${typography.body.small} text-green-800`}>
                                <span className="font-semibold">✓ Location detected:</span>
                                <span className="ml-1">{parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}</span>
                            </p>
                        </div>
                    )}
                </SectionCard>

                {/* ─── 7. PORTFOLIO PHOTOS ────────────────────────────────────── */}
                <SectionCard title="Portfolio Photos (Optional)">
                    <label className="cursor-pointer block">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                            disabled={selectedImages.length + existingImages.length >= 5}
                        />
                        <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${selectedImages.length + existingImages.length >= 5
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}>
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className={`${typography.form.input} font-medium text-gray-700`}>
                                        {selectedImages.length + existingImages.length >= 5
                                            ? 'Maximum limit reached'
                                            : 'Tap to upload portfolio photos'}
                                    </p>
                                    <p className={`${typography.body.small} text-gray-500 mt-1`}>Maximum 5 images</p>
                                </div>
                            </div>
                        </div>
                    </label>

                    {/* Image Previews */}
                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {existingImages.map((url, i) => (
                                <div key={`ex-${i}`} className="relative aspect-square">
                                    <img
                                        src={url}
                                        alt={`Saved ${i + 1}`}
                                        className="w-full h-full object-cover rounded-xl border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <span className={`absolute bottom-2 left-2 bg-blue-600 text-white ${typography.fontSize.xs} px-2 py-0.5 rounded-full`}>
                                        Saved
                                    </span>
                                </div>
                            ))}
                            {imagePreviews.map((preview, i) => (
                                <div key={`new-${i}`} className="relative aspect-square">
                                    <img
                                        src={preview}
                                        alt={`Preview ${i + 1}`}
                                        className="w-full h-full object-cover rounded-xl border-2 border-blue-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <span className={`absolute bottom-2 left-2 bg-green-600 text-white ${typography.fontSize.xs} px-2 py-0.5 rounded-full`}>
                                        New
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* ── Action Buttons ── */}
                <div className="flex gap-4 pt-2 pb-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        type="button"
                        className={`flex-1 px-6 py-3.5 rounded-lg font-semibold text-white transition-all ${loading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            } shadow-sm ${typography.body.base}`}
                    >
                        {loading
                            ? (isEditMode ? 'Updating...' : 'Creating...')
                            : (isEditMode ? 'Update Service' : 'Create Service')}
                    </button>
                    <button
                        onClick={handleCancel}
                        type="button"
                        className={`px-8 py-3.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-all ${typography.body.base}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SportsForm;