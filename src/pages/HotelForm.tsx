import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHotelWithImages, updateHotel, getHotelById, Hotel } from '../services/HotelService.service';
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import subcategoriesData from '../data/subcategories.json';
import { X, Upload, MapPin } from 'lucide-react';

const availabilityOptions = ['Full Time', 'Part Time', 'On Demand', 'Weekends Only'];

const getHotelTravelSubcategories = () => {
    const hotelCategory = subcategoriesData.subcategories.find(cat => cat.categoryId === 4);
    return hotelCategory ? hotelCategory.items.map(item => item.name) : [];
};

const inputBase =
    `w-full px-4 py-3 border border-gray-300 rounded-xl ` +
    `focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
    `placeholder-gray-400 transition-all duration-200 ` +
    `${typography.form.input} bg-white`;

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <label className={`block ${typography.form.label} text-gray-800 mb-2`}>
        {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
);

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

const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            return { lat: loc.lat, lng: loc.lng };
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
const HotelForm = () => {
    const navigate = useNavigate();

    const getIdFromUrl = () => new URLSearchParams(window.location.search).get('id');
    const getSubcategoryFromUrl = () => {
        const sub = new URLSearchParams(window.location.search).get('subcategory');
        return sub ? sub.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : null;
    };

    const [editId] = useState<string | null>(getIdFromUrl());
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [locationWarning, setLocationWarning] = useState('');

    const hotelTypes = getHotelTravelSubcategories();
    const defaultType = getSubcategoryFromUrl() || hotelTypes[0] || 'Hotels';

    // ✅ FIX: Try all common localStorage key names your app might use for userId
    const resolveUserId = (): string => {
        const candidates = [
            'userId', 'user_id', 'uid', 'id',
            'user', 'currentUser', 'loggedInUser',
            'userData', 'userInfo', 'authUser'
        ];

        for (const key of candidates) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;

            // Direct string ID (e.g. "695ddd1bd2f8e85bf14f8a8f")
            if (raw.length > 10 && !raw.startsWith('{')) {
                console.log(`✅ Found userId in localStorage["${key}"] =`, raw);
                return raw;
            }

            // JSON object — try common nested keys
            try {
                const parsed = JSON.parse(raw);
                const id =
                    parsed._id || parsed.id || parsed.userId ||
                    parsed.user_id || parsed.uid;
                if (id) {
                    console.log(`✅ Found userId in localStorage["${key}"].${Object.keys(parsed).find(k => parsed[k] === id)} =`, id);
                    return String(id);
                }
            } catch {
                // not JSON, skip
            }
        }

        console.warn("⚠️ Could not find userId in localStorage. Keys present:", Object.keys(localStorage));
        return '';
    };

    const [formData, setFormData] = useState({
        userId: resolveUserId(),
        name: '',
        type: defaultType,
        email: '',
        phone: '',
        description: '',
        service: '',
        priceRange: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        experience: '',
        availability: availabilityOptions[0],
    });

    // ── images ───────────────────────────────────────────────────────────────
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [locationLoading, setLocationLoading] = useState(false);
    const [isCurrentlyAvailable, setIsCurrentlyAvailable] = useState(true);
    const isGPSDetected = useRef(false);

    // ── fetch for edit ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!editId) return;
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const data = await getHotelById(editId);
                if (!data) throw new Error('Service not found');

                setFormData(prev => ({
                    ...prev,
                    userId: data.userId || '',
                    name: data.name || '',
                    type: data.type || defaultType,
                    email: data.email || '',
                    phone: data.phone || '',
                    description: data.description || '',
                    service: data.service || '',
                    priceRange: data.priceRange || '',
                    area: data.area || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    latitude: data.latitude?.toString() || '',
                    longitude: data.longitude?.toString() || '',
                    experience: data.experience?.toString() || '',
                    availability: data.availability || availabilityOptions[0],
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

    // ── Auto-geocode when address fields are typed manually ──────────────────
    useEffect(() => {
        const detectCoordinates = async () => {
            if (isGPSDetected.current) {
                isGPSDetected.current = false;
                return;
            }
            if (formData.area && !formData.latitude && !formData.longitude) {
                const fullAddress = [formData.area, formData.city, formData.state, formData.pincode]
                    .filter(Boolean).join(', ');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── Image helpers ────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const totalExisting = selectedImages.length + existingImages.length;
        const availableSlots = 5 - totalExisting;
        if (availableSlots <= 0) { setError('Maximum 5 images allowed'); return; }

        const validFiles = files.slice(0, availableSlots).filter(file => {
            if (!file.type.startsWith('image/')) { setError(`${file.name} is not a valid image`); return false; }
            if (file.size > 5 * 1024 * 1024) { setError(`${file.name} exceeds 5 MB`); return false; }
            return true;
        });

        if (!validFiles.length) return;

        const newPreviews: string[] = [];
        let loaded = 0;
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                loaded++;
                if (loaded === validFiles.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews]);
                }
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

    // ── GPS location ─────────────────────────────────────────────────────────
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
                isGPSDetected.current = true;

                const lat = pos.coords.latitude.toString();
                const lng = pos.coords.longitude.toString();
                const accuracy = pos.coords.accuracy;

                if (accuracy > 500) {
                    setLocationWarning(
                        `⚠️ Low accuracy detected (~${Math.round(accuracy)}m). Your device may not have GPS. ` +
                        `The address fields below may be approximate — please verify and correct if needed.`
                    );
                }

                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await res.json();
                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
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

    // ============================================================================
    // SUBMIT — builds FormData exactly matching the API:
    // formdata.append("userId", ...)
    // formdata.append("images", fileInput.files[0], filename)
    // ============================================================================
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // ✅ FIX: Validate userId FIRST — this was causing "User not found" 404
            if (!formData.userId || formData.userId.trim() === '') {
                // Last-chance attempt to read userId from localStorage
                const freshId = resolveUserId();
                if (freshId) {
                    setFormData(prev => ({ ...prev, userId: freshId }));
                } else {
                    throw new Error(
                        'User not logged in. Cannot find userId in localStorage. ' +
                        'Please log out and log back in, then try again.'
                    );
                }
            }

            if (!formData.name || !formData.phone || !formData.email)
                throw new Error('Please fill in all required fields (Name, Phone, Email)');
            if (!formData.service || !formData.service.trim())
                throw new Error('Please enter at least one service');
            if (!formData.latitude || !formData.longitude)
                throw new Error('Please provide a valid location');

            if (isEditMode && editId) {
                // ── UPDATE: use urlencoded (existing pattern)
                const payload: Hotel = {
                    ...formData,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                };
                await updateHotel(editId, payload);
                setSuccessMessage('Service updated successfully!');
                setTimeout(() => navigate('/my-business'), 1500);
            } else {
                // ── CREATE: build FormData exactly like the API expects
                const formdata = new FormData();

                // ✅ Append each field individually (matches API curl exactly)
                formdata.append("userId", formData.userId);
                formdata.append("name", formData.name);
                formdata.append("type", formData.type);
                formdata.append("email", formData.email);
                formdata.append("phone", formData.phone);
                formdata.append("description", formData.description);
                formdata.append("service", formData.service);
                formdata.append("priceRange", formData.priceRange);
                formdata.append("area", formData.area);
                formdata.append("city", formData.city);
                formdata.append("state", formData.state);
                formdata.append("pincode", formData.pincode);
                formdata.append("latitude", formData.latitude);
                formdata.append("longitude", formData.longitude);

                if (formData.experience) formdata.append("experience", formData.experience);
                if (formData.availability) formdata.append("availability", formData.availability);

                // ✅ Append images exactly like the API curl: formdata.append("images", file, filename)
                if (selectedImages.length > 0) {
                    selectedImages.forEach((file) => {
                        formdata.append("images", file, file.name);
                    });
                    console.log("📤 Uploading", selectedImages.length, "image(s)");
                }

                // Debug log — matches Postman output format
                console.log("📤 Sending FormData fields:");
                console.log("  userId being sent:", formData.userId);
                Array.from(formdata.entries()).forEach(([key, value]) => {
                    if (value instanceof File) {
                        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
                    } else {
                        console.log(`  ${key}: ${value}`);
                    }
                });

                const response = await fetch(
                    `${process.env.REACT_APP_API_BASE_URL}/createHotelTravel`,
                    { method: "POST", body: formdata, redirect: "follow" }
                );

                const responseText = await response.text();
                console.log("📥 Server response:", responseText);

                if (!response.ok) {
                    let msg = `HTTP ${response.status}`;
                    try { msg += ': ' + JSON.parse(responseText).message; } catch { msg += ': ' + responseText; }
                    throw new Error(msg);
                }

                const result = JSON.parse(responseText);
                if (!result.success) throw new Error(result.message || 'Failed to create service');

                setSuccessMessage('Service created successfully!');
                setTimeout(() => navigate('/my-business'), 1500);
            }
        } catch (err: any) {
            console.error("❌ Submit error:", err);
            setError(err.message || 'Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => window.history.back();

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
    // RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Sticky Header ── */}
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
                            {isEditMode ? 'Update Service' : 'Add New Hotel Service'}
                        </h1>
                        <p className={`${typography.body.small} text-gray-500`}>
                            {isEditMode ? 'Update your service listing' : 'Create new hotel/travel listing'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

                {/* Alerts */}
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

                {/* 1. NAME */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Hotel / Service Name</FieldLabel>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter hotel or service name"
                            className={inputBase}
                        />
                    </div>
                </SectionCard>

                {/* 2. CONTACT */}
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

                {/* 3. CATEGORY */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Category / Type</FieldLabel>
                        <select
                            name="type"
                            value={formData.type}
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
                            {hotelTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </SectionCard>

                {/* 4. SERVICES */}
                <SectionCard>
                    <div>
                        <FieldLabel required>Services Offered</FieldLabel>
                        <textarea
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Room Service, Pool, Spa, Restaurant, Parking"
                            className={inputBase + ' resize-none'}
                        />
                        <p className={`${typography.misc.caption} mt-2`}>
                            💡 Enter services separated by commas
                        </p>
                        {formData.service && formData.service.trim() && (
                            <div className="mt-3">
                                <p className={`${typography.body.small} font-medium text-gray-700 mb-2`}>
                                    Selected Services:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.service.split(',').map((s, i) => {
                                        const trimmed = s.trim();
                                        if (!trimmed) return null;
                                        return (
                                            <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                                ✓ {trimmed}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* 5. PROFESSIONAL DETAILS */}
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
                            <FieldLabel required>Price Range (₹)</FieldLabel>
                            <input
                                type="text"
                                name="priceRange"
                                value={formData.priceRange}
                                onChange={handleInputChange}
                                placeholder="e.g. 1000"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <span className={`${typography.body.small} font-semibold text-gray-800`}>Currently Available</span>
                        <button
                            type="button"
                            onClick={() => setIsCurrentlyAvailable(!isCurrentlyAvailable)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isCurrentlyAvailable ? 'bg-emerald-500' : 'bg-gray-300'
                                }`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isCurrentlyAvailable ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </SectionCard>

                {/* 6. BIO */}
                <SectionCard title="Description">
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe your hotel or service..."
                        className={inputBase + ' resize-none'}
                    />
                </SectionCard>

                {/* 7. LOCATION */}
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
                                <><span className="animate-spin mr-1">⌛</span>Detecting...</>
                            ) : (
                                <><MapPin className="w-4 h-4 inline mr-1.5" />Auto Detect</>
                            )}
                        </Button>
                    }
                >
                    {locationWarning && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5 shrink-0">⚠️</span>
                            <p className={`${typography.body.small} text-yellow-800`}>{locationWarning}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel required>Area</FieldLabel>
                            <input type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="Area name" className={inputBase} />
                        </div>
                        <div>
                            <FieldLabel required>City</FieldLabel>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className={inputBase} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel required>State</FieldLabel>
                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className={inputBase} />
                        </div>
                        <div>
                            <FieldLabel required>PIN Code</FieldLabel>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="PIN code" className={inputBase} />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className={`${typography.body.small} text-blue-800`}>
                            📍 <span className="font-medium">Tip:</span> Click "Auto Detect" to fill your location automatically, or enter manually above.
                        </p>
                    </div>

                    {formData.latitude && formData.longitude && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                            <p className={`${typography.body.small} text-green-800`}>
                                <span className="font-semibold">✓ Location detected: </span>
                                {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                            </p>
                        </div>
                    )}
                </SectionCard>

                {/* 8. PHOTOS */}
                <SectionCard title="Photos (Optional)">
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
                                            ? 'Maximum limit reached (5 images)'
                                            : 'Tap to upload photos'}
                                    </p>
                                    <p className={`${typography.body.small} text-gray-500 mt-1`}>
                                        Max 5 images · 5 MB each · JPG, PNG, WEBP
                                    </p>
                                    {selectedImages.length > 0 && (
                                        <p className="text-blue-600 text-sm font-medium mt-1">
                                            {selectedImages.length} new image{selectedImages.length > 1 ? 's' : ''} selected ✓
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </label>

                    {/* Image Previews */}
                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {existingImages.map((url, i) => (
                                <div key={`ex-${i}`} className="relative aspect-square">
                                    <img src={url} alt={`Saved ${i + 1}`} className="w-full h-full object-cover rounded-xl border-2 border-gray-200" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        Saved
                                    </span>
                                </div>
                            ))}
                            {imagePreviews.map((preview, i) => (
                                <div key={`new-${i}`} className="relative aspect-square">
                                    <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover rounded-xl border-2 border-blue-400" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewImage(i)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        New
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2 pb-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        type="button"
                        className={`flex-1 px-6 py-3.5 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
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

export default HotelForm;