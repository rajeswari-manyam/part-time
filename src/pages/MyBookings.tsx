import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Calendar, Clock, IndianRupee, User } from 'lucide-react';

type BookingStatus = 'all' | 'pending' | 'active' | 'done';

interface Booking {
    id: number;
    service: string;
    icon: string;
    workerName: string;
    phone: string;
    location: string;
    date: string;
    time: string;
    price: number;
    status: 'pending' | 'active' | 'done';
    statusColor: string;
    buttonText: string;
    buttonColor: string;
}

const MyBookings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<BookingStatus>('all');

    const bookings: Booking[] = [
        {
            id: 1,
            service: 'Accounting Report',
            icon: '📊',
            workerName: 'Suresh Kumar',
            phone: '+91 98765 43210',
            location: 'Delhi, Delhi',
            date: '2025-01-15',
            time: '10:00 AM',
            price: 1200,
            status: 'done',
            statusColor: 'bg-blue-100 text-blue-700',
            buttonText: 'Book Job',
            buttonColor: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            id: 2,
            service: 'Electrical Wiring',
            icon: '⚡',
            workerName: 'Rajesh Singh',
            phone: '+91 98765 43211',
            location: 'Mumbai, Maharashtra',
            date: '2025-01-16',
            time: '2:00 PM',
            price: 2200,
            status: 'active',
            statusColor: 'bg-green-100 text-green-700',
            buttonText: 'Complete Job',
            buttonColor: 'bg-green-600 hover:bg-green-700'
        },
        {
            id: 3,
            service: 'House Painting',
            icon: '🎨',
            workerName: 'Amit Patel',
            phone: '+91 98765 43212',
            location: 'Bangalore, Karnataka',
            date: '2025-01-17',
            time: '9:00 AM',
            price: 15000,
            status: 'active',
            statusColor: 'bg-green-100 text-green-700',
            buttonText: 'Complete Job',
            buttonColor: 'bg-green-600 hover:bg-green-700'
        },
        {
            id: 4,
            service: 'AC Service',
            icon: '❄️',
            workerName: 'Sunita Reddy',
            phone: '+91 98765 43213',
            location: 'Hyderabad, Telangana',
            date: '2025-01-18',
            time: '11:00 AM',
            price: 800,
            status: 'pending',
            statusColor: 'bg-yellow-100 text-yellow-700',
            buttonText: 'Start Job',
            buttonColor: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            id: 5,
            service: 'Plumbing Repair',
            icon: '🔧',
            workerName: 'Priyam Kumar',
            phone: '+91 98765 43210',
            location: 'Orissa, Hyderabad',
            date: '2025-01-20',
            time: '10:00 AM',
            price: 600,
            status: 'active',
            statusColor: 'bg-blue-100 text-blue-700',
            buttonText: 'Start Job',
            buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
    ];

    const filteredBookings = activeTab === 'all'
        ? bookings
        : bookings.filter(booking => booking.status === activeTab);

    const getStatusCount = (status: BookingStatus) => {
        if (status === 'all') return bookings.length;
        return bookings.filter(booking => booking.status === status).length;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-900" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">My Bookings</h1>
                        <div className="w-10" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tabs */}
                <div className="bg-white rounded-xl p-1 shadow-sm mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            All ({getStatusCount('all')})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Pending ({getStatusCount('pending')})
                        </button>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'active'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Active ({getStatusCount('active')})
                        </button>
                        <button
                            onClick={() => setActiveTab('done')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'done'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Done ({getStatusCount('done')})
                        </button>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                            <div className="text-5xl mb-3">📋</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                            <p className="text-gray-500 text-sm">You don't have any {activeTab} bookings yet.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                {/* Service Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{booking.icon}</div>
                                        <h3 className="text-base font-semibold text-gray-900">{booking.service}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.statusColor}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                {/* Booking Details */}
                                <div className="space-y-2.5 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{booking.workerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{booking.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{booking.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{booking.date}</span>
                                        <Clock className="w-4 h-4 text-gray-400 ml-2" />
                                        <span className="text-gray-700">{booking.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <IndianRupee className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900 font-semibold">₹{booking.price}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${booking.buttonColor}`}>
                                    {booking.buttonText}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyBookings;