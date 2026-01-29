// import React from "react";
// import NearbyRentLeaseCard from "../components/NearbyRentLeaseCard";
// import type { JobType } from "../components/NearbyRentLeaseCard";

// interface Props {
//   onViewDetails: (job: JobType) => void;
//   job?: JobType;
// }

// // Dummy data for rent/lease listings
// const DUMMY_RENT_LEASE: JobType[] = [
//   {
//     id: "rent_1",
//     title: "Spacious 3BHK Apartment",
//     location: "Jubilee Hills, Hyderabad",
//     description: "Well-maintained 3BHK with modern amenities, perfect for families.",
//     jobData: {
//       rating: 4.5,
//       user_ratings_total: 89,
//       status: true,
//       pincode: "500033",
//       icon: "🏠",
//       propertyType: "Apartment",
//       price: "₹45,000/month",
//       area: "1850 sq.ft",
//       bedrooms: 3,
//       bathrooms: 2,
//       special_tags: ["Furnished", "Pet Friendly"],
//       amenities: ["Parking", "24x7 Security", "Gym", "Power Backup", "Swimming Pool"],
//       geometry: {
//         location: {
//           lat: 17.4326,
//           lng: 78.4071,
//         },
//       },
//     },
//   },
//   {
//     id: "rent_2",
//     title: "Luxury 2BHK Flat",
//     location: "Gachibowli, Hyderabad",
//     description: "Premium 2BHK apartment in gated community with all modern facilities.",
//     jobData: {
//       rating: 4.7,
//       user_ratings_total: 134,
//       status: true,
//       pincode: "500032",
//       icon: "🏠",
//       propertyType: "Flat",
//       price: "₹35,000/month",
//       area: "1400 sq.ft",
//       bedrooms: 2,
//       bathrooms: 2,
//       special_tags: ["Gated Community", "Ready to Move"],
//       amenities: ["Modular Kitchen", "Intercom", "Club House", "Children's Play Area", "Lift"],
//       geometry: {
//         location: {
//           lat: 17.4399,
//           lng: 78.3489,
//         },
//       },
//     },
//   },
//   {
//     id: "rent_3",
//     title: "Independent Villa for Rent",
//     location: "Kondapur, Hyderabad",
//     description: "Beautiful 4BHK independent villa with garden and private parking.",
//     jobData: {
//       rating: 4.8,
//       user_ratings_total: 67,
//       status: true,
//       pincode: "500084",
//       icon: "🏡",
//       propertyType: "Villa",
//       price: "₹75,000/month",
//       area: "3200 sq.ft",
//       bedrooms: 4,
//       bathrooms: 3,
//       special_tags: ["Independent", "Garden"],
//       amenities: ["Private Parking", "Servant Quarter", "Terrace", "Geyser", "Water Softener"],
//       geometry: {
//         location: {
//           lat: 17.4624,
//           lng: 78.3647,
//         },
//       },
//     },
//   },
//   {
//     id: "rent_4",
//     title: "Affordable 1BHK Studio",
//     location: "HITEC City, Hyderabad",
//     description: "Compact and cozy 1BHK studio apartment ideal for working professionals.",
//     jobData: {
//       rating: 4.4,
//       user_ratings_total: 156,
//       status: true,
//       pincode: "500081",
//       icon: "🏠",
//       propertyType: "Studio",
//       price: "₹18,000/month",
//       area: "650 sq.ft",
//       bedrooms: 1,
//       bathrooms: 1,
//       special_tags: ["Affordable", "Near Metro"],
//       amenities: ["Wi-Fi", "Air Conditioned", "Laundry", "Maintenance Staff", "CCTV"],
//       geometry: {
//         location: {
//           lat: 17.4435,
//           lng: 78.3772,
//         },
//       },
//     },
//   },
// ];

// const NearbyRentLeaseCard: React.FC<Props> = ({ onViewDetails, job }) => {
//   // If job prop is provided, render single card
//   if (job) {
//     return <NearbyRentLeaseCard job={job} onViewDetails={onViewDetails} />;
//   }

//   // Otherwise render all dummy data
//   return (
//     <div className="space-y-6">
//       {/* Section Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">
//           🏠 Nearby Rent/Lease Properties
//         </h2>
//         <span className="text-sm text-gray-500">
//           {DUMMY_RENT_LEASE.length} properties available
//         </span>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {DUMMY_RENT_LEASE.map((property) => (
//           <NearbyRentLeaseCard
//             key={property.id}
//             job={property}
//             onViewDetails={onViewDetails}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NearbyRentLeaseCard;
export default{};