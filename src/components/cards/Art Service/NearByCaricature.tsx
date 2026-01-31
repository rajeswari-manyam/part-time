import React, { useState } from "react";
import {
    MapPin,
    Phone,
    MessageSquare,
    Star,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Award,
    TrendingUp,
    Shield,
    MessageCircle
} from "lucide-react";

interface CaricatureArtist {
    id: string;
    name: string;
    rating: number;
    ratingsCount: number;
    location: string;
    city: string;
    specialties: string[];
    phone: string;
    whatsapp: string;
    image: string;
    images: string[];
    yearsInBusiness?: number;
    verified?: boolean;
    trending?: boolean;
    popular?: boolean;
    topSearch?: boolean;
}

interface CaricatureArtistListingProps {
    className?: string;
}

const DUMMY_ARTISTS: CaricatureArtist[] = [
    {
        id: "1",
        name: "Art By Manjeet",
        rating: 5.0,
        ratingsCount: 4,
        location: "Delhi",
        city: "Also Serves Chatra",
        specialties: ["Sketch Painting Artists", "Painting Artists"],
        phone: "9876543210",
        whatsapp: "9876543210",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
        images: [
            "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
        ],
        yearsInBusiness: 2,
        verified: false,
        trending: false,
        topSearch: true,
    },
    {
        id: "2",
        name: "Vola Art Escape",
        rating: 4.8,
        ratingsCount: 384,
        location: "Goa",
        city: "Also Serves Chatra",
        specialties: ["3D Painting"],
        phone: "08123456789",
        whatsapp: "08123456789",
        image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400",
        images: [
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
        ],
        yearsInBusiness: 16,
        verified: true,
        trending: false,
        popular: true,
    },
    {
        id: "3",
        name: "Bhai ki drawing",
        rating: 5.0,
        ratingsCount: 6,
        location: "Ballia",
        city: "",
        specialties: ["3D Painting"],
        phone: "09012345678",
        whatsapp: "09012345678",
        image: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400",
        images: [
            "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800",
            "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=800",
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
        ],
        yearsInBusiness: 0,
        verified: false,
        trending: true,
    },
    {
        id: "4",
        name: "Artist vilash Burnwal",
        rating: 5.0,
        ratingsCount: 2,
        location: "Deoghar-Jharkhand",
        city: "",
        specialties: ["3D Painting"],
        phone: "07412345678",
        whatsapp: "07412345678",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
        images: [
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
        ],
        yearsInBusiness: 9,
        verified: false,
        trending: true,
    },
];

const ArtistCard: React.FC<{ artist: CaricatureArtist }> = ({ artist }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + artist.images.length) % artist.images.length);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % artist.images.length);
    };

    const handleShowNumber = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `tel:${artist.phone}`;
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://wa.me/${artist.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    };

    const handleGetBestPrice = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert('Get Best Price feature would open here');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex gap-4 p-4">
                {/* Image Section */}
                <div className="relative w-52 h-44 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 group">
                    <img
                        src={artist.images[currentImageIndex]}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                    />

                    {artist.images.length > 1 && (
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
                        {artist.verified && (
                            <Shield size={20} className="text-gray-700 flex-shrink-0" />
                        )}
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {artist.name}
                        </h3>
                    </div>

                    {/* Rating & Badges */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded">
                            <span className="font-bold text-sm">{artist.rating.toFixed(1)}</span>
                            <Star size={12} className="fill-white" />
                        </div>
                        <span className="text-sm text-gray-600">{artist.ratingsCount} Ratings</span>

                        {artist.trending && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                                <TrendingUp size={14} />
                                Trending
                            </div>
                        )}

                        {artist.verified && (
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                <Shield size={12} />
                                Verified
                            </div>
                        )}

                        {artist.popular && (
                            <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                                <Award size={14} />
                                Popular
                            </div>
                        )}

                        {artist.topSearch && (
                            <div className="text-orange-500 text-xs font-semibold flex items-center gap-1">
                                🔍 Top Search
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-1 text-gray-600 mb-2">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <span>{artist.location}</span>
                            {artist.city && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span className="text-gray-500">{artist.city}</span>
                                </>
                            )}
                            {(artist.yearsInBusiness || 0) > 0 && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span className="flex items-center gap-1 inline-flex">
                                        <Briefcase size={14} />
                                        <span className="font-semibold">{artist.yearsInBusiness} Years</span> in Business
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {artist.specialties.map((specialty, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
                            >
                                {specialty}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleShowNumber}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded font-semibold transition-colors"
                        >
                            <Phone size={16} />
                            Show Number
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
                            Get Best Price
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CaricatureArtistListing: React.FC<CaricatureArtistListingProps> = ({ className = "" }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>("relevance");

    const filters = [
        { id: "relevance", label: "Relevance" },
        { id: "top-rated", label: "Top Rated", icon: "⭐" },
        { id: "verified", label: "Jd Verified", icon: "✓" },
        { id: "ratings", label: "Ratings" },
    ];

    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={20} />
                                <span className="font-semibold">Hiring, Chatra</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="text-2xl">🎨</span>
                                <span className="font-semibold text-gray-900">Digital Caricature Artists Near Hiring</span>
                                <button className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold">
                            Reset all filters
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${selectedFilter === filter.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {filter.icon && <span>{filter.icon}</span>}
                                {filter.label}
                            </button>
                        ))}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50">
                            ⚙ All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Artist Cards */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                        {DUMMY_ARTISTS.map((artist) => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-96 flex-shrink-0 hidden xl:block">
                        <div className="sticky top-24">
                            {/* Get Best Price Form */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                                <h3 className="text-lg mb-1">
                                    Get the list of best <span className="text-blue-600 font-semibold">Digital Caricature Artists</span>
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    We'll send you contact details in seconds for free
                                </p>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="audi"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="7674099475"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        Get Best Price
                                        <span className="text-xl">»»»</span>
                                    </button>
                                </div>
                            </div>

                            {/* Connect Ad */}
                            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6 text-center">
                                <p className="text-sm text-gray-700 mb-1">Connect with</p>
                                <p className="text-4xl font-bold text-blue-600 mb-1">19.3 Crore+</p>
                                <p className="text-lg font-semibold text-gray-800 mb-3">Buyers</p>
                                <p className="text-sm text-gray-600 mb-4">on Justdial</p>
                                <div className="flex justify-center mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200"
                                        alt="Businessman"
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                                    List your business for <span className="bg-pink-500 px-2 py-1 rounded ml-1">FREE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-gray-700 mb-2">
                        Get the list of best <span className="text-blue-600 font-semibold">Digital Caricature Artists</span>
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Get Best Price »»»
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaricatureArtistListing;