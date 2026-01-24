// src/data/BikeWash.ts

import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for bike wash services
export const bikeWashDummyData: AutomotiveService[] = [
    {
        _id: "bikewash-dummy-1",
        userId: "bikewash-user-1",
        name: "SpeedClean Bike Wash",
        email: "speedclean@example.com",
        phone: "+91 98765 11101",
        description: "Professional bike washing and detailing services. Steam cleaning, engine wash, and complete motorcycle care under one roof.",
        businessType: "Bike Wash",
        experience: 7,
        availability: "Open · Closes 21:00",
        area: "Dilsukhnagar",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500060",
        services: [
            "Steam Wash",
            "Engine Cleaning",
            "Chain Lubrication",
            "Polish & Shine",
            "Underbody Wash",
            "Helmet Cleaning"
        ],
        images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.3687,
        longitude: 78.5243,
        priceRange: "₹100-₹400",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "bikewash-dummy-2",
        userId: "bikewash-user-2",
        name: "Moto Shine Bike Care",
        email: "motoshine@example.com",
        phone: "+91 98765 11102",
        description: "Express bike wash with eco-friendly products. Quick service with quality results and affordable pricing.",
        businessType: "Bike Wash",
        experience: 5,
        availability: "Open · Closes 22:00",
        area: "Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        services: [
            "Express Wash",
            "Eco Products",
            "Wax Coating",
            "Pressure Wash",
            "Dashboard Polish",
            "Tyre Blackening"
        ],
        images: [
            "https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=800",
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4948,
        longitude: 78.3982,
        priceRange: "₹80-₹300",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "bikewash-dummy-3",
        userId: "bikewash-user-3",
        name: "Bike Spa Detailing Center",
        email: "bikespa@example.com",
        phone: "+91 98765 11103",
        description: "Premium bike detailing and spa services. Complete makeover with Teflon coating, paint protection, and interior care.",
        businessType: "Bike Wash",
        experience: 9,
        availability: "Open · Closes 20:00",
        area: "Madhapur",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        services: [
            "Complete Detailing",
            "Teflon Coating",
            "Paint Protection",
            "Ceramic Coating",
            "Rust Removal",
            "Body Polish"
        ],
        images: [
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4485,
        longitude: 78.3915,
        priceRange: "₹200-₹1500",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "bikewash-dummy-4",
        userId: "bikewash-user-4",
        name: "Two Wheeler Wash Station",
        email: "twowheelerwash@example.com",
        phone: "+91 98765 11104",
        description: "Specialized two-wheeler washing center with automated and manual options. Doorstep service available.",
        businessType: "Bike Wash",
        experience: 6,
        availability: "Open · Closes 19:30",
        area: "Ameerpet",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500016",
        services: [
            "Automated Wash",
            "Manual Wash",
            "Doorstep Service",
            "Monthly Plans",
            "Scooter Wash",
            "Quick Dry"
        ],
        images: [
            "https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=800",
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4374,
        longitude: 78.4482,
        priceRange: "₹70-₹250",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];