import React, { useEffect, useState } from 'react';
import { createAutomotive, updateAutomotive, getAutomotiveById, CreateAutomotiveData } from '../services/CategoriesApi.service';
import Button from "../components/ui/Buttons";
import { typography } from "../styles/typography";

// Business Types & Availability
const businessTypes = [
    'Car Service Center', 'Bike Repair', 'Car Wash', 'Bike Wash',
    'Tyre Shop', 'Battery Shop', 'Automobile Spare Parts', 'Towing Service', 'Car Rental'
];

const availabilityOptions = ['Full Time', 'Part Time', 'On Demand', '24/7'];

const AutomotiveForm = () => {
    const getIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    const [editId, setEditId] = useState<string | null>(getIdFromUrl());
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        name: '',
        businessType: 'Car Service Center',
        phone: '',
        email: '',
        services: [] as string[],
        experience: '',
        availability: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        priceRange: '',
        description: ''
    });

    const [serviceInput, setServiceInput] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);

    // Fetch data if editing
    useEffect(() => {
        if (!editId) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const res = await getAutomotiveById(editId);
                const data = res.data;
                const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://13.204.29.0:3001';

                setFormData({
                    userId: data.userId,
                    name: data.name,
                    businessType: data.businessType,
                    phone: data.phone,
                    email: data.email,
                    services: data.services,
                    experience: data.experience.toString(),
                    availability: data.availability,
                    area: data.area,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                    priceRange: data.priceRange,
                    description: data.description
                });
                if (data.images && data.images.length > 0) {
                    setImagePreviews(data.images.map((img: string) => `${API_BASE_URL}/${img}`));
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

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddService = () => {
        if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
            setFormData(prev => ({ ...prev, services: [...prev.services, serviceInput.trim()] }));
            setServiceInput('');
        }
    };

    const handleRemoveService = (index: number) => {
        setFormData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
    };

    const handleImageChange = (e: any) => {
        if (!e.target.files) return;
        const newImages = Array.from(e.target.files) as File[];
        setImages(prev => [...prev, ...newImages]);

        newImages.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const getCurrentLocation = () => {
        setLocationLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude.toString();
                const longitude = position.coords.longitude.toString();
                setFormData(prev => ({ ...prev, latitude, longitude }));

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
                            area: data.address.suburb || data.address.neighbourhood || prev.area,
                            city: data.address.city || data.address.town || prev.city,
                            state: data.address.state || prev.state,
                            pincode: data.address.postcode || prev.pincode
                        }));
                    }
                } catch (err) {
                    console.error('Error fetching address:', err);
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

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            if (!formData.name || !formData.phone || !formData.email) {
                throw new Error('Please fill in all required fields');
            }
            if (formData.services.length === 0) {
                throw new Error('Please add at least one service');
            }

            const submitData: CreateAutomotiveData = { ...formData, images };

            if (isEditMode && editId) {
                await updateAutomotive(editId, submitData);
                setSuccessMessage('Service updated successfully!');
            } else {
                await createAutomotive(submitData);
                setSuccessMessage('Service created successfully!');
            }

            setTimeout(() => {
                window.history.back();
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={typography.body.small}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className={typography.heading.h1}>
                        {isEditMode ? 'Update Automotive Service' : 'Add Automotive Service'}
                    </h1>
                    <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        ← Back
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {successMessage}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="ABC Auto Garage"
                                />
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>
                                    Business Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {businessTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="9876543210"
                                />
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="abc@gmail.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block ${typography.form.label} mb-2`}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Multi-brand car service"
                            />
                        </div>
                    </div>

                    {/* Services Offered */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={serviceInput}
                                onChange={(e) => setServiceInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter a service (e.g., Oil Change)"
                            />
                            <Button variant="primary" size="md" onClick={handleAddService}>
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.services.map((service, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                                >
                                    {service}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveService(index)}
                                        className="text-blue-900 hover:text-red-600 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>Experience (years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="5"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>Availability</label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {availabilityOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>Price Range</label>
                                <input
                                    type="text"
                                    name="priceRange"
                                    value={formData.priceRange}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="1000-5000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                      
                        
                      

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>Area</label>
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Area"
                                />
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="City"
                                />
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="State"
                                />
                            </div>

                            <div>
                                <label className={`block ${typography.form.label} mb-2`}>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="500016"
                                />
                            </div>
                        </div>
                            <div className="flex items-center justify-end border-b pb-2">
                            <Button
                                variant="success"
                                size="md"
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                            >
                                {locationLoading ? (
                                    <>
                                        <span className="animate-spin mr-2">⌛</span>
                                        Detecting...
                                    </>
                                ) : (
                                    <>📍 Use Current Location</>
                                )}
                            </Button>
                                  {formData.latitude && formData.longitude && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                                <span className="font-semibold text-green-700">✓ Location detected:</span>
                                <span className="text-green-600 ml-2">
                                    {formData.latitude}, {formData.longitude}
                                </span>
                            </div>
                        )}
                        </div>
                        <p className={`${typography.body.xs} text-gray-500 italic`}>
                            💡 Tip: Click "Use Current Location" to auto-detect your location, or enter your address manually.
                        </p>
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                        <div>
                            <label className={`block ${typography.form.label} mb-2`}>Upload Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Service' : 'Create Service')}
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleCancel}
                            className="px-8"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomotiveForm;