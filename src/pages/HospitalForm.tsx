import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createHospital,
    updateHospital,
    getHospitalById,
    CreateHospitalPayload,
} from '../services/HospitalService.service';
import Button from '../components/ui/Buttons';
import typography from '../styles/typography';
import subcategoriesData from '../data/subcategories.json';
import { X, Upload, MapPin, Building2, Stethoscope, Briefcase } from 'lucide-react';

// ── Pull hospital subcategories from JSON (categoryId 2) ────────────────────
const getHospitalSubcategories = () => {
    const hospitalCategory = subcategoriesData.subcategories.find(
        (cat: any) => cat.categoryId === 2
    );
    return hospitalCategory
        ? hospitalCategory.items.map((item: any) => item.name)
        : [];
};

// ============================================================================
// SHARED INPUT CLASS WITH ENHANCED STYLING
// ============================================================================
const inputBase =
    'w-full px-4 py-3 border border-gray-300 rounded-xl ' +
    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ' +
    'placeholder-gray-400 transition-all duration-200 ' +
    'hover:border-gray-400 ' +
    typography.form.input;

const textareaBase =
    'w-full px-4 py-3 border border-gray-300 rounded-xl ' +
    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ' +
    'placeholder-gray-400 transition-all duration-200 resize-y ' +
    'hover:border-gray-400 min-h-[100px] ' +
    typography.form.input;

