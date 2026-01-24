import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for battery shops
export const batteryShopsDummyData: AutomotiveService[] = [
    {
        _id: "batteryshop-dummy-1",
        userId: "batteryshop-user-1",
        name: "Amaron Battery World",
        email: "amaronbattery@example.com",
        phone: "+91 98765 55501",
        description:
            "Authorized Amaron battery dealer for cars, bikes, and commercial vehicles. Free installation and doorstep support.",
        businessType: "Battery Shop",
        experience: 14,
        availability: "Open · Closes 21:00",
        area: "Punjagutta",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500082",
        services: [
            "Car Batteries",
            "Bike Batteries",
            "Inverter Batteries",
            "Free Installation",
            "Battery Testing",
            "Doorstep Service"
        ],
        images: [
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
            "https://images.unsplash.com/photo-1603380353725-f8a4a5ed88e8?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4269,
        longitude: 78.4514,
        priceRange: "₹1,500-₹15,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "batteryshop-dummy-2",
        userId: "batteryshop-user-2",
        name: "Exide Care",
        email: "exidecare@example.com",
        phone: "+91 98765 55502",
        description:
            "Exide authorized battery shop providing reliable batteries with warranty and quick replacement service.",
        businessType: "Battery Shop",
        experience: 12,
        availability: "Open · Closes 22:00",
        area: "Secunderabad",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500003",
        services: [
            "Exide Batteries",
            "Battery Replacement",
            "Warranty Support",
            "Jump Start Service",
            "Battery Charging",
            "Vehicle Diagnostics"
        ],
        images: [
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800",
            "https://images.unsplash.com/photo-1581091215367-59ab6c9cbd5c?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4399,
        longitude: 78.4983,
        priceRange: "₹1,800-₹18,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "batteryshop-dummy-3",
        userId: "batteryshop-user-3",
        name: "QuickStart Battery Services",
        email: "quickstart@example.com",
        phone: "+91 98765 55503",
        description:
            "24/7 emergency battery support for cars and bikes. Jump start and roadside battery replacement available.",
        businessType: "Battery Shop",
        experience: 7,
        availability: "Open · 24/7",
        area: "Hitech City",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        services: [
            "24/7 Battery Support",
            "Jump Start",
            "Roadside Assistance",
            "Battery Replacement",
            "Fast Delivery",
            "Emergency Service"
        ],
        images: [
            "https://images.unsplash.com/photo-1601924579440-97c97c1d1b75?w=800",
            "https://images.unsplash.com/photo-1597006254053-9d44a92e2e1a?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4486,
        longitude: 78.3912,
        priceRange: "₹2,000-₹20,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "batteryshop-dummy-4",
        userId: "batteryshop-user-4",
        name: "PowerPlus Battery Hub",
        email: "powerplus@example.com",
        phone: "+91 98765 55504",
        description:
            "Multi-brand battery outlet for cars, bikes, inverters, and UPS systems. Best prices with exchange offers.",
        businessType: "Battery Shop",
        experience: 9,
        availability: "Open · Closes 19:30",
        area: "Kondapur",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500084",
        services: [
            "Multi-Brand Batteries",
            "Exchange Offers",
            "UPS Batteries",
            "Inverter Batteries",
            "Battery Health Check",
            "Installation Support"
        ],
        images: [
            "https://images.unsplash.com/photo-1581091870627-3b8c5c34e1ab?w=800",
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4641,
        longitude: 78.3674,
        priceRange: "₹1,200-₹16,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];
