import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createBeautyWorker,
    updateBeautyWorker,
    getBeautyWorkerById,
    BeautyWorker
} from "../services/Beauty.Service.service";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import { X, Upload } from 'lucide-react';

// Beauty Categories — these are the ONLY valid values saved to the database.
// Every other file that filters by category must match these exactly.
const beautyCategories = [
    'Hair Stylist',
    'Makeup Artist',
    'Nail Technician',
    'Spa Therapist',
    'Beautician',
    'Massage Therapist',
    'Skincare Specialist',
    'Beauty Parlour',
    'Fitness Trainer',
    'Yoga Instructor',
    'Tattoo Artist',
    'Mehendi Artist'
];

// Availability options
const availabilityOptions = ['Full Time', 'Part Time', 'On Demand', 'Weekends Only'];

// ============================================================================
// MAP URL SUBCATEGORY SLUG → DEFAULT FORM CATEGORY
// This mirrors the inverse of getCategoriesFromSubcategory in BeautyServicesList.
// When the user lands on the form via a subcategory link we pre-select the most
// relevant single category from beautyCategories[].
// ============================================================================
const getDefaultCategoryFromSlug = (slug: string | null): string => {
    if (!slug) return beautyCategories[0];

    const n = slug.toLowerCase();

    if (n.includes("spa") || n.includes("massage")) return "Spa Therapist";
    if (n.includes("fitness") || n.includes("gym")) return "Fitness Trainer";
    if (n.includes("makeup") || n.includes("make-up")) return "Makeup Artist";
    if (n.includes("salon") || n.includes("saloon") || n.includes("hair")) return "Hair Stylist";
    if (n.includes("yoga")) return "Yoga Instructor";
    if (n.includes("tattoo")) return "Tattoo Artist";
    if (n.includes("mehendi") || n.includes("mehndi")) return "Mehendi Artist";
    if (n.includes("nail")) return "Nail Technician";
    if (n.includes("skin")) return "Skincare Specialist";
    if (n.includes("beauty") && n.includes("parlour")) return "Beauty Parlour";
    if (n.includes("beautician")) return "Beautician";

    return beautyCategories[0];
};

// ============================================================================
// SHARED INPUT CLASS
// ============================================================================
const inputBase =
    'w-full px-3 py-2.5 sm:py-2 border border-rose-200 rounded-lg ' +
    'focus:ring-2 focus:ring-rose-300 focus:border-transparent ' +
    'placeholder-gray-400 transition ' +
    typography.form.input;

// ============================================================================
// REUSABLE LABEL
// ============================================================================
const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <label className={`block ${typography.form.label} text-gray-700 mb-1.5`}>
        {children}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
);

