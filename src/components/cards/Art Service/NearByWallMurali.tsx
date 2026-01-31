import React, { useState } from "react";
import { 
    MapPin, 
    Phone, 
    MessageSquare, 
    Star, 
    ChevronLeft, 
    ChevronRight, 
    Briefcase,
    Shield,
    TrendingUp,
    Award,
    Zap,
    MessageCircle
} from "lucide-react";

interface WallMuralManufacturer {
    id: string;
    name: string;
    rating: number;
    ratingsCount: number;
    location: string;
    yearsInBusiness?: number;
    specialties: string[];
    category?: string;
    phone: string;
    whatsapp: string;
    image: string;
    images: string[];
    verified?: boolean;
    trending?: boolean;
    popular?: boolean;
    responsive?: boolean;
    topSearch?: boolean;
    responseTime?: string;
}

interface WallMuralListingProps {
    className?: string;
}

const DUMMY_MANUFACTURERS: WallMuralManufacturer[] = [
    {
        id: "1",
        name: "Sawant Art",
        rating: 4.6,
        ratingsCount: 5,
        location: "Thane",
        yearsInBusiness: 26,
        specialties: ["3D Painting"],
        phone: "08296230426",
        whatsapp: "08296230426",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400",
        images: [
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
        ],
        verified: false,
        trending: false,
        topSearch: true,
    },
    {
        id: "2",
        name: "Godai Arts",
        rating: 5.0,
        ratingsCount: 11,
        location: "Mumbai",
        yearsInBusiness: 8,
        specialties: ["3D Painting"],
        phone: "08904245881",
        whatsapp: "08904245881",
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400",
        images: [
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
        ],
        verified: true,
        trending: false,
        responsive: true,
    },
    {
        id: "3",
        name: "Infinity Art Services",
        rating: 4.9,
        ratingsCount: 95,
        location: "Thane",
        yearsInBusiness: 36,
        specialties: ["Apartment"],
        phone: "08401459125",
        whatsapp: "08401459125",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400",
        images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
        ],
        verified: false,
        trending: false,
        popular: true,
        responseTime: "Responds in 45 Mins",
    },
    {
        id: "4",
        name: "Art Creation",
        rating: 4.8,
        ratingsCount: 4,
        location: "Palghar",
        yearsInBusiness: 16,
        specialties: ["Ganpati Idol Manufacturers", "Fibre Statue Manufacturers"],
        phone: "08401778301",
        whatsapp: "08401778301",
        image: "https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=400",
        images: [
            "https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=800",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
        ],
        verified: false,
        trending: true,
    },
];

