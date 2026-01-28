import React from "react";

// ===============================
// TypeScript Interfaces
// ===============================
interface BloodBank {
  id: number;
  name: string;
  image: string;
  address: string;
  distance: string;
}

interface BloodBankCardProps {
  bank: BloodBank;
}

// ===============================
// Blood Bank Data
// ===============================
const DUMMY_BLOOD_BANKS: BloodBank[] = [
  {
    id: 1,
    name: "New City Blood Bank",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    address: "Dornakal Road, Suryarao Pet, Vijayawada",
    distance: "2.3 km away",
  },
  {
    id: 2,
    name: "Vijaya Sri Blood Bank",
    image: "https://images.unsplash.com/photo-1580281657521-6c6d1f37b6e2?w=400&h=300&fit=crop",
    address: "Dornakal Road, Suryarao Pet, Vijayawada",
    distance: "1.9 km away",
  },
  {
    id: 3,
    name: "Rotary Red Cross Blood Bank Hall",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop",
    address: "G S Raju Street, Gandhi Nagar, Vijayawada",
    distance: "2.1 km away",
  },
  {
    id: 4,
    name: "Life Care Blood Bank",
    image: "https://images.unsplash.com/photo-1584467735871-bd7a5c85b6b1?w=400&h=300&fit=crop",
    address: "Benz Circle, Vijayawada",
    distance: "3.4 km away",
  },
];

// ===============================
// Blood Bank Card Component
// ===============================
const BloodBankCard: React.FC<BloodBankCardProps> = ({ bank }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-40">
        <img
          src={bank.image}
          alt={bank.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-base mb-2 text-gray-900 line-clamp-2">
          {bank.name}
        </h3>

        <div className="flex items-start mb-2">
          <span className="text-red-500 mr-1 mt-0.5">📍</span>
          <p className="text-sm text-gray-600 line-clamp-2">
            {bank.address}
          </p>
        </div>

        <p className="text-sm text-green-600 font-medium">
          {bank.distance}
        </p>
      </div>
    </div>
  );
};

// ===============================
// MAIN COMPONENT - RETURNS ONLY THE GRID
// ===============================
const NearbyBloodBanksList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {DUMMY_BLOOD_BANKS.map((bank) => (
        <BloodBankCard key={bank.id} bank={bank} />
      ))}
    </div>
  );
};

export default NearbyBloodBanksList;