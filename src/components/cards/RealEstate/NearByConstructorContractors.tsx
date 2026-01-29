// import React from "react";
// import NearbyConstructionContractorCard from "../components/NearbyConstructionContractorCard";
// import type { JobType } from "../components/NearbyConstructionContractorCard";

// interface Props {
//   onViewDetails: (job: JobType) => void;
//   job?: JobType;
// }

// // Dummy data for construction contractors
// const DUMMY_CONTRACTORS: JobType[] = [
//   {
//     id: "contractor_1",
//     title: "Reliable Constructions",
//     location: "Gachibowli, Hyderabad",
//     description: "Trusted construction contractor with 15+ years of experience in residential projects.",
//     jobData: {
//       rating: 4.7,
//       user_ratings_total: 234,
//       status: true,
//       pincode: "500032",
//       icon: "👷",
//       special_tags: ["Experienced", "Quality Work"],
//       amenities: ["House Construction", "Renovation", "Waterproofing", "Painting"],
//       geometry: {
//         location: {
//           lat: 17.4399,
//           lng: 78.3489,
//         },
//       },
//     },
//   },
//   {
//     id: "contractor_2",
//     title: "BuildRight Contractors",
//     location: "Banjara Hills, Hyderabad",
//     description: "Professional contractors for commercial and residential buildings.",
//     jobData: {
//       rating: 4.6,
//       user_ratings_total: 189,
//       status: true,
//       pincode: "500034",
//       icon: "👷",
//       special_tags: ["Professional", "Quick Response"],
//       amenities: ["Commercial Buildings", "Villa Construction", "Interior Work", "Plumbing"],
//       geometry: {
//         location: {
//           lat: 17.4239,
//           lng: 78.4538,
//         },
//       },
//     },
//   },
//   {
//     id: "contractor_3",
//     title: "Prime Builders & Contractors",
//     location: "Kondapur, Hyderabad",
//     description: "Complete construction solutions from foundation to finishing.",
//     jobData: {
//       rating: 4.8,
//       user_ratings_total: 312,
//       status: true,
//       pincode: "500084",
//       icon: "👷",
//       special_tags: ["Complete Solution", "On-Time Delivery"],
//       amenities: ["Civil Work", "Electrical", "Flooring", "Roofing", "Facade Work"],
//       geometry: {
//         location: {
//           lat: 17.4624,
//           lng: 78.3647,
//         },
//       },
//     },
//   },
//   {
//     id: "contractor_4",
//     title: "Quality Constructions",
//     location: "Jubilee Hills, Hyderabad",
//     description: "High-quality construction services with transparent pricing.",
//     jobData: {
//       rating: 4.9,
//       user_ratings_total: 445,
//       status: true,
//       pincode: "500033",
//       icon: "👷",
//       special_tags: ["Verified", "Transparent Pricing"],
//       amenities: ["Custom Homes", "Apartment Renovation", "Structural Work", "Project Management"],
//       geometry: {
//         location: {
//           lat: 17.4326,
//           lng: 78.4071,
//         },
//       },
//     },
//   },
// ];

// const NearbyConstructionContractorsCard: React.FC<Props> = ({ onViewDetails, job }) => {
//   // If job prop is provided, render single card
//   if (job) {
//     return <NearbyConstructionContractorCard job={job} onViewDetails={onViewDetails} />;
//   }

//   // Otherwise render all dummy data
//   return (
//     <div className="space-y-6">
//       {/* Section Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">
//           👷 Nearby Construction Contractors
//         </h2>
//         <span className="text-sm text-gray-500">
//           {DUMMY_CONTRACTORS.length} contractors found
//         </span>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {DUMMY_CONTRACTORS.map((contractor) => (
//           <NearbyConstructionContractorCard
//             key={contractor.id}
//             job={contractor}
//             onViewDetails={onViewDetails}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NearbyConstructionContractorsCard;
export default {};