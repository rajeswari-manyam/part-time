import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPetService, updatePetServiceById, getPetServiceById } from "../services/PetWorker.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import subcategoriesData from '../data/subcategories.json';
import { X, Upload, MapPin } from 'lucide-react';

// ── Availability options ─────────────────────────────────────────────────────
const availabilityOptions = ['Full Time', 'Part Time', 'On Demand', 'Weekends Only'];

// ── Pull pet service subcategories from JSON (categoryId 13) ────────────────
const getPetServiceSubcategories = () => {
    const petCategory = subcategoriesData.subcategories.find(cat => cat.categoryId === 13);
    return petCategory ? petCategory.items.map(item => item.name) : [];
};

// ── Common pet services ──────────────────────────────────────────────────────
const commonServices = [
    'Vaccination',
    'Health Checkup',
    'Grooming',
    'Bathing',
    'Nail Trimming',
    'Training',
    'Boarding',
    'Pet Sitting',
    'Dog Walking',
    'Emergency Care',
    'Dental Care',
    'Surgery',
    'Pet Food & Supplies'
];

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
const PetForm = () => {
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

    // NEW: separate warning state for low-accuracy GPS (yellow banner)
    const [locationWarning, setLocationWarning] = useState('');

    const petCategories = getPetServiceSubcategories();
    const defaultCategory = getSubcategoryFromUrl() || petCategories[0] || 'Pet Shops';

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        name: '',
        category: defaultCategory,
        email: '',
        phone: '',
        bio: '',
        services: [] as string[],
        experience: '',
        serviceCharge: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        availability: availabilityOptions[0],
    });

    // ── images ───────────────────────────────────────────────────────────────
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // ── geo ──────────────────────────────────────────────────────────────────
    const [locationLoading, setLocationLoading] = useState(false);
    const [isCurrentlyAvailable, setIsCurrentlyAvailable] = useState(true);

    // FIX: Prevents geocoding useEffect from overwriting real GPS coordinates
    const isGPSDetected = useRef(false);

    // ── fetch for edit ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!editId) return;
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const response = await getPetServiceById(editId);
                if (!response.success || !response.data || response.data.length === 0) {
                    throw new Error('Service not found');
                }

                const data = response.data[0];

                setFormData(prev => ({
                    ...prev,
                    userId: data.userId || '',
                    name: data.name || '',
                    category: data.category || defaultCategory,
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    services: data.services || [],
                    experience: data.experience?.toString() || '',
                    serviceCharge: data.serviceCharge?.toString() || '',
                    area: data.area || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    latitude: data.latitude?.toString() || '',
                    longitude: data.longitude?.toString() || '',
                    availability: typeof data.availability === 'string' 
                        ? data.availability 
                        : availabilityOptions[0],
                }));

                // Set the currently available toggle based on the data
                if (typeof data.availability === 'boolean') {
                    setIsCurrentlyAvailable(data.availability);
                }

                if (data.images && Array.isArray(data.images)) {
                    setExistingImages(data.images);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load service data');
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [editId]);

    // ── Auto-detect coordinates when address is typed manually ───────────────
    // FIX: Skips geocoding when GPS was just used to prevent overwriting real coords
    useEffect(() => {
        const detectCoordinates = async () => {
            // Skip geocoding if GPS just fired — real coords are already set
            if (isGPSDetected.current) {
                isGPSDetected.current = false;
                return;
            }

            // Only auto-detect if we have area but no coordinates yet
            if (formData.area && !formData.latitude && !formData.longitude) {
                const fullAddress = `${formData.area}, ${formData.city}, ${formData.state}, ${formData.pincode}`
                    .replace(/, ,/g, ',')
                    .replace(/^,|,$/g, '');

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

    // ── service selection ────────────────────────────────────────────────────
    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
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
        setLocationWarning('');

        if (!navigator.geolocation) {
            setError('Geolocation not supported by your browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                // FIX: Mark GPS detected BEFORE updating address fields
                // This blocks the geocoding useEffect from firing and overwriting real GPS coords
                isGPSDetected.current = true;

                const lat = pos.coords.latitude.toString();
                const lng = pos.coords.longitude.toString();
                const accuracy = pos.coords.accuracy; // metres

                // FIX: Show yellow warning if accuracy is poor
                // > 500m means browser used WiFi/IP fallback (common on desktops)
                // On mobile with real GPS this is usually < 20m
                if (accuracy > 500) {
                    setLocationWarning(
                        `⚠️ Low accuracy detected (~${Math.round(accuracy)}m). Your device may not have GPS. ` +
                        `The address fields below may be approximate — please verify and correct if needed.`
                    );
                }

                // Set GPS coordinates immediately
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await res.json();

                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
                            // FIX: Explicitly re-include lat/lng to prevent state batching from losing them
                            latitude: lat,
                            longitude: lng,
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
            if (!formData.name || !formData.phone || !formData.email)
                throw new Error('Please fill in all required fields (Name, Phone, Email)');
            if (!formData.services || formData.services.length === 0)
                throw new Error('Please select at least one service');
            if (!formData.latitude || !formData.longitude)
                throw new Error('Please provide a valid location');

            const formDataToSend = new FormData();

            formDataToSend.append('userId', formData.userId);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('services', JSON.stringify(formData.services));
            formDataToSend.append('experience', formData.experience);
            formDataToSend.append('serviceCharge', formData.serviceCharge);
            formDataToSend.append('area', formData.area);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('state', formData.state);
            formDataToSend.append('pincode', formData.pincode);
            formDataToSend.append('latitude', formData.latitude);
            formDataToSend.append('longitude', formData.longitude);
            // Send the currently available toggle state (API expects boolean)
            formDataToSend.append('availability', isCurrentlyAvailable.toString());

            selectedImages.forEach((image) => {
                formDataToSend.append('images', image);
            });

            if (isEditMode && editId) {
                await updatePetServiceById(editId, formDataToSend);
                setSuccessMessage('Service updated successfully!');
                setTimeout(() => navigate('/listed-jobs'), 1500);
            } else {
                await addPetService(formDataToSend);
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
                            {isEditMode ? 'Update Pet Service' : 'Add Pet Service'}
                        </h1>
                        <p className={`${typography.body.small} text-gray-500`}>
                            {isEditMode ? 'Update your pet service listing' : 'Create new pet service listing'}
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

                {/* ─── 1. NAME ──────────────────────────────────────── */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Service Name / Business Name</FieldLabel>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Happy Paws Veterinary Clinic"
                            className={inputBase}
                        />
                    </div>
                </SectionCard>

                {/* ─── 2. CONTACT INFORMATION ───────────────────────── */}
                <SectionCard title="Contact Information">
                    <div>
                        <FieldLabel required>Phone</FieldLabel>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className={inputBase}
                        />
                    </div>
                    <div>
                        <FieldLabel required>Email</FieldLabel>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            className={inputBase}
                        />
                    </div>
                </SectionCard>

                {/* ─── 3. CATEGORY & SERVICES ────────────────────────── */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Category</FieldLabel>
                        <select
                            name="category"
                            value={formData.category}
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
                            {petCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </SectionCard>

                <SectionCard>
                    <div>
                        <FieldLabel required>Services Offered</FieldLabel>
                        <p className={`${typography.misc.caption} mb-3`}>
                            Select all services you provide
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {commonServices.map((service) => (
                                <button
                                    key={service}
                                    type="button"
                                    onClick={() => toggleService(service)}
                                    className={`px-3 py-2.5 rounded-lg ${typography.body.small} font-medium transition-all ${
                                        formData.services.includes(service)
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {formData.services.includes(service) && '✓ '}
                                    {service}
                                </button>
                            ))}
                        </div>

                        {/* Selected Services Preview */}
                        {formData.services.length > 0 && (
                            <div className="mt-4">
                                <p className={`${typography.body.small} font-medium text-gray-700 mb-2`}>
                                    Selected Services ({formData.services.length}):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.services.map((s, i) => (
                                        <span
                                            key={i}
                                            className={`inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full ${typography.misc.badge} font-medium`}
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* ─── 4. PROFESSIONAL DETAILS ───────────────────────── */}
                <SectionCard title="Professional Details">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel required>Experience (years)</FieldLabel>
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
                            <FieldLabel required>Service Charge (₹)</FieldLabel>
                            <input
                                type="text"
                                name="serviceCharge"
                                value={formData.serviceCharge}
                                onChange={handleInputChange}
                                placeholder="Amount"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <span className={`${typography.body.small} font-semibold text-gray-800`}>Currently Available</span>
                        <button
                            type="button"
                            onClick={() => setIsCurrentlyAvailable(!isCurrentlyAvailable)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                isCurrentlyAvailable ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    isCurrentlyAvailable ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </SectionCard>

                {/* ─── 5. BIO ──────────────────────────────────────── */}
                <SectionCard title="About Your Service">
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your pet service, expertise, and what makes you special..."
                        className={inputBase + ' resize-none'}
                    />
                </SectionCard>

                {/* ─── 6. LOCATION DETAILS ────────────────────────────── */}
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
                    {/* NEW: Low accuracy warning — shown when browser uses WiFi/IP instead of GPS */}
                    {locationWarning && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5 shrink-0">⚠️</span>
                            <p className={`${typography.body.small} text-yellow-800`}>
                                {locationWarning}
                            </p>
                        </div>
                    )}

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
                                <span className="ml-1">
                                    {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                                </span>
                            </p>
                        </div>
                    )}
                </SectionCard>

                {/* ─── 7. PORTFOLIO PHOTOS ────────────────────────────── */}
                <SectionCard title="Service Photos (Optional)">
                    <label className="cursor-pointer block">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                            disabled={selectedImages.length + existingImages.length >= 5}
                        />
                        <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                            selectedImages.length + existingImages.length >= 5
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
                                            : 'Tap to upload service photos'}
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
                <div className="flex gap-4 pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        type="button"
                        className={`flex-1 px-6 py-3.5 rounded-lg font-semibold text-white transition-all ${
                            loading
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

export default PetForm;