const ManufacturerCard: React.FC<{ manufacturer: WallMuralManufacturer }> = ({ manufacturer }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + manufacturer.images.length) % manufacturer.images.length);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % manufacturer.images.length);
    };

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `tel:${manufacturer.phone}`;
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://wa.me/${manufacturer.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    };

    const handleGetBestPrice = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert('Get Best Price feature');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex gap-4 p-4">
                {/* Image Section */}
                <div className="relative w-52 h-44 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 group">
                    <img
                        src={manufacturer.images[currentImageIndex]}
                        alt={manufacturer.name}
                        className="w-full h-full object-cover"
                    />
                    
                    {manufacturer.images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    {/* Name & Verified Badge */}
                    <div className="flex items-center gap-2 mb-2">
                        {manufacturer.verified && (
                            <Shield size={20} className="text-gray-700 flex-shrink-0" />
                        )}
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {manufacturer.name}
                        </h3>
                    </div>

                    {/* Rating & Badges */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded">
                            <span className="font-bold text-sm">{manufacturer.rating.toFixed(1)}</span>
                            <Star size={12} className="fill-white" />
                        </div>
                        <span className="text-sm text-gray-600">{manufacturer.ratingsCount} Ratings</span>
                        
                        {manufacturer.trending && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                                <TrendingUp size={14} />
                                Trending
                            </div>
                        )}
                        
                        {manufacturer.verified && (
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                <Shield size={12} />
                                Verified
                            </div>
                        )}
                        
                        {manufacturer.popular && (
                            <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                                <Award size={14} />
                                Popular
                            </div>
                        )}

                        {manufacturer.responsive && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                                <Zap size={14} />
                                Responsive
                            </div>
                        )}

                        {manufacturer.topSearch && (
                            <div className="text-orange-500 text-xs font-semibold flex items-center gap-1">
                                🔍 Top Search
                            </div>
                        )}
                    </div>

                    {/* Location & Years */}
                    <div className="flex items-start gap-1 text-gray-600 mb-2">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <span>{manufacturer.location}</span>
                            {manufacturer.yearsInBusiness && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span className="flex items-center gap-1 inline-flex">
                                        <Briefcase size={14} />
                                        <span className="font-semibold">{manufacturer.yearsInBusiness} Years</span> in Business
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Specialties / Category */}
                    {manufacturer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {manufacturer.specialties.map((specialty, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCall}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded font-semibold transition-colors"
                        >
                            <Phone size={16} />
                            {manufacturer.phone}
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-6 py-2.5 rounded font-semibold transition-colors"
                        >
                            <MessageSquare size={16} />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleGetBestPrice}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-semibold transition-colors"
                        >
                            <MessageCircle size={16} />
                            {manufacturer.responseTime ? (
                                <div className="flex flex-col items-start">
                                    <span>Get Best Price</span>
                                    <span className="text-[10px] font-normal">{manufacturer.responseTime}</span>
                                </div>
                            ) : (
                                "Get Best Price"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WallMuralListing: React.FC<WallMuralListingProps> = ({ className = "" }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>("sort-by");
    const [selectedMuralType, setSelectedMuralType] = useState<string | null>(null);

    const filters = [
        { id: "sort-by", label: "Sort by" },
        { id: "top-rated", label: "Top Rated", icon: "⭐" },
        { id: "quick-response", label: "Quick Response", icon: "⚡" },
        { id: "verified", label: "Jd Verified", icon: "✓" },
        { id: "ratings", label: "Ratings" },
        { id: "trust", label: "Jd Trust", icon: "🛡️" },
    ];

    const muralTypes = ["Nature", "Abstract", "Urban", "Custom Design"];

    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">🎨</span>
                        <div>
                            <p className="font-bold text-lg">आधुनिक युग की रचनात्मकता</p>
                            <p className="text-sm">Creative & Realistic Work</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm">Call: 9673787541</span>
                        <button className="bg-white text-gray-800 px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-100">
                            KNOW MORE
                        </button>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Mumbai</span>
                        <span>›</span>
                        <span>Wall Mural Manufacturers in Mumbai</span>
                        <span>›</span>
                        <span>Wall Mural Manufacturers near Smile Designers Ghatkopar East</span>
                        <span>›</span>
                        <span className="font-semibold text-gray-900">92+ Listings</span>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Popular Wall Mural Manufacturers near Smile Designers Ghatkopar East, Mumbai
                    </h1>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                                    selectedFilter === filter.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {filter.icon && <span>{filter.icon}</span>}
                                {filter.label}
                                {filter.id === "sort-by" && <span className="ml-1">▼</span>}
                            </button>
                        ))}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50">
                            ⚙ All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Main Listing */}
                    <div className="flex-1 space-y-4">
                        {DUMMY_MANUFACTURERS.map((manufacturer) => (
                            <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
                        ))}

                        {/* Mural Type Selection */}
                        <div className="bg-gray-100 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                What type of wall mural are you interested in?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                We will get you best deal for free.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {muralTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedMuralType(type)}
                                        className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                                            selectedMuralType === type
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-96 flex-shrink-0 hidden xl:block">
                        <div className="sticky top-24">
                            {/* Get List Form */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                                <h3 className="text-lg mb-1">
                                    Get the List of Top{" "}
                                    <span className="text-blue-600 font-semibold">Wall Mural Manufacturers</span>
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    We'll send you contact details in seconds for free
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                                        <span className="text-gray-400">👤</span>
                                        <input
                                            type="text"
                                            placeholder="audi"
                                            className="flex-1 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                                        <span className="text-gray-400">📱</span>
                                        <input
                                            type="tel"
                                            placeholder="7674099475"
                                            className="flex-1 outline-none text-sm"
                                        />
                                    </div>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        Get Verified Sellers
                                        <span className="text-xl">»»»</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom CTA */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                <p className="text-sm text-gray-700 mb-2">
                    Get the list of best <span className="text-blue-600 font-semibold">Wall Mural Manufacturers</span>
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                    Get Verified Sellers »»»
                </button>
            </div>
        </div>
    );
};

export default WallMuralListing;