// ============================================================================
// REUSABLE LABEL WITH ICON SUPPORT
// ============================================================================
const FieldLabel: React.FC<{
    children: React.ReactNode;
    required?: boolean;
    icon?: React.ReactNode;
}> = ({ children, required, icon }) => (
    <label className={`flex items-center gap-2 ${typography.form.label} text-gray-700 font-semibold mb-2`}>
        {icon && <span className="text-emerald-600">{icon}</span>}
        {children}
        {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

// ============================================================================
// SECTION DIVIDER
// ============================================================================
const SectionDivider: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-3 pt-4 pb-2">
        {icon && <span className="text-emerald-600 text-xl">{icon}</span>}
        <h2 className={`${typography.heading.h4} text-gray-800 font-bold`}>{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-3"></div>
    </div>
);

// ============================================================================
// COMPONENT
// ============================================================================
const HospitalForm = () => {
    const navigate = useNavigate();

    // ── URL helpers ──────────────────────────────────────────────────────────
    const getIdFromUrl = () => new URLSearchParams(window.location.search).get('id');
    const getSubcategoryFromUrl = () => {
        const sub = new URLSearchParams(window.location.search).get('subcategory');
        return sub
            ? sub.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            : null;
    };

    // ── state ────────────────────────────────────────────────────────────────
    const [editId] = useState<string | null>(getIdFromUrl());
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const hospitalTypes = getHospitalSubcategories();
    const defaultType = getSubcategoryFromUrl() || hospitalTypes[0] || 'Hospitals';

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        hospitalName: '',
        hospitalType: defaultType,
        departments: '',
        description: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        services: '',
    });

    // ── images ───────────────────────────────────────────────────────────────
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // ── geo ──────────────────────────────────────────────────────────────────
    const [locationLoading, setLocationLoading] = useState(false);

    // ── fetch for edit ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!editId) return;
        const fetchData = async () => {
            setLoadingData(true);
            try {
                const response = await getHospitalById(editId);
                if (!response.success || !response.data)
                    throw new Error('Hospital not found');

                const data = response.data;

                setFormData((prev) => ({
                    ...prev,
                    userId: prev.userId,
                    hospitalName: data.name || '',
                    hospitalType: data.hospitalType || defaultType,
                    departments: data.departments || '',
                    area: data.area || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    latitude: data.latitude?.toString() || '',
                    longitude: data.longitude?.toString() || '',
                    services: data.services || '',
                }));

                if (data.images && Array.isArray(data.images))
                    setExistingImages(data.images);
            } catch (err) {
                console.error(err);
                setError('Failed to load hospital data');
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [editId]);

    // ── generic input ────────────────────────────────────────────────────────
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

        const validFiles = files.slice(0, availableSlots).filter((file) => {
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
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === validFiles.length)
                    setImagePreviews((prev) => [...prev, ...newPreviews]);
            };
            reader.readAsDataURL(file);
        });
        setSelectedImages((prev) => [...prev, ...validFiles]);
        setError('');
    };

    const handleRemoveNewImage = (i: number) => {
        setSelectedImages((prev) => prev.filter((_, idx) => idx !== i));
        setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
    };
    const handleRemoveExistingImage = (i: number) =>
        setExistingImages((prev) => prev.filter((_, idx) => idx !== i));

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
                setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await res.json();
                    if (data.address) {
                        setFormData((prev) => ({
                            ...prev,
                            area: data.address.suburb || data.address.neighbourhood || prev.area,
                            city: data.address.city || data.address.town || prev.city,
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
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    // ── submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            if (!formData.hospitalName || !formData.departments || !formData.services)
                throw new Error(
                    'Please fill in all required fields (Name, Departments, Services)'
                );
            if (!formData.latitude || !formData.longitude)
                throw new Error('Please provide a valid location');

            if (isEditMode && editId) {
                // Update
                await updateHospital(editId, {
                    hospitalName: formData.hospitalName,
                    hospitalType: formData.hospitalType,
                    departments: formData.departments,
                    area: formData.area,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    services: formData.services,
                    images: selectedImages,
                });
                setSuccessMessage('Hospital updated successfully!');
                setTimeout(() => navigate('/listed-jobs'), 1500);
            } else {
                // Create
                const payload: CreateHospitalPayload = {
                    userId: formData.userId,
                    hospitalName: formData.hospitalName,
                    hospitalType: formData.hospitalType,
                    departments: formData.departments,
                    area: formData.area,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    services: formData.services,
                    images: selectedImages,
                };
                await createHospital(payload);
                setSuccessMessage('Hospital created successfully!');
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-600 mx-auto mb-4" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className={`${typography.body.base} text-gray-600 font-medium`}>Loading hospital data...</p>
                    <p className={`${typography.body.small} text-gray-400 mt-2`}>Please wait</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-gray-50 px-3 sm:px-4 py-6 sm:py-8">
            <div className="max-w-5xl mx-auto">

                {/* ── Header with Gradient ── */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <div>
                                <h1 className={`${typography.heading.h2} text-gray-800 font-bold leading-tight`}>
                                    {isEditMode ? 'Update Hospital' : 'Add New Hospital'}
                                </h1>
                                <p className={`${typography.body.small} text-gray-500 mt-0.5`}>
                                    {isEditMode ? 'Update your hospital information' : 'Register your healthcare facility'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancel}
                            className={`flex items-center gap-2 px-4 py-2.5 ${typography.body.small} text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow`}
                        >
                            ← Back
                        </button>
                    </div>
                </div>

                {/* ── Alerts with Enhanced Styling ── */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                                <span className="text-red-600 text-xs font-bold">!</span>
                            </div>
                            <p className={`${typography.body.small} text-red-700 flex-1`}>{error}</p>
                        </div>
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                <span className="text-green-600 text-xs font-bold">✓</span>
                            </div>
                            <p className={`${typography.body.small} text-green-700 flex-1`}>{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* ── Main Form Card with Sections ── */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-5 sm:p-8 space-y-8">

                        {/* ─── SECTION 1: BASIC INFO ───────────────────────── */}
                        <div>
                            <SectionDivider title="Basic Information" icon={<Building2 className="w-5 h-5" />} />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
                                <div className="space-y-2">
                                    <FieldLabel required icon={<Building2 className="w-4 h-4" />}>
                                        Hospital Name
                                    </FieldLabel>
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={formData.hospitalName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Apollo Hospitals"
                                        className={inputBase}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FieldLabel required icon={<Stethoscope className="w-4 h-4" />}>
                                        Hospital Type
                                    </FieldLabel>
                                    <select
                                        name="hospitalType"
                                        value={formData.hospitalType}
                                        onChange={handleInputChange}
                                        className={inputBase + ' bg-white cursor-pointer'}
                                    >
                                        {hospitalTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 2: DEPARTMENTS ──────────────────────── */}
                        <div>
                            <SectionDivider title="Departments" icon={<Briefcase className="w-5 h-5" />} />

                            <div className="mt-6 space-y-2">
                                <FieldLabel required>Available Departments</FieldLabel>
                                <textarea
                                    name="departments"
                                    value={formData.departments}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Cardiology, Orthopaedics, Neurology, Dermatology, Pediatrics"
                                    className={textareaBase}
                                />
                                <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <span className="text-blue-600 mt-0.5">💡</span>
                                    <p className={`${typography.misc.caption} text-blue-700`}>
                                        Separate each department with a comma. This helps patients find the right specialists.
                                    </p>
                                </div>

                                {/* Department chips preview with enhanced styling */}
                                {formData.departments && formData.departments.trim() && (
                                    <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                        <p className={`${typography.misc.caption} text-emerald-800 font-semibold mb-3 flex items-center gap-2`}>
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                            Preview: {formData.departments.split(',').filter(d => d.trim()).length} departments
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.departments.split(',').map((d, i) => {
                                                const trimmed = d.trim();
                                                if (!trimmed) return null;
                                                return (
                                                    <span
                                                        key={i}
                                                        className="group bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg shadow-sm border border-emerald-200 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="text-emerald-500 group-hover:scale-110 transition-transform">🏥</span>
                                                            <span className={`${typography.misc.badge} font-medium`}>{trimmed}</span>
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─── SECTION 3: SERVICES ─────────────────────────── */}
                        <div>
                            <SectionDivider title="Services & Facilities" icon={<Stethoscope className="w-5 h-5" />} />

                            <div className="mt-6 space-y-2">
                                <FieldLabel required>Available Services</FieldLabel>
                                <textarea
                                    name="services"
                                    value={formData.services}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Emergency Care, ICU, Lab Tests, X-Ray, CT Scan, MRI, Surgery, Dialysis, Pharmacy"
                                    className={textareaBase}
                                />
                                <div className="flex items-start gap-2 mt-2 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                                    <span className="text-purple-600 mt-0.5">💡</span>
                                    <p className={`${typography.misc.caption} text-purple-700`}>
                                        List all medical services and facilities available at your hospital, separated by commas.
                                    </p>
                                </div>

                                {/* Service chips preview with enhanced styling */}
                                {formData.services && formData.services.trim() && (
                                    <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <p className={`${typography.misc.caption} text-blue-800 font-semibold mb-3 flex items-center gap-2`}>
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            Preview: {formData.services.split(',').filter(s => s.trim()).length} services
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.services.split(',').map((s, i) => {
                                                const trimmed = s.trim();
                                                if (!trimmed) return null;
                                                return (
                                                    <span
                                                        key={i}
                                                        className="group bg-white hover:bg-blue-50 text-blue-700 px-3 py-2 rounded-lg shadow-sm border border-blue-200 transition-all duration-200 hover:shadow-md hover:scale-105"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="text-blue-500 group-hover:scale-110 transition-transform">✓</span>
                                                            <span className={`${typography.misc.badge} font-medium`}>{trimmed}</span>
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─── SECTION 4: LOCATION ─────────────────────────── */}
                        <div>
                            <SectionDivider title="Location Details" icon={<MapPin className="w-5 h-5" />} />

                            <div className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <FieldLabel>Area / Locality</FieldLabel>
                                        <input
                                            type="text"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Banjara Hills"
                                            className={inputBase}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel>City</FieldLabel>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Hyderabad"
                                            className={inputBase}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <FieldLabel>State</FieldLabel>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Telangana"
                                            className={inputBase}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FieldLabel>Pincode</FieldLabel>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 500016"
                                            className={inputBase}
                                        />
                                    </div>
                                </div>

                                {/* Enhanced Location Button & Status */}
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border border-emerald-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <Button
                                            variant="success"
                                            size="md"
                                            onClick={getCurrentLocation}
                                            disabled={locationLoading}
                                            className="flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            {locationLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    <span>Detecting Location...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Use Current Location</span>
                                                </>
                                            )}
                                        </Button>

                                        {formData.latitude && formData.longitude && (
                                            <div className="flex-1 p-3 bg-white border border-emerald-300 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="font-semibold text-green-700 text-sm">Location Captured:</span>
                                                </div>
                                                <p className="text-green-600 text-xs mt-1 font-mono">
                                                    {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2 mt-4 p-3 bg-white/70 rounded-lg">
                                        <span className="text-emerald-600 mt-0.5">📍</span>
                                        <p className={`${typography.misc.caption} text-emerald-800`}>
                                            Click the button to automatically detect your location, or enter your address manually above.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── SECTION 5: IMAGES ───────────────────────────── */}
                        <div>
                            <SectionDivider title="Hospital Images" icon={<Upload className="w-5 h-5" />} />

                            <div className="mt-6 space-y-4">
                                <FieldLabel>Upload Images (Optional)</FieldLabel>

                                <label className="cursor-pointer block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        disabled={selectedImages.length + existingImages.length >= 5}
                                    />
                                    <div
                                        className={`group relative flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed rounded-xl transition-all duration-300 ${selectedImages.length + existingImages.length >= 5
                                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-lg'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-full transition-all duration-300 ${selectedImages.length + existingImages.length >= 5
                                            ? 'bg-gray-200'
                                            : 'bg-emerald-100 group-hover:bg-emerald-200 group-hover:scale-110'
                                            }`}>
                                            <Upload className={`w-8 h-8 ${selectedImages.length + existingImages.length >= 5
                                                ? 'text-gray-400'
                                                : 'text-emerald-600'
                                                }`} />
                                        </div>

                                        <div className="text-center">
                                            <p className={`${typography.body.base} font-semibold ${selectedImages.length + existingImages.length >= 5
                                                ? 'text-gray-500'
                                                : 'text-gray-700 group-hover:text-emerald-700'
                                                }`}>
                                                {selectedImages.length + existingImages.length >= 5
                                                    ? 'Maximum 5 images reached'
                                                    : 'Click to upload hospital images'}
                                            </p>
                                            <p className={`${typography.body.small} text-gray-500 mt-1`}>
                                                Max 5 images • 5 MB each • JPG, PNG, WEBP
                                            </p>
                                        </div>

                                        {(selectedImages.length + existingImages.length > 0) && (
                                            <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                                {selectedImages.length + existingImages.length} / 5
                                            </div>
                                        )}
                                    </div>
                                </label>

                                {/* Enhanced Image Previews */}
                                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
                                        {existingImages.map((url, i) => (
                                            <div key={`ex-${i}`} className="relative group">
                                                <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 shadow-md group-hover:shadow-xl transition-all duration-300">
                                                    <img
                                                        src={url}
                                                        alt={`Saved ${i + 1}`}
                                                        className="w-full h-32 sm:h-36 object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(i)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow-md font-semibold">
                                                        Saved
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {imagePreviews.map((preview, i) => (
                                            <div key={`new-${i}`} className="relative group">
                                                <div className="relative overflow-hidden rounded-xl border-2 border-emerald-400 shadow-md group-hover:shadow-xl transition-all duration-300">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${i + 1}`}
                                                        className="w-full h-32 sm:h-36 object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewImage(i)}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow-md font-semibold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                        New
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ─── FOOTER: SUBMIT BUTTONS ───────────────────────── */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 sm:px-8 py-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                                className="shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        {isEditMode ? 'Updating Hospital...' : 'Creating Hospital...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {isEditMode ? (
                                            <>
                                                <Building2 className="w-5 h-5" />
                                                Update Hospital
                                            </>
                                        ) : (
                                            <>
                                                <Building2 className="w-5 h-5" />
                                                Create Hospital
                                            </>
                                        )}
                                    </span>
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={handleCancel}
                                className="w-full sm:w-auto sm:px-10 font-semibold"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className={`${typography.body.small} text-gray-500`}>
                        All fields marked with <span className="text-red-500">*</span> are required
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HospitalForm;