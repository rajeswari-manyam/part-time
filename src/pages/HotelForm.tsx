import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHotelWithImages, updateHotel, getHotelById, Hotel } from '../services/HotelService.service';
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import subcategoriesData from '../data/subcategories.json';
import { X, Upload } from 'lucide-react';


// ── Availability options ─────────────────────────────────────────────────────
const availabilityOptions = ['Full Time', 'Part Time', 'On Demand', 'Weekends Only'];

// ── Pull hotel/travel subcategories from JSON (categoryId 4) ────────────────
const getHotelTravelSubcategories = () => {
    const hotelCategory = subcategoriesData.subcategories.find(cat => cat.categoryId === 4);
    return hotelCategory ? hotelCategory.items.map(item => item.name) : [];
};

// ============================================================================
// SHARED INPUT CLASS  (typography.form.input = "text-base sm:text-lg")
// ============================================================================
const inputBase =
    'w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg ' +
    'focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
    'placeholder-gray-400 transition ' +
    typography.form.input;

// ============================================================================
// REUSABLE LABEL  (typography.form.label = "text-base sm:text-lg font-medium")
// ============================================================================
const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <label className={`block ${typography.form.label} text-gray-700 mb-1.5`}>
        {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

// ============================================================================
// COMPONENT
// ============================================================================
const HotelForm = () => {
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

    const hotelTypes = getHotelTravelSubcategories();
    const defaultType = getSubcategoryFromUrl() || hotelTypes[0] || 'Hotels';

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        name: '',
        type: defaultType,
        email: '',
        phone: '',
        description: '',
        service: '' as string,
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

    // ── geo ──────────────────────────────────────────────────────────────────
    const [locationLoading, setLocationLoading] = useState(false);

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

    // ── generic input ────────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            if (!formData.service || formData.service.trim() === '')
                throw new Error('Please enter at least one service or skill');
            if (!formData.latitude || !formData.longitude)
                throw new Error('Please provide a valid location');

            const payload: Hotel = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
            };

            if (isEditMode && editId) {
                await updateHotel(editId, payload);
                setSuccessMessage('Service updated successfully!');
                setTimeout(() => navigate('/listed-jobs'), 1500);
            } else {
                await createHotelWithImages(payload, selectedImages);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className={`${typography.body.small} text-gray-600`}>Loading...</p>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER
    // ============================================================================
    return (
        <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-4xl mx-auto">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h1 className={`${typography.heading.h3} text-gray-800 leading-tight`}>
                        {isEditMode ? 'Update Service' : 'Add Service'}
                    </h1>
                    <button
                        onClick={handleCancel}
                        className={`flex items-center gap-1 px-3 py-2 ${typography.body.small} text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition`}
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
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-5 sm:space-y-6">

                    {/* ─── 1. NAME | TYPE ──────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <FieldLabel required>Business Name</FieldLabel>
                            <input
                                type="text" name="name" value={formData.name}
                                onChange={handleInputChange}
                                placeholder="ABC Auto Garage"
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <FieldLabel required>Business Type</FieldLabel>
                            <select
                                name="type" value={formData.type}
                                onChange={handleInputChange}
                                className={inputBase + ' bg-white'}
                            >
                                {hotelTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
                                placeholder="abc@gmail.com"
                                className={inputBase}
                            />
                        </div>
                    </div>

                    {/* ─── 3. DESCRIPTION ──────────────────────────────── */}
                    <div>
                        <FieldLabel>Description</FieldLabel>
                        <textarea
                            name="description" value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Multi-brand car service"
                            className={inputBase + ' resize-y'}
                        />
                    </div>

                    {/* ─── 4. SERVICES / SKILLS ─────────────────────────────────── */}
                    <div className="space-y-3">
                        <FieldLabel required>Services / Skills (comma-separated)</FieldLabel>

                        <textarea
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="WiFi, Breakfast Included, Parking, Swimming Pool, Gym, Spa, Room Service"
                            className={inputBase + ' resize-y'}
                        />

                        <p className={`${typography.misc.caption} text-gray-500`}>
                            💡 Enter your services or skills separated by commas. Example: WiFi, Parking, AC Repair, Oil Change
                        </p>

                        {/* Display entered services as chips */}
                        {formData.service && formData.service.trim() && (
                            <div>
                                <p className={`${typography.misc.caption} mb-1.5`}>Preview:</p>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {formData.service.split(',').map((s, i) => {
                                        const trimmed = s.trim();
                                        if (!trimmed) return null;
                                        return (
                                            <span key={i} className={`bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full ${typography.misc.badge} flex items-center gap-1.5`}>
                                                ✓ {trimmed}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── 5. EXPERIENCE | AVAILABILITY ───────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                            <FieldLabel>Availability</FieldLabel>
                            <select
                                name="availability" value={formData.availability}
                                onChange={handleInputChange}
                                className={inputBase + ' bg-white'}
                            >
                                {availabilityOptions.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ─── 6. PRICE RANGE ──────────────────────────────── */}
                    <div>
                        <FieldLabel>Price Range (₹)</FieldLabel>
                        <input
                            type="text" name="priceRange" value={formData.priceRange}
                            onChange={handleInputChange}
                            placeholder="1000-5000"
                            className={inputBase}
                        />
                    </div>

                    {/* ─── 7. LOCATION ─────────────────────────────────── */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <FieldLabel>Area</FieldLabel>
                                <input type="text" name="area" value={formData.area} onChange={handleInputChange}
                                    placeholder="Area" className={inputBase} />
                            </div>
                            <div>
                                <FieldLabel>City</FieldLabel>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                    placeholder="City" className={inputBase} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <FieldLabel>State</FieldLabel>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                                    placeholder="State" className={inputBase} />
                            </div>
                            <div>
                                <FieldLabel>Pincode</FieldLabel>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                                    placeholder="500016" className={inputBase} />
                            </div>
                        </div>

                        {/* Use Current Location  →  Button variant="success" */}
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

                    {/* ─── 8. UPLOAD IMAGES ────────────────────────────── */}
                    <div className="space-y-3">
                        <FieldLabel>Upload Images</FieldLabel>

                        <label className="cursor-pointer">
                            <input
                                type="file" accept="image/*" multiple
                                onChange={handleImageSelect} className="hidden"
                                disabled={selectedImages.length + existingImages.length >= 5}
                            />
                            <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition ${selectedImages.length + existingImages.length >= 5
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
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

                        {/* previews – remove btn always visible mobile, hover on sm+ */}
                        {(existingImages.length > 0 || imagePreviews.length > 0) && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                                {existingImages.map((url, i) => (
                                    <div key={`ex-${i}`} className="relative group">
                                        <img src={url} alt={`Saved ${i + 1}`}
                                            className="w-full h-22 sm:h-28 object-cover rounded-lg border-2 border-gray-200" />
                                        <button type="button" onClick={() => handleRemoveExistingImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition"
                                        ><X className="w-3.5 h-3.5" /></button>
                                        <span className={`absolute bottom-1 left-1 bg-blue-600 text-white ${typography.fontSize.xs} px-1.5 py-0.5 rounded`}>Saved</span>
                                    </div>
                                ))}
                                {imagePreviews.map((preview, i) => (
                                    <div key={`new-${i}`} className="relative group">
                                        <img src={preview} alt={`Preview ${i + 1}`}
                                            className="w-full h-22 sm:h-28 object-cover rounded-lg border-2 border-blue-400" />
                                        <button type="button" onClick={() => handleRemoveNewImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition"
                                        ><X className="w-3.5 h-3.5" /></button>
                                        <span className={`absolute bottom-1 left-1 bg-green-600 text-white ${typography.fontSize.xs} px-1.5 py-0.5 rounded`}>New</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── 9. SUBMIT ───────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="primary" size="lg" fullWidth
                            onClick={handleSubmit} disabled={loading}
                        >
                            {loading
                                ? (isEditMode ? 'Updating...' : 'Creating...')
                                : (isEditMode ? 'Update Service' : 'Create Service')}
                        </Button>
                        <Button
                            variant="secondary" size="lg"
                            onClick={handleCancel}
                            className="w-full sm:w-auto sm:px-8"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelForm;