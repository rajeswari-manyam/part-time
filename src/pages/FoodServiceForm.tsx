import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FoodServiceAPI, { CreateFoodServiceData }  from "../services/FoodService.service";
import Button from "../components/ui/Buttons";
import { typography } from "../styles/typography";
import { ArrowLeft, MapPin, Store, Phone, Mail, Tag } from 'lucide-react';

// Food Service Types
const foodServiceTypes = [
    { value: 'Restaurant', icon: '🍽️', label: 'Restaurant' },
    { value: 'Cafe', icon: '☕', label: 'Cafe' },
    { value: 'Bakery', icon: '🍰', label: 'Bakery' },
    { value: 'Street Food', icon: '🌮', label: 'Street Food' },
    { value: 'Juice Shop', icon: '🥤', label: 'Juice & Smoothie Shop' },
    { value: 'Sweet Shop', icon: '🍬', label: 'Sweet Shop' },
    { value: 'Ice Cream Parlour', icon: '🍦', label: 'Ice Cream Parlour' },
    { value: 'Fast Food', icon: '🍔', label: 'Fast Food' },
    { value: 'Cloud Kitchen', icon: '🍱', label: 'Cloud Kitchen' },
    { value: 'Catering Service', icon: '🎂', label: 'Catering Service' },
];

const FoodServiceForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId') || '',
        name: '',
        type: 'Restaurant',
        icon: '🍽️',
        phone: '',
        email: '',
        description: '',
        specialties: [] as string[],
        area: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
        priceRange: '',
        status: 'true',
        openingTime: '',
        closingTime: '',
        cuisineType: '',
    });

    const [specialtyInput, setSpecialtyInput] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);

    // Fetch data if editing
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const res = await FoodServiceAPI.getFoodServiceById(id);
                if (res.success && res.data) {
                    const data = res.data;
                    setFormData({
                        userId: data.userId,
                        name: data.name,
                        type: data.type,
                        icon: data.icon,
                        phone: '', // Add if available in API
                        email: '', // Add if available in API
                        description: '', // Add if available in API
                        specialties: [], // Add if available in API
                        area: data.area,
                        city: data.city,
                        state: data.state,
                        pincode: data.pincode,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        priceRange: '', // Add if available in API
                        status: data.status ? 'true' : 'false',
                        openingTime: '', // Add if available in API
                        closingTime: '', // Add if available in API
                        cuisineType: '', // Add if available in API
                    });
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load service data');
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Update icon when type changes
        if (name === 'type') {
            const selectedType = foodServiceTypes.find(t => t.value === value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                icon: selectedType?.icon || '🍽️'
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddSpecialty = () => {
        if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
            setFormData(prev => ({
                ...prev,
                specialties: [...prev.specialties, specialtyInput.trim()]
            }));
            setSpecialtyInput('');
        }
    };

    const handleRemoveSpecialty = (index: number) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.filter((_, i) => i !== index)
        }));
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
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
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
            // Validation
            if (!formData.name || !formData.type || !formData.area || !formData.city) {
                throw new Error('Please fill in all required fields');
            }

            // Prepare data for API
            const submitData: CreateFoodServiceData = {
                userId: formData.userId,
                name: formData.name,
                type: formData.type,
                icon: formData.icon,
                area: formData.area,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                latitude: formData.latitude,
                longitude: formData.longitude,
                status: formData.status,
            };

            if (isEditMode && id) {
                const response = await FoodServiceAPI.updateFoodService(id, submitData);
                if (response.success) {
                    setSuccessMessage('Service updated successfully!');
                    setTimeout(() => navigate('/food-services/all'), 2000);
                } else {
                    throw new Error(response.error || 'Failed to update service');
                }
            } else {
                const response = await FoodServiceAPI.createFoodService(submitData);
                if (response.success) {
                    setSuccessMessage('Service created successfully!');
                    setTimeout(() => navigate('/food-services/all'), 2000);
                } else {
                    throw new Error(response.error || 'Failed to create service');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={typography.body.small}>Loading service data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCancel}
                            className="text-blue-600 hover:text-blue-800 transition-colors group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                {isEditMode ? 'Update Food Service' : 'Add Food Service'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditMode ? 'Update your service details' : 'List your food business'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500 text-xl">⚠️</span>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 text-xl">✓</span>
                            <p className="text-green-700 font-medium">{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <Store className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Business Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Business Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., Royal Restaurant"
                                    />
                                </div>

                                {/* Business Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Business Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        {foodServiceTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    >
                                        <option value="true">✓ Open</option>
                                        <option value="false">✗ Closed</option>
                                    </select>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            placeholder="business@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                        placeholder="Brief description of your business..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specialties Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <Tag className="text-blue-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Specialties / Menu Items</h2>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={specialtyInput}
                                    onChange={(e) => setSpecialtyInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSpecialty();
                                        }
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="e.g., Biryani, Masala Dosa, Coffee"
                                />
                                <Button variant="primary" size="md" onClick={handleAddSpecialty}>
                                    Add
                                </Button>
                            </div>

                            {formData.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.specialties.map((specialty, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                                        >
                                            {specialty}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSpecialty(index)}
                                                className="text-blue-900 hover:text-red-600 font-bold text-lg transition"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Additional Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <span className="text-2xl">⏰</span>
                                <h2 className="text-xl font-bold text-gray-800">Additional Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Opening Time */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Opening Time
                                    </label>
                                    <input
                                        type="time"
                                        name="openingTime"
                                        value={formData.openingTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Closing Time */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Closing Time
                                    </label>
                                    <input
                                        type="time"
                                        name="closingTime"
                                        value={formData.closingTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <input
                                        type="text"
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="₹100 - ₹500"
                                    />
                                </div>

                                {/* Cuisine Type */}
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cuisine Type
                                    </label>
                                    <input
                                        type="text"
                                        name="cuisineType"
                                        value={formData.cuisineType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., South Indian, North Indian, Chinese, Continental"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-blue-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
                                </div>
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
                            </div>

                            {formData.latitude && formData.longitude && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 text-lg">✓</span>
                                        <div>
                                            <p className="font-semibold text-green-800">Location Detected</p>
                                            <p className="text-sm text-green-600">
                                                {formData.latitude}, {formData.longitude}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Area */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Area / Locality <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., Jubilee Hills"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., Hyderabad"
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="e.g., Telangana"
                                    />
                                </div>

                                {/* Pincode */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        placeholder="500001"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tip:</strong> Click "Use Current Location" to automatically detect your location, or enter your address manually.
                                </p>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={handleSubmit}
                                disabled={loading}
                                className="order-2 sm:order-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⌛</span>
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </span>
                                ) : (
                                    isEditMode ? '✓ Update Service' : '✓ Create Service'
                                )}
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={handleCancel}
                                className="order-1 sm:order-2 sm:w-auto"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                        Need help? Contact support or check our{' '}
                        <a href="/help" className="text-blue-600 hover:underline">
                            help center
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FoodServiceForm;