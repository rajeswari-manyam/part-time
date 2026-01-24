import { AutomotiveService } from "../services/CategoriesApi.service";

// Dummy data for tyre shops
export const tyreShopsDummyData: AutomotiveService[] = [
    {
        _id: "tyreshop-dummy-1",
        userId: "tyreshop-user-1",
        name: "Apollo Tyres World",
        email: "apollotyres@example.com",
        phone: "+91 98765 44401",
        description:
            "Authorized Apollo Tyres dealer offering car and bike tyres, wheel alignment, balancing, and nitrogen filling.",
        businessType: "Tyre Shop",
        experience: 15,
        availability: "Open · Closes 21:00",
        area: "Banjara Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        services: [
            "Car Tyres",
            "Bike Tyres",
            "Wheel Alignment",
            "Wheel Balancing",
            "Nitrogen Air Filling",
            "Puncture Repair"
        ],
        images: [
            "https://images.unsplash.com/photo-1597764699513-13e2c8a7b12a?w=800",
            "https://images.unsplash.com/photo-1613214021522-1c9c98c6b2f4?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4120,
        longitude: 78.4483,
        priceRange: "₹1,200-₹18,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "tyreshop-dummy-2",
        userId: "tyreshop-user-2",
        name: "MRF Tyre Zone",
        email: "mrftyres@example.com",
        phone: "+91 98765 44402",
        description:
            "Multi-brand tyre store with MRF, CEAT, and Bridgestone tyres. Quick service and best price guarantee.",
        businessType: "Tyre Shop",
        experience: 11,
        availability: "Open · Closes 22:00",
        area: "Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        services: [
            "Multi-Brand Tyres",
            "Tubeless Tyres",
            "Alloy Wheels",
            "Wheel Alignment",
            "Balancing",
            "Emergency Puncture"
        ],
        images: [
            "https://images.unsplash.com/photo-1621346305049-8d98b5eb2d0c?w=800",
            "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4949,
        longitude: 78.3990,
        priceRange: "₹1,000-₹20,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "tyreshop-dummy-3",
        userId: "tyreshop-user-3",
        name: "Wheel Care Centre",
        email: "wheelcare@example.com",
        phone: "+91 98765 44403",
        description:
            "Complete wheel care solution for cars and SUVs. Specialized in alignment, balancing, and tyre rotation.",
        businessType: "Tyre Shop",
        experience: 8,
        availability: "Open · Closes 20:30",
        area: "Hitech City",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        services: [
            "Wheel Alignment",
            "Wheel Balancing",
            "Tyre Rotation",
            "SUV Tyres",
            "Nitrogen Filling",
            "Road Force Balancing"
        ],
        images: [
            "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800",
            "https://images.unsplash.com/photo-1597006254053-9d44a92e2e1a?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.4483,
        longitude: 78.3910,
        priceRange: "₹1,500-₹25,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService,

    {
        _id: "tyreshop-dummy-4",
        userId: "tyreshop-user-4",
        name: "QuickFix Tyre Shop",
        email: "quickfixtyre@example.com",
        phone: "+91 98765 44404",
        description:
            "Neighborhood tyre and puncture repair shop providing fast service for bikes and cars.",
        businessType: "Tyre Shop",
        experience: 5,
        availability: "Open · Closes 19:00",
        area: "Dilsukhnagar",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500060",
        services: [
            "Bike Tyres",
            "Car Tyres",
            "Puncture Repair",
            "Tube Replacement",
            "Air Filling",
            "Emergency Support"
        ],
        images: [
            "https://images.unsplash.com/photo-1601924579440-97c97c1d1b75?w=800",
            "https://images.unsplash.com/photo-1613214021522-1c9c98c6b2f4?w=800"
        ],
        categoryId: "",
        subcategoryId: "",
        additionalInfo: "",
        status: "active",
        latitude: 17.3689,
        longitude: 78.5245,
        priceRange: "₹150-₹8,000",
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as AutomotiveService
];
