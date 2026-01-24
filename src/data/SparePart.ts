import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for automobile spare parts shops
export const sparePartsDummyData: AutomotiveService[] = [
    {
        _id: "sparepart-dummy-1",
        userId: "sparepart-user-1",
        name: "AutoMax Spare Parts",
        email: "automax@example.com",
        phone: "+91 98765 33301",
        description:
            "Authorized dealer for genuine car and bike spare parts. Engine parts, brake systems, filters, and accessories available.",
        businessType: "Automobile Spare Parts",
        experience: 12,
        availability: "Open · Closes 20:30",
        area: "Begumpet",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500016",
        services: [
            "Genuine Spare Parts",
            "Engine Parts",
            "Brake Systems",
            "Oil & Filters",
            "Car Accessories",
            "Bike Accessories"
        ],
        images: [
            "https://images.unsplash.com/photo-1581091870627-3b8c5c34e1ab?w=800",
            "https://images.unsplash.com/photo-1581091215367-59ab6c9cbd5c?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4444,
        longitude: 78.4621,
        priceRange: "₹200-₹50,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "sparepart-dummy-2",
        userId: "sparepart-user-2",
        name: "City Auto Spares",
        email: "cityspares@example.com",
        phone: "+91 98765 33302",
        description:
            "One-stop shop for multi-brand car spare parts. Competitive prices with expert guidance.",
        businessType: "Automobile Spare Parts",
        experience: 9,
        availability: "Open · Closes 21:00",
        area: "Abids",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        services: [
            "Multi-Brand Spares",
            "Suspension Parts",
            "Clutch Plates",
            "Electrical Parts",
            "Batteries",
            "Wiper & Lighting"
        ],
        images: [
            "https://images.unsplash.com/photo-1515922076344-8c4b7c41b47d?w=800",
            "https://images.unsplash.com/photo-1592878849122-704d8fa54b1d?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.3946,
        longitude: 78.4747,
        priceRange: "₹150-₹40,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "sparepart-dummy-3",
        userId: "sparepart-user-3",
        name: "MotoWorld Spare Hub",
        email: "motoworld@example.com",
        phone: "+91 98765 33303",
        description:
            "Premium bike spare parts and performance accessories. Special focus on sports and superbikes.",
        businessType: "Automobile Spare Parts",
        experience: 7,
        availability: "Open · Closes 19:30",
        area: "Miyapur",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500049",
        services: [
            "Bike Spare Parts",
            "Performance Parts",
            "Chain & Sprockets",
            "Brake Pads",
            "Lubricants",
            "Riding Accessories"
        ],
        images: [
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
            "https://images.unsplash.com/photo-1603380353725-f8a4a5ed88e8?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4960,
        longitude: 78.3736,
        priceRange: "₹300-₹25,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "sparepart-dummy-4",
        userId: "sparepart-user-4",
        name: "Express Auto Parts",
        email: "expressautoparts@example.com",
        phone: "+91 98765 33304",
        description:
            "Fast-moving spare parts store for cars and two-wheelers. Wholesale and retail available.",
        businessType: "Automobile Spare Parts",
        experience: 6,
        availability: "Open · Closes 18:30",
        area: "Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        services: [
            "Fast-Moving Parts",
            "Wholesale Supply",
            "Retail Sales",
            "Belts & Hoses",
            "Cooling Parts",
            "Exhaust Parts"
        ],
        images: [
            "https://images.unsplash.com/photo-1601924579440-97c97c1d1b75?w=800",
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4948,
        longitude: 78.3983,
        priceRange: "₹100-₹30,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];
