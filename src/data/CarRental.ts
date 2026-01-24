// src/data/CarRental.ts

import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for car hire/rental services
export const carRentalDummyData: AutomotiveService[] = [
    {
        _id: "rental-dummy-1",
        userId: "rental-user-1",
        name: "Zoomcar Self Drive Car Rental",
        email: "zoomcar.hyd@example.com",
        phone: "+91 98765 99901",
        description: "Self-drive car rental with wide range of vehicles. Flexible hourly, daily, and monthly rental plans with 24/7 roadside assistance.",
        businessType: "Car Hire / Rentals",
        experience: 8,
        availability: "Open 24 Hours",
        area: "Hitech City",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        services: [
            "Self Drive",
            "Hourly Rental",
            "Daily Rental",
            "Monthly Rental",
            "Airport Pickup",
            "24/7 Support"
        ],
        images: [
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4435,
        longitude: 78.3772,
        priceRange: "₹1500-₹5000/day",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "rental-dummy-2",
        userId: "rental-user-2",
        name: "Revv Car Rental Services",
        email: "revv.hyderabad@example.com",
        phone: "+91 98765 99902",
        description: "Premium car rental service with sanitized vehicles. Monthly subscription plans and luxury car options available.",
        businessType: "Car Rental",
        experience: 6,
        availability: "Open · Closes 22:00",
        area: "Banjara Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        services: [
            "Monthly Plans",
            "Luxury Cars",
            "SUV Rental",
            "Sanitized Vehicles",
            "Doorstep Delivery",
            "Unlimited KMs"
        ],
        images: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4239,
        longitude: 78.4738,
        priceRange: "₹2000-₹8000/day",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "rental-dummy-3",
        userId: "rental-user-3",
        name: "Avis Car Rental",
        email: "avis.secbad@example.com",
        phone: "+91 98765 99903",
        description: "International car rental brand with chauffeur-driven and self-drive options. Corporate packages and outstation trips available.",
        businessType: "Car Hire",
        experience: 15,
        availability: "Open · Closes 21:00",
        area: "Secunderabad",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500003",
        services: [
            "Chauffeur Driven",
            "Corporate Plans",
            "Outstation Trips",
            "Wedding Cars",
            "Event Services",
            "Insurance Included"
        ],
        images: [
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4399,
        longitude: 78.4983,
        priceRange: "₹2500-₹12000/day",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,
    {
        _id: "rental-dummy-4",
        userId: "rental-user-4",
        name: "Myles Car Rental",
        email: "myles@example.com",
        phone: "+91 98765 99904",
        description: "Affordable car rental with flexible plans. Perfect for weekend getaways and daily commutes with well-maintained vehicles.",
        businessType: "Car Rental",
        experience: 7,
        availability: "Open · Closes 20:00",
        area: "Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        services: [
            "Weekend Packages",
            "Budget Cars",
            "Weekly Plans",
            "No Deposit",
            "Easy Booking",
            "Free Fuel"
        ],
        images: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4948,
        longitude: 78.3982,
        priceRange: "₹1200-₹4000/day",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];