// ============================================================================
// COMPONENT
// ============================================================================
const BeautyServiceForm = () => {
    const navigate = useNavigate();

    // ── URL helpers ──────────────────────────────────────────────────────────
    const getIdFromUrl = () => new URLSearchParams(window.location.search).get('id');
    const getSubcategoryFromUrl = () => new URLSearchParams(window.location.search).get('subcategory');

    // ── state ────────────────────────────────────────────────────────────────
    const [editId] = useState<string | null>(getIdFromUrl());
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Derive the default category from the URL slug using the shared mapping
    const defaultCategory = getDefaultCategoryFromSlug(getSubcategoryFromUrl());

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        name: '',
        category: defaultCategory,
        email: '',
        phone: '',
        bio: '',
        services: '' as string,
        experience: '',
        serviceCharge: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        availability: true
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
                const data = await getBeautyWorkerById(editId);
                if (!data) throw new Error('Service not found');

                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

                // Convert services array to comma-separated string
                const servicesString = Array.isArray(data.services)
                    ? data.services.join(', ')
                    : data.services || '';

                setFormData(prev => ({
                    ...prev,
                    userId: data.userId || '',
                    name: data.name || '',
                    category: data.category || defaultCategory,
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    services: servicesString,
                    experience: data.experience?.toString() || '',
                    serviceCharge: data.serviceCharge?.toString() || '',
                    area: data.area || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    latitude: data.latitude?.toString() || '',
                    longitude: data.longitude?.toString() || '',
                    availability: data.availability !== undefined ? data.availability : true,
                }));

                if (data.images && Array.isArray(data.images)) {
                    setExistingImages(data.images.map((img: string) => `${API_BASE_URL}/${img}`));
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

    // ── generic input ────────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // ── image helpers ────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const availableSlots = 5 - (selectedImages.length + existingImages.length);
        if (availableSlots <= 0) { setError('Maximum 5 images allowed'); return; }

        const validFiles = files.slice(0, availableSlots).filter(file => {
            if (!file.type.startsWith('image/')) { setError(`${file.name} is not a valid image`); return false; }
            if (file.size > 5 * 1024 * 1024) { setError(`${file.name} exceeds 5 MB`); return false; }
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
        if (!navigator.geolocation) { setError('Geolocation not supported'); setLocationLoading(false); return; }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude.toString();
                const lng = pos.coords.longitude.toString();
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await res.json();
                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
                            area: data.address.suburb || data.address.neighbourhood || prev.area,
                            city: data.address.city || data.address.town || prev.city,
                            state: data.address.state || prev.state,
                            pincode: data.address.postcode || prev.pincode,
                        }));
                    }
                } catch (e) { console.error(e); }
                setLocationLoading(false);
            },
            (err) => { setError(`Location error: ${err.message}`); setLocationLoading(false); },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
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
            if (!formData.services || formData.services.trim() === '')
                throw new Error('Please enter at least one service');
            if (!formData.latitude || !formData.longitude)
                throw new Error('Please provide a valid location');

            // Convert services string to array
            const servicesArray = formData.services.split(',').map(s => s.trim()).filter(Boolean);

            const payload: Partial<BeautyWorker> = {
                ...formData,
                services: servicesArray,
                experience: formData.experience ? Number(formData.experience) : undefined,
                serviceCharge: formData.serviceCharge ? Number(formData.serviceCharge) : undefined,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
            };

            if (isEditMode && editId) {
                await updateBeautyWorker(editId, payload, selectedImages[0]);
                setSuccessMessage('Service updated successfully! ✨');
                setTimeout(() => navigate('/listed-jobs'), 1500);
            } else {
                await createBeautyWorker(payload);
                setSuccessMessage('Service created successfully! ✨');
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
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-lg font-light text-gray-600 tracking-wide">Loading...</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-4xl mx-auto">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {isEditMode ? 'Update Beauty Service' : 'Add Beauty Service'}
                    </h1>
                    <button
                        onClick={handleCancel}
                        className={`flex items-center gap-1 px-3 py-2 ${typography.body.small} text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition`}
                    >
                        ← Back
                    </button>
                </div>

                {/* ── Alerts ── */}
                {error && (
                    <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg ${typography.form.error}`}>
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className={`mb-4 p-3 bg-green-50 border border-green-200 rounded-lg ${typography.body.small} text-green-700`}>
                        {successMessage}
                    </div>
                )}

                {/* ── White card ── */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 sm:p-6 space-y-5 sm:space-y-6 border border-rose-100">

                    {/* ─── 1. NAME | CATEGORY ──────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <FieldLabel required>Your Name</FieldLabel>
                            <input
                                type="text" name="name" value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Jane Doe"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel required>Category</FieldLabel>
                            <select
                                name="category" value={formData.category}
                                onChange={handleInputChange}
                                className={inputBase + ' bg-white'}
                            >
                                {beautyCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ─── 2. PHONE | EMAIL ────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <FieldLabel required>Phone</FieldLabel>
                            <input
                                type="tel" name="phone" value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="9876543210"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel required>Email</FieldLabel>
                            <input
                                type="email" name="email" value={formData.email}
                                onChange={handleInputChange}
                                placeholder="jane@example.com"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    {/* ─── 3. BIO ──────────────────────────────────── */}
                    <div>
                        <FieldLabel>Bio / About You</FieldLabel>
                        <textarea
                            name="bio" value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Tell clients about your expertise and passion..."
                            className={inputBase + ' resize-y'}
                        />
                    </div>

                    {/* ─── 4. SERVICES ─────────────────────────────────── */}
                    <div className="space-y-3">
                        <FieldLabel required>Services Offered (comma-separated)</FieldLabel>

                        <textarea
                            name="services"
                            value={formData.services}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Bridal Makeup, Hair Coloring, Facial Treatment, Manicure, Pedicure"
                            className={inputBase + ' resize-y'}
                        />

                        <p className={`${typography.misc.caption} text-gray-500`}>
                            💡 Enter your services separated by commas. Example: Bridal Makeup, Hair Styling, Facial
                        </p>

                        {/* Display entered services as chips */}
                        {formData.services && formData.services.trim() && (
                            <div>
                                <p className={`${typography.misc.caption} mb-1.5`}>Preview:</p>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {formData.services.split(',').map((s, i) => {
                                        const trimmed = s.trim();
                                        if (!trimmed) return null;
                                        return (
                                            <span key={i} className={`bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full ${typography.misc.badge} flex items-center gap-1.5`}>
                                                ✓ {trimmed}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── 5. EXPERIENCE | SERVICE CHARGE | AVAILABILITY ───────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                            <FieldLabel>Experience (years)</FieldLabel>
                            <input
                                type="number" name="experience" value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="5" min="0"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel>Service Charge (₹)</FieldLabel>
                            <input
                                type="number" name="serviceCharge" value={formData.serviceCharge}
                                onChange={handleInputChange}
                                placeholder="1000" min="0"
                                className={inputBase}
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer pb-2">
                                <input
                                    type="checkbox"
                                    name="availability"
                                    checked={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400"
                                />
                                <span className={`${typography.body.small} text-gray-700`}>
                                    Currently Available
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* ─── 6. LOCATION ─────────────────────────────────── */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <FieldLabel>Area</FieldLabel>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange}
                                    placeholder="Banjara Hills" className={inputBase} />
                            </div>
                            <div>
                                <FieldLabel>City</FieldLabel>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                    placeholder="Hyderabad" className={inputBase} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <FieldLabel>State</FieldLabel>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                                    placeholder="Telangana" className={inputBase} />
                            </div>
                            <div>
                                <FieldLabel>Pincode</FieldLabel>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                                    placeholder="500034" className={inputBase} />
                            </div>
                        </div>

                        {/* Use Current Location */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-1">
                            <Button
                                variant="success"
                                size="md"
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                                className="w-full sm:w-auto justify-center"
                            >
                                {locationLoading
                                    ? <><span className="animate-spin mr-1">⌛</span> Detecting...</>
                                    : <>📍 Use Current Location</>
                                }
                            </Button>

                            {formData.latitude && formData.longitude && (
                                <div className={`w-full sm:w-auto p-2 bg-green-50 border border-green-200 rounded-lg ${typography.form.helper} text-center sm:text-left`}>
                                    <span className="font-semibold text-green-700">✓ Location:</span>
                                    <span className="text-green-600 ml-1">{formData.latitude}, {formData.longitude}</span>
                                </div>
                            )}
                        </div>

                        {/* Tip */}
                        <p className={typography.misc.caption}>
                            💡 Tip: Tap "Use Current Location" to auto-detect your location, or enter your address manually.
                        </p>
                    </div>

                    {/* ─── 7. UPLOAD IMAGES ────────────────────────────── */}
                    <div className="space-y-3">
                        <FieldLabel>Portfolio Images</FieldLabel>

                        <label className="cursor-pointer">
                            <input
                                type="file" accept="image/*" multiple
                                onChange={handleImageSelect} className="hidden"
                                disabled={selectedImages.length + existingImages.length >= 5}
                            />
                            <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition ${selectedImages.length + existingImages.length >= 5
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'border-rose-200 hover:border-rose-400 hover:bg-rose-50/30'
                                }`}>
                                <Upload className="w-5 h-5 text-gray-500 shrink-0" />
                                <span className={`${typography.body.small} text-gray-600`}>
                                    {selectedImages.length + existingImages.length >= 5
                                        ? 'Maximum 5 images reached'
                                        : 'Click to upload images'}
                                </span>
                                <span className={`${typography.misc.caption} ml-auto shrink-0`}>
                                    Max 5 · 5 MB each
                                </span>
                            </div>
                        </label>

                        {/* previews */}
                        {(existingImages.length > 0 || imagePreviews.length > 0) && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                                {existingImages.map((url, i) => (
                                    <div key={`ex-${i}`} className="relative group">
                                        <img src={url} alt={`Saved ${i + 1}`}
                                            className="w-full h-22 sm:h-28 object-cover rounded-lg border-2 border-rose-200" />
                                        <button type="button" onClick={() => handleRemoveExistingImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition"
                                        ><X className="w-3.5 h-3.5" /></button>
                                        <span className={`absolute bottom-1 left-1 bg-rose-600 text-white ${typography.fontSize.xs} px-1.5 py-0.5 rounded`}>Saved</span>
                                    </div>
                                ))}
                                {imagePreviews.map((preview, i) => (
                                    <div key={`new-${i}`} className="relative group">
                                        <img src={preview} alt={`Preview ${i + 1}`}
                                            className="w-full h-22 sm:h-28 object-cover rounded-lg border-2 border-rose-400" />
                                        <button type="button" onClick={() => handleRemoveNewImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition"
                                        ><X className="w-3.5 h-3.5" /></button>
                                        <span className={`absolute bottom-1 left-1 bg-green-600 text-white ${typography.fontSize.xs} px-1.5 py-0.5 rounded`}>New</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── 8. SUBMIT ───────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="primary" size="lg" fullWidth
                            onClick={handleSubmit} disabled={loading}
                            className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500"
                        >
                            {loading
                                ? (isEditMode ? 'Updating...' : 'Creating...')
                                : (isEditMode ? '✨ Update Service' : '✨ Create Service')}
                        </Button>
                        <Button
                            variant="secondary" size="lg"
                            onClick={handleCancel}
                            className="w-full sm:w-auto sm:px-8 border-rose-200 hover:bg-rose-50"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeautyServiceForm;