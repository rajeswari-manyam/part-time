import React, { useState } from "react";
import { MapPin, Phone, Navigation, Star, Clock, ChevronLeft, ChevronRight, Package, Award, Sparkles } from "lucide-react";

interface Business {
    id: string;
    title: string;
    description?: string;
    location?: string;
    distance?: number | string;
    category?: string;
    businessData?: {
        rating?: number;
        user_ratings_total?: number;
        opening_hours?: { open_now: boolean };
        geometry?: { location: { lat: number; lng: number } };
        trending?: boolean;
        verified?: boolean;
    };
    services?: string[];
}

interface BusinessCardProps {
    business?: Business;
    onViewDetails: (business: Business) => void;
}

// Phone numbers mapping
const PHONE_NUMBERS_MAP: Record<string, string> = {
    shop_1: "07947138792",
    shop_2: "07947138962",
    shop_3: "07947430941",
    shop_4: "08460471716",
};

// Business images
const BUSINESS_IMAGES_MAP: Record<string, string[]> = {
    shop_1: [
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800",
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800",
    ],
    shop_2: [
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
        "https://images.unsplash.com/photo-1608528924449-679e86baff75?w=800",
        "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=800",
    ],
    shop_3: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800",
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800",
    ],
    shop_4: [
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800",
    ],
};

const BUSINESS_DESCRIPTIONS_MAP: Record<string, string> = {
    shop_1: "Unique handmade dreamcatchers and artisan crafts. Wide collection of decorative items and personalized gifts for special occasions.",
    shop_2: "Premium gift shop featuring exclusive collections of greeting cards, stationery, and personalized gift items for all celebrations.",
    shop_3: "Traditional and contemporary gift house specializing in festive decorations, pooja items, and handcrafted gift articles.",
    shop_4: "Curated toy gallery and gift shop offering international brands, educational toys, and unique gift selections for all ages.",
};

// Dummy businesses data
const DUMMY_BUSINESSES: Business[] = [
    {
        id: "shop_1",
        title: "Ekdant Artbox Dreamcatchers By Darsha",
        description: BUSINESS_DESCRIPTIONS_MAP["shop_1"],
        location: "Sundarbai Pardeshi Building Raviwar Peth, Pune",
        distance: 1.5,
        category: "Gift Shop",
        services: ["In Store Shopping", "In Store Collect", "Shop In Store"],
        businessData: {
            rating: 4.9,
            user_ratings_total: 74,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 18.5204, lng: 73.8567 } },
            trending: true,
            verified: true,
        }
    },
    {
        id: "shop_2",
        title: "Arva Collection",
        description: BUSINESS_DESCRIPTIONS_MAP["shop_2"],
        location: "Shivam Complex Nashik Road, Nashik",
        distance: 2.1,
        category: "Gift Shop",
        services: ["Shop In Store", "Custom Orders", "Gift Wrapping"],
        businessData: {
            rating: 4.0,
            user_ratings_total: 1,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 19.9975, lng: 73.7898 } },
            trending: false,
            verified: true,
        }
    },
    {
        id: "shop_3",
        title: "Ganesh Gift House",
        description: BUSINESS_DESCRIPTIONS_MAP["shop_3"],
        location: "Bhadrakali Road Bhadrakali, Nashik",
        distance: 3.2,
        category: "Gift Shop",
        services: ["Same Day Delivery", "Shop In Store", "Delivery Available"],
        businessData: {
            rating: 4.4,
            user_ratings_total: 34,
            opening_hours: { open_now: true },
            geometry: { location: { lat: 19.9975, lng: 73.7898 } },
            trending: true,
            verified: true,
        }
    },
    {
        id: "shop_4",
        title: "Neo Toys and Gift Gallery",
        description: BUSINESS_DESCRIPTIONS_MAP["shop_4"],
        location: "Vapi Silvassa Road Vapi Industrial Estate, Vapi",
        distance: 5.0,
        category: "Gift Shop",
        services: ["Wallet Accepted", "Online Orders", "Gift Registry"],
        businessData: {
            rating: 4.7,
            user_ratings_total: 15,
            opening_hours: { open_now: false },
            geometry: { location: { lat: 20.3717, lng: 72.9046 } },
            trending: false,
            verified: true,
        }
    }
];

