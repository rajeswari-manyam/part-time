// src/data/BikeRepair.ts

import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for 4 bike repair shops
export const bikeRepairDummyData: AutomotiveService[] = [
    {
        _id: "dummy-1",
        userId: "dummy-user-1",
        name: "Hero Cycles Authorised Dealer - Zaheerabad",
        email: "hero.zaheerabad@example.com",
        phone: "+91 98765 43210",
        description: "Premium bicycle shop offering Hero Cycles with spare parts and repair services. Expert mechanics available for all bike repairs.",
        businessType: "Bike Repair",
        experience: 10,
        availability: "Open · Closes 22:00",
        area: "Sangareddy",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "502001",
        services: [
            "Bicycle Sales",
            "Spare Parts",
            "Repair Services",
            "Maintenance",
            "Tube Replacement"
        ],
        images: [
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800",
            "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800",
            "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.6138,
        longitude: 77.5065,
        priceRange: "₹500-₹2000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "dummy-2",
        userId: "dummy-user-2",
        name: "VELO FIX Bike Service Center",
        email: "velofix@example.com",
        phone: "+91 98765 43211",
        description: "Professional bike repair and service center. Specialized in all types of bicycles and motorcycles with quick turnaround time.",
        businessType: "Bike Repair",
        experience: 8,
        availability: "Open · Closes 20:00",
        area: "Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        services: [
            "General Service",
            "Brake Repair",
            "Chain Replacement",
            "Gear Adjustment",
            "Wheel Alignment",
            "Paint Job"
        ],
        images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4948,
        longitude: 78.3982,
        priceRange: "₹300-₹1500",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "dummy-3",
        userId: "dummy-user-3",
        name: "Speed Bike Repair Shop",
        email: "speedbike@example.com",
        phone: "+91 98765 43212",
        description: "Fast and reliable bike repair services. Expert in motorcycle and bicycle repairs with affordable pricing.",
        businessType: "Bike Repair",
        experience: 12,
        availability: "Open · Closes 21:00",
        area: "Ameerpet",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500016",
        services: [
            "Engine Repair",
            "Electrical Work",
            "Oil Change",
            "Tyre Replacement",
            "Battery Service"
        ],
        images: [
            "https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=800",
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800",
            "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4374,
        longitude: 78.4482,
        priceRange: "₹400-₹1800",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "dummy-4",
        userId: "dummy-user-4",
        name: "Cycle World Service Station",
        email: "cycleworld@example.com",
        phone: "+91 98765 43213",
        description: "Complete bicycle service station with branded spare parts. Authorized service center for multiple brands.",
        businessType: "Bike Repair",
        experience: 15,
        availability: "Open · Closes 19:30",
        area: "Banjara Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        services: [
            "Brand Service",
            "Custom Builds",
            "Accessories",
            "Upgrades",
            "Annual Maintenance"
        ],
        images: [
            "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800",
            "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4239,
        longitude: 78.4738,
        priceRange: "₹600-₹2500",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];