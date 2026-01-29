// import React from "react";
// import NearbyArchitectCard from "../components/NearbyArchitectCard";
// import type { JobType } from "../components/NearbyArchitectCard";

// interface Props {
//   onViewDetails: (job: JobType) => void;
//   job?: JobType;
// }

// // Dummy data for architects
// const DUMMY_ARCHITECTS: JobType[] = [
//   {
//     id: "architect_1",
//     title: "Design Studio Architects",
//     location: "Banjara Hills, Hyderabad",
//     description: "Award-winning architects specializing in contemporary residential designs.",
//     jobData: {
//       rating: 4.9,
//       user_ratings_total: 187,
//       status: true,
//       pincode: "500034",
//       icon: "📐",
//       special_tags: ["Award Winner", "Premium Design"],
//       amenities: ["Residential Design", "3D Visualization", "Vastu Compliant", "Modern Architecture"],
//       geometry: {
//         location: {
//           lat: 17.4239,
//           lng: 78.4538,
//         },
//       },
//     },
//   },
//   {
//     id: "architect_2",
//     title: "Urban Space Architects",
//     location: "Gachibowli, Hyderabad",
//     description: "Innovative architects for commercial and residential projects.",
//     jobData: {
//       rating: 4.7,
//       user_ratings_total: 145,
//       status: true,
//       pincode: "500032",
//       icon: "📐",
//       special_tags: ["Innovative", "Quick Turnaround"],
//       amenities: ["Commercial Design", "Green Buildings", "Project Management", "Cost Estimation"],
//       geometry: {
//         location: {
//           lat: 17.4399,
//           lng: 78.3489,
//         },
//       },
//     },
//   },
//   {
//     id: "architect_3",
//     title: "Classic Architects & Planners",
//     location: "Jubilee Hills, Hyderabad",
//     description: "Traditional and modern architecture with 20+ years experience.",
//     jobData: {
//       rating: 4.8,
//       user_ratings_total: 234,
//       status: true,
//       pincode: "500033",
//       icon: "📐",
//       special_tags: ["Experienced", "Vastu Expert"],
//       amenities: ["Villa Design", "Heritage Renovation", "Landscape Design", "Structural Design"],
//       geometry: {
//         location: {
//           lat: 17.4326,
//           lng: 78.4071,
//         },
//       },
//     },
//   },
//   {
//     id: "architect_4",
//     title: "Blueprint Design Studio",
//     location: "HITEC City, Hyderabad",
//     description: "Contemporary architects specializing in luxury homes and offices.",
//     jobData: {
//       rating: 4.6,
//       user_ratings_total: 156,
//       status: true,
//       pincode: "500081",
//       icon: "📐",
//       special_tags: ["Luxury Specialist", "Tech-Savvy"],
//       amenities: ["Smart Home Design", "Interior Consultation", "Space Planning", "Building Permits"],
//       geometry: {
//         location: {
//           lat: 17.4435,
//           lng: 78.3772,
//         },
//       },
//     },
//   },
// ];

// const NearbyArchitectsCard: React.FC<Props> = ({ onViewDetails, job }) => {
//   // If job prop is provided, render single card
//   if (job) {
//     return <NearbyArchitectCard job={job} onViewDetails={onViewDetails} />;
//   }

//   // Otherwise render all dummy data
//   return (
//     <div className="space-y-6">
//       {/* Section Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">
//           📐 Nearby Architects
//         </h2>
//         <span className="text-sm text-gray-500">
//           {DUMMY_ARCHITECTS.length} architects found
//         </span>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {DUMMY_ARCHITECTS.map((architect) => (
//           <NearbyArchitectCard
//             key={architect.id}
//             job={architect}
//             onViewDetails={onViewDetails}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NearbyArchitectsCard;
export default {};
