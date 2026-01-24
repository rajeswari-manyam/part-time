// src/data/CarWash.ts

import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for car wash services
export const carWashDummyData: AutomotiveService[] = [
    {
        _id: "carwash-dummy-1",
        userId: "carwash-user-1",
        name: "SpeedClean Car Wash",
        email: "speedcleancar@example.com",
        phone: "+91 98765 22201",
        description:
            "Professional car wash and detailing services. Foam wash, interior vacuuming, and engine bay cleaning with premium products.",
        businessType: "Car Wash",
        experience: 8,
        availability: "Open · Closes 21:30",
        area: "Gachibowli",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500032",
        services: [
            "Foam Wash",
            "Interior Vacuum",
            "Engine Bay Cleaning",
            "Dashboard Polish",
            "Tyre Blackening",
            "Underbody Wash"
        ],
        images: [
            "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4401,
        longitude: 78.3489,
        priceRange: "₹300-₹900",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "carwash-dummy-2",
        userId: "carwash-user-2",
        name: "AutoShine Car Care",
        email: "autoshine@example.com",
        phone: "+91 98765 22202",
        description:
            "Premium car detailing studio offering ceramic coating, paint protection, and deep interior cleaning.",
        businessType: "Car Wash",
        experience: 10,
        availability: "Open · Closes 20:00",
        area: "Madhapur",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        services: [
            "Complete Detailing",
            "Ceramic Coating",
            "Paint Protection",
            "Leather Conditioning",
            "Glass Treatment",
            "Odour Removal"
        ],
        images: [
            "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
            "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4478,
        longitude: 78.3913,
        priceRange: "₹800-₹5000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "carwash-dummy-3",
        userId: "carwash-user-3",
        name: "QuickWash Car Spa",
        email: "quickwash@example.com",
        phone: "+91 98765 22203",
        description:
            "Express car wash services for busy schedules. Affordable pricing with fast turnaround time.",
        businessType: "Car Wash",
        experience: 5,
        availability: "Open · Closes 22:00",
        area: "Kondapur",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500084",
        services: [
            "Express Wash",
            "Pressure Wash",
            "Interior Cleaning",
            "Spray Wax",
            "Tyre Polish",
            "Seat Vacuum"
        ],
        images: [
            "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4644,
        longitude: 78.3676,
        priceRange: "₹250-₹700",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "carwash-dummy-4",
        userId: "carwash-user-4",
        name: "Doorstep Car Wash",
        email: "doorstepcarwash@example.com",
        phone: "+91 98765 22204",
        description:
            "Convenient doorstep car wash service using waterless and eco-friendly products. Monthly plans available.",
        businessType: "Car Wash",
        experience: 6,
        availability: "Open · Closes 19:00",
        area: "Ameerpet",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500016",
        services: [
            "Doorstep Wash",
            "Waterless Cleaning",
            "Interior Dusting",
            "Monthly Packages",
            "Eco-Friendly Products",
            "Quick Dry"
        ],
        images: [
            "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4376,
        longitude: 78.4485,
        priceRange: "₹200-₹600",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];
