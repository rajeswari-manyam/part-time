// sampleData.ts - Sample data generator

import { Job } from '../../types/Job';


export const generateSampleJobs = (): Job[] => [
    {
        id: '1',
        title: 'Plumbing Emergency Repair',
        description: 'Bathroom tap leaking and pipeline repair needed urgently',
        paymentType: 'Hourly',
        rate: 600,
        currency: 'INR',
        distance: 2.3,
        category: 'plumbing',
        status: 'available',
        postedAt: new Date('2024-12-18T10:00:00'),
        location: {
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'Sector 62, Noida'
        },
        client: {
            id: 'c1',
            name: 'Rajesh Kumar',
            rating: 4.8,
            reviewCount: 45,
            verified: true
        },
        requirements: ['Immediate availability', 'Own tools required'],
        estimatedDuration: 2,
        urgency: 'high'
    },
    {
        id: '2',
        title: 'Electrical Wiring Installation',
        description: 'New room electrical setup with modern fixtures required',
        paymentType: 'Fixed',
        rate: 8500,
        currency: 'INR',
        distance: 4.7,
        category: 'electrical',
        status: 'available',
        postedAt: new Date('2024-12-18T09:30:00'),
        location: {
            latitude: 28.5355,
            longitude: 77.3910,
            address: 'Sector 18, Noida'
        },
        client: {
            id: 'c2',
            name: 'Priya Sharma',
            rating: 4.9,
            reviewCount: 78,
            verified: true
        },
        requirements: ['Licensed electrician', 'Safety certification'],
        estimatedDuration: 6,
        urgency: 'medium'
    },
    {
        id: '3',
        title: 'Furniture Assembly',
        description: 'Assemble IKEA wardrobe and bed frame with provided instructions',
        paymentType: 'Fixed',
        rate: 3500,
        currency: 'INR',
        distance: 1.8,
        category: 'carpentry',
        status: 'available',
        postedAt: new Date('2024-12-18T11:15:00'),
        location: {
            latitude: 28.4595,
            longitude: 77.0266,
            address: '789 DLF Phase 3, Gurgaon'
        },
        client: {
            id: 'c3',
            name: 'Amit Verma',
            rating: 4.7,
            reviewCount: 32,
            verified: true
        },
        requirements: ['Experience with IKEA furniture'],
        estimatedDuration: 4,
        urgency: 'low'
    }
];