import React, { useState } from "react";
import { MapPin, Phone, Star, MessageSquare, Palette, ChevronLeft, ChevronRight, TrendingUp, Award, Shield } from "lucide-react";

interface PainterArtist {
    id: string;
    name: string;
    rating: number;
    ratingsCount: number;
    location: string;
    address: string;
    specialties: string[];
    phone: string;
    whatsapp: string;
    image: string;
    images: string[];
    trending?: boolean;
    verified?: boolean;
    popular?: boolean;
    responsive?: boolean;
    distance?: number;
}

interface PainterListingProps {
    className?: string;
}

const DUMMY_PAINTERS: PainterArtist[] = [
    {
        id: "1",
        name: "Draw With Anuraglization",
        rating: 5.0,
        ratingsCount: 21,
        location: "Amber Chock Naseerpur, Bihar Sharif",
        address: "Amber Chock Naseerpur, Bihar Sharif",
        specialties: ["Charcoal Painting Artists", "Goddess Painting Artists"],
        phone: "9876543210",
        whatsapp: "9876543210",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
        images: [
            "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
        ],
        trending: true,
        verified: false,
        distance: 2.3,
    },
    {
        id: "2",
        name: "Rishi Art Club",
        rating: 4.6,
        ratingsCount: 18,
        location: "Indrapuri Colony Road, Ranchi",
        address: "Indrapuri Colony Road Indrapuri Colony, Ranchi",
        specialties: ["Artists", "Sketch Painting Artists"],
        phone: "07947140909",
        whatsapp: "07947140909",
        image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400",
        images: [
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
        ],
        trending: true,
        verified: true,
        distance: 5.1,
    },
    {
        id: "3",
        name: "A B ARTS",
        rating: 5.0,
        ratingsCount: 1,
        location: "SHAUKAT ALI ANSARI Ratu Road, Ranchi",
        address: "SHAUKAT ALI ANSARI Ratu Road, Ranchi",
        specialties: ["3D Painting"],
        phone: "07947116207",
        whatsapp: "07947116207",
        image: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=400",
        images: [
            "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800",
            "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=800",
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
        ],
        trending: true,
        verified: false,
        distance: 7.8,
    },
    {
        id: "4",
        name: "Indian Graffiti",
        rating: 4.2,
        ratingsCount: 7,
        location: "Chandni Chow Kanke Road, Ranchi",
        address: "Chandni Chow Kanke Road, Ranchi",
        specialties: ["Painting Artists", "Sculpture Artists"],
        phone: "07947412039",
        whatsapp: "07947412039",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400",
        images: [
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
            "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
        ],
        trending: false,
        verified: true,
        distance: 4.5,
    },
    {
        id: "5",
        name: "Kala Thinker",
        rating: 5.0,
        ratingsCount: 25,
        location: "Main Road, Ranchi",
        address: "Main Road, Ranchi",
        specialties: ["Modern Art", "Wall Paintings", "Portrait Artists"],
        phone: "08012345678",
        whatsapp: "08012345678",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
        images: [
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
            "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800",
        ],
        trending: false,
        verified: true,
        popular: true,
        distance: 3.2,
    },
    {
        id: "6",
        name: "Arjun Artist",
        rating: 4.2,
        ratingsCount: 9,
        location: "Ring Road Ratu, Ranchi",
        address: "Ring Road Ratu, Ranchi",
        specialties: ["Canvas Painting", "Custom Artwork"],
        phone: "09123456789",
        whatsapp: "09123456789",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
        images: [
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
            "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=800",
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800",
        ],
        trending: false,
        verified: false,
        responsive: true,
        distance: 6.7,
    },
];

const PainterCard: React.FC<{ painter: PainterArtist }> = ({ painter }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showGetBestDeal, setShowGetBestDeal] = useState(false);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + painter.images.length) % painter.images.length);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % painter.images.length);
    };

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `tel:${painter.phone}`;
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://wa.me/${painter.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex gap-4 p-4">
                {/* Image Section */}
                <div className="relative w-48 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 group">
                    <img
                        src={painter.images[currentImageIndex]}
                        alt={painter.name}
                        className="w-full h-full object-cover"
                    />
                    
                    {painter.images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={18} />
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                {currentImageIndex + 1}/{painter.images.length}
                            </div>
                        </>
                    )}
                    
                    {painter.verified && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Shield size={12} />
                            Jd Verified
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    {/* Title & Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex items-center gap-2">
                            {painter.verified && <Shield size={16} className="text-blue-600 flex-shrink-0" />}
                            {painter.name}
                        </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded">
                            <span className="font-bold text-sm">{painter.rating.toFixed(1)}</span>
                            <Star size={12} className="fill-white" />
                        </div>
                        <span className="text-sm text-gray-600">{painter.ratingsCount} Ratings</span>
                        
                        {/* Badges */}
                        {painter.trending && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs font-semibold">
                                <TrendingUp size={14} />
                                Trending
                            </div>
                        )}
                        {painter.popular && (
                            <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                                <Award size={14} />
                                Popular
                            </div>
                        )}
                        {painter.responsive && (
                            <div className="text-green-600 text-xs font-semibold">
                                ⚡ Responsive
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-1 text-gray-600 mb-3">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{painter.address}</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {painter.specialties.map((specialty, index) => (
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
                            onClick={handleCall}
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
                    </div>
                </div>

                {/* Right Sidebar - Get Best Deal */}
                <div className="w-64 flex-shrink-0 hidden xl:block">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Palette className="text-blue-600" size={20} />
                            <span className="font-semibold text-gray-900 text-sm">
                                {painter.phone}
                            </span>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            Get Best Deal 
                            <span className="text-xl">»»</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PainterListing: React.FC<PainterListingProps> = ({ className = "" }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>("relevance");

    const filters = [
        { id: "relevance", label: "Relevance", icon: null },
        { id: "ratings", label: "Ratings", icon: null },
        { id: "top-rated", label: "Top Rated", icon: "⭐" },
        { id: "verified", label: "Jd Verified", icon: "✓" },
        { id: "quick-response", label: "Quick Response", icon: "⚡" },
        { id: "deals", label: "Deals", icon: "🎁" },
        { id: "trust", label: "Jd Trust", icon: "🛡️" },
        { id: "open-now", label: "Open Now", icon: null },
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
                                <Palette size={20} className="text-blue-600" />
                                <span className="font-semibold text-gray-900">Painting Artists Near Hiring</span>
                            </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                            Reset all filters
                        </button>
                    </div>

                    {/* Filters */}
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
                            </button>
                        ))}
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50">
                            ⚙ All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Painter Cards */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="space-y-4">
                    {DUMMY_PAINTERS.map((painter) => (
                        <PainterCard key={painter.id} painter={painter} />
                    ))}
                </div>
            </div>

            {/* Get Best Deal Sidebar (Mobile) */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-2">
                            Get the List of Top <span className="text-blue-600 font-semibold">Painting Artists</span>
                        </p>
                        <p className="text-xs text-gray-600 mb-3">
                            We'll send you contact details in seconds for free
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Get Best Deal »»
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PainterListing;