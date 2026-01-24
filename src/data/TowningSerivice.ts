// src/data/TowingServices.ts

import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for towing services
export const towingServicesDummyData: AutomotiveService[] = [
    {
        _id: "towing-dummy-1",
        userId: "towing-user-1",
        name: "24/7 Emergency Towing Service",
        email: "emergency.tow@example.com",
        phone: "+91 98765 00001",
        description: "Round-the-clock emergency towing and roadside assistance. Fast response time with trained professionals and modern equipment.",
        businessType: "Towing Services",
        experience: 12,
        availability: "Open 24 Hours",
        area: "Jubilee Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500033",
        services: [
            "24/7 Towing",
            "Emergency Assistance",
            "Accident Recovery",
            "Breakdown Service",
            "Flat Tire Help",
            "Battery Jumpstart"
        ],
        images: [
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4326,
        longitude: 78.4071,
        priceRange: "₹800-₹3000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "towing-dummy-2",
        userId: "towing-user-2",
        name: "Quick Tow Vehicle Recovery",
        email: "quicktow@example.com",
        phone: "+91 98765 00002",
        description: "Professional towing service for cars and bikes. Specialized in accident recovery and long-distance towing with GPS tracking.",
        businessType: "Towing Services",
        experience: 10,
        availability: "Open 24 Hours",
        area: "Madhapur",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        services: [
            "Car Towing",
            "Bike Towing",
            "GPS Tracking",
            "Long Distance",
            "Insurance Claims",
            "Safe Transport"
        ],
        images: [
            "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800",
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4485,
        longitude: 78.3915,
        priceRange: "₹1000-₹5000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "towing-dummy-3",
        userId: "towing-user-3",
        name: "RoadRescue Towing & Recovery",
        email: "roadrescue@example.com",
        phone: "+91 98765 00003",
        description: "Complete roadside assistance with towing services. On-spot repair, fuel delivery, and wheel change facilities available.",
        businessType: "Towing Services",
        experience: 15,
        availability: "Open 24 Hours",
        area: "Ameerpet",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500016",
        services: [
            "Roadside Repair",
            "Fuel Delivery",
            "Wheel Change",
            "Lockout Service",
            "Winching",
            "Heavy Vehicle Towing"
        ],
        images: [
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4374,
        longitude: 78.4482,
        priceRange: "₹700-₹4000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "towing-dummy-4",
        userId: "towing-user-4",
        name: "SafeTow Vehicle Assistance",
        email: "safetow@example.com",
        phone: "+91 98765 00004",
        description: "Reliable towing service with modern flatbed trucks. Specializing in luxury car towing with damage-free guarantee.",
        businessType: "Towing Services",
        experience: 8,
        availability: "Open 24 Hours",
        area: "Gachibowli",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500032",
        services: [
            "Flatbed Towing",
            "Luxury Car Towing",
            "Damage-Free",
            "24/7 Availability",
            "Membership Plans",
            "Corporate Contracts"
        ],
        images: [
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800",
            "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4401,
        longitude: 78.3489,
        priceRange: "₹1200-₹6000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];