const SingleBusinessCard: React.FC<{ business: Business; onViewDetails: (business: Business) => void }> = ({ 
    business, 
    onViewDetails 
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const photos = BUSINESS_IMAGES_MAP[business.id] || [];
    const currentPhoto = photos[currentImageIndex];

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const getRating = () => business.businessData?.rating?.toFixed(1) || null;
    const getUserRatingsTotal = () => business.businessData?.user_ratings_total || null;
    const isOpen = business.businessData?.opening_hours?.open_now;
    const isTrending = business.businessData?.trending;
    const isVerified = business.businessData?.verified;

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        const phone = PHONE_NUMBERS_MAP[business.id];
        if (phone) window.location.href = `tel:${phone}`;
    };

    const handleDirections = (e: React.MouseEvent) => {
        e.stopPropagation();
        const lat = business.businessData?.geometry?.location.lat;
        const lng = business.businessData?.geometry?.location.lng;
        if (lat && lng) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
        }
    };

    return (
        <div
            onClick={() => onViewDetails(business)}
            className="group relative bg-gradient-to-br from-white to-amber-50/30 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full flex flex-col border border-amber-200/50 hover:border-amber-400/60 hover:-translate-y-1"
            style={{
                fontFamily: "'Outfit', sans-serif",
            }}
        >
            {/* Trending & Verified Badges */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                {isTrending && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                        <Sparkles size={12} className="animate-pulse" />
                        Trending
                    </div>
                )}
                {isVerified && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                        <Award size={12} />
                        Verified
                    </div>
                )}
            </div>

            {/* Image Carousel with Decorative Frame */}
            <div className="relative h-56 bg-gradient-to-br from-amber-100 to-orange-100 shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
                {currentPhoto ? (
                    <>
                        <img 
                            src={currentPhoto} 
                            alt={business.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition-all shadow-xl"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-sm transition-all shadow-xl"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <div className="absolute bottom-3 right-3 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold">
                                    {currentImageIndex + 1}/{photos.length}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-600 text-5xl">
                        🎁
                    </div>
                )}
            </div>

            {/* Content with Decorative Elements */}
            <div className="p-5 space-y-3 flex-grow flex flex-col relative">
                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full" />
                
                <h2 className="text-xl font-bold text-gray-900 line-clamp-2 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {business.title}
                </h2>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-amber-600" />
                    <span className="line-clamp-2">{business.location}</span>
                </div>

                {business.distance && (
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-grow bg-gradient-to-r from-amber-200 to-transparent" />
                        <p className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                            {business.distance} km away
                        </p>
                        <div className="h-px flex-grow bg-gradient-to-l from-amber-200 to-transparent" />
                    </div>
                )}

                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-auto">
                    {BUSINESS_DESCRIPTIONS_MAP[business.id] || business.description}
                </p>

                {/* Rating & Status */}
                <div className="flex items-center gap-3 text-sm pt-2 flex-wrap">
                    {getRating() && (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg shadow-md">
                            <Star size={14} className="fill-white" />
                            <span className="font-bold">{getRating()}</span>
                            <span className="opacity-90">({getUserRatingsTotal()})</span>
                        </div>
                    )}
                    {isOpen !== undefined && (
                        <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shadow-sm ${
                                isOpen 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                                    : "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                            }`}
                        >
                            <Clock size={12} />
                            <span className="text-xs">{isOpen ? "Open Now" : "Closed"}</span>
                        </div>
                    )}
                </div>

                {/* Services */}
                {business.services && business.services.length > 0 && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Package size={14} className="text-amber-600" />
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Services</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {business.services.slice(0, 3).map((service, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm"
                                >
                                    <span className="text-amber-600">✓</span>
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 mt-auto">
                    <button
                        onClick={handleDirections}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Navigation size={16} />
                        Directions
                    </button>
                    <button
                        onClick={handleCall}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Phone size={16} />
                        Call Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const BusinessCard: React.FC<BusinessCardProps> = (props) => {
    // If no business is provided, render the list of dummy businesses
    if (!props.business) {
        return (
            <div 
                className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8"
                style={{
                    fontFamily: "'Outfit', sans-serif",
                }}
            >
                {/* Header */}
                <div className="max-w-7xl mx-auto mb-12 text-center">
                    <h1 
                        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Handmade Gift Dealers
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover unique handcrafted gifts, artisan creations, and personalized treasures from verified local dealers
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Award size={16} className="text-amber-600" />
                        <span>All businesses are JD Verified</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {DUMMY_BUSINESSES.map((business) => (
                        <SingleBusinessCard
                            key={business.id}
                            business={business}
                            onViewDetails={props.onViewDetails}
                        />
                    ))}
                </div>

                {/* Footer Note */}
                <div className="max-w-7xl mx-auto mt-12 text-center">
                    <p className="text-sm text-gray-500 italic">
                        Click on any card to view more details
                    </p>
                </div>
            </div>
        );
    }

    // If business is provided, render individual card
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <SingleBusinessCard business={props.business} onViewDetails={props.onViewDetails} />
            </div>
        </div>
    );
};

export default BusinessCard;