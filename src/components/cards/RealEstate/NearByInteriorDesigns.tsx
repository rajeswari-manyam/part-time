// import React from "react";
// import NearbyInteriorDesignerCard from "../components/NearbyInteriorDesignerCard";
// import type { JobType } from "../components/NearbyInteriorDesignerCard";

// interface Props {
//   onViewDetails: (job: JobType) => void;
//   job?: JobType;
// }

// // Dummy data for interior designers
// const DUMMY_INTERIOR_DESIGNERS: JobType[] = [
//   {
//     id: "interior_1",
//     title: "Livspace Interior Designs",
//     location: "Kondapur, Hyderabad",
//     description: "Premium interior design services with end-to-end project management.",
//     jobData: {
//       rating: 4.8,
//       user_ratings_total: 456,
//       status: true,
//       pincode: "500084",
//       icon: "🎨",
//       special_tags: ["Premium", "Trending"],
//       amenities: ["Modular Kitchen", "Wardrobes", "Full Home Interiors", "3D Design"],
//       geometry: {
//         location: {
//           lat: 17.4624,
//           lng: 78.3647,
//         },
//       },
//     },
//   },
//   {
//     id: "interior_2",
//     title: "Design Cafe",
//     location: "Madhapur, Hyderabad",
//     description: "Contemporary interior design with personalized solutions.",
//     jobData: {
//       rating: 4.7,
//       user_ratings_total: 389,
//       status: true,
//       pincode: "500081",
//       icon: "🎨",
//       special_tags: ["Contemporary", "Quick Response"],
//       amenities: ["Living Room", "Bedroom Design", "False Ceiling", "Lighting Design"],
//       geometry: {
//         location: {
//           lat: 17.4485,
//           lng: 78.3908,
//         },
//       },
//     },
//   },
//   {
//     id: "interior_3",
//     title: "HomeLane Interior Solutions",
//     location: "Banjara Hills, Hyderabad",
//     description: "Affordable luxury interiors with quality craftsmanship.",
//     jobData: {
//       rating: 4.6,
//       user_ratings_total: 298,
//       status: true,
//       pincode: "500034",
//       icon: "🎨",
//       special_tags: ["Affordable Luxury", "Quality Assured"],
//       amenities: ["Space Saving Solutions", "Kids Room", "Home Office", "Balcony Design"],
//       geometry: {
//         location: {
//           lat: 17.4239,
//           lng: 78.4538,
//         },
//       },
//     },
//   },
//   {
//     id: "interior_4",
//     title: "Bonito Designs",
//     location: "Gachibowli, Hyderabad",
//     description: "Award-winning interior designers for residential and commercial spaces.",
//     jobData: {
//       rating: 4.9,
//       user_ratings_total: 567,
//       status: true,
//       pincode: "500032",
//       icon: "🎨",
//       special_tags: ["Award Winner", "Celebrity Designer"],
//       amenities: ["Luxury Interiors", "Smart Home Integration", "Furniture Design", "Art Consultation"],
//       geometry: {
//         location: {
//           lat: 17.4399,
//           lng: 78.3489,
//         },
//       },
//     },
//   },
// ];

// const NearbyInteriorDesignersCard: React.FC<Props> = ({ onViewDetails, job }) => {
//   // If job prop is provided, render single card
//   if (job) {
//     return <NearbyInteriorDesignerCard job={job} onViewDetails={onViewDetails} />;
//   }

//   // Otherwise render all dummy data
//   return (
//     <div className="space-y-6">
//       {/* Section Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">
//           🎨 Nearby Interior Designers
//         </h2>
//         <span className="text-sm text-gray-500">
//           {DUMMY_INTERIOR_DESIGNERS.length} designers found
//         </span>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {DUMMY_INTERIOR_DESIGNERS.map((designer) => (
//           <NearbyInteriorDesignerCard
//             key={designer.id}
//             job={designer}
//             onViewDetails={onViewDetails}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NearbyInteriorDesignersCard;
export